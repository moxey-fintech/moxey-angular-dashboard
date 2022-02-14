(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.voucherMoneyService.voucherMoneyServiceSettings')
        .directive('voucherMoneyServiceSettingsMenu', voucherMoneyServiceSettingsMenu);

    /** @ngInject */
    function voucherMoneyServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/voucherMoneyService/voucherMoneyServiceSettings/voucherMoneyServiceSettingsMenu/voucherMoneyServiceSettingsMenu.html'
        };
    }
})();
