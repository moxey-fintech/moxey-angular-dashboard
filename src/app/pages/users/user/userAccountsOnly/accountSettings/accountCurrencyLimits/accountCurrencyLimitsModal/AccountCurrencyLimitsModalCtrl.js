(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .controller('AccountCurrencyLimitsModalCtrl', AccountCurrencyLimitsModalCtrl);

    function AccountCurrencyLimitsModalCtrl($scope,$uibModalInstance,accountCurrencyLimit,currencyCode,reference,toastr,
                                            Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        $scope.accountCurrencyLimit = accountCurrencyLimit;
        $scope.deletingAccountCurrencyLimits = false;
        vm.token = localStorageManagement.getValue('token');

        $scope.deleteAccountCurrencyLimit = function () {
            $scope.deletingAccountCurrencyLimits = true;
            Rehive.admin.accounts.currencies.limits.delete(vm.reference,vm.currencyCode,$scope.accountCurrencyLimit.id).then(function (res) {
                $scope.deletingAccountCurrencyLimits = false;
                toastr.success('Account currency limit successfully deleted');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.deletingAccountCurrencyLimits = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
