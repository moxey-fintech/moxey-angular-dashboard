(function () {
    'use strict';

    angular.module('BlurAdmin.pages.multiFactorAuthVerify')
        .controller('MultiFactorAuthVerifyCtrl', MultiFactorAuthVerifyCtrl);

    /** @ngInject */
    function MultiFactorAuthVerifyCtrl($rootScope,$scope,Rehive,localStorageManagement,errorHandler,toastr,$stateParams,$location,extensionsHelper,environmentConfig,$state,$http,$intercom) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.customToken = $state.params && $state.params.customToken ? $state.params.customToken : null;
        vm.prevState = $state.params && $state.params.prevState ? $state.params.prevState : null;
        $scope.authType = $stateParams.authType;
        $scope.verifyTokenObj = {token: ''};
        $scope.tokenAuthenticationEnabled = false;
        $scope.prevLocation = $location.search().prevUrl;
        $scope.loginUser = localStorageManagement.getValue('intercomUser') ? JSON.parse(localStorageManagement.getValue('intercomUser')) : null;
        $scope.loginUserAppId = $scope.loginUser ? $scope.loginUser.appId : null;
        $scope.focusElem = 'token';
        
        setTimeout(function(){
            var elemId = $scope.authType === 'token' ? '#tokenInput' : '#smsInput';
            $(elemId).focus();
        }, 600);

        vm.getTokenAuthenticationDetails = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.token.enable().then(function (res) {
                    $scope.tokenAuthenticationDetails = res;
                    $scope.qrCodeUrl = 'https://chart.googleapis.com/chart?cht=qr&chl='+
                        encodeURIComponent(res.otpauth_url) + '&chs=200x200&chld=L|0';
                    delete $scope.tokenAuthenticationDetails['otpauth_url'];
                    $scope.loadingVerifyAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.checkIfTokenAuthenticationEnabled = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.token.get().then(function (res) {
                    if(res && res.confirmed){
                        $scope.tokenAuthenticationEnabled = true;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    $scope.$apply();
                });
            }
        };

        $scope.resendSmsAuthNumber = function(forCustomToken){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.sms.send().then(function (res) {
                    if(!forCustomToken){
                        toastr.success('Otp has been resent to your mobile number successfully');
                    }
                    $scope.loadingVerifyAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        if($scope.prevLocation != 'login'){
            if(!vm.prevState && $scope.authType == 'token'){
                vm.getTokenAuthenticationDetails();
                vm.checkIfTokenAuthenticationEnabled();
            } else if(vm.prevState && $scope.authType == 'sms'){
                $scope.resendSmsAuthNumber('forCustomToken');
            }
        } else {
            $rootScope.gotToken = false;
        }

        $scope.deleteTokenAuth = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.token.disable().then(function (res) {
                    toastr.success('Token authentication successfully disabled');
                    $location.path('/authentication/multi-factor');
                    $scope.loadingVerifyAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getAllServices = function(){
            extensionsHelper.fetchAdminServices()
            .then(function(res){
                extensionsHelper.storeServicesListToLocalstorage(res); 
                $rootScope.gotToken = true;
                localStorageManagement.deleteValue('mfaUnverified');
                $location.path('/currencies/currencies-list');
            })
            .catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.returnToPrevState = function(tokenVerified){
            $state.go(vm.prevState, {
                customToken: vm.customToken,
                customTokenVerified: tokenVerified
            }, { reload: true });
        };

        $scope.goBack = function(mfaType){
            if(vm.customToken && vm.prevState){
                $scope.returnToPrevState(false);
            } else {
                mfaType === 'sms' ? $location.path('/authentication/multi-factor/sms') : $location.path('/authentication/multi-factor');
            }
        }

        $scope.handleIntercomBoot = function(){                
            if($scope.loginUser && environmentConfig.API !== "https://api.staging.rehive.com/3/"){                            
                $http.get('https://functions.rehive.io/intercom-identity-verification', {
                    headers: {
                        'Content': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function(res){
                    var intercomUser = {
                        email: $scope.loginUser.email,
                        name: $scope.loginUser.first_name + ' ' + $scope.loginUser.last_name,
                        user_id: $scope.loginUser.id,
                        user_hash: res.data.data.user_hash,
                        company_id: $scope.loginUser.company,
                        phone: $scope.loginUser.mobile
                    };
                    $intercom.boot(intercomUser);
                    localStorageManagement.deleteValue('intercomUser');
                }, function(error){ 
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.verifyRehiveToken = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.verify($scope.verifyTokenObj).then(function (res)
                {
                    $location.search('prevUrl', null);
                    toastr.success('Token successfully verified');
                    if($scope.prevLocation == 'login'){ 
                        $scope.handleIntercomBoot();
                        vm.getAllServices();      
                    } else {
                        $scope.loadingVerifyAuth = false;
                        $location.path('/account-info');
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        $scope.verifyCustomRehiveToken = function(){
            if(vm.customToken) {
                $scope.loadingVerifyAuth = true;
                $http.post(environmentConfig.API + 'auth/mfa/verify/', $scope.verifyTokenObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Token " + vm.customToken.token
                    }
                }).then(function (res){
                    $scope.loadingVerifyAuth = false;
                    toastr.success('Token successfully verified');
                    $scope.returnToPrevState(true);
                })
                .catch(function (error) {
                    $scope.loadingVerifyAuth = false;
                    $scope.verifyTokenObj = {token: ''};
                    // $scope.returnToPrevState(false);
                    if(error && error.data){
                        error.data.custom_toastr_required = 'token_otp_error';
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        $scope.detectKeyPress = function(keyCode){
            if(!$scope.verifyTokenObj.token){
                return;
            }

            if(keyCode === 13){
                $scope.verifyToken();
            }
        };
        
        $scope.verifyToken = function(){
            (vm.customToken && vm.prevState) ? $scope.verifyCustomRehiveToken() : $scope.verifyRehiveToken();
        };
    }
})();
