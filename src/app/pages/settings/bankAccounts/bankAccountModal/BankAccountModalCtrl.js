(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('BankAccountModalCtrl', BankAccountModalCtrl);

    function BankAccountModalCtrl($scope,Rehive,$uibModalInstance,bankAccount,toastr,
                                  $ngConfirm,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.bankAccount = bankAccount;
        vm.token = localStorageManagement.getValue('token');
        $scope.deletingBankAccount = false;

        $scope.archiveBankAccount = function (deleteBankAccount) {
            $scope.deletingBankAccount = true;
            Rehive.admin.bankAccounts.update($scope.bankAccount.id, {archived: true}).then(function (res) {
                if(deleteBankAccount){
                    $scope.deleteBankAccount();
                    $scope.$apply();
                } else {
                    $scope.deletingBankAccount = false;
                    toastr.success('Bank account successfully archived');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }
            }, function (error) {
                $scope.deletingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteBankAccountPrompt = function () {
            $ngConfirm({
                title: 'Delete bank account',
                contentUrl: 'app/pages/settings/bankAccounts/bankAccountModal/deleteBankAccountPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            if(!$scope.bankAccount.archived){
                                $scope.archiveBankAccount('deleteBankAccount');
                            } else {
                                scope.deleteBankAccount();
                            }
                        }
                    }
                }
            });
        };

        $scope.deleteBankAccount = function () {
            $scope.deletingBankAccount = true;
            Rehive.admin.bankAccounts.delete($scope.bankAccount.id).then(function (res) {
                $scope.deletingBankAccount = false;
                toastr.success('Bank account successfully deleted');
                $uibModalInstance.close(res);
                $scope.$apply();
            }, function (error) {
                $scope.deletingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
