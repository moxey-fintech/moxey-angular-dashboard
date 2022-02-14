(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.list')
        .directive('userFilters', userFilters);

    /** @ngInject */
    function userFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/usersList/filters/userFilters.html'
        };
    }
})();