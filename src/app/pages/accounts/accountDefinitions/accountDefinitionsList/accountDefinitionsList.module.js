(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions.list', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accounts.definitions.list', {
                url: '/definitions-list',
                views: {
                    'listDefinition': {
                        templateUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionsList/accountDefinitionsList.html',
                        controller: "AccountDefinitionsListCtrl"
                    }
                },
                // templateUrl: 'app/pages/accounts/accountDefinitions/accountDefinitionsList/accountDefinitionsList.html',
                // controller: "AccountDefinitionsListCtrl",
                title: 'Accounts',
                params: {}
            });
    }

})();