(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.overview', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.overview', {
                url: '/overview',
                controller: 'GroupsOverviewCtrl',
                templateUrl: 'app/pages/groups/groupsOverview/groupsOverview.html',
                title: "Groups details"
            });

    }

})();
