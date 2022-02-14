(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('serializeFiltersService', serializeFiltersService);

    /** @ngInject */
    function serializeFiltersService() {

        return {
            serializeFilters : function (obj) {
                var str = [];
                for(var p in obj){
                    if (obj.hasOwnProperty(p)) {
                        if(obj[p]){
                            str.push(p.toLowerCase() + "=" + (obj[p]));
                        }
                    }
                }
                return str.join("&");
            },
            objectFilters: function (obj) {
                var serializedObj = {};
                for(var p in obj){
                    if (obj.hasOwnProperty(p)) {
                        if((obj[p] != null) || (obj[p] != undefined)){
                            serializedObj[p] = obj[p];
                        }
                    }
                }
                return serializedObj;
            }
        };
    }

})();
