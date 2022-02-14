(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userSettings', userSettings);

    /** @ngInject */
    function userSettings() {
        return {
            restrict: 'E',
            controller: 'UserSettingsCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userSettings/userSettings.html'
        };
    }
})();
