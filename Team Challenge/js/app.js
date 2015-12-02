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

    $scope.getDate = function(passedDate) {
        var today = new Date();
        var test = (today.getMonth() + 1) + "/" + today.getDate() + "/" + (today.getFullYear() - 13);
        var past = Date.parse(test);
        var passed = Date.parse(passedDate);
        return passed < past;
    }
}])

.directive("compareTo", function() {    
    return {        
        require: "ngModel",
                scope: {            
            otherModelValue: "=compareTo"        
        },
                link: function(scope, element, attributes, ngModel) {                         
            ngModel.$validators.compareTo = function(modelValue) {                
                return modelValue === scope.otherModelValue;            
            };             
            scope.$watch("otherModelValue", function() {                
                ngModel.$validate();            
            });        
        }    
    };
})

.directive("dateValid", function() {    
    return {        
        require: "ngModel",
                link: function(scope, element, attributes, ngModel) {                         
            ngModel.$validators.dateValid = function(modelValue) {               
                return scope.getDate(modelValue);            
            };  
            scope.$watch("modelValue", function() {                
                ngModel.$validate();            
            });        
        }    
    };
});;