(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetHotwallet', stellarTestnetHotwallet);

    /** @ngInject */
    function stellarTestnetHotwallet() {
        return {
            restrict: 'E',
            controller: 'StellarTestnetHotwalletCtrl',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetHotwallet/stellarTestnetHotwallet.html'
        };
    }
})();
