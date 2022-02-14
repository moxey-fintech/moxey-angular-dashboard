(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('identifySearchInput', identifySearchInput);

    /** @ngInject */
    function identifySearchInput() {

        return {
            isEmail: function(email){
                if(!email)return true;
                var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegex.test(email);
            },
            isMobile: function(mobile){
                var mobileRegex = /^\+\d{1,3}\d{9,10}$/;
                return mobileRegex.test(mobile);
            },
            isCompanyId: function(companyId){
                if(!companyId)return true;
                var companyIdRegex = /^[a-zA-Z0-9']([a-zA-Z_ 0-9'])*[a-zA-Z0-9']$/;
                return companyIdRegex.test(companyId);
            }
        }
    }

})();
