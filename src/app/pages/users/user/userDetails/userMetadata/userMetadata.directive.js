(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userMetadata', userMetadata);

    /** @ngInject */
    function userMetadata() {
        return {
            restrict: 'E',
            controller: 'UserMetadataCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userMetadata/userMetadata.html'
        };
    }
})();
