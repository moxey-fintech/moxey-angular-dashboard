(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRewards')
        .directive('rewardsServiceRewardsFilters', rewardsServiceRewardsFilters);

    /** @ngInject */
    function rewardsServiceRewardsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/rewardsService/rewardsServiceRewards/rewardsServiceRewardsFilters/rewardsServiceRewardsFilters.html'
        };
    }
})();