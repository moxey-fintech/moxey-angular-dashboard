(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('errorHandler', errorHandler);

    /** @ngInject */
    function errorHandler(toastr,$location,localStorageManagement,$rootScope,Rehive) {
        return {
            triggerSentryCaptureException: function(error, sentryContext){
                if(!$rootScope.pageTopObj.userInfoObj){
                    var token = localStorageManagement.getValue('TOKEN');
                    if(token){
                        Rehive.user.get().then(function(user){
                            sentryContext.user = {
                                id: user.id,
                                email: user.email
                            };
                            Sentry.captureException(error, sentryContext);
                            $rootScope.$apply();
                        },function(err){
                        });
                    } else {
                        if(sentryContext.user !== 'undefined') {delete sentryContext['user'];} // checking is user added accidentally.
                        Sentry.captureException(error, sentryContext);
                    }
                } else {
                    sentryContext.user = {
                        id: $rootScope.pageTopObj.userInfoObj.id,
                        email: $rootScope.pageTopObj.userInfoObj.email
                    };
                    Sentry.captureException(error, sentryContext);
                }                
            },
            evaluateErrorForSentryLogging: function(errors){ 
                if(typeof errors.valueOf() !== "string" && errors.status !== undefined && (errors.status == 400 || errors.status == 401)){
                    return false;
                }

                var vm = this;
                var targetError = null;
                var sentryContext = {};

                if(errors instanceof Error){
                    if(!errors.message && !errors.data && typeof errors.valueOf() !== "string"){
                        targetError = Object.assign({}, errors);
                        targetError.message = "Undefined error.";
                    } else if(typeof errors.valueOf() === "string") {
                        targetError = new Error();
                        targetError.message = errors;
                    } else {
                        targetError = errors;
                    }
                } else {
                    targetError = new Error('Invalid API error response. Check additional data.');    
                    sentryContext = {                
                        tags: {
                            error_type: "unknown",
                            custom_data: errors.data ? true : false
                        },
                        extra: {
                            data: errors.data ? errors.data : errors,
                            message: errors.message ? errors.message : 'Unknown error. Check additional data.',
                            status: errors.status ? errors.status: 'error',
                        }
                    };

                    if(errors.name){ sentryContext.extra.name = errors.name; }
                    if(errors.stack){ sentryContext.extra.stack = errors.stack; }
                }
                vm.triggerSentryCaptureException(targetError, sentryContext);
            },
            evaluateErrors: function (errors) {
                var vm = this;
                if(errors){
                    // if(errors.subscription_check !== undefined){ return false; }
                    if(errors.custom_toastr_required !== undefined){ /* If custom_toastr_required, we show that first */
                        if(errors.custom_toastr_required == 'token_otp_error'){
                            toastr.error("The OTP provided is not valid", "Invalid OTP");
                        }
                    } else if(!errors.status || (errors.status !== undefined && errors.status !== 403)){ // If error.status = 403, no need to show toastr error to user
                        if(errors.data){
                            for(var key in errors.data){
                                if (errors.data.hasOwnProperty(key)) {
                                    if(Array.isArray(errors.data[key])){
                                        errors.data[key].forEach(function(error){
                                            if(key == 'non_field_errors'){
                                                key = 'error';
                                            }
                                            var errorTitle = (key.charAt(0).toUpperCase() + key.slice(1));
                                            if((errorTitle == 'Password1' || errorTitle == 'Password2')){
                                                errorTitle = 'Password';
                                            }
        
                                            toastr.error(error, errorTitle);
                                        });
                                    } else {
                                        toastr.error(errors.message);
                                    }
                                }
                            }
                        } else if(!errors.message && Object.keys(errors).length > 0){
                            for(var key in errors){
                                if (errors.hasOwnProperty(key) && key !== 'status') {
                                    if(Array.isArray(errors[key])){
                                        errors[key].forEach(function(error){
                                            if(key == 'non_field_errors'){
                                                key = 'error';
                                            }
                                            var errorTitle = (key.charAt(0).toUpperCase() + key.slice(1));
                                            toastr.error(error, errorTitle);
                                        });
                                    }
                                }
                            }
                        } else if(errors.message) {
                            if(errors.message == 'Invalid token.'){
                                toastr.error('Your session has expired, please log in again');
                            } 
                            else if(errors.message.indexOf("Authentication credentials were not provided") > -1){
                                return;
                            }
                            else {
                                toastr.error(errors.message);
                            }
                        } else {
                            toastr.error('Something went wrong, please refresh and try again. An error report has been sent to the engineering team.');
                        }
                    }     
                    
                    vm.evaluateErrorForSentryLogging(errors);
                } else {
                    toastr.error('Something went wrong, please refresh and try again. An error report has been sent to the engineering team.');
                }               
            },
            handleErrors: function(errors){                
                if(errors && errors.status){
                    if(errors.status == 401){
                        $rootScope.gotToken = false;
                        $rootScope.securityConfigured = true;
                        $rootScope.pageTopObj = {};
                        localStorageManagement.deleteValue('TOKEN');
                        localStorageManagement.deleteValue('token');
                        Rehive.removeToken();
                        $location.path('/login');
                    }
                }
            }
        };
    }

})();
