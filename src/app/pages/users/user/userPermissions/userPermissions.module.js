(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.permissions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user.permissions', {
                url: '/permissions',
                views: {
                    'userDetailsView': {
                        controller: "UserPermissionsCtrl",
                        templateUrl: 'app/pages/users/user/userPermissions/userPermissions.html'
                    }
                },
                title: "User permissions"
            });
    }

})();