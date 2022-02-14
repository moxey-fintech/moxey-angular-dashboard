(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService', [
      "BlurAdmin.pages.services.bitcoinService.bitcoinServiceTransactions",
      "BlurAdmin.pages.services.bitcoinService.bitcoinServiceUsers",
      "BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings",
      "BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinService', {
                // url: '/services/bitcoin',
                url: '/extensions/bitcoin',
                abstract:true,
                // title: 'Bitcoin service'
                title: 'Bitcoin extension'
            });
            // $urlRouterProvider.when("/services/bitcoin", "/services/bitcoin/accounts");
            $urlRouterProvider.when("/extensions/bitcoin", "/extensions/bitcoin/accounts");
    }

})();
