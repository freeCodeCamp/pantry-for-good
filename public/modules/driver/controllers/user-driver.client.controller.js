import moment from 'moment';

(function() {
	'use strict';

	angular.module('driver').controller('DriverUserController', DriverUserController);

	/* @ngInject */
	function DriverUserController($filter, Authentication, VolunteerUser, CustomerAdmin, moment, $window, $timeout, $state,$rootScope, GeoLocation) {
		var self = this;
		var googleObject = $window.google;
		var markerClustererObject = $window.MarkerClusterer;

		var user = Authentication.user;

		//=== Bindable variables ===//
		self.allChecked = false;
		self.customers = [];
		self.customersCopy = [].concat(self.customers); // Copy data for smart table
		self.deliver = deliver;
		self.driver = {};
		self.error = {};
		self.isDisabled = isDisabled;
		self.isLoading = null;
		self.updateNotes = updateNotes;
		self.mapObject = null;
		self.driverPosition = null;
		self.destination = null; //this is calculated as the furthest client away from the driver
		self.waypoints = [];
		self.waypointsMarker = [];
		self.driverMarker = null;
		self.foodBankGeo = null;
		self.navigator = null;
		self.geoLocationFail = false;
		self.changeOrigin = false;
		self.useDriverAddress = false;

	$rootScope.$on("$stateChangeStart", function(event, to, fromState){
   navigator.geolocation.clearWatch(self.navigator);
});


		//call server for foodbank location
		GeoLocation.getCity().get(function(response){

					var city = response.foodBankCity;
						//call google api for city lat/lng
				GeoLocation.getGeoLocation(city).then(function(response){
					console.log('geolocation city response is:',response.data.status);
					if(response.data.status === 'OK'){
						var lat = response.data.results[0].geometry.location.lat;
						var lng = response.data.results[0].geometry.location.lng;
						self.foodBankGeo = {lat:lat, lng: lng};
						//event handler to initialise map
					}
					googleObject.maps.event.addDomListener(document.querySelector(".googleMap"), 'load', initMap());
				});
			});


		//=== Private variables ===//
		moment = moment.utc;
		var beginWeek = moment().startOf('isoWeek'); // Store the date of this week's Monday

		function initMap() {

	         self.mapObject = new googleObject.maps.Map(document.querySelector(".googleMap"), {
						 center: new googleObject.maps.LatLng(0, 0),
	           zoom: 1
	         });
					 //to ensures the findCustomers function is fired once
					 //in the recursive watchPosition method
					 var flag = false;
					 //driver marker icon
		 			  var driverIcon = 'modules/driver/images/driver-marker.png';

			 //HTML5 geolocation.
			 if (navigator.geolocation) {
				 //use watchPosition method to track user movements as it fires
				 //intermittently to check user's position
				self.navigator = navigator.geolocation.watchPosition(function(position) {
					 var driverPosition = {
						 lat: position.coords.latitude,
						 lng: position.coords.longitude
					 };

					self.driverPosition = driverPosition;

					self.mapObject.setCenter(driverPosition);
					//removes previously rendered driver marker so there's only one
					if(self.driverMarker){
						self.driverMarker.setMap(null);
						self.driverMarker = null;
					}

					var driverMarker = new googleObject.maps.Marker({
	 				position:driverPosition,
	 				map:self.mapObject,
	 		    icon:driverIcon
				});

					self.driverMarker = driverMarker;
						//stops findCustomers firing repeatedly
						if(!flag){
							findCustomers(false, true);
							flag = true;
						}

				 }, function() {
					 //if geo location not working
					 self.geoLocationFail = true;
					findCustomers(true, true);
				 });
			 }
			 else {
				 //if geo location not supported
				 self.geoLocationFail = true;
				 findCustomers(true, true);
			 }
     }
          function clearWatchPosition(){
						//stops function firing intermittently if geo location errors
					 	if (navigator.geolocation && self.navigator || self.navigator === 0) {
					 		navigator.geolocation.clearWatch(self.navigator);
					 		self.navigator = null;
					 	}
					 	//removes previously rendered driver marker so there's only one
					 	if(self.driverMarker){
					 		self.driverMarker.setMap(null);
					 		self.driverMarker = null;
					 	}

					}

					function getDriversAddress(){
						//driver marker icon
		 				 var driverIcon = 'modules/driver/images/driver-marker.png';

						var driversAddress = self.driver.fullAddress;
						if(driversAddress.length !== 0){
							GeoLocation.getGeoLocation(driversAddress).then(function(response){
								console.log('geolocation driver address response is:',response.data.status);
								if(response.data.status === 'OK'){
									var lat = response.data.results[0].geometry.location.lat;
									var lng = response.data.results[0].geometry.location.lng;
									self.driverPosition = {lat:lat, lng: lng};
									//event handler to initialise map
									self.mapObject.setCenter(self.driverPosition);

									var driverMarker = new googleObject.maps.Marker({
										position:self.driverPosition,
										map:self.mapObject,
										icon:driverIcon
									});

									self.driverMarker = driverMarker;
									furthestClientFromDriver();
								}
								else{
									//unable to retrieve driver's address
									createMarkersWithoutRoute();
								}
							});
						}
						else{
							//no driver's address in DB
							createMarkersWithoutRoute();
						}
					}

		 		 //set starting point to the city if geo location not working
		 		 	function createStartingPoint(){

						 clearWatchPosition();
	           getDriversAddress();
			 			}

					//unable to create optimised route, fire this function
					function createMarkersWithoutRoute(){

						clearWatchPosition();
						//client marker icon
						var clientIcon = 'modules/driver/images/client-marker.png';

						// min/max values for nudging markers who are on the same spot
						var min = 0.999999;
						var max = 1.000001;
						var number = 0;

					self.customers.forEach(function(customer){

						//create window instance
						var infoWindow = new googleObject.maps.InfoWindow(),
								latitude = customer.location[1] * (Math.random() * (max - min) + min),
								longitude = customer.location[0] * (Math.random() * (max - min) + min);

								number++;

						//centers first marker
						if(number === 1){
							self.mapObject.setCenter({lat:latitude, lng:longitude});
						}

					//create marker instance
					var googleMarker = new googleObject.maps.Marker({
					position:{
						lat:latitude,
						lng:longitude
					},
					map:self.mapObject,
					icon:{
						url:clientIcon,
						labelOrigin:new googleObject.maps.Point(11, 10)
					},
					label:{
						text:number.toString(),
						fontSize:'8'
					}
					});

					function showWindow(){
						infoWindow.setOptions({
							content:'<h4><strong>' + customer._id + '</strong> ' + customer.address + '</h4>',
							position:{lat:latitude, lng:longitude},
							pixelOffset: new googleObject.maps.Size(0, -33)
							});
						infoWindow.open(self.mapObject);
						}

					function hideWindow(){
							infoWindow.close();
						}
						//apply previous functions to the marker
						googleMarker.addListener('mouseover', showWindow);
						googleMarker.addListener('mouseout', hideWindow);

					});

					}

							//if user selects 'not now' to sharing location on
							//firefox, it doesn't fire the error function.
							//safari usually doesn't respond to geolocation
							//$timeout is the way around this
			function checkFunctionChain(){
				if(!self.driverPosition){
				self.useDriverAddress = true;
					findCustomers(true, true);
				}
			}

//fires list immediately without triggering chain
findCustomers(true, false);

//checks map and route is rendered
$timeout(checkFunctionChain, 5000);

     //=== START Function chain ===//
		// Find a list of customers
		function findCustomers(geolocationFail,fireCustomersList){
			// Set loading state
			self.isLoading = true;
			VolunteerUser.get({
				volunteerId: user._id
			}, function(volunteer) {
				self.driver = volunteer;
				self.customers = volunteer.customers.filter(function(customer) {
					// Select only customers that have been packed but not delivered yet
					return moment(customer.lastPacked).isSame(beginWeek) &&
						!moment(customer.lastDelivered).isSame(beginWeek);
				});
				// Remove loading state
				self.isLoading = false;
				// Trigger next function in the chain
				if(geolocationFail && fireCustomersList){
					createStartingPoint();
				}
				else if(fireCustomersList){
					furthestClientFromDriver();
				}
			});
		}

	function furthestClientFromDriver(){

	self.customers.forEach(function(customer){
		var LatLng = {
			lat:customer.location[0],
			lng:customer.location[1]
		};
    var clientPosition = new googleObject.maps.LatLng(LatLng);
		var driverPosition = new googleObject.maps.LatLng(self.driverPosition);
   //uses geometry API to work out distance from driver to client
   customer.distanceFromDriver = Math.round(googleObject.maps.geometry.spherical.computeDistanceBetween(driverPosition, clientPosition));
	});

    //finds the client furthest away from the driver's position
		var furthestClientFromDriver = self.customers.reduce(function(prev, current) {
    return (prev.distanceFromDriver > current.distanceFromDriver) ? prev : current;
	});
	//furthest client from driver is herein referred to as destination
		self.destination = furthestClientFromDriver;

		var removedDestination = self.customers.filter(function(customer){
			return customer.distanceFromDriver !== self.destination.distanceFromDriver;
		});

		var waypoints = [];
		//iterating through waypoints minus destination
		removedDestination.forEach(function(waypoint){
			var waypointLocation ={
				location:new googleObject.maps.LatLng({lat:waypoint.location[1], lng:waypoint.location[0]}),
				stopover:true
			};

			waypoints.push(waypointLocation);
		});
		//waypoint objects for google
		self.waypoints = waypoints;
		//customer objects without destination
		self.waypointsMarker = removedDestination; //required for numbering waypoints
		createDriverRoute();
		}

		// Display client markers and optimised route
		function createDriverRoute() {
				var directionsService = new googleObject.maps.DirectionsService();
				var directionsDisplay = new googleObject.maps.DirectionsRenderer();
				//maps the directions to the map object and suppresses google's waypoints
				  directionsDisplay.setOptions({suppressMarkers:true,
																				map:self.mapObject});

				 var destinationLatLng = {
		 			lat:self.destination.location[1],
		 			lng:self.destination.location[0]
		 		};

				//request made to directions service. origin - driver
				//destination - furthest client
				//waypoints - all the clients inbetween
				var request = {
					origin:new googleObject.maps.LatLng(self.driverPosition),
					destination:new googleObject.maps.LatLng(destinationLatLng),
					travelMode:'DRIVING',
					waypoints:self.waypoints,
					optimizeWaypoints:true
				};//waypoints optimised to calculate optimal route

				directionsService.route(request, function(result, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(result);
			//pass the new waypoint order given by directionsService,
			//it does not include final destination which is included
			//in the createMarkers function
			createMarkers(result.routes[0].waypoint_order);
    }
		else {
				//if route fails, just show markers
				if(!self.changeOrigin && !self.useDriverAddress){
					self.changeOrigin = true;
					findCustomers(true, true);
				}
				else{
					createMarkersWithoutRoute();
				}
		}
  });
		}

		function createMarkers(waypointOrder){

			//client marker icon
			var clientIcon = 'modules/driver/images/client-marker.png';

			// min/max values for nudging markers who are on the same spot
			var min = 0.999999;
			var max = 1.000001;
			var number = 0;

			//need to include destination nr
			waypointOrder.push(waypointOrder.length);
			//added final destination to the waypoint/client list
			self.waypointsMarker.push(self.destination);

				waypointOrder.forEach(function(waypointNr){
					var customer = self.waypointsMarker[waypointNr];

					number++;

				//create window instance
				var infoWindow = new googleObject.maps.InfoWindow(),
				 		latitude = customer.location[1] * (Math.random() * (max - min) + min),
				    longitude = customer.location[0] * (Math.random() * (max - min) + min);

			//create marker instance

			var googleMarker = new googleObject.maps.Marker({
			position:{
				lat:latitude,
				lng:longitude
			},
			map:self.mapObject,
			icon:{
				url:clientIcon,
				labelOrigin:new googleObject.maps.Point(11, 10)
			},
			label:{
				text:number.toString(),
				fontSize:'8'
			}
			});

			function showWindow(){
				infoWindow.setOptions({
					content:'<h4><strong>' + customer._id + '</strong> ' + customer.address + '</h4>',
					position:{lat:latitude, lng:longitude},
					pixelOffset: new googleObject.maps.Size(0, -33)
					});
				infoWindow.open(self.mapObject);
				}

			function hideWindow(){
					infoWindow.close();
				}

				//apply previous functions to the marker
				googleMarker.addListener('mouseover', showWindow);
				googleMarker.addListener('mouseout', hideWindow);
		});
}
		//=== END Function chain ===//

		// Mark customers as delivered
		function deliver() {
			// Set loading state
			self.isLoading = true;
			// Keep track of server calls that haven't returned yet
			var updatesInProgress = 0;

			var driver = self.driver;

			self.customers.filter(function(customer) {
				return customer.isChecked;
			}).forEach(function(customerOld) {
				var customer = new CustomerAdmin(customerOld);

				// Update delivered date to this week
				customer.lastDelivered = beginWeek;
				// Add server call
				updatesInProgress++;

				customer.$update(function() {
					// Subtract server call upon return
					updatesInProgress--;
					// If all customers and driver updates have returned from the server then we can
					// render the view again
					// Note: This will trigger only once, depending on which callback comes in last,
					// which is why it's in both the customer and driver callbacks
					if (!updatesInProgress) findCustomers(self.geolocationFail, true);
				}, function(errorResponse) {
					self.error = errorResponse.data.message;
				});
			});
		}

		// Update general notes
		function updateNotes() {
			// Set loading state
			self.isLoading = true;

			var driver = self.driver;
			driver.generalNotes = driver.newNotes;

			driver.$update(function() {
				findCustomers(self.geolocationFail, true);
			}, function(errorResponse) {
				self.error = errorResponse.data.message;
			});
		}

		//=== Helper functions ===//
		// Enable button if any of the checkboxes are checked
		function isDisabled() {
			if (self.customers) {
				return !$filter('filter')(self.customers, {isChecked: true}).length;
			}
		}

		// Select all checkboxes
		self.selectAll = function() {
			self.customers.forEach(function(customer) {
				customer.isChecked = !self.allChecked;
			});
		};
	}
})();
