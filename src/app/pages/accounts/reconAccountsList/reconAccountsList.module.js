(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.reconAccList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accounts.reconAccList', {
                url: '/recon-accounts-list',
                views: {
                    'accountsViews': {
                        templateUrl: 'app/pages/accounts/reconAccountsList/reconAccountsList.html',
                        controller: "ReconAccountsListCtrl"
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