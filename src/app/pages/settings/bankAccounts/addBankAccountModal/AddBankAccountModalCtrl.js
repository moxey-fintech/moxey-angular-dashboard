(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('AddBankAccountModalCtrl', AddBankAccountModalCtrl);

    function AddBankAccountModalCtrl($scope,$uibModalInstance,toastr,
                                      Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingBankAccount = false;
        $scope.newBankData = {};
        $scope.bankAccountCurrencies = {
            list: []
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesList = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.addBankAccount = function (newBankAccount) {
            $scope.addingBankAccount = true;
            Rehive.admin.bankAccounts.create(newBankAccount).then(function (res) {
                vm.addBankAccountCurrencies(res);
                $scope.$apply();
            }, function (error) {
                $scope.addingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.addBankAccountCurrencies = function (newBankAccount) {
            $scope.addingBankAccount = true;
            if($scope.bankAccountCurrencies.list.length > 0){
                $scope.bankAccountCurrencies.list.forEach(function (currency,index,array) {
                    Rehive.admin.bankAccounts.currencies.create(newBankAccount.id,{currency: currency.code}).then(function (res) {
                        if(index == (array.length - 1)){
                            $scope.addingBankAccount = false;
                            toastr.success('You have successfully added the bank account');
                            $scope.newBankData = {};
                            $uibModalInstance.close(res);
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.addingBankAccount = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                });
            } else {
                $scope.addingBankAccount = false;
                toastr.success('You have successfully added the bank account');
                $scope.newBankData = {};
                $uibModalInstance.close(true);
            }
        };


    }
})();
