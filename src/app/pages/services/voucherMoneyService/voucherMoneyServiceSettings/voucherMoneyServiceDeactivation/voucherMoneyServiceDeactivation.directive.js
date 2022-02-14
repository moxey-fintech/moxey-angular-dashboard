(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService.voucherMoneyServiceSettings')
        .directive('voucherMoneyServiceDeactivation', voucherMoneyServiceDeactivation);

    /** @ngInject */
    function voucherMoneyServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/voucherMoneyService/voucherMoneyServiceSettings/voucherMoneyServiceDeactivation/voucherMoneyServiceDeactivation.html'
        };
    }
})();
