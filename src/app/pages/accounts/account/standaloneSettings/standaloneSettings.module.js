(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account.standaloneSettings', [
        'BlurAdmin.pages.accounts.account.standaloneSettings.standaloneCurrencyLimits',
        'BlurAdmin.pages.accounts.account.standaloneSettings.standaloneCurrencyFees',
        'BlurAdmin.pages.accounts.account.standaloneSettings.standaloneCurrencySettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('account.standaloneSettings', {
                url: '/account-settings/:currencyCode',
                views: {
                    'accountDetailsView': {
                        controller: "StandaloneSettingsCtrl",
                        templateUrl: 'app/pages/accounts/account/standaloneSettings/standaloneSettings.html'
                    }
                },
                title: 'Account settings'
            });
    }

})();