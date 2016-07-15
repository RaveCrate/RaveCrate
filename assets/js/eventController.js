var app = angular.module('eventGrid', []);
app.controller('eventCtrl', function($scope, $http) {

  // getDateTime will calculate the exact time, which will be passed into
  // GET http://52.25.111.252/api/v1/events" + getDateTime() + "&to_date=2099-12-31%2023:59:59"
  // Every time someone accesses the event page, the most current events will populate the grid
  function getDateTime() {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth() + 1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();

    if (month.toString().length == 1) {
      var month = '0' + month;
    }
    if (day.toString().length == 1) {
      var day = '0' + day;
    }
    if (hour.toString().length == 1) {
      var hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
      var minute = '0' + minute;
    }
    if (second.toString().length == 1) {
      var second = '0' + second;
    }

    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
      return dateTime;

  }

  //  console.log(getDateTime());

  $http.defaults.headers.common['Authorization'] = 'Basic ZGV2ZWxvcGVyLXNpZDpzcGFycm93OA==';

  $http({
    method: "GET",
    crossDomain: true,
    async: true,
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    dataType: 'json',
    url: "http://52.41.16.214:8080/api/v2/events?from_date=2016-01-31%2023:59:59&to_date=2099-12-31%2023:59:59"
  }).then(function successCallback(response) {
    // This callback will be called asynchronously
    // when the response is available

    // console.log(response);

    // Create an empty array where the event data will go
    var self = this;
    self.listEvents = [];

    // This function will capitalize the first letter of the JSON data response
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    // sortByDate will sort the events into chronological order
    var sortByDate = function (property) {
      return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
      };
    };

    //Loop through the event data from the $http request
    for (var i = 0; i < response.data.response.length; i++) {

      // Creates an empty object to add the JSON data
      var eventObject = {};

      // The JSON data
      eventObject.title = response.data.response[i].event_title;
      eventObject.host = response.data.response[i].event_host;
      eventObject.date = response.data.response[i].event_date;
      eventObject.location = response.data.response[i].event_location;
      eventObject.address = response.data.response[i].contact_address;
      eventObject.city = response.data.response[i].contact_city;
      eventObject.state = response.data.response[i].contact_state;
      eventObject.postcode = response.data.response[i].contact_post_code;
      eventObject.latitude = response.data.response[i].latitude;
      eventObject.longitude = response.data.response[i].longitude;
      eventObject.phone = response.data.response[i].contact_phone;
      eventObject.email = response.data.response[i].contact_email;
      eventObject.type = response.data.response[i].event_type.capitalize();
      eventObject.description = response.data.response[i].description;
      eventObject.fee = response.data.response[i].event_fee;

      // Push the eventObject into the empty listEvents array
      self.listEvents.push(eventObject);
    }

    // Convert listEvents into $scope so it can be accessed by html files
    $scope.list = self.listEvents;

    // This will sort the events by date on the events page by implementing sortByDate
    $scope.list.sort(sortByDate('date'));

    // console.log($scope.list);

  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });

});

// Initialize new Google Maps
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0522342, lng: -118.2436849},
    zoom: 10
  });

  // Set the pin image on the map to RaveCrate pin
  var image = {
    url: 'assets/images/map-marker.png',
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(70, 70)
  };

  // Create a new pin for Avalon Nightclub
  var markerAvalon = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(34.102719, -118.327169),
    icon: image
  });

  // Create a new pin for Zanzibar
  var markerZanzibar = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(34.01858, -118.495426),
    icon: image
  });

  // Create a new pin for Exchange LA
  var markerExchange = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(34.045254, -118.251139),
    icon: image
    });

  // Create a new pin for US Bank Tower
  var markerUSBank = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(34.05112, -118.254322),
    icon: image
  });

  // Create a new pin for Coliseum Stadium
  var markerColiseum = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.DROP,
    position: new google.maps.LatLng(34.012852, -118.284539),
    icon: image
  });

  // Adds the markers to the map by calling setMap();
  markerAvalon.setMap(map);
  markerZanzibar.setMap(map);
  markerExchange.setMap(map);
  markerUSBank.setMap(map);
  markerColiseum.setMap(map);

  // HTML5 geolocation
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    // Make the center of the map the user's location
    map.setCenter(pos);

  });

}
