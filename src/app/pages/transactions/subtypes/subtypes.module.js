(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes', [
      'BlurAdmin.pages.transactions.subtypes.subtypesList',
      'BlurAdmin.pages.transactions.subtypes.subtypesDefault'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('transactions.subtypes', {
                url: '/subtypes',
                abstract: true,
                views: {
                  'transactionsViews': {
                    template: '<div ui-view="subtypesView"></div>'
                  }
                },
                title: "Subtypes"
            });

        $urlRouterProvider.when("/transactions/subtypes", "/transactions/subtypes/subtypes-list");
    }

})();
