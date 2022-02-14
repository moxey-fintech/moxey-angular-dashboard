(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.currencies', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accounts.currencies', {
                url: '/account-currencies',
                views: {
                    'accountsViews': {
                        templateUrl: 'app/pages/accounts/accountCurrencies/accountCurrencies.html',
                        controller: "AccountCurrenciesCtrl"
                    }
                },
                title: 'Accounts',
                params: {}
            });
    }

})();
