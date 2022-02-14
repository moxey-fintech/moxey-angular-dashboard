(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarServiceAccountsMenu', stellarServiceAccountsMenu);

    /** @ngInject */
    function stellarServiceAccountsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarServiceAccountsMenu/stellarServiceAccountsMenu.html'
        };
    }
})();
