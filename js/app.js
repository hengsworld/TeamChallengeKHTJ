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
    $scope.password = "";
    $scope.confirm = "";

    $scope.matchPassword = function() {
        if ($scope.password === $scope.confirm) {
            $scope.signUpForm.confirm.$setValidity('$invalid', true);
            return true;
        } else {
            $scope.signUpForm.confirm.$setValidity('$invalid', false);
            return false;
        }
    }

}])