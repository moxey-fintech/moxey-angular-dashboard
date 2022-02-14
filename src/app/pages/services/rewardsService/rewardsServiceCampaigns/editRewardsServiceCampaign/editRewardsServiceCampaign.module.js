(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.editRewardsServiceCampaign', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService.editRewardsServiceCampaign', {
                url: '/campaigns/:campaignId/edit',
                views: {
                    'rewardsServiceViews' : {
                        templateUrl:'app/pages/services/rewardsService/rewardsServiceCampaigns/editRewardsServiceCampaign/editRewardsServiceCampaign.html',
                        controller: "EditRewardsServiceCampaignsCtrl"
                    }
                },
                title: 'Rewards campaigns'
            });
    }

})();
