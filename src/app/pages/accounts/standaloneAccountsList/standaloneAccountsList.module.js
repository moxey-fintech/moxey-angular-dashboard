(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.standaloneAccList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accounts.standaloneList', {
                url: '/standalone-accounts-list',
                views: {
                    'accountsViews': {
                        templateUrl: 'app/pages/accounts/standaloneAccountsList/standaloneAccountsList.html',
                        controller: "StandaloneAccountsListCtrl"
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