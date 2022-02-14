(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceUsers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinServiceUsers', {
                // url: '/services/bitcoin/users',
                url: '/extensions/bitcoin/users',
                templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceUsers/bitcoinServiceUsers.html',
                controller: "BitcoinServiceUsersCtrl",
                title: 'Users'
            });
    }

})();
