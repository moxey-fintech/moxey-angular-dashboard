(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.definitions', [
        'BlurAdmin.pages.accounts.definitions.list',
        'BlurAdmin.pages.accounts.definitions.edit'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('accounts.definitions', {
                url: '/account-definitions',
                abstract: true,
                views: {
                    'accountsViews': {
                        templateUrl: 'app/pages/accounts/accountDefinitions/accountDefinitions.html',
                        controller: function($scope,$location){
                            var vm = this;
                            $scope.definitionChildView = 'listDefinition';
                            vm.locationArray = $location.path().split('/');
                            var urlLastElement = vm.locationArray[vm.locationArray.length - 1];
                            $scope.definitionChildView = urlLastElement === 'definitions-list' ? 'listDefinition' : 'editDefinition';
                        }
                    }
                },
                title: 'Accounts',
                params: {}
            });

        $urlRouterProvider.when("/accounts/account-definitions", "/accounts/account-definitions/definitions-list");
    }

})();