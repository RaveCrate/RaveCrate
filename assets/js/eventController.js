var app = angular.module('eventGrid', []);
app.controller('eventCtrl', function($scope, $http, $window) {

  // getDateTime will calculate the exact time, which will be passed into
  // GET http://52.41.16.214:8080/api/v2/events" + getDateTime() + "&to_date=2099-12-31%2023:59:59"
  // Every time someone accesses the event page, the most current events will populate the grid
  function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

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

  };

  // Set the header to gain access to the API
  $http.defaults.headers.common['Authorization'] = 'Basic ZGV2ZWxvcGVyLXNpZDpzcGFycm93OA==';

  // Make a GET request to the API to view all of the events
  $http({
    method: "GET",
    crossDomain: true,
    async: true,
    contentType: "application/x-www-form-urlencoded; charset=utf-8",
    dataType: 'json',
    url: "http://52.41.16.214:8080/api/v2/events?from_date=2016-06-01%2023:59:59&to_date=2099-12-31%2023:59:59"
  }).then(function successCallback(response) {

    // Create an empty array where the event data will go
    var self = this;
    self.listEvents = [];

    // This function will capitalize the first letter of the JSON data response
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    // Create a new Google Map and define the center of the map and zoom level
    $window.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 34.0522342,
        lng: -118.2436849
      },
        zoom: 10
    });

    // HTML5 geolocation
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // Make the center of the map the user's location
      map.setCenter(pos);
    });

    // Set the marker image on the map to the RaveCrate marker
    var image = {
      url: 'assets/images/map-marker.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 5),
      anchor: new google.maps.Point(40, 42),
      scaledSize: new google.maps.Size(70, 70)
    };

    //Loop through the event data from the $http request
    for (var i = 0; i < response.data.response.length; i++) {

      // Creates an empty object to add the JSON data
      var eventObject = {};

      // The JSON data
      eventObject.id = response.data.response[i].id;
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
      eventObject.description = response.data.response[i].event_description;
      eventObject.fee = response.data.response[i].event_fee;

      // Store the JSON date in a variable called convertedDate
      var convertedDate = eventObject.date;

      // Split convertedDate into individual strings
      var newDate = convertedDate.split("");

      // Convert the numerical month into the corresponding string
      if (newDate[5] == "0" && newDate[6] == "1") {
        newDate.splice(5, 2, "January")
      } else if (newDate[5] == "0" && newDate[6] == "2") {
        newDate.splice(5, 2, "February")
      } else if (newDate[6] == "3") {
        newDate.splice(5, 2, "March")
      } else if (newDate[6] == "4") {
        newDate.splice(5, 2, "April")
      } else if (newDate[6] == "5") {
        newDate.splice(5, 2, "May")
      } else if (newDate[6] == "6") {
        newDate.splice(5, 2, "June")
      } else if (newDate[6] == "7") {
        newDate.splice(5, 2, "July")
      } else if (newDate[6] == "8") {
        newDate.splice(5, 2, "August")
      } else if (newDate[6] == "9") {
        newDate.splice(5, 2, "September")
      } else if (newDate[5] == "1" && newDate[6] == "0") {
        newDate.splice(5, 2, "October")
      } else if (newDate[5] == "1" && newDate[6] == "1") {
        newDate.splice(5, 2, "November")
      } else {
        newDate.splice(5, 2, "December")
      };

      // Remove the seconds from the JSON object
      var removeSeconds= newDate.splice(15, 3);

      // Add AM or PM to newDate
      if (newDate[10] >= 1 && newDate[11] > 1) {
        newDate.push('PM')
      } else {
        newDate.push('AM')
      };

      // Remove the dashes from the JSON object
      if (newDate[4] == "-") {
        newDate.splice(4, 1)
      };
      if (newDate[5] == "-") {
        newDate.splice(5, 1)
      };

      // Remove the month from the newDate and move it to the beginning
      var moveMonth = newDate.splice(4, 1);
      newDate.splice(0, 0, moveMonth[0]);

      // Remove the year from the newDate and move it to after the date
      var moveYear = newDate.splice(1, 4);
      newDate.splice(3, 0, moveYear[0], moveYear[1], moveYear[2],
      moveYear[3]);

      // Create a function called joinDate that will allow us to join the individual strings together
      Array.prototype.joinDate = function(seperator, start, end){
        if(!start) start = 0;
        if(!end) end = this.length - 1;
        end++;
        return this.slice(start,end).join(seperator);
      };

      // Create new variables to correctly display the day using joinDate
      var finalMonth = newDate[0]; // ex. August
      var finalDay = newDate.joinDate("", 1, 2); // ex. 08
      var finalCentury = newDate.joinDate("", 3, 4); // ex. 20
      var finalYear = newDate.joinDate("", 5, 6); // ex. 16
      var finalHour = newDate.joinDate("", 8, 9); // ex. 14
      var finalMinute = newDate.joinDate("", 11, 12); // ex. 30
      var finalAmPm = newDate[13]; // ex. PM

      // Remove the zero in finalDay if the day is < 10
      if (finalDay == 01) {
        finalDay = 1;
      } else if (finalDay == 02) {
        finalDay = 2;
      } else if (finalDay == 03) {
        finalDay = 3;
      } else if (finalDay == 04) {
        finalDay = 4;
      } else if (finalDay == 05) {
        finalDay = 5;
      } else if (finalDay == 06) {
        finalDay = 6;
      } else if (finalDay == 07) {
        finalDay = 7;
      } else if (finalDay == 08) {
        finalDay = 8;
      } else if (finalDay == 09) {
        finalDay = 9;
      };

      // Convert finalHour from military time to standard time
      if (finalHour == 00) {
        finalHour = 12;
      } else if (finalHour == 01 || finalHour == 13) {
        finalHour = 1;
      } else if (finalHour == 02 || finalHour == 14) {
        finalHour = 2;
      } else if (finalHour == 03 || finalHour == 15) {
        finalHour = 3;
      } else if (finalHour == 04 || finalHour == 16) {
        finalHour = 4;
      } else if (finalHour == 05 || finalHour == 17) {
        finalHour = 5;
      } else if (finalHour == 06 || finalHour == 18) {
        finalHour = 6;
      } else if (finalHour == 07 || finalHour == 19) {
        finalHour = 7;
      } else if (finalHour == 08 || finalHour == 20) {
        finalHour = 8;
      } else if (finalHour == 09 || finalHour == 21) {
        finalHour = 9;
      } else if (finalHour == 22) {
        finalHour = 10;
      } else if (finalHour == 23) {
        finalHour = 11;
      };

      // Conjoin the newly established variables to display the final date
      // ex. "August 8, 2016 @ 2:30 PM"
      var finalDate = finalMonth + " " + finalDay + ", " + finalCentury + finalYear + " @ " + finalHour + ":" + finalMinute + " " + finalAmPm;

      // Add finalDate to eventObject and allow the date to be accessed by html
      eventObject.eventDate = finalDate;

      // Push the eventObject into the empty listEvents array
      self.listEvents.push(eventObject);

      // Create a marker for each event on the map
      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(eventObject.latitude, eventObject.longitude),
        title: eventObject.title,
        icon: image
      });

      // Declare a new variable for InfoWindows
      var infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(10, 20)
      });

      // Generate the content of the InfoWindows with JSON data
      var content = '<div class="event-name">' +
                    '<h4>' + eventObject.title + '</h4>' +
                    '<p><b>Venue:</b> ' + eventObject.location + '</p>' +
                    '<p><b>Address:</b> ' + eventObject.address + ', ' + eventObject.city + ' ' + eventObject.state + ' ' + eventObject.postcode + '</p>' +
                    '<p><b>Date:</b> ' + eventObject.eventDate + '</p>' +
                    '<p><a href="eventDetail.html" style="color: #17B2EF !important;">Click here for more details</a></p>' +
                    '</div>';

      // When a marker is clicked, zoom in and bring up the InfoWindow and content for that specific event
      google.maps.event.addListener(marker, 'click', (function(marker, content, infoWindow) {
        return function() {
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
          map.setZoom(15);
          map.setCenter(marker.getPosition());
        };
      })(marker, content, infoWindow));

    };

    // =====================================================================================
    // WILL BE USED TO GET INFORMATION ABOUT A SINGLE EVENT

    // for (var i = 0; i < self.listEvents.length; i++) {
    //   var eventId = self.listEvents[i].id;
    //   console.log(eventId);
    // }
    //
    // $http({
    //   method: "GET",
    //   crossDomain: true,
    //   async: true,
    //   contentType: "application/x-www-form-urlencoded; charset=utf-8",
    //   dataType: 'json',
    //   url: "http://52.41.16.214:8080/api/v2/getEvent/" + eventId
    // }).then(function successCallback(response) {
    //
    //   // for (var i = 0; i < response.data.response.length; i++) {
    //     console.log("test");
    //     // Creates an empty object to add the JSON data
    //     var singleEvent = {};
    //
    //     // The JSON data
    //     singleEvent.id = response.data.response.id;
    //     singleEvent.title = response.data.response.event_title;
    //     singleEvent.host = response.data.response.event_host;
    //     singleEvent.date = response.data.response.event_date;
    //     singleEvent.location = response.data.response.event_location;
    //     singleEvent.address = response.data.response.contact_address;
    //     singleEvent.city = response.data.response.contact_city;
    //     singleEvent.state = response.data.response.contact_state;
    //     singleEvent.postcode = response.data.response.contact_post_code;
    //     singleEvent.latitude = response.data.response.latitude;
    //     singleEvent.longitude = response.data.response.longitude;
    //     singleEvent.phone = response.data.response.contact_phone;
    //     singleEvent.email = response.data.response.contact_email;
    //     singleEvent.type = response.data.response.event_type.capitalize();
    //     singleEvent.description = response.data.response.description;
    //     singleEvent.fee = response.data.response.event_fee;
    //     console.log(singleEvent.address);
    //   // }
    // }, function errorCallback(response) {
    //   console.log(response);
    // })
    // ===================================================================================

    // Convert listEvents into $scope so it can be accessed by html files
    $scope.list = self.listEvents;

    // // This will sort the events by date on the events page by implementing sortByDate
    // $scope.list.sort(sortByDate('date'));

  }, function errorCallback(response) {
    console.log(response);
  });

});
