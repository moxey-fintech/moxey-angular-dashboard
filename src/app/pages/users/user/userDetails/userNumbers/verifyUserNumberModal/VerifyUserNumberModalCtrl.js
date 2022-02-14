(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('VerifyUserNumberModalCtrl', VerifyUserNumberModalCtrl);

    function VerifyUserNumberModalCtrl($scope,$uibModalInstance,number,user,toastr,Rehive,
                                       localStorageManagement,errorHandler) {

        var vm= this;
        $scope.mobile = number;
        $scope.user = user;
        vm.token = localStorageManagement.getValue('token');
        $scope.verifyingMobile = false;
        vm.company = {};

        vm.getCompanyDetails = function () {
            Rehive.company.get().then(function(res){
                vm.company =  res;
                $scope.$apply();
            },function(error){
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getCompanyDetails();

        $scope.verifyMobile = function () {
            $scope.verifyingMobile = true;
            Rehive.admin.users.mobiles.update($scope.mobile.id,{
                verified: true
            }).then(function (res) {
                $scope.verifyingMobile = false;
                toastr.success('Mobile number successfully verified');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.verifyingMobile = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.resendMobileVerification = function () {
            $scope.verifyingMobile = true;
            Rehive.auth.mobile.resendMobileVerification({
                mobile: $scope.mobile.number,
                company: vm.company.id
            }).then(function(res){
                $scope.verifyingMobile = false;
                toastr.success('Mobile number verification resent successfully');
                $uibModalInstance.close(true);
                $scope.$apply();
            },function(error){
                $scope.verifyingMobile = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };


    }
})();
