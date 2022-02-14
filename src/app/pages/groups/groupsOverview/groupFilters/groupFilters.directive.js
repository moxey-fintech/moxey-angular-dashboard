(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.overview')
        .directive('groupFilters', groupFilters);

    /** @ngInject */
    function groupFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/groups/groupsOverview/groupFilters/groupFilters.html'
        };
    }
})();