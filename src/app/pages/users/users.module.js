(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users', [
        'BlurAdmin.pages.users.user',
        'BlurAdmin.pages.users.list',
        'BlurAdmin.pages.users.documents'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('users', {
                url: '/users',
                template : '<div ui-view="usersViews"></div>',
                abstract: true,
                controller: function ($scope,_,$state,$location) {

                    var vm = this;
                    vm.location = $location.path();
                    vm.locationArray = vm.location.split('/');

                    $scope.usersLocationIndicator = vm.locationArray[vm.locationArray.length - 1];
                    
                    if($scope.usersLocationIndicator == 'users'){
                        $state.go('users.list');
                    }
                    
                    $scope.$on('$locationChangeStart', function (event,newUrl) {
                        var newUrlArray = newUrl.split('/'),
                            newUrlLastElement = _.last(newUrlArray);
                        if(newUrlLastElement == 'list' || newUrlLastElement == 'users'){
                            $scope.usersLocationIndicator = 'list';
                            $state.go('users.list');
                        } 
                        else if(newUrlLastElement == 'user-documents') {
                            $scope.usersLocationIndicator = 'user-documents';
                            $state.go('users.documents');
                        } 
                    });
                },
                title: 'Users',
                sidebarMeta: {
                    order: 400,
                    icon: 'sidebar-users-icon'
                }
            });

        $urlRouterProvider.when("/users", "/users/list");
    }

})();