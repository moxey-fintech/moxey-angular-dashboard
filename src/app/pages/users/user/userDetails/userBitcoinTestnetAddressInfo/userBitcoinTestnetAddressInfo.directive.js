(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userBitcoinTestnetAddressInfo', userBitcoinTestnetAddressInfo);

    /** @ngInject */
    function userBitcoinTestnetAddressInfo() {
        return {
            restrict: 'E',
            controller: 'UserBitcoinTestnetAddressInfoCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userBitcoinTestnetAddressInfo/userBitcoinTestnetAddressInfo.html'
        };
    }
})();
