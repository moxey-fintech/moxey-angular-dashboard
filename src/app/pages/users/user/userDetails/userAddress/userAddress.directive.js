(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userAddress', userAddress);

    /** @ngInject */
    function userAddress() {
        return {
            restrict: 'E',
            controller: 'UserAddressCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userAddress/userAddress.html'
        };
    }
})();
