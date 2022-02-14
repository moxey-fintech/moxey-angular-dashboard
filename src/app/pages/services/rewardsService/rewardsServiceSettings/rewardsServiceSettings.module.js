(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService.rewardsServiceSettings', {
                url: '/settings',
                views: {
                    'rewardsServiceViews' : {
                        templateUrl:'app/pages/services/rewardsService/rewardsServiceSettings/rewardsServiceSettings.html',
                        controller: "RewardsServiceSettingsCtrl"
                    }
                },
                title: 'Rewards'
            });
    }

})();
