//Everything is in one file for sake of simplicity
var contactsApp = angular.module('ContactsApp', []);

contactsApp.factory('Contact', ['$http', function ($http) {
    var baseUrl = '../src/data.js'; //Replace URL with https://s3.amazonaws.com/technical-challenge/Contacts_v2.json, Local development had X-domain issues
    var Contact = {};
    Contact.getContacts = function () {
        return $http.get(baseUrl);
    };
    return Contact;
}]);

contactsApp.controller('contactsController', ['$scope', 'Contact',
    function ($scope, Contact) {

        function getContacts() {
            Contact.getContacts()
                .then(function (response) {
                    $scope.contacts = response.data;
                }, function (error) {
                    $scope.status = 'Unable to load data';
                });
        }

        $scope.contactDetail = function (contactDob) {
            var processContacts = $scope.contacts;
            var result = processContacts.filter(function (obj) {
                return obj.birthdate == contactDob;
            });
            $scope.currentContact = result[0];
        }

        $scope.anyItemOpen = function () {
            return $scope.currentContact !== undefined;
        };

        $scope.close = function () {
            $scope.currentContact = undefined;
        };

        getContacts();
    }
]);

//If an image errors out (404), the following directive loads default avatar
contactsApp.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});