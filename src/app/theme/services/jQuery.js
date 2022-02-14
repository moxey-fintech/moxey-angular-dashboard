(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('jQuery', jQuery);

    /** @ngInject */
    function jQuery($window) {

        return $window.jQuery;
    }

})();
