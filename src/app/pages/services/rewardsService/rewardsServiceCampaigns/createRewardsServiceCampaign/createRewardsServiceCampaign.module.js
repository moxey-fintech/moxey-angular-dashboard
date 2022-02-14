(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.createRewardsServiceCampaign', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService.createRewardsServiceCampaign', {
                url: '/campaigns/create',
                views: {
                    'rewardsServiceViews' : {
                        templateUrl:'app/pages/services/rewardsService/rewardsServiceCampaigns/createRewardsServiceCampaign/createRewardsServiceCampaign.html',
                        controller: "CreateRewardsServiceCampaignsCtrl"
                    }
                },
                title: 'Rewards campaigns'
            });
    }

})();
