(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceUsers')
        .directive('ethereumServiceUsersFilters', ethereumServiceUsersFilters);

    /** @ngInject */
    function ethereumServiceUsersFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceUsers/ethereumServiceUsersFilters/ethereumServiceUsersFilters.html'
        };
    }
})();
