(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceSettings')
        .directive('bitcoinTestnetServiceSettingsMenu', bitcoinTestnetServiceSettingsMenu);

    /** @ngInject */
    function bitcoinTestnetServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinTestnetService/bitcoinTestnetServiceSettings/bitcoinTestnetServiceSettingsMenu/bitcoinTestnetServiceSettingsMenu.html'
        };
    }
})();
