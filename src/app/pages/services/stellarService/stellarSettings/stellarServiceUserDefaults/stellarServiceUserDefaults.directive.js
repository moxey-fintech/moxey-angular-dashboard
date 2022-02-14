(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings')
        .directive('stellarServiceUserDefaults', stellarServiceUserDefaults);

    /** @ngInject */
    function stellarServiceUserDefaults() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarService/stellarSettings/stellarServiceUserDefaults/stellarServiceUserDefaults.html'
        };
    }
})();
