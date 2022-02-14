(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupPermissions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupPermissions', {
                url: '/:groupName/permissions',
                controller: 'GroupPermissionsCtrl',
                templateUrl: 'app/pages/groups/groupPermissions/groupPermissions.html',
                title: "Groups permissions",
            });

    }

})();
