(function () {
    'use strict';

    angular.module('BlurAdmin.pages.smsAuth')
        .controller('SmsAuthenticationCtrl', SmsAuthenticationCtrl);

    /** @ngInject */
    function SmsAuthenticationCtrl($scope,Rehive,localStorageManagement,errorHandler,toastr,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.smsAuthObj = {mobile: ''};
        $scope.numberFromGetCall = false;
        $scope.loadingSmsAuth = false;
        $scope.focusElemName = null;
        
        setTimeout(function(){
            $scope.focusElemName = 'smsAuthInput';
        }, 2000);

        $scope.getSmsAuthNumber = function(){
            if(vm.token) {
                $scope.loadingSmsAuth = true;
                Rehive.auth.mfa.sms.get().then(function (res) {
                    if(res && res.mobile){
                        $scope.smsAuthObj.mobile = res.mobile;
                        $scope.numberFromGetCall = true;
                    }
                    $scope.loadingSmsAuth = false;
                    // $scope.focusElemName = 'smsAuthInput';
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSmsAuth = false;
                    if(error.status == 404){
                        $scope.$apply();
                        return;
                    }
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getSmsAuthNumber();

        $scope.deleteSmsAuthNumber = function(){
            if(vm.token) {
                $scope.loadingSmsAuth = true;
                Rehive.auth.mfa.sms.disable().then(function (res) {
                    toastr.success('SMS authentication disabled successfully');
                    $scope.smsAuthObj = {mobile: ''};
                    $scope.numberFromGetCall = false;
                    $scope.loadingSmsAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSmsAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.postSmsAuthNumber = function(){
            if(vm.token) {
                $scope.loadingSmsAuth = true;
                Rehive.auth.mfa.sms.enable({
                    mobile: $scope.smsAuthObj.mobile
                }).then(function (res) {
                    toastr.success('Mobile number successfully saved, please enter the OTP to enable sms multi factor authentication');
                    $location.path('/authentication/multi-factor/verify/sms');
                    $scope.loadingSmsAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSmsAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
