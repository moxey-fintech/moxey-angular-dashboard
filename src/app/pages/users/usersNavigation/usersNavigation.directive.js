(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .directive('usersNavigation', usersNavigation);

    /** @ngInject */
    function usersNavigation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/usersNavigation/usersNavigation.html'
        };
    }
})();