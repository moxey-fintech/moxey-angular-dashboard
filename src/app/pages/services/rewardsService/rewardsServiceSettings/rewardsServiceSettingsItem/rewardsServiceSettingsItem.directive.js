(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceSettings')
        .directive('rewardsSettingsItem', rewardsSettingsItem);

    /** @ngInject */
    function rewardsSettingsItem() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/rewardsService/rewardsServiceSettings/rewardsServiceSettingsItem/rewardsServiceSettingsItem.html'
        };
    }
})();
