(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRewards', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService.rewardsServiceRewards', {
                url: '/list',
                views: {
                    'rewardsServiceViews' : {
                        templateUrl:'app/pages/services/rewardsService/rewardsServiceRewards/rewardsServiceRewards.html',
                        controller: "RewardsServiceRewardsCtrl"
                    }
                },
                title: 'Rewards'
            });
    }

})();
