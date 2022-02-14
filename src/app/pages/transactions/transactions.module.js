(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions', [
            'BlurAdmin.pages.transactions.history',
            'BlurAdmin.pages.transactions.subtypes',
            'BlurAdmin.pages.transactions.stats',
            'BlurAdmin.pages.transactions.settings'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('transactions', {
                url: '/transactions',
                template : '<div ui-view="transactionsViews"></div>',
                abstract: true,
                controller: function ($scope,_,$state,$location) {

                    var vm = this;
                    vm.location = $location.path();
                    vm.locationArray = vm.location.split('/');
                    $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
                    if($scope.locationIndicator == 'transactions'){
                        $state.go('transactions.history');
                    }
                    $scope.$on('$locationChangeStart', function (event,newUrl) {
                        var newUrlArray = newUrl.split('/'),
                            newUrlLastElement = _.last(newUrlArray);
                        if(newUrlLastElement == 'history' || newUrlLastElement == 'transactions'){
                            $scope.locationIndicator = 'history';
                            $state.go('transactions.history');
                        } else if(newUrlLastElement == 'subtypes' || newUrlLastElement == 'subtypes-list' || newUrlLastElement == 'subtypes-default') {
                            $scope.locationIndicator = 'subtypes';
                            var targetState = newUrlLastElement == 'subtypes' ||  newUrlLastElement == 'subtypes-list' ? 'transactions.subtypes.subtypesList' : 'transactions.subtypes.subtypesDefault';
                            $state.go(targetState);
                        } else if(newUrlLastElement == 'stats') {
                            $scope.locationIndicator = 'stats';
                            $state.go('transactions.stats');
                        } else if(newUrlLastElement == 'global-subtype-controls') {
                            $scope.locationIndicator = 'global-subtype-controls';
                            $state.go('transactions.settings');
                        }
                    });
                },
                title: 'Transactions',
                sidebarMeta: {
                    order: 300,
                    icon: 'sidebar-transactions-icon'
                }
            });
        $urlRouterProvider.when("/transactions", "/transactions/history");
    }

})();