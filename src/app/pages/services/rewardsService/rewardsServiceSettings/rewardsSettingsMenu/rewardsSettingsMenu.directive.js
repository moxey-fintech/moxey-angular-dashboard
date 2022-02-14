(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceSettings')
        .directive('rewardsSettingsMenu', rewardsSettingsMenu);

    /** @ngInject */
    function rewardsSettingsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/rewardsService/rewardsServiceSettings/rewardsSettingsMenu/rewardsSettingsMenu.html'
        };
    }
})();
