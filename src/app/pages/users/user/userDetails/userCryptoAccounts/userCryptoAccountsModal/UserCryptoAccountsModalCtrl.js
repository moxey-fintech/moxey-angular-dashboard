(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserCryptoAccountsModalCtrl', UserCryptoAccountsModalCtrl);

    function UserCryptoAccountsModalCtrl($scope,Rehive,$uibModalInstance,userCryptoAccount,uuid,
                                         toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.userCryptoAccount = userCryptoAccount;
        vm.uuid = uuid;
        $scope.deletingUserCryptoAccount = false;
        vm.token = localStorageManagement.getValue('token');

        $scope.deleteUserCryptoAccount = function () {
            $scope.deletingUserCryptoAccount = true;
            Rehive.admin.users.cryptoAccounts.delete(userCryptoAccount.id).then(function (res) {
                $scope.deletingUserCryptoAccount = false;
                toastr.success('Crypto account successfully deleted');
                $uibModalInstance.close($scope.userCryptoAccount);
                $scope.$apply();
            }, function (error) {
                $scope.deletingUserCryptoAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
