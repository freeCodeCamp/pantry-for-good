(function () {
    'use strict';

    angular.module('driver').controller('DriverRouteController', DriverAdminController);

    /* search of food bank city lattitude and langitude */
    function findCity() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "/api/settings", false);
        xhr.send();

        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText); // example: 404: Not Found
        } else {
            var result = JSON.parse(xhr.responseText);
        }
        return result.foodBankCity;
    }

    function citySearch() {
        var city = findCity();
        var xhr = new XMLHttpRequest();
        //var city = "Toronto";
        xhr.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(city), false);
        xhr.send();

        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText); // example: 404: Not Found
        } else {
            var result = JSON.parse(xhr.responseText);
        }

        var arr = $.map(result, function (el) {
            return el;
        });

        var lat = arr[0].geometry.location.lat;
        var lng = arr[0].geometry.location.lng;

        return {lat: lat, lng: lng}

    }

    /* @ngInject */
    function DriverAdminController($filter, CustomerAdmin, VolunteerAdmin, $scope, $window) {
        var self = this;
        var googleObject = $window.google;
        var markerClustererObject = $window.MarkerClusterer;

        //=== Bindable variables ===//
        self.assign = assign;
        self.customers = [];
        self.customersCopy = [];
        self.driver = null;
        self.drivers = [];
        self.error = {};
        self.isDisabled = isDisabled;
        self.isLoading = null;
        self.mapObject = null;
        self.settings = [];

        googleObject.maps.event.addDomListener(document.querySelector(".googleMap"), 'load', initMap());

        function initMap() {

            self.mapObject = new googleObject.maps.Map(document.querySelector(".googleMap"), {
                center: citySearch(),
                zoom: 12
            });
            findDrivers();
        }

        //=== START Function chain ===//
        // 1. Find a list of drivers
        function findDrivers() {
            // Set loading state
            self.isLoading = true;

            VolunteerAdmin.query({}, function (volunteers) {
                self.drivers = volunteers.filter(function (volunteer) {
                    return volunteer.driver;
                });
                // Trigger next function in the chain
                findCustomers();
            });
        }

        // 2. Find a list of customers
        function findCustomers() {
            CustomerAdmin.query({}, function (customers) {
                self.customers = customers.filter(function (customer) {
                    return customer.status === 'Accepted';
                });
                // Trigger next function in the chain
                createMarkers();
            });
        }

        // 3. Configure google markers for each customer
        function createMarkers() {
            // marker icons
            var iconUrlBlue = 'modules/driver/images/gm-marker-blue.png';
            var iconUrlPink = 'modules/driver/images/gm-marker-pink.png';

            // min/max values for nudging markers who are on the same spot
            var min = 0.999999;
            var max = 1.000001;
            var markers = [];

            self.customers.forEach(function (customer) {
                // create info window instance

                var infoWindow = new googleObject.maps.InfoWindow(),
                    latitude = customer.location[1] * (Math.random() * (max - min) + min),
                    longitude = customer.location[0] * (Math.random() * (max - min) + min);

                //create marker instance

                var googleMarker = new googleObject.maps.Marker({
                    position: {
                        lat: latitude,
                        lng: longitude
                    },
                    map: self.mapObject,
                    icon: iconUrlPink
                });

                function clickMarker() {
                    //wrapped in apply function so Angular makes list changes
                    $scope.$apply(function () {
                        customer.isChecked = !customer.isChecked;
                        googleMarker.setIcon(customer.isChecked ? iconUrlBlue : iconUrlPink);
                    });
                }

                function showWindow() {
                    infoWindow.setOptions({
                        content: '<h4><strong>' + customer._id + '</strong> ' + customer.address + '</h4>',
                        position: {lat: latitude, lng: longitude},
                        pixelOffset: new googleObject.maps.Size(0, -33)
                    });
                    infoWindow.open(self.mapObject);
                }

                function hideWindow() {
                    infoWindow.close();
                }

                //apply previous functions to the marker
                googleMarker.addListener('click', clickMarker);
                googleMarker.addListener('mouseover', showWindow);
                googleMarker.addListener('mouseout', hideWindow);

                markers.push(googleMarker);

            });

            //create marker cluster instance
            var markerCluster = new markerClustererObject(self.mapObject, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

            self.isLoading = false;

        }

        //=== END Function chain ===//

        // Assign customers to drivers
        function assign() {
            // Set loading state
            self.isLoading = true;
            // Keep track of server calls that haven't returned yet
            var updatesInProgress = 0;

            var driver = self.driver;
            var oldDrivers = [];

            self.customers.filter(function (customer) {
                return customer.isChecked;
            }).forEach(function (customer) {
                // If assigned driver is different from the one to be assigned
                if (customer.assignedTo && customer.assignedTo._id !== driver._id) {
                    var oldDriver = {};
                    self.drivers.some(function (driver) {
                        if (driver._id === customer.assignedTo._id) {
                            oldDriver = driver;
                            return true;
                        }
                        return false;
                    });

                    // Remove customer from old driver
                    oldDriver.customers.splice(oldDriver.customers.indexOf(customer._id), 1);

                    // Add driver to be updated later, if it hasn't been added yet
                    if (oldDrivers.length) {
                        var containsDriver = oldDrivers.some(function (driver) {
                            return driver._id === oldDriver._id;
                        });
                        if (!containsDriver) oldDrivers.push(oldDriver);
                    } else {
                        oldDrivers.push(oldDriver);
                    }
                }

                // Update customer only if hasn't been assigned yet or if driver is changing
                if (!customer.assignedTo || customer.assignedTo._id !== driver._id) {
                    // Add assigned customer to new driver
                    driver.customers.push(customer._id);

                    // Update customer with new driver
                    customer.assignedTo = driver._id;
                    updatesInProgress++;
                    customer.$update(function () {
                        // Subtract server call upon return
                        updatesInProgress--;
                        // If all customers and driver updates have returned from the server then we can
                        // render the view again by starting the function chain
                        // Note: This will trigger only once, depending on which callback comes in last,
                        // which is why it's in both the customer and driver callbacks
                        if (!updatesInProgress) findDrivers();
                    }, function (errorResponse) {
                        self.error = errorResponse.data.message;
                    });
                }
            });

            // Update old drivers
            if (oldDrivers.length) {
                oldDrivers.forEach(function (driver) {
                    updatesInProgress++;
                    driver.$update(function () {
                        // Subtract server call upon return
                        updatesInProgress--;
                        if (!updatesInProgress) findDrivers();
                    }, function (errorResponse) {
                        self.error = errorResponse.data.message;
                    });
                });
            }

            // Update new driver
            updatesInProgress++;
            driver.$update(function () {
                // Subtract server call upon return
                updatesInProgress--;
                // If all customers and driver updates have returned from the server then we can
                // render the view again by starting the function chain
                // Note: This will trigger only once, depending on which callback comes in last,
                // which is why it's in both the customer and driver callbacks
                if (!updatesInProgress) findDrivers();
            }, function (errorResponse) {
                self.error = errorResponse.data.message;
            });
        }

        //=== Helper functions ===//
        // Enable assign button if any of the checkboxes are checked
        function isDisabled(assignForm) {
            if (self.customers.length > 0) {
                return !$filter('filter')(self.customers, {isChecked: true}).length || assignForm.$invalid;
            }
        }
    }
})();
