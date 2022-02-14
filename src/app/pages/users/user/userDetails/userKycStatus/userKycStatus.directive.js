(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userKycStatus', userKycStatus);

    /** @ngInject */
    function userKycStatus() {
        return {
            restrict: 'E',
            controller: 'UserKycStatusCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userKycStatus/userKycStatus.html'
        };
    }
})();
