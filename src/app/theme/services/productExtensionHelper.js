/**
 * @author m.talukder
 * created on 07.10.2020
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('productExtensionHelper', productExtensionHelper);

    /** @ngInject */
    function productExtensionHelper($window, $timeout, currencyModifiers) {
        return {
            callBackFn: null,
            
        };
    }

})();