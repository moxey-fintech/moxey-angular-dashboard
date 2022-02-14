(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userBusinessExtensionInfo', userBusinessExtensionInfo);

    /** @ngInject */
    function userBusinessExtensionInfo() {
        return {
            restrict: 'E',
            controller: 'UserBusinessExtensionInfoCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userBusinessExtensionInfo/userBusinessExtensionInfo.html'
        };
    }
})();
