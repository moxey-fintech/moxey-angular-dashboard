(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts', [
        'BlurAdmin.pages.accounts.userAccList',
        'BlurAdmin.pages.accounts.reconAccList',
        'BlurAdmin.pages.accounts.standaloneAccList',
        'BlurAdmin.pages.accounts.currencies',
        'BlurAdmin.pages.accounts.account',
        'BlurAdmin.pages.accounts.definitions'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('accounts', {
                url: '/accounts',
                templateUrl : 'app/pages/accounts/accountsView.html',
                abstract: true,
                controller: function ($scope,_,$state,$location) {

                    var vm = this;
                    vm.location = $location.path();
                    vm.locationArray = vm.location.split('/');
                    $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];                    
                    if($scope.locationIndicator == 'accounts'){
                        $state.go('accounts.userAccList');
                    }

                    $scope.goToAccountDefList = function(){
                        $scope.locationIndicator = 'definitions';
                        $state.go('accounts.definitions.list', {}, {reload: true});
                    };
                    
                    $scope.$on('$locationChangeStart', function (event,newUrl) {
                        var newUrlArray = newUrl.split('/'),
                            newUrlLastElement = _.last(newUrlArray);
                            
                        if(newUrlLastElement == 'user-accounts-list' || newUrlLastElement == 'accounts'){
                            $scope.locationIndicator = 'user-accounts-list';
                            $state.go('accounts.userAccList');
                        } else if(newUrlLastElement == 'account-currencies') {
                            $scope.locationIndicator = 'currencies';
                            $state.go('accounts.currencies');
                        } else if(newUrlLastElement == 'account-definitions' || newUrlLastElement == 'definitions-list' || newUrlLastElement == 'edit-definition') {
                            $scope.locationIndicator = 'definitions';
                            (newUrlLastElement == 'edit-definition') ? $state.go('accounts.definitions.edit') : $state.go('accounts.definitions.list');
                        } else if(newUrlLastElement == 'standalone-accounts-list') {
                            $scope.locationIndicator = 'standalone-accounts-list';
                            $state.go('accounts.standaloneList');
                        } else if(newUrlLastElement == 'recon-accounts-list') {
                            $scope.locationIndicator = 'recon-accounts-list';
                            $state.go('accounts.reconAccList');
                        }
                    });
                },
                title: 'Accounts',
                sidebarMeta: {
                    order: 200,
                    icon: 'sidebar-accounts-icon'
                }
            });

        $urlRouterProvider.when("/accounts", "/accounts/user-accounts-list");
    }

})();
