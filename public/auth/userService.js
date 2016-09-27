(function () {
  'use strict';

  angular
    .module('app')
    .factory('UserService', UserService);

  UserService.$inject = ['$http', '$rootScope'];
  function UserService($http, $rootScope) {
    var service = {};

    service.GetById = GetById;
    service.GetByUsername = GetByUsername;
    service.Create = Create;

    return service;

    function GetById(id) {
      return $http({
        method: "GET",
        crossDomain: true,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType: 'json',
        url: "http://52.41.16.214:8080/api/v2/getUser/" + $rootScope.globals.currentUser.id
      }).then(handleSuccess, handleError('Error getting user by id'));
    }

    function GetByUsername(id) {
      // return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
      return $http({
        method: "GET",
        crossDomain: true,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType: 'json',
        url: "http://52.41.16.214:8080/api/v2/getUser/" + $rootScope.globals.currentUser.id
      }).then(handleSuccess, handleError('Error getting user by username'));
    }

    function Create(user) {
      $http.defaults.headers.common['Authorization'] = 'Basic ZGV2ZWxvcGVyLXNpZDpzcGFycm93OA==';
      // return $http.post('http://52.41.16.214:8080/api/v2/addUser').then(handleSuccess, handleError('Error creating user'));
      var signUpFirstName = document.getElementById("firstName").value;
      var signUpLastName = document.getElementById("lastName").value;
      var signUpEmail = document.getElementById("email").value;
      var signUpPassword = document.getElementById("password").value;
      var signUpConfirmPassword = document.getElementById("confirm-password").value;

      return $http({
        data: {first_name: signUpFirstName, last_name: signUpLastName, email: signUpEmail, password: signUpPassword, confirm_password: signUpConfirmPassword},
        method: "POST",
        crossDomain: true,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType: 'json',
        url: "http://52.41.16.214:8080/api/v2/addUser"
      }, user).then(handleSuccess, handleError('Error creating user'));
    }

    // private functions

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(error) {
      return function () {
        return { success: false, message: error };
      };
    }
  }

})();
