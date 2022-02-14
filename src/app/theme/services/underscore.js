(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('_', _);

    /** @ngInject */
    function _($window) {

        return $window._;
    }

})();