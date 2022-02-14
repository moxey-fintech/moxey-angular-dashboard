(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceUsers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarServiceUsers', {
                // url: '/services/stellar/users',
                url: '/extensions/stellar/users',
                templateUrl: 'app/pages/services/stellarService/stellarServiceUsers/stellarServiceUsers.html',
                controller: "StellarServiceUsersCtrl",
                title: 'Users'
            });
    }

})();
