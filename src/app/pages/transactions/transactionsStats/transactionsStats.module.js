(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.stats', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('transactions.stats', {
                url: '/stats',
                views: {
                    'transactionsViews': {
                        controller: 'TransactionsStatsCtrl',
                        templateUrl: 'app/pages/transactions/transactionsStats/transactionsStats.html'
                    }
                },
                title: "Stats"
            });
    }

})();
