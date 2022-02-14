(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings', [
        'BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits',
        'BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees',
        'BlurAdmin.pages.users.user.accountSettings.accountCurrencySettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user.accountSettings', {
                url: '/account/:reference/settings/:currencyCode',
                views: {
                    'userDetailsView': {
                        controller: "AccountSettingsCtrl",
                        templateUrl: 'app/pages/users/user/userAccountsOnly/accountSettings/accountSettings.html'
                    }
                },
                title: 'Account settings'
            });
    }

})();