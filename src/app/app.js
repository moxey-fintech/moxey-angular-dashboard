'use strict';

angular.module('BlurAdmin', [
    'BlurAdmin.config',
    'cp.ngConfirm',
    'ngFileUpload',
    'ngSanitize',
    'ngCookies',
    'ui.bootstrap',
    'ui.router',
    'toastr',
    'countrySelect',
    'angular-click-outside',
    'ngCsv',
    'iso-3166-country-codes',
    'ngclipboard',
    'ngIntlTelInput',
    'localytics.directives',
    'ngTagsInput',
    'ui.codemirror',
    'ng.codemirror.dictionary.hint',
    'BlurAdmin.theme',
    'BlurAdmin.pages',
    'ngIntercom',
    'lrDragNDrop',
    'smart-table',
    'ngTagsInput',
    'ngRaven',
    'colorpicker'
])
    .config(function (ngIntlTelInputProvider, $intercomProvider, environmentConfig) {
        // Raven.config(environmentConfig.SENTRY_DSN, {}).install();
        try {
            var IS_DEBUG = environmentConfig.SENTRY_DSN === '';
            Sentry.init({
                dsn: environmentConfig.SENTRY_DSN,
                beforeSend: function(event, hint){
                    if (IS_DEBUG) {
                        console.error(hint.originalException || hint.syntheticException);
                        return null; // this drops the event and nothing will be sent to sentry
                    }
                    return event;
                    }
            });
        } catch(err){ 
            console.log("%cError in initializing Sentry", "color: red");
            console.error(err);
        }
        $intercomProvider.appID(environmentConfig.INTERCOM_APPID);
        $intercomProvider.asyncLoading(true);
        ngIntlTelInputProvider.set({initialCountry: 'us',utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.0.1/js/utils.js'});
    })
    .run(function($rootScope,errorHandler,localStorageManagement,toastr,Rehive,$uibModal,$state,$ngConfirm,
                  environmentConfig,$window,$location,_,$http,billingService,$intercom){

        $window.onload = function(){
            $rootScope.$pageFinishedLoading = true;
            $rootScope.showTrialbanner = false;
            $rootScope.trialExpired = false;
            $rootScope.displayIncompleteSubscription = false;
            $rootScope.unverifiedAdminEmail = false;
            $rootScope.trialbannerText = '';
            $rootScope.isInTestMode = false;
            $rootScope.isRestricted = false;
        };

        if(!localStorageManagement.getValue('DATE_FORMAT')){
            localStorageManagement.setValue('DATE_FORMAT','MM/dd/yyyy');
        }

        $rootScope.dashboardTitle = 'Moxey';

        $rootScope.pageTopObj = {};

        $rootScope.goToRehivePlans = function(){
            $location.path('/rehive-billing');
        };

        $rootScope.goToRehiveBilling = function() {
            $location.path('/settings/billing-info');
        };

        $rootScope.logOutFromApp = function(){
            $rootScope.dashboardTitle = 'Moxey';
            $rootScope.gotToken = false;
            $rootScope.securityConfigured = true;
            $rootScope.inVerification = false;
            $rootScope.showTrialbanner = false;
            $rootScope.isRestricted = false;
            $rootScope.displayIncompleteSubscription = false;
            $rootScope.trialExpired = false;
            if($rootScope.$subscriptionObj){ delete $rootScope['$subscriptionObj']; }
            if(localStorageManagement.getValue('availableCategories')){ localStorageManagement.deleteValue('availableCategories'); }
            if(localStorageManagement.getValue('productCategories')){ localStorageManagement.deleteValue('productCategories'); } 

            $window.sessionStorage.currenciesList = '';
            $rootScope.pageTopObj = {};
            $intercom.shutdown();
            localStorageManagement.deleteValue('TOKEN');
            localStorageManagement.deleteValue('token');
            Rehive.removeToken();
            $location.path('/login');            
        };

        $rootScope.handleStateChange = function(event, toState, toParams, fromState, fromParams){
            if(!$rootScope.$subscriptionObj || !$rootScope.$subscriptionObj.status) {
                return false;
            }
            $rootScope.trialExpired = false;
            $rootScope.showTrialbanner = false;
            $rootScope.displayIncompleteSubscription = false;
            var dashboardUsagePermission = billingService.getDashboardUsagePermission($rootScope.$subscriptionObj.status);
            if(dashboardUsagePermission === 'allow'){
                billingService.handleAllowedSubscriptionStatuses();
                if(toState.url === "/redirect-to-web-wallet") {
                    event.preventDefault();
                    var webWalletUrl = 'https://app.rehive.com/' + $rootScope.pageTopObj.companyObj.id + "/";
                    $window.open(webWalletUrl, '_blank');
                }
            } else if(dashboardUsagePermission === 'allow_restricted') {
                if(toState.url !== '/login' && toState.url !== '/login-alt' && toState.url !== '/register' && toState.url !== '/demo' && toState.url !== '/template' && toState.url !== '/account-info'){
                    $rootScope.trialbannerText = '';
                    $rootScope.showTrialbanner = $rootScope.unverifiedAdminEmail;
                    if($rootScope.$subscriptionObj.status === 'incomplete' || $rootScope.$subscriptionObj.status === 'incomplete_expired'){  
                        billingService.handleIncompleteSubscriptionStatuses(event, toState.url, $rootScope.$subscriptionObj.status);
                    } else if($rootScope.$subscriptionObj.status === 'unpaid' || $rootScope.$subscriptionObj.status === 'incomplete_payment') {
                        billingService.handleUnpaidSubscriptionStatuses(event, toState.url, $rootScope.$subscriptionObj.status);
                    } else {  
                        billingService.handleExpiredSubscriptionStatuses(event, toState.url, $rootScope.$subscriptionObj.status);
                    }
                }
            } else if(dashboardUsagePermission === 'block') {
                $location.path('/login');
            }
        };
        
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if(toState.url !== '/login' && toState.url !== '/login-alt' && toState.url !== '/register' && toState.url !== '/demo' && toState.url !== '/password/reset' && toState.url.indexOf('authentication/multi-factor') < 0){
                if($rootScope.$subscriptionObj !== undefined){
                    $rootScope.handleStateChange(event, toState, toParams, fromState, fromParams);
                }
                else {
                    $rootScope.$pageFinishedLoading = false;
                    billingService.fetchRehiveSubscriptionAsUser().then(function(res){
                        $rootScope.$subscriptionObj = res;
                        $rootScope.$pageFinishedLoading = true;
                        $rootScope.handleStateChange(event, toState, toParams, fromState, fromParams);
                        $rootScope.$apply();
                    }).catch(function(error){
                        $rootScope.$pageFinishedLoading = true;
                        $location.path('/login');
                        $rootScope.$apply();
                    })
                }   
            }
        });

        // In case of trial usage, to go to the Rehive plans section from anywhere on the dashboard
        $rootScope.resendAdminEmailVerification = function(){
            var token = localStorageManagement.getValue('token');
            if(token && !localStorageManagement.getValue('mfaUnverified')) {
                $rootScope.$pageFinishedLoading = false;
                Rehive.auth.email.resendEmailVerification({
                    email: $rootScope.pageTopObj.userInfoObj.email,
                    company: $rootScope.pageTopObj.companyObj.id
                }).then(function(res){
                    $rootScope.$pageFinishedLoading = true;
                    toastr.success('Email verification resent successfully');
                    $rootScope.$apply();
                },function(error){
                    $rootScope.$pageFinishedLoading = true;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $rootScope.$apply();
                });
            }
        };

        $rootScope.confirmAdminEmail = function() {
            $ngConfirm({
                columnClass: 'medium',
                title: 'Resend verification email',
                content: 'Resend verification email to <i style="color: #6A71F2"><strong>' + $rootScope.pageTopObj.userInfoObj.email + '</strong></i>?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $rootScope,
                closeIcon: true,
                buttons: {
                    close: {
                        text: "Manage",
                        btnClass: 'btn-default dashboard-btn',
                        action: function(scope){
                            $location.path('/account-info');
                        }
                    },
                    ok: {
                        text: "Resend",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $rootScope.resendAdminEmailVerification();
                        }
                    }
                }
            });
        };

        //using to check if user is in changing password or setting up 2 factor authentication
        $rootScope.securityConfigured = true;

        var locationChangeStart = $rootScope.$on('$locationChangeStart', function (event,newUrl,oldUrl) {

            $rootScope.shouldBeBlue = '';

            routeManagement(event,newUrl,oldUrl);
        });

        function routeManagement(event,newUrl,oldUrl){
            var token = localStorageManagement.getValue('token'),
                TOKEN = localStorageManagement.getValue('TOKEN'),
                newUrlArray = newUrl.split('/'),
                newUrlLastElement = _.last(newUrlArray);

            if(!$rootScope.pageTopObj.companyObj){
                var getCompanyInfo = function () {
                    if(token && !localStorageManagement.getValue('mfaUnverified')) {
                        Rehive.admin.company.get().then(function (res) {
                            $rootScope.pageTopObj.companyObj = {};
                            $rootScope.pageTopObj.companyObj = res;
                            $rootScope.isInTestMode = res.mode === 'test';
                            $rootScope.isRestricted = res.status === 'restricted';
                            localStorageManagement.setValue('companyIdentifier',$rootScope.pageTopObj.companyObj.id);
                            localStorageManagement.setValue('companyCreatedAt', res.created);
                            $rootScope.$apply();
                        }, function (error) {
                            if(error.status == 401){
                                $rootScope.gotToken = false;
                                $rootScope.securityConfigured = true;
                                $rootScope.pageTopObj = {};
                                localStorageManagement.deleteValue('TOKEN');
                                localStorageManagement.deleteValue('token');
                                Rehive.removeToken();
                                $location.path('/login');
                            }
                            $rootScope.$apply();
                        });
                    }
                };
                getCompanyInfo();
            }

            if(!$rootScope.pageTopObj.userInfoObj){
                var getUserInfo = function () {
                    if(token && !localStorageManagement.getValue('mfaUnverified')) {
                        Rehive.user.get().then(function(user){
                            $rootScope.pageTopObj.userInfoObj = {};
                            $rootScope.pageTopObj.userInfoObj = user;
                            Rehive.user.emails.get().then(function (res) {
                                var adminEmails = res;
                                $rootScope.unverifiedAdminEmail = false;
                                adminEmails.forEach(function(email){
                                    if(email.primary && !email.verified){
                                        $rootScope.unverifiedAdminEmail = true;                                        
                                        return;
                                    }                                    
                                });
                                $rootScope.$apply();
                            }, function (error) {
                                errorHandler.evaluateErrors(error);
                                errorHandler.handleErrors(error);
                                $rootScope.$apply();
                            });
                            $rootScope.$apply();
                        },function(error){
                            if(error.status == 401){
                                $rootScope.gotToken = false;
                                $rootScope.securityConfigured = true;
                                $rootScope.pageTopObj = {};
                                localStorageManagement.deleteValue('TOKEN');
                                localStorageManagement.deleteValue('token');
                                Rehive.removeToken();
                                $location.path('/login');
                            }
                            $rootScope.$apply();
                        });
                    }
                };
                getUserInfo();
            }

            if(newUrlLastElement == 'login' || newUrlLastElement == 'login-alt'){
                localStorageManagement.deleteValue('TOKEN');
                localStorageManagement.deleteValue('token');
                Rehive.removeToken();
                $rootScope.showTrialbanner = false;
                $rootScope.trialExpired = false;
                $rootScope.isRestricted = false;
                if($rootScope.$subscriptionObj){ delete $rootScope['$subscriptionObj']; }
                if(localStorageManagement.getValue('availableCategories')){ localStorageManagement.deleteValue('availableCategories'); }
                if(localStorageManagement.getValue('productCategories')){ localStorageManagement.deleteValue('productCategories'); }                
                $rootScope.dashboardTitle = 'Moxey';
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                $window.sessionStorage.currenciesList = '';
                $location.path('/' + newUrlLastElement);
            }
            else if(newUrl.indexOf('password/reset/confirm') > 0 || newUrl.indexOf('email/verify') > 0) {
                $rootScope.securityConfigured = false;
            } 
            else if(newUrlLastElement == 'register' || newUrlLastElement == 'reset'
                // || newUrlLastElement == 'verification' || newUrlLastElement == 'info_request' || newUrlLastElement == 'welcome_to_rehive'
                || newUrlLastElement == 'template' || newUrlLastElement == 'info_request' || newUrlLastElement == 'welcome_to_rehive' || newUrlLastElement == 'demo'
                || newUrl.indexOf('company/setup/') > 0){
                $rootScope.securityConfigured = false;
            } 
            else if(newUrlLastElement == 'change' || newUrlLastElement == 'multi-factor'
            || newUrl.indexOf('/multi-factor/sms') > 0 || newUrl.indexOf('/multi-factor/verify') > 0){
                //checking if changing password or setting up multi factor authentication                
                $rootScope.securityConfigured = false;
            } 
            else if(token && !localStorageManagement.getValue('mfaUnverified')){
                //redirect users from transaction/credit or transactions/debit  to transactions/history
                if(newUrl.indexOf('transactions/credit') > 0 || newUrl.indexOf('transactions/debit') > 0 ||
                    newUrl.indexOf('transactions/transfer') > 0){
                    $location.path('/transactions/history');
                }

                localStorageManagement.deleteValue('setupUsers');
                localStorageManagement.deleteValue('setupCurrencies');
                localStorageManagement.deleteValue('setupAccounts');
                localStorageManagement.deleteValue('setupSubtypes');
                localStorageManagement.deleteValue('activeSetupRoute');
                $rootScope.gotToken = true;
                $rootScope.securityConfigured = true;
            } 
            else {
                $rootScope.dashboardTitle = 'Moxey';
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                $location.path('/login');
                $location.replace();
            }
        };
    });
