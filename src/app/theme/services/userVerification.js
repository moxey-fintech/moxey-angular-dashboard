(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('userVerification', userVerification);

    /** @ngInject */
    function userVerification(localStorageManagement,Rehive,errorHandler) {

        return {
            verify: function (cb) {
                var token = localStorageManagement.getValue('token');
                var emailVerified = false;

                if(token) {
                    Rehive.user.emails.get().then(function (res) {
                        var emailArrays = res;
                        for(var i = 0; i < emailArrays.length ; i++){
                            if(emailArrays[i].verified == true){
                                emailVerified = true;
                                break;
                            }
                        }
                        cb(null,emailVerified);
                    }, function (error) {
                        cb(error,null);
                        errorHandler.handleErrors(error);
                    });
                } else {
                    cb(null,false);
                }
            }
        };
    }

})();
