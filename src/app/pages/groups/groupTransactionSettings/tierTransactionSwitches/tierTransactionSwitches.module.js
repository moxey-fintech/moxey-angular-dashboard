(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.tierTransactionSwitches', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupTransactionSettings.tierTransactionSwitches', {
                url: '/tier-controls',
                views:{
                    'groupTransactionSettingsView':{
                      templateUrl: 'app/pages/groups/groupTransactionSettings/tierTransactionSwitches/tierTransactionSwitches.html',
                      controller: "TierTransactionSwitchesCtrl"
                    }
                },
                title: 'Tier transaction controls'
            });
    }
})();