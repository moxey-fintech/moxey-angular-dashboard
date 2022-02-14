(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('cleanObject', cleanObject);

    /** @ngInject */
    function cleanObject() {

        return {
            cleanObj: function (obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if(!obj[key]){
                            delete obj[key];
                        }
                    }
                }
                return obj;
            }
        };
    }

})();