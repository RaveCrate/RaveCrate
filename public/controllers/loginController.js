(function () {
  'use strict';

  var myApp = angular
    .module('myApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService', '$rootScope'];
  function LoginController($location, AuthenticationService, FlashService, $rootScope) {
    var vm = this;

    vm.login = login;

    (function initController() {
      // reset login status
      AuthenticationService.ClearCredentials();
    })();

    function login() {
      vm.dataLoading = true;
      AuthenticationService.Login(vm.email, vm.password, function(response) {
        console.log(response);
        if (response.status == 'success') {
          AuthenticationService.SetCredentials(vm.email, vm.password, vm.id, vm.firstName);
          $rootScope.test = response.response.first_name;
          console.log($rootScope.test);
          console.log(vm.id);
          console.log('log in success');
          $location.path('/');
        } else {
          FlashService.Error(response.message);
          vm.dataLoading = false;
        }
      });
    };
  }

})();
