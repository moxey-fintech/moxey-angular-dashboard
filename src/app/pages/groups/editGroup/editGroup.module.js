(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.editGroup', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.editGroup', {
                url: '/:groupName/details',
                controller: 'EditGroupCtrl',
                templateUrl: 'app/pages/groups/editGroup/editGroup.html',
                title: "Groups"
            });
    }

})();
