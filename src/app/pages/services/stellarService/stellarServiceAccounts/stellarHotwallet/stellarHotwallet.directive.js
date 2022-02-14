(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarHotwallet', stellarHotwallet);

    /** @ngInject */
    function stellarHotwallet() {
        return {
            restrict: 'E',
            controller: 'StellarHotwalletCtrl',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarHotwallet/stellarHotwallet.html'
        };
    }
})();
