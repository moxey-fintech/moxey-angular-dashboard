(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionSwitches', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupTransactionSettings.groupTransactionSwitches', {
                url: '/group-controls',
                views:{
                    'groupTransactionSettingsView':{
                      templateUrl: 'app/pages/groups/groupTransactionSettings/groupTransactionSwitches/groupTransactionSwitches.html',
                      controller: "GroupTransactionSwitchesCtrl"
                    }
                },
                title: 'Group transaction controls'
            });
    }
})();