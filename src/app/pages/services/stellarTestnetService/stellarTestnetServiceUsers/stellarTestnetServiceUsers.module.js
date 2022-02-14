(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceUsers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetServiceUsers', {
                // url: '/services/stellar-testnet/users',
                url: '/extensions/stellar-testnet/users',
                templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceUsers/stellarTestnetServiceUsers.html',
                controller: "StellarTestnetServiceUsersCtrl",
                title: 'Users'
            });
    }

})();
