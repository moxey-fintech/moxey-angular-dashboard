(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userStellarTestnetAddressInfo', userStellarTestnetAddressInfo);

    /** @ngInject */
    function userStellarTestnetAddressInfo() {
        return {
            restrict: 'E',
            controller: 'UserStellarTestnetAddressInfoCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userStellarTestnetAddressInfo/userStellarTestnetAddressInfo.html'
        };
    }
})();
