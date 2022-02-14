(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.tokens', {
                url: '/tokens',
                controller: 'TokensCtrl',
                templateUrl: 'app/pages/developers/tokens/tokens.html',
                title: "API tokens",
                sidebarMeta: {
                    order: 200
                },
                params: {
                    customToken: null,
                    customTokenVerified: false
                }
            });
    }

})();
