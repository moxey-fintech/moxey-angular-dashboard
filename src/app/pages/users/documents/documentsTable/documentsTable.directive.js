(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.documents')
        .directive('documentsTable', documentsTable);

    /** @ngInject */
    function documentsTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/documents/documentsTable/documentsTable.html'
        };
    }
})();