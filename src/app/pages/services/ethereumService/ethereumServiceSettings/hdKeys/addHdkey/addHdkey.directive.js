(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceSettings')
        .directive('addHdkey', addHdkey);

    /** @ngInject */
    function addHdkey() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceSettings/hdKeys/addHdkey/addHdkey.html'
        };
    }
})();
