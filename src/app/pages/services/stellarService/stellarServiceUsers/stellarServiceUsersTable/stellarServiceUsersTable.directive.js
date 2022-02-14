(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceUsers')
        .directive('stellarServiceUsersTable', stellarServiceUsersTable);

    /** @ngInject */
    function stellarServiceUsersTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceUsers/stellarServiceUsersTable/stellarServiceUsersTable.html'
        };
    }
})();
