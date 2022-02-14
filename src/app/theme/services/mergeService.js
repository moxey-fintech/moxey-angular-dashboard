(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('mergeHandlerService', mergeHandlerService);

    /** @ngInject */
    function mergeHandlerService() {
        // Doesn't handle deep merges of Array properties
        return {
            deepMerge: function(){                
                // Variables
                var resultObj = {};
                var deep = false;
                var i = 0;

                // Check if a deep merge
                if (typeof (arguments[0]) === 'boolean') {
                    deep = arguments[0];
                    ++i;
                }

                // Merge the object into the resultObj object
                var merge = function (obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                                // If we're doing a deep merge and the property is an object
                                extended[prop] = this.deepMerge(true, extended[prop], obj[prop]);
                            } else {
                                // Otherwise, do a regular merge
                                extended[prop] = obj[prop];
                            }
                        }
                    }
                };

                // Loop through each object and conduct a merge
                for (; i < arguments.length; i++) {
                    merge(arguments[i]);
                }

                return resultObj;
            }
        };
    }

})();