(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetServiceAccountsMenu', stellarTestnetServiceAccountsMenu);

    /** @ngInject */
    function stellarTestnetServiceAccountsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetServiceAccountsMenu/stellarTestnetServiceAccountsMenu.html'
        };
    }
})();
