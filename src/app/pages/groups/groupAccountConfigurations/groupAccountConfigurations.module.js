(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupAccountConfigurations', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupAccountConfigurations', {
                url: '/:groupName/account-configurations',
                controller: 'GroupAccountConfigurationsCtrl',
                templateUrl: 'app/pages/groups/groupAccountConfigurations/groupAccountConfigurations.html',
                title: "Group Users"
            });
    }

})();
