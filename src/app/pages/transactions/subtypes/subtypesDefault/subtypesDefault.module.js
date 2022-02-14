(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes.subtypesDefault', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('transactions.subtypes.subtypesDefault', {
                url: '/subtypes-default',
                views: {
                  'subtypesView': {
                    controller: 'SubtypesDefaultCtrl',
                    templateUrl: 'app/pages/transactions/subtypes/subtypesDefault/subtypesDefault.html'
                  }
                },
                title: "Subtypes",
                params: {
                    defaultSubtypes: null
                }
            });
    }

})();
