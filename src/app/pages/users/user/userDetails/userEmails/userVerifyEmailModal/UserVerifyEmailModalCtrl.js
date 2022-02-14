(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserVerifyEmailModalCtrl', UserVerifyEmailModalCtrl);

    function UserVerifyEmailModalCtrl($scope,Rehive,$uibModalInstance,email,user,toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.email = email;
        $scope.user = user;
        vm.token = localStorageManagement.getValue('token');
        $scope.verifyingEmail = false;
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

        $scope.verifyEmail = function () {
            $scope.verifyingEmail = true;
            Rehive.admin.users.emails.update(email.id,{verified: true}).then(function (res) {
                $scope.verifyingEmail = false;
                toastr.success('Email successfully verified');
                $uibModalInstance.close($scope.email);
                $scope.$apply();
            }, function (error) {
                $scope.verifyingEmail = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.resendEmailVerification = function () {
            $scope.verifyingEmail = true;
            Rehive.auth.email.resendEmailVerification({
                email: email.email,
                company: vm.company.id
            }).then(function(res){
                toastr.success('Email verification resent successfully');
                $uibModalInstance.close();
                $scope.$apply();
            },function(error){
                $scope.verifyingEmail = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
