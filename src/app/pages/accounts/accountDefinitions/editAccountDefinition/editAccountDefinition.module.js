(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions.edit', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accounts.definitions.edit', {
                url: '/edit-definition',
                views: {
                    'editDefinition': {
                        templateUrl: 'app/pages/accounts/accountDefinitions/editAccountDefinition/editAccountDefinition.html',
                        controller: "EditAccountDefinitionCtrl"
                    }
                },
                title: 'Accounts',
                params: {
                    accDefName: null
                }
            });
    }

})();