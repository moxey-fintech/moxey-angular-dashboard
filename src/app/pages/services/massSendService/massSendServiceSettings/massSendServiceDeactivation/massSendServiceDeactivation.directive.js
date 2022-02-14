(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.massSendService.massSendServiceSettings')
        .directive('massSendServiceDeactivation', massSendServiceDeactivation);

    /** @ngInject */
    function massSendServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/massSendService/massSendServiceSettings/massSendServiceDeactivation/massSendServiceDeactivation.html'
        };
    }
})();
