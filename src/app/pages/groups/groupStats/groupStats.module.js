(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupStats', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupStats', {
                url: '/:groupName/stats',
                controller: 'GroupStatsCtrl',
                templateUrl: 'app/pages/groups/groupStats/groupStats.html',
                title: "Groups"
            });
    }

})();
