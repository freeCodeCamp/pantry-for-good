(function() {
	'use strict';

	angular.module('driver').controller('DriverUserController', DriverUserController);

	/* @ngInject */
	function DriverUserController($filter, Authentication, VolunteerUser, CustomerAdmin, moment, $window, $timeout) {
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

		var geoToronto = {lat: 43.8108899, lng: -79.449906};


  googleObject.maps.event.addDomListener(document.querySelector(".googleMap"), 'load', initMap());

		//=== Private variables ===//
		moment = moment.utc;
		var beginWeek = moment().startOf('isoWeek'); // Store the date of this week's Monday

		function initMap() {

	         self.mapObject = new googleObject.maps.Map(document.querySelector(".googleMap"), {
	           center: geoToronto,
	           zoom: 12
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
				 navigator.geolocation.watchPosition(function(position) {
					 var driverPosition = {
						 lat: position.coords.latitude,
						 lng: position.coords.longitude
					 };

					self.driverPosition = driverPosition;

					self.mapObject.setCenter(driverPosition);
					//removes previously rendered driver marker so there's only one
					if(self.driverMarker){
						self.driverMarker.setMap(null);
					}

					var driverMarker = new googleObject.maps.Marker({
	 				position:driverPosition,
	 				map:self.mapObject,
	 		    icon:driverIcon
	 			  });

					self.driverMarker = driverMarker;

						if(!flag){
							findCustomers();
							flag = true;
						}

				 }, function() {
					 handleLocationError(true, true);
				 });
			 }
			 else {
				 // Browser doesn't support Geolocation
				 handleLocationError(false, true);
			 }
     }

				 function handleLocationError(browserHasGeolocation,fireFindCustomers) {
					 var infoWindow = new googleObject.maps.InfoWindow();

					 infoWindow.setOptions({
	 					content:browserHasGeolocation ?
																	'Error: The Geolocation service failed.' :
																	'Error: Your browser doesn\'t support geolocation.',
	 					position:geoToronto,
	 					pixelOffset: new googleObject.maps.Size(0, -33)
	 					});

	 			 	infoWindow.open(self.mapObject);

					self.mapObject.setCenter(geoToronto);
					//make driver position Toronto so the route is rendered
					//with a starting point
					self.driverPosition = geoToronto;
					var closeInfoWindow = function(){
						infoWindow.close();
					};

					$timeout(closeInfoWindow, 6000);

					if(fireFindCustomers){
						findCustomers(); //fires again so driver position is now Toronto
					}
				      }
							//if user selects 'not now' to sharing location on
							//firefox, it doesn't fire the error function.
							//$timeout is the way around this
			function checkFunctionChain(){
				if(!self.driverPosition){
					self.mapObject.setCenter(geoToronto);
					self.driverPosition = geoToronto;
					findCustomers();
				}
			}

//checks map and route is rendered
$timeout(checkFunctionChain, 9000);

     //=== START Function chain ===//
		// Find a list of customers
		function findCustomers() {
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
				furthestClientFromDriver();
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
		else{
			//if route fails, inform the driver
			handleLocationError(true, false);
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
					if (!updatesInProgress) findCustomers();
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
				findCustomers();
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
