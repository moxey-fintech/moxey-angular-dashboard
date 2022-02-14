(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceUsers')
        .directive('ethereumServiceUsersTable', ethereumServiceUsersTable);

    /** @ngInject */
    function ethereumServiceUsersTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceUsers/ethereumServiceUsersTable/ethereumServiceUsersTable.html'
        };
    }
})();
