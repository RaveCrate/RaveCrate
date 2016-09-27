(function () {
  'use strict';

  angular
    .module('app', ['ngRoute', 'ngCookies'])
    .config(config)
    .run(run);

  // config.$inject = ['$routeProvider', '$locationProvider'];
  // function config($routeProvider, $locationProvider) {
  //   $routeProvider
  //     .when('/', {
  //       templateUrl: 'public/views/index.html'
  //     })
  //
  //     .when('/login', {
  //       controller: 'LoginController',
  //       templateUrl: 'public/views/login.html',
  //       controllerAs: 'vm'
  //     })
  //
  //     .when('/signup', {
  //       controller: 'SignupController',
  //       templateUrl: 'public/views/signup.html',
  //       controllerAs: 'vm'
  //     })
  //
  //     .when('/events', {
  //       controller: 'eventCtrl',
  //       templateUrl: 'public/views/events.html'
  //     })
  //
  //     .when('/eventDetail', {
  //       controller: 'eventCtrl',
  //       templateUrl: 'public/views/eventDetail.html'
  //     })
  //
  //     .when('/createEvent', {
  //       templateUrl: 'public/views/createevent.html'
  //     })
  //
  //     .when('/freelancers', {
  //       templateUrl: 'public/views/freelancers.html'
  //     })
  //
  //     .when('/createFreelancer', {
  //       templateUrl: 'public/views/createfreelancer.html'
  //     })
  //
  //     .when('/about', {
  //       templateUrl: 'public/views/about.html'
  //     })
  //
  //     .when('/contactUs', {
  //       templateUrl: 'public/views/contactUs.html'
  //     })
  //
  //     .when('/comingSoon', {
  //       templateUrl: 'public/views/comingsoon.html'
  //     })
  //
  //     .otherwise({ redirectTo: '/login' });
  // }

  run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
  function run($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Basic ZGV2ZWxvcGVyLXNpZDpzcGFycm93OA==';
      $http({
        method: "POST",
        crossDomain: true,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType: 'json',
        data: {email: $rootScope.globals.currentUser.email, password: $rootScope.globals.currentUser.password},
        url: "http://52.41.16.214:8080/api/v2/authUser"
      }, {email: $rootScope.globals.currentUser.email, password: $rootScope.globals.currentUser.password}).success(function (response) {
        // callback(response);
        console.log(response.response.first_name);
        console.log($rootScope.globals.currentUser.email);
        console.log($rootScope.globals.currentUser.password);
        console.log($rootScope.globals.currentUser.id);
      });
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      var restrictedPage = $.inArray($location.path(), ['/login', '/signup']) === -1;
      var loggedIn = $rootScope.globals.currentUser;
      if (restrictedPage && !loggedIn) {
        $location.path('/login');
      }
    });
  }

})();
