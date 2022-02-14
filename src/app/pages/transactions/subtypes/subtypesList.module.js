(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes.subtypesList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('transactions.subtypes.subtypesList', {
                url: '/subtypes-list',
                views: {
                  'subtypesView': {
                    controller: 'SubtypesCtrl',
                    templateUrl: 'app/pages/transactions/subtypes/subtypesList.html'
                  }
                },
                title: "Subtypes"
            });
    }

})();
