(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account.standaloneSettings.standaloneCurrencyFees', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('account.standaloneSettings.standaloneCurrencyFees', {
                url: '/account-fees',
                title: 'Account currency fees',
                views:{
                    'accountSettingsView':{
                        templateUrl: 'app/pages/accounts/account/standaloneSettings/standaloneCurrencyFees/standaloneCurrencyFees.html',
                        controller: "StandaloneCurrencyFeesCtrl"
                    }
                }
            });
    }

})();