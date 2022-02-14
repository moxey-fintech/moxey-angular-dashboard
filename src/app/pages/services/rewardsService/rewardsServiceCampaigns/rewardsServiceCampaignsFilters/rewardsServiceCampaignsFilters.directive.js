(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceCampaigns')
        .directive('rewardsServiceCampaignsFilters', rewardsServiceCampaignsFilters);

    /** @ngInject */
    function rewardsServiceCampaignsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/rewardsService/rewardsServiceCampaigns/' +
            'rewardsServiceCampaignsFilters/rewardsServiceCampaignsFilters.html'
        };
    }
})();