(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user.accountSettings.accountCurrencyFees', {
                url: '/fees',
                title: 'Account currency fees',
                views:{
                    'accountSettings':{
                        templateUrl: 'app/pages/users/user/userAccountsOnly/accountSettings/accountCurrencyFees/accountCurrencyFees.html',
                        controller: "AccountCurrencyFeesCtrl"
                    }
                }
            });
    }

})();