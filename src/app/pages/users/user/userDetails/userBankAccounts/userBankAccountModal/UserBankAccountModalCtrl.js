(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBankAccountModalCtrl', UserBankAccountModalCtrl);

    function UserBankAccountModalCtrl($scope,Rehive,$uibModalInstance,bankAccount,toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.userBankAccount = bankAccount;
        $scope.deletingUserBankAccount = false;
        vm.token = localStorageManagement.getValue('token');

        $scope.deleteUserBankAccount = function () {
            $scope.deletingUserBankAccount = true;
            Rehive.admin.users.bankAccounts.delete($scope.userBankAccount.id).then(function (res) {
                $scope.deletingUserBankAccount = false;
                toastr.success('Bank account successfully deleted');
                $uibModalInstance.close($scope.userBankAccount);
                $scope.$apply();
            }, function (error) {
                $scope.deletingUserBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
