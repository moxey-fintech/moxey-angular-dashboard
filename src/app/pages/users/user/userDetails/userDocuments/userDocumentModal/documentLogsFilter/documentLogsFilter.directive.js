(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('documentLogsFilter', documentLogsFilter);

    /** @ngInject */
    function documentLogsFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userDocuments/userDocumentModal/documentLogsFilter/documentLogsFilter.html'
        };
    }
})();