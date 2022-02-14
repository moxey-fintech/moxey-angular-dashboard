(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('Big', Big);

    /** @ngInject */
    function Big($window) {
        return $window.Big;
    }

})();