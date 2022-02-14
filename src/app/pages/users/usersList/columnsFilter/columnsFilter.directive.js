(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.list')
        .directive('columnsFilter', columnsFilter);

    /** @ngInject */
    function columnsFilter() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/usersList/columnsFilter/columnsFilter.html'
        };
    }
})();