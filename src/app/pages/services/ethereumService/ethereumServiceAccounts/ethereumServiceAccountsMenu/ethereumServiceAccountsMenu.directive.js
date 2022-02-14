(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumServiceAccountsMenu', ethereumServiceAccountsMenu);

    /** @ngInject */
    function ethereumServiceAccountsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumServiceAccountsMenu/ethereumServiceAccountsMenu.html'
        };
    }
})();
