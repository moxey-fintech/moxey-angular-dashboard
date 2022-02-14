(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('jsDataHandler', jsDataHandler);

    /** @ngInject */
    function jsDataHandler() {
        // Handles data formats
        return {
            getStringTag: function(value){
                return Object.prototype.toString.call(value);
            },
            getKeys: function(obj){
                
            },
            isLength: function(value){
                var vm = this;
                return typeof value == 'number' && value > -1 && value <= Number.MAX_SAFE_INTEGER;
            },
            isArrayLike: function(value){
                var vm = this;
                return value != null && vm.isLength(value.length);
            },
            isArray: function(value){
                var vm = this;
                return vm.isArrayLike(value) && Array.isArray(value);
            },
            isObjectLike: function(value){
                var vm = this;
                return !!value && (typeof value == 'object' || typeof value == 'function');
            },
            isObject: function(value){
                var vm = this;
                return !!value && vm.isObjectLike(value) && vm.getStringTag(value) == '[object Object]';
            },
            isFunction: function(value){
                var vm = this;
                return !!value && vm.isObjectLike(value) && vm.getStringTag(value) == '[object Function]';
            },
        };
    }

})();