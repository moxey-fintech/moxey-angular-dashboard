(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('BankAccountsCtrl', BankAccountsCtrl);

    /** @ngInject */
    function BankAccountsCtrl($scope,$uibModal,localStorageManagement,
                              Rehive,errorHandler,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingBankAccounts = true;
        $scope.bankAccounts = [];

        $scope.pagination = {
            itemsPerPage: 15,
            pageNo: 1,
            maxSize: 5
        };

        vm.getBankAccountsFilterObj = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getBankAccounts = function (fromModalDelete) {
            if(vm.token) {
                $scope.loadingBankAccounts = true;

                if ($scope.bankAccounts.length > 0) {
                    $scope.bankAccounts.length = 0;
                }

                if(fromModalDelete){
                    $scope.pagination.pageNo = 1;
                }

                var bankAccountsFilterObj = vm.getBankAccountsFilterObj();

                Rehive.admin.bankAccounts.get({filter: bankAccountsFilterObj}).then(function (res) {
                    if(res.results.length > 0 ){
                        $scope.bankAccountsData = res;
                        $scope.bankAccounts = res.results;
                        vm.getBankAccountCurrencies($scope.bankAccounts);
                    } else {
                        $scope.loadingBankAccounts = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingBankAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getBankAccounts();

        vm.getBankAccountCurrencies = function (bankAccounts) {
            $scope.loadingBankAccounts = true;
            bankAccounts.forEach(function (bank,index,array) {
                Rehive.admin.bankAccounts.currencies.get(bank.id).then(function (res) {
                    bank.currencies = res.results;
                    if(index == (array.length -1)){
                        $scope.loadingBankAccounts = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingBankAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            });
        };

        $scope.restoreBankAccount = function (bankAccount) {
            $scope.loadingBankAccounts = true;
            Rehive.admin.bankAccounts.update(bankAccount.id, {archived: false}).then(function (res) {
                $scope.getBankAccounts();
                $scope.$apply();
            }, function (error) {
                $scope.loadingBankAccounts = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAddBankAccountModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddBankAccountModalCtrl',
                scope: $scope
            });

            vm.theAddModal.result.then(function(bankAccount){
                if(bankAccount){
                    $scope.getBankAccounts();
                }
            }, function(){
            });
        };

        $scope.openEditBankAccountModal = function (page, size,bankAccount) {
            vm.theEditModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditBankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theEditModal.result.then(function(bankAccount){
                if(bankAccount){
                    $scope.getBankAccounts();
                }
            }, function(){
            });
        };

        $scope.openBankAccountModal = function (page, size,bankAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'BankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theModal.result.then(function(bankAccount){
               if(bankAccount){
                   $scope.getBankAccounts('fromModalDelete');
               }
            }, function(){
            });
        };
    }
})();
