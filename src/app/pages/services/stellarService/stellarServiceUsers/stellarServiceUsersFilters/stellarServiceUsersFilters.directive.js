(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceUsers')
        .directive('stellarServiceUsersFilters', stellarServiceUsersFilters);

    /** @ngInject */
    function stellarServiceUsersFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarServiceUsers/stellarServiceUsersFilters/stellarServiceUsersFilters.html'
        };
    }
})();
