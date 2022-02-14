(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupUsers', {
                url: '/:groupName/users',
                controller: 'GroupUsersCtrl',
                templateUrl: 'app/pages/groups/groupUsers/groupUsers.html',
                title: "Group Users"
            });
    }

})();
