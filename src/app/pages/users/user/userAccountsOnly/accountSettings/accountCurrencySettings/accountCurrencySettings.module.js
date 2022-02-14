(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencySettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user.accountSettings.accountCurrencySettings', {
                url: '/settings',
                title: 'Account currency settings',
                views:{
                    'accountSettings':{
                        templateUrl: 'app/pages/users/user/userAccountsOnly/accountSettings/accountCurrencySettings/accountCurrencySettings.html',
                        controller: "AccountCurrencySettingsCtrl"
                    }
                }
            });
    }

})();