(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees')
        .controller('AccountCurrencyFeesModalCtrl', AccountCurrencyFeesModalCtrl);

    function AccountCurrencyFeesModalCtrl($scope,$uibModalInstance,accountCurrencyFee,currencyCode,reference,
                                          Rehive,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        $scope.accountCurrencyFee = accountCurrencyFee;
        $scope.deletingAccountCurrencyFees = false;
        vm.token = localStorageManagement.getValue('token');

        $scope.deleteAccountCurrencyFee = function () {
            $scope.deletingAccountCurrencyFees = true;
            Rehive.admin.accounts.currencies.fees.delete(vm.reference,vm.currencyCode,$scope.accountCurrencyFee.id).then(function (res) {
                $scope.deletingAccountCurrencyFees = false;
                toastr.success('Account currency fee successfully deleted');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.deletingAccountCurrencyFees = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
