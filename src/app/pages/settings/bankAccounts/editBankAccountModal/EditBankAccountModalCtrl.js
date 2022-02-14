(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('EditBankAccountModalCtrl', EditBankAccountModalCtrl);

    function EditBankAccountModalCtrl($scope,$uibModalInstance,bankAccount,toastr,$timeout,
                                      Rehive,localStorageManagement,errorHandler,_) {

        var vm = this;

        $scope.bankAccount = bankAccount;
        vm.token = localStorageManagement.getValue('token');
        $scope.updatingBankAccount = false;
        $scope.editBankData = {};
        vm.updatedBankAccount = {};
        $scope.editBankAccountCurrencies = {
            list: []
        };
        $scope.originalBankAccountCurrencies = {
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

        vm.getBankAccount = function () {
            $scope.updatingBankAccount = true;
            Rehive.admin.bankAccounts.get({id: bankAccount.id}).then(function (res) {
                $scope.editBankData = res;
                vm.getBankAccountCurrencies();
                $scope.$apply();
            }, function (error) {
                $scope.updatingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getBankAccount();

        vm.getBankAccountCurrencies = function () {
            $scope.updatingBankAccount = true;
            Rehive.admin.bankAccounts.currencies.get(bankAccount.id).then(function (res) {
                $scope.updatingBankAccount = false;
                $scope.editBankAccountCurrencies.list = res.results;
                $scope.originalBankAccountCurrencies = {
                    list: _.map(res.results,'code')
                };
                $scope.$apply();
            }, function (error) {
                $scope.updatingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.bankAccountChanged = function(field){
            vm.updatedBankAccount[field] = $scope.editBankData[field];
        };

        $scope.bankAccountAddressChanged = function(field){
            if(vm.updatedBankAccount["branch_address"] == undefined){
                vm.updatedBankAccount["branch_address"] = {}
            }
            vm.updatedBankAccount["branch_address"][field] = $scope.editBankData["branch_address"][field];
        };

        $scope.updateBankAccount = function () {
            $scope.updatingBankAccount = true;
            Rehive.admin.bankAccounts.update($scope.editBankData.id, vm.updatedBankAccount).then(function (res) {
                $scope.separateCurrencies($scope.editBankAccountCurrencies);
                $scope.$apply();
            }, function (error) {
                $scope.updatingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.separateCurrencies = function (editBankAccountCurrencies) {
            var newCurrencyArray = [],deleteCurrencyArray = [],currencies = [];

            currencies = _.map(editBankAccountCurrencies.list,'code');
            newCurrencyArray = _.difference(currencies,$scope.originalBankAccountCurrencies.list);
            deleteCurrencyArray = _.difference($scope.originalBankAccountCurrencies.list,currencies);

            if(deleteCurrencyArray.length > 0){
                deleteCurrencyArray.forEach(function (currencyCode,index,array) {
                    $scope.deleteBankAccountCurrency(editBankAccountCurrencies,currencyCode);
                    if(index === (array.length -1)){
                        if(newCurrencyArray.length > 0){
                            newCurrencyArray.forEach(function (currencyCode,index,array) {
                                if(index === (array.length -1)){
                                    $scope.createBankAccountCurrency(editBankAccountCurrencies,currencyCode,'last');
                                } else{
                                    $scope.createBankAccountCurrency(editBankAccountCurrencies,currencyCode);
                                }
                            });
                        } else {
                            $timeout(function () {
                                vm.updatedBankAccount = {};
                                $scope.updatingBankAccount = false;
                                $uibModalInstance.close(true);
                                toastr.success('Bank account successfully updated');
                            },800);
                        }
                    }
                });
            } else {
                if(newCurrencyArray.length > 0){
                    newCurrencyArray.forEach(function (currencyCode,index,array) {
                        if(index === (array.length -1)){
                            $scope.createBankAccountCurrency(editBankAccountCurrencies,currencyCode,'last');
                        } else{
                            $scope.createBankAccountCurrency(editBankAccountCurrencies,currencyCode);
                        }
                    });
                } else {
                    $timeout(function () {
                        vm.updatedBankAccount = {};
                        $scope.updatingBankAccount = false;
                        $uibModalInstance.close(true);
                        toastr.success('Bank account successfully updated');
                    },800);
                }
            }


        };

        $scope.deleteBankAccountCurrency = function(editBankAccountCurrencies,currencyCode){
            $scope.updatingBankAccount = true;
            Rehive.admin.bankAccounts.currencies.delete($scope.editBankData.id, currencyCode).then(function (res) {

            }, function (error) {
                $scope.updatingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
            });
        };

        $scope.createBankAccountCurrency = function(editBankAccountCurrencies,currencyCode,last){
            $scope.updatingBankAccount = true;
            Rehive.admin.bankAccounts.currencies.create($scope.editBankData.id,{currency: currencyCode}).then(function (res) {
                if(last){
                    $timeout(function () {
                        vm.updatedBankAccount = {};
                        $uibModalInstance.close(true);
                        $scope.updatingBankAccount = false;
                        toastr.success('Bank account successfully updated');
                        $scope.$apply();
                    },800);
                }
            }, function (error) {
                $scope.updatingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
