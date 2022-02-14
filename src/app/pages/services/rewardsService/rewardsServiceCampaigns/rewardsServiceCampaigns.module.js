(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceCampaigns', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService.rewardsServiceCampaigns', {
                url: '/campaigns',
                views: {
                    'rewardsServiceViews' : {
                        templateUrl:'app/pages/services/rewardsService/rewardsServiceCampaigns/rewardsServiceCampaigns.html',
                        controller: "RewardsServiceCampaignsCtrl"
                    }
                },
                title: 'Rewards campaigns'
            });
    }

})();
