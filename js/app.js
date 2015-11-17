'use strict';

angular.module('RegistrationApp', [])

.controller('RegisterCtrl', ['$scope', function($scope) {

    $scope.clearForm = function() {
        document.querySelector('#signUpForm').reset();
        $scope.signUpForm.$setPristine();
        $scope.signUpForm.$setUntouched();
    }
    $scope.submitForm = function() {
        $scope.submitted = true;
    }

}])

.directive('pwCheck', function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attrs, ctrl) {
			scope.$watch(attrs.pwCheck, function (confirmPassword) {
    			var isValid = ctrl.$viewValue === confirmPassword;
    			ctrl.$setValidity('pwmatch', isValid);
			})
		}
	}
});

