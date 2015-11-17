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

    $scope.ageValidation = function() {
    	var dob = document.getElementById("#numbers").val();
    	var now = new Date();
    	var data = dob.split("/");
    	var born = new Date(data[2], data[0]-1, data[1]);
    	age = get_age(born, now);
    	console.log("#numbers");

    	if(isNaN(Date.parse(data[2] + "-" + data[1] + "-" + data[0]))) {
    		return false;
    	}

    	if(age <= 13) {
    		alert("Age should be greater than 13");
    		return false;
    	}
    }

    $scope.get_age = function(born, now) {
    	var birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
    	if(now >= birthday) {
    		return now.getFullYear() - born.getFullYear();
    	} else {
    		return now.getFulYear() - born.getFullYear() - 1;
    	}
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