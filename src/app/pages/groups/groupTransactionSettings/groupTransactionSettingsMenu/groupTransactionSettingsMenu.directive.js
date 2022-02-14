(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings')
        .directive('groupTransactionSettingsMenu', groupTransactionSettingsMenu);

    /** @ngInject */
    function groupTransactionSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/groups/groupTransactionSettings/groupTransactionSettingsMenu/groupTransactionSettingsMenu.html'
        };
    }
})();
