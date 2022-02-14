(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups')
        .directive('groupNavigation', groupNavigation);

    /** @ngInject */
    function groupNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/groups/groupNavigation/groupNavigation.html'
        };
    }
})();
