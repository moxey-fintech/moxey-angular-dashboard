(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionFees', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupTransactionSettings.groupTransactionFees', {
                url: '/fees',
                views:{
                    'groupTransactionSettingsView':{
                      templateUrl: 'app/pages/groups/groupTransactionSettings/groupTransactionFees/groupTransactionFees.html',
                      controller: "GroupTransactionFeesCtrl"
                    }
                },
                title: 'Transaction fees'
            });
    }
})();