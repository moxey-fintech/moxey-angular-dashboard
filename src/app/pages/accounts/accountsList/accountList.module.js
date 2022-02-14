(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.userAccList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accounts.userAccList', {
                url: '/user-accounts-list',
                views: {
                    'accountsViews': {
                        templateUrl: 'app/pages/accounts/accountsList/accounts.html',
                        controller: "AccountsCtrl"
                    }
                },
                title: 'Accounts',
                params: {
                    email: null,
                    accountRef: null
                }
            });
    }

})();
