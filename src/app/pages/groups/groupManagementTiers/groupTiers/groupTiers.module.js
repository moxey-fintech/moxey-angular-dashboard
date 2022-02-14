(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupManagementTiers.list', {
                url: '/list',
                views:{
                    'groupTiersManagementView':{
                      templateUrl: 'app/pages/groups/groupManagementTiers/groupTiers/groupTiers.html',
                      controller: "GroupTiersCtrl"
                    }
                },
                title: 'Group tiers'
            });
    }

})();
