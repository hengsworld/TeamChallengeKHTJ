'use strict';

angular.module('TodoApp', ['angular.panels', 'ui.router', 'ui.bootstrap', 'firebase'])

.config(['panelsProvider', '$stateProvider', '$urlRouterProvider', function(panelsProvider, $stateProvider, $urlRouterProvider) {
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
        .state('re-edit', {
            url: '/edit/{id}',
            templateUrl: 'partials/edit.html',
            controller: 'newNoteCtrl'
        });

    panelsProvider
        .add({
            id: 'sideBar',
            position: 'left',
            size: '450px',
            templateUrl: 'partials/sideBar.html',
            controller: 'sideBarCtrl'
        });

     $urlRouterProvider.otherwise('/#');
}])

// parent controller that houses all the ui-views
// put all global functions and variables here to access them from
// the other ui-views
.controller('TodoCtrl', ['$scope', '$uibModal', '$firebaseAuth', '$firebaseArray', '$firebaseObject', '$stateParams', 'panels', function($scope, $uibModal, $firebaseAuth, $firebaseArray, $firebaseObject, $stateParams, panels) {

    //reference to the app
    var ref = new Firebase("https://khtj-todo-list.firebaseio.com/");

    //make the Auth service for this app
    var Auth = $firebaseAuth(ref);

    //reference to a value in the JSON in the Sky
    var valueRef = ref.child('TodoList');
    if (valueRef === undefined) {
        ref.push().set({
            'TodoList': []
        });
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
            .catch(function(error) {
                //error handling (called on the promise)
                console.log(error);
            })
    };

    // if trash is clicked, delete review
       $scope.delete = function(item){
            var index = $scope.list.indexOf(item);
            $scope.list.splice(index, 1);
            
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
        if (authData) { //if we are authorized
            $scope.userId = authData.uid;
            $scope.userName = authData.password.email;
        } else {
            $scope.userId = undefined;
        }
    });

    //Test if already logged in (when page load)
    var authData = Auth.$getAuth(); //get if we're authorized
    $scope.loggedIn = authData; // easy variable to test if logged in
    if (authData) {
        $scope.userId = authData.uid;
    }

    // opens the login modal
    $scope.open = function() {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'partials/login-modal.html',
            controller: 'ModalInstanceCtrl',
            scope: $scope // pass in the parent scope, so that functions
                // are availible to be called from here
        });

    }

    $scope.sideBarOpen = function() {
        $scope.$broadcast('leftBarOpen', {});
        console.log('sent');
    }

    $scope.formatTime = function(time) {
        return new Date(time).toLocaleString();
    }

    $scope.getKey = function(item) {
        var key = $scope.list.$keyAt(item);
        console.log(key);
        console.log($scope.list.$indexFor(key));
    }

}])

// separate controller for the edit page
.controller('newNoteCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

        $scope.id = $stateParams.id;
        if ($scope.id != undefined) {
            $scope.title = $scope.list[$scope.id].title;
            $scope.body = $scope.list[$scope.id].body;
            $scope.tagText = $scope.list[$scope.id].tagText;
            var author = $scope.list[$scope.id].author;
        }

        // creates new note and appends it to firebase cloud Json
        $scope.newNote = function() {
            var newItem = {
                title: $scope.title,
                body: $scope.body,
                tagText: $scope.tagText,
                author: $scope.userName,
                time: Firebase.ServerValue.TIMESTAMP
            };
            console.log(newItem)
            $scope.$parent.list.$add(newItem);
            $scope.$parent.list.$save();
        }

        $scope.updateNote = function() {
            // emptying the array
            $scope.title = ' ';
            $scope.body = ' ';
            $scope.tagText = ' ';
            $scope.userName = '';

        }

        $scope.editNote = function() {
            $scope.$parent.list[$scope.id].title = $scope.title;
            $scope.$parent.list[$scope.id].body = $scope.body;
            $scope.$parent.list[$scope.id].tagText = $scope.tagText;
            $scope.$parent.list.$save($scope.$parent.list[$scope.id]);
        }

        $scope.deleteReview = function() {
            $scope.title.$remove;
            $scope.body.$remove;
            $scope.tagText.$remove;
            $scope.userName.$remove;

        }

        $scope.inputTags = [];

        $scope.addTag = function() {
            if ($scope.tagText.length == 0) {
                return;
            }

            $scope.inputTags.push({
                name: $scope.tagText
            });
            $scope.tagText = '';
        }

        $scope.deleteTag = function(key) {
            if ($scope.inputTags.length > 0 &&
                $scope.tagText.length == 0 &&
                key === undefined) {
                $scope.inputTags.pop();
            } else if (key != undefined) {
                $scope.inputTags.splice(key, 1);
            }
        }

    }])
    .directive('tagInput', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.inputWidth = 20;

                // Watch for changes in text field
                scope.$watch(attrs.ngModel, function(value) {
                    if (value != undefined) {
                        var tempEl = $('<span>' + value + '</span>').appendTo('body');
                        scope.inputWidth = tempEl.width() + 5;
                        tempEl.remove();
                    }
                });

                element.bind('keydown', function(e) {
                    if (e.which == 9) {
                        e.preventDefault();
                    }

                    if (e.which == 8) {
                        scope.$apply(attrs.deleteTag);
                    }
                });

                element.bind('keyup', function(e) {
                    var key = e.which;

                    // Tab or Enter pressed 
                    if (key == 9 || key == 13) {
                        e.preventDefault();
                        scope.$apply(attrs.newTag);
                    }
                });
            }
        }
    })

.controller('sideBarCtrl', ['$scope', 'panels', function($scope, panels) {

    $scope.$on('leftBarOpen', function(event, args) {
        console.log('received');
        panels.open('sideBar');
    });

}])


// separate controller for the login modal
.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

    // either signUp or signIn was pressed. Determines which was pressed and calls
    // the appropriate method to use. Also closes modal.
    $scope.ok = function(messageType) {
        $uibModalInstance.close();
        if (messageType == 'signup') {
            $scope.signUp($scope.email, $scope.password);
        } else if (messageType == 'login') {
            $scope.signIn($scope.email, $scope.password);
        }
    };

    // closes modal
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}]);