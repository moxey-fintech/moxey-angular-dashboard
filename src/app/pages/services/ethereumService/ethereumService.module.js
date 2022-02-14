(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService', [
      "BlurAdmin.pages.services.ethereumService.ethereumServiceTransactions",
      "BlurAdmin.pages.services.ethereumService.ethereumServiceUsers",
      "BlurAdmin.pages.services.ethereumService.ethereumServiceSettings",
      "BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('ethereumService', {
                // url: '/services/ethereum',
                url: '/extensions/ethereum',
                abstract:true,
                // title: 'Ethereum service'
                title: 'Ethereum extension'
            });
            // $urlRouterProvider.when("/services/ethereum", "/services/ethereum/accounts");
            $urlRouterProvider.when("/extensions/ethereum", "/extensions/ethereum/accounts");
    }

})();
