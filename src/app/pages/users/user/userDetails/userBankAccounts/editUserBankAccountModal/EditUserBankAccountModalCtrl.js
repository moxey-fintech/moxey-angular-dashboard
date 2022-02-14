(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserBankAccountModalCtrl', EditUserBankAccountModalCtrl);

    function EditUserBankAccountModalCtrl($scope,$uibModalInstance,bankAccount,toastr,$stateParams,$filter,
                                          Rehive,localStorageManagement,errorHandler,_,$timeout) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userbankAccount = bankAccount;
        vm.updatedUserBankAccount = {};
        $scope.editUserBankAccount = {};
        $scope.editUserBankAccountCurrencies = {
            list: []
        };
        $scope.originalUserBankAccountCurrencies = {
            list: []
        };
        $scope.editingUserBankAccount = true;
        $scope.bankStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('token');

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

        vm.getUserBankAccount = function () {
            $scope.editingUserBankAccount = true;
            Rehive.admin.users.bankAccounts.get({id: $scope.userbankAccount.id}).then(function (res) {
                $scope.editingUserBankAccount = false;
                $scope.editUserBankAccount = res;
                $scope.editUserBankAccountCurrencies.list = res.currencies;
                $scope.originalUserBankAccountCurrencies = {
                    list: _.map(res.currencies,'code')
                };
                $scope.editUserBankAccount.status = $filter('capitalizeWord')(res.status);
                $scope.$apply();
            }, function (error) {
                $scope.editingUserBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getUserBankAccount();

        $scope.userBankAccountChanged =  function (field) {
            vm.updatedUserBankAccount[field] = $scope.editUserBankAccount[field];
        };

        $scope.userBankAccountAddressChanged = function(field){
            if(vm.updatedUserBankAccount["branch_address"] == undefined){
                vm.updatedUserBankAccount["branch_address"] = {}
            }
            vm.updatedUserBankAccount["branch_address"][field] = $scope.editUserBankAccount["branch_address"][field];
        };

        $scope.updateUserBankAccount = function(){
            if(vm.token) {
                $scope.editingUserBankAccount = true;
                vm.updatedUserBankAccount.status ? vm.updatedUserBankAccount.status = vm.updatedUserBankAccount.status.toLowerCase() : '';
                Rehive.admin.users.bankAccounts.update($scope.editUserBankAccount.id,vm.updatedUserBankAccount).then(function (res) {
                    $scope.separateCurrencies($scope.editUserBankAccountCurrencies);
                    $scope.$apply();
                    $scope.editingUserBankAccount = false;
                    vm.updatedUserBankAccount = {};
                    $scope.editUserBankAccount = {};
                    toastr.success('Successfully updated user bank account.');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                    vm.getUserBankAccount();
                }, function (error) {
                    $scope.editingUserBankAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.separateCurrencies = function (editUserBankAccountCurrencies) {
            var newCurrencyArray = [],deleteCurrencyArray = [],currencies = [];

            currencies = _.map(editUserBankAccountCurrencies.list,'code');
            newCurrencyArray = _.difference(currencies,$scope.originalUserBankAccountCurrencies.list);
            deleteCurrencyArray = _.difference($scope.originalUserBankAccountCurrencies.list,currencies);

            if(deleteCurrencyArray.length > 0){
                deleteCurrencyArray.forEach(function (currencyCode,index,array) {
                    $scope.deleteBankAccountCurrency(editUserBankAccountCurrencies,currencyCode);
                    if(index === (array.length -1)){
                        if(newCurrencyArray.length > 0){
                            newCurrencyArray.forEach(function (currencyCode,index,array) {
                                if(index === (array.length -1)){
                                    $scope.createBankAccountCurrency(editUserBankAccountCurrencies,currencyCode,'last');
                                } else{
                                    $scope.createBankAccountCurrency(editUserBankAccountCurrencies,currencyCode);
                                }
                            });
                        } else {
                            $timeout(function () {
                                vm.updatedUserBankAccount = {};
                                vm.getUserBankAccount();
                                $scope.editingUserBankAccount = false;
                                $uibModalInstance.close(true);
                                toastr.success('Successfully removed currency from bank account.');
                            },800);
                        }
                    }
                });
            } else {
                if(newCurrencyArray.length > 0){
                    newCurrencyArray.forEach(function (currencyCode,index,array) {
                        if(index === (array.length -1)){
                            $scope.createBankAccountCurrency(editUserBankAccountCurrencies,currencyCode,'last');
                        } else{
                            $scope.createBankAccountCurrency(editUserBankAccountCurrencies,currencyCode);
                        }
                    });
                } else {
                    $timeout(function () {
                        vm.updatedUserBankAccount = {};
                        $scope.editingUserBankAccount = false;
                        $uibModalInstance.close(true);
                    },800);
                }
            }


        };

        $scope.deleteBankAccountCurrency = function(editUserBankAccountCurrencies,currencyCode){
            $scope.editingUserBankAccount = true;
            Rehive.admin.users.bankAccounts.currencies.delete($scope.editUserBankAccount.id, currencyCode).then(function (res) {
            }, function (error) {
                $scope.editingUserBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
            });
        };

        $scope.createBankAccountCurrency = function(editUserBankAccountCurrencies,currencyCode,last){
            $scope.editingUserBankAccount = true;
            Rehive.admin.users.bankAccounts.currencies.create($scope.editUserBankAccount.id,{currency: currencyCode}).then(function (res) {
                if(last){
                    $timeout(function () {
                        vm.updatedBankAccount = {};
                        vm.getUserBankAccount();
                        $uibModalInstance.close(true);
                        $scope.editingUserBankAccount = false;
                        toastr.success('Successfully added new currency to bank account.');
                        $scope.$apply();
                    },800);
                }
            }, function (error) {
                $scope.editingUserBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };


    }
})();
