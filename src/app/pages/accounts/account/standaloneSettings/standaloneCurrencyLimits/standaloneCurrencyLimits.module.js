(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account.standaloneSettings.standaloneCurrencyLimits', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('account.standaloneSettings.standaloneCurrencyLimits', {
                url: '/account-limits',
                title: 'Account currency limits',
                views:{
                    'accountSettingsView':{
                        templateUrl: 'app/pages/accounts/account/standaloneSettings/standaloneCurrencyLimits/standaloneCurrencyLimits.html',
                        controller: "StandaloneCurrencyLimitsCtrl"
                    }
                }
            });
    }

})();