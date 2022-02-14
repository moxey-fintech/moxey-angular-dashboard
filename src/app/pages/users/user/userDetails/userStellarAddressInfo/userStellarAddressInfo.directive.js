(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userStellarAddressInfo', userStellarAddressInfo);

    /** @ngInject */
    function userStellarAddressInfo() {
        return {
            restrict: 'E',
            controller: 'UserStellarAddressInfoCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userStellarAddressInfo/userStellarAddressInfo.html'
        };
    }
})();
