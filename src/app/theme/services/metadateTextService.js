(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('metadataTextService', metadataTextService);

    /** @ngInject */
    function metadataTextService() {

        return {
            convertToText: function (metadata) {

                var isJson = function (str) {
                    try {
                        JSON.parse(str);
                    } catch (e) {
                        return false;
                    }
                    return true;
                };

                if(!metadata) return '';
                if(typeof metadata == 'string'){
                    if(isJson(metadata)){
                        metadata = JSON.parse(metadata);
                    }
                }


                var metadataString = JSON.stringify(metadata, null, 1);
                metadataString = metadataString.replace(/[{",\\}]/g, '').trim();
                return metadataString;
            }
        }
    }

})();