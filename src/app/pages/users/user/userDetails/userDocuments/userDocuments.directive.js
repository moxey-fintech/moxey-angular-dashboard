(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userDocuments', userDocuments);

    /** @ngInject */
    function userDocuments() {
        return {
            restrict: 'E',
            controller: 'UserDocumentsCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userDocuments/userDocuments.html'
        };
    }
})();
