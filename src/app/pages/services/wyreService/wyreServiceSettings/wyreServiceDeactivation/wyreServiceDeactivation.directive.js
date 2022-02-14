(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.wyreService.wyreServiceSettings')
        .directive('wyreServiceDeactivation', wyreServiceDeactivation);

    /** @ngInject */
    function wyreServiceDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/wyreService/wyreServiceSettings/wyreServiceDeactivation/wyreServiceDeactivation.html'
        };
    }
})();
