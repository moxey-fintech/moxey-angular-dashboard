(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceUsers')
        .directive('stellarTestnetServiceUsersFilters', stellarTestnetServiceUsersFilters);

    /** @ngInject */
    function stellarTestnetServiceUsersFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceUsers/stellarTestnetServiceUsersFilters/stellarTestnetServiceUsersFilters.html'
        };
    }
})();
