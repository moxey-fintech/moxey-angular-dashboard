(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.overview', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currency.overview', {
                url: '/overview',
                templateUrl: 'app/pages/currency/overview/overview.html',
                controller: "OverviewCtrl",
                title: 'Overview',
                sidebarMeta: {
                    order: 0
                }
            });
    }

})();