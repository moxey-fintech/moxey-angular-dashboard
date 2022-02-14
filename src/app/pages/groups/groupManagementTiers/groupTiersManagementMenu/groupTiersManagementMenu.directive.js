(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers')
        .directive('groupTiersManagementMenu', groupTiersManagementMenu);

    /** @ngInject */
    function groupTiersManagementMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/groups/groupManagementTiers/groupTiersManagementMenu/groupTiersManagementMenu.html'
        };
    }
})();
