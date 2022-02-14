(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account.standaloneSettings')
        .directive('standaloneSettingsMenu', standaloneSettingsMenu);

    /** @ngInject */
    function standaloneSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/account/standaloneSettings/standaloneSettingsMenu/standaloneSettingsMenu.html'
        };
    }
})();
