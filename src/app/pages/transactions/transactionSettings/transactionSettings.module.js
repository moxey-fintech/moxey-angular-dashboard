(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.settings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('transactions.settings', {
                url: '/global-subtype-controls',
                views: {
                    'transactionsViews': {
                        controller: 'TransactionSettingsCtrl',
                        templateUrl: 'app/pages/transactions/transactionSettings/transactionSettings.html'
                    }
                },
                title: "Global Subtype Controls"
            });
    }

})();
