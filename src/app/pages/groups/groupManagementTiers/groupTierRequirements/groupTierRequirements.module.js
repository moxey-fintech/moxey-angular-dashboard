(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierRequirements', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupManagementTiers.groupTierRequirements', {
                url: '/requirements',
                views:{
                    'groupTiersManagementView':{
                      templateUrl: 'app/pages/groups/groupManagementTiers/groupTierRequirements/groupTierRequirements.html',
                      controller: "GroupTierRequirementsCtrl"
                    }
                },
                title: 'Tier requirements'
            });
    }

})();
