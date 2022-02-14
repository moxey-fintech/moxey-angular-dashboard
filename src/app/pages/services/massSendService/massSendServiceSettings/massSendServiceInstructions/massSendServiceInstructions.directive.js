(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.massSendService.massSendServiceSettings')
        .directive('massSendServiceInstructions', massSendServiceInstructions);

    /** @ngInject */massSendServiceInstructions
    function massSendServiceInstructions() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/massSendService/massSendServiceSettings/massSendServiceInstructions/massSendServiceInstructions.html'
        };
    }
})();
