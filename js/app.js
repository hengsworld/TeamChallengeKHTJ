'use strict';

angular.module('RegistrationApp', [])

.controller('RegisterCtrl', ['$scope', function($scope) {

	$scope.clearForm = function() {
		document.querySelector('#signUpForm').reset();
		$scope.signUpForm.$setPristine();
		$scope.signUpForm.$setUntouched();
	}

}])