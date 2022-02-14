(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('ethereumServiceAccounts', {
                // url: '/services/ethereum/accounts',
                url: '/extensions/ethereum/accounts',
                templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumServiceAccounts.html',
                controller: "EthereumServiceAccountsCtrl",
                title: 'Accounts'
            });
    }

})();
