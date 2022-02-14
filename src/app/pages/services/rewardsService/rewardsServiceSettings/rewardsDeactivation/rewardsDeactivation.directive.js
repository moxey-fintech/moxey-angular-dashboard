(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceSettings')
        .directive('rewardsDeactivation', rewardsDeactivation);

    /** @ngInject */
    function rewardsDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/rewardsService/rewardsServiceSettings/rewardsDeactivation/rewardsDeactivation.html'
        };
    }
})();
