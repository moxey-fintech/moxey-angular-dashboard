(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings', [
        'BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionFees',
        'BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionLimits',
        'BlurAdmin.pages.groups.groupTransactionSettings.groupTransactionSwitches',
        'BlurAdmin.pages.groups.groupTransactionSettings.tierTransactionSwitches'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupTransactionSettings', {
                url: '/:groupName/transaction-settings',
                controller: 'GroupTransactionSettingsCtrl',
                templateUrl: 'app/pages/groups/groupTransactionSettings/groupTransactionSettings.html',
                title: "Group transaction settings"
            });
    }

})();
