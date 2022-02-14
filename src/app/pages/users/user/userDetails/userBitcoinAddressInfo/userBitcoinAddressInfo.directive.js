(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userBitcoinAddressInfo', userBitcoinAddressInfo);

    /** @ngInject */
    function userBitcoinAddressInfo() {
        return {
            restrict: 'E',
            controller: 'UserBitcoinAddressInfoCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userBitcoinAddressInfo/userBitcoinAddressInfo.html'
        };
    }
})();
