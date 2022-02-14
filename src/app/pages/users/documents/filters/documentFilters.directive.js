(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.list')
        .directive('documentFilters', documentFilters);

    /** @ngInject */
    function documentFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/documents/filters/documentFilters.html'
        };
    }
})();