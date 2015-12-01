'use strict';

angular.module('TodoApp', ['ui.router', 'ui.bootstrap', 'firebase'])

.config(function($stateProvider) {
    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'partials/home.html',
        controller: 'TodoCtrl'
    })
    .state('edit', {
        url: '/edit',
        templateUrl: 'partials/edit.html',
        controller: 'newNoteCtrl'
    })
})

// parent controller that houses all the ui-views
// put all global functions and variables here to access them from
// the other ui-views
.controller('TodoCtrl', ['$scope', '$uibModal', '$firebaseAuth', '$firebaseArray', '$firebaseObject', '$stateParams', function ($scope, $uibModal, $firebaseAuth, $firebaseArray, $firebaseObject, $stateParams) {

    //reference to the app
    var ref = new Firebase("https://khtj-todo-list.firebaseio.com/");

    //make the Auth service for this app
    var Auth = $firebaseAuth(ref);

    //reference to a value in the JSON in the Sky
    var valueRef = ref.child('TodoList');
    if (valueRef === undefined) {
        ref.push().set({'TodoList': []});
        valueRef = ref.child('TodoList');
    }
    $scope.list = $firebaseArray(valueRef);

    // signUp fungtion that chains and calls signIn afterwards
    $scope.signUp = function(email, password) {
        console.log("creating user " + email);
        //pass in an object with the new 'email' and 'password'
        Auth.$createUser({
            'email': email,
            'password': password
        })
        .then($scope.signIn)
        .catch(function(error){
            //error handling (called on the promise)
            console.log(error);
        })
    };

    //separate signIn function
    $scope.signIn = function(email, password) {
        console.log(email);
        var promise = Auth.$authWithPassword({
            'email': email,
            'password': password
        });
        return promise; //return promise so we can *chain promises*
                        //and call .then() on returned value
    };

    //Make LogOut function available to views
    $scope.logOut = function() {
        Auth.$unauth(); //"unauthorize" to log out
    };

    //Any time auth status updates, set the userId so we know
    Auth.$onAuth(function(authData) {
        if(authData) { //if we are authorized
            $scope.userId = authData.uid;
        }
        else {
            $scope.userId = undefined;
        }
    });

    //Test if already logged in (when page load)
    var authData = Auth.$getAuth(); //get if we're authorized
    $scope.loggedIn = authData; // easy variable to test if logged in
    if(authData) {
        $scope.userId = authData.uid;
    }

    // opens the login modal
    $scope.open = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'partials/login-modal.html',
            controller: 'ModalInstanceCtrl',
            scope: $scope   // pass in the parent scope, so that functions
                            // are availible to be called from here
        });

    };

    $scope.formatTime = function(time) {
        return new Date(time).toDateString();
    }

}])

// separate controller for the edit page
.controller('newNoteCtrl', ['$scope', function ($scope) {

    // creates new note and appends it to firebase cloud Json
    $scope.newNote = function() {
        var newItem = {
            title: $scope.title,
            body: $scope.body,
            author: $scope.userId,
            time: Firebase.ServerValue.TIMESTAMP
        };
        $scope.$parent.list.$add(newItem);
        $scope.$parent.list.$save();
    }

}])

// separate controller for the login modal
.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

    // either signUp or signIn was pressed. Determines which was pressed and calls
    // the appropriate method to use. Also closes modal.
    $scope.ok = function (messageType) {
        $uibModalInstance.close();
        if (messageType == 'signup') {
            $scope.signUp($scope.email, $scope.password);
        } else if (messageType == 'login') {
            $scope.signIn($scope.email, $scope.password);
        }
    };

    // closes modal
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);