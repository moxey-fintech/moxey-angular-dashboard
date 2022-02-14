(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceUsers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('ethereumServiceUsers', {
                // url: '/services/ethereum/users',
                url: '/extensions/ethereum/users',
                templateUrl: 'app/pages/services/ethereumService/ethereumServiceUsers/ethereumServiceUsers.html',
                controller: "EthereumServiceUsersCtrl",
                title: 'Users'
            });
    }

})();
