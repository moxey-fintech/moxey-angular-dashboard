(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionLimits', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupTransactionSettings.groupTransactionLimits', {
                url: '/limits',
                views:{
                    'groupTransactionSettingsView':{
                      templateUrl: 'app/pages/groups/groupTransactionSettings/groupTransactionLimits/groupTransactionLimits.html',
                      controller: "GroupTransactionLimitsCtrl"
                    }
                },
                title: 'Transaction limits'
            });
    }
})();