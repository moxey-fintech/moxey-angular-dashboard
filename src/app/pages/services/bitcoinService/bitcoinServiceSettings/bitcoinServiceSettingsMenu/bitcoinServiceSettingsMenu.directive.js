(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .directive('bitcoinServiceSettingsMenu', bitcoinServiceSettingsMenu);

    /** @ngInject */
    function bitcoinServiceSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinServiceSettingsMenu/bitcoinServiceSettingsMenu.html'
        };
    }
})();
