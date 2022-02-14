(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userBasicInfo', userBasicInfo);

    /** @ngInject */
    function userBasicInfo() {
        return {
            restrict: 'E',
            controller: 'UserBasicInfoCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userBasicInfo/userBasicInfo.html'
        };
    }
})();
