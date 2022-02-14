(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('sharedResources', sharedResources);

    /** @ngInject */
    function sharedResources(Rehive, builderService) {

        return {
            getSubtypes : function () {
                return Rehive.admin.subtypes.get();
            }, 
            getDefaultSubtypes : function() {
                return builderService.getBuilderTemplates({type: 'subtype'});
            },
            getMissingDefaultSubtypes: function(defaultTemplateSubtypes, rehiveSubtypes) {
                var defaultSubtypes = [];
                defaultTemplateSubtypes.forEach(function(defaultSubtype){
                    var subtypeExists = false;
                    rehiveSubtypes.forEach(function(rehiveSubtype){
                        if(rehiveSubtype.name === defaultSubtype.name && rehiveSubtype.tx_type === defaultSubtype.tx_type){
                            subtypeExists = true;
                            return false;
                        }
                    });
                    if(!subtypeExists){                        
                        if(!defaultSubtype.usage_type){ defaultSubtype.usage_type = null; }
                        defaultSubtypes.push(defaultSubtype);
                    }
                });

                return defaultSubtypes;
            }
        };
    }

})();
