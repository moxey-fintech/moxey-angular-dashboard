(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account.standaloneSettings.standaloneCurrencySettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('account.standaloneSettings.standaloneCurrencySettings', {
                url: '/currency-settings',
                title: 'Account currency settings',
                views:{
                    'accountSettingsView':{
                        templateUrl: 'app/pages/accounts/account/standaloneSettings/standaloneCurrencySettings/standaloneCurrencySettings.html',
                        controller: "StandaloneCurrencySettingsCtrl"
                    }
                }
            });
    }

})();