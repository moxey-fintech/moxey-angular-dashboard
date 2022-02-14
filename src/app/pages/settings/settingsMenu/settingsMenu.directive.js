(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings')
        .directive('settingsMenu', settingsMenu);

    /** @ngInject */
    function settingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/settings/settingsMenu/settingsMenu.html'
        };
    }
})();
