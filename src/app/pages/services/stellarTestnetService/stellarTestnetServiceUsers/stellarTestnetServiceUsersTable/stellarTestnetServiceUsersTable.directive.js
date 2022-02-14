(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceUsers')
        .directive('stellarTestnetServiceUsersTable', stellarTestnetServiceUsersTable);

    /** @ngInject */
    function stellarTestnetServiceUsersTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceUsers/stellarTestnetServiceUsersTable/stellarTestnetServiceUsersTable.html'
        };
    }
})();
