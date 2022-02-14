(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserBankAccountModalCtrl', AddUserBankAccountModalCtrl);

    function AddUserBankAccountModalCtrl($scope,Rehive,$uibModalInstance,toastr,$stateParams,localStorageManagement,errorHandler,$window) {

        var vm = this;

        $scope.userBankAccountParams = {status: 'Pending'};
        vm.uuid = $stateParams.uuid;
        $scope.bankStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('token');
        $scope.addingUserBankAccount = false;
        $scope.newUserBankData = {};
        $scope.userBankAccountCurrencies = {
            list: []
        };

        vm.getUserBankAccounts = function(){
            if(vm.token) {
                $scope.addingUserBankAccount = true;
                Rehive.admin.users.bankAccounts.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.addingUserBankAccount = false;
                    $scope.userBanks = res.results;
                    $window.sessionStorage.userBanks = JSON.stringify(res.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.addingUserBankAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
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

        $scope.addUserBankAccount = function(userBankAccountParams){
            if(vm.token) {
                userBankAccountParams.user = vm.uuid;
                $scope.addingUserBankAccount = true;
                userBankAccountParams.status = userBankAccountParams.status.toLowerCase();
                Rehive.admin.users.bankAccounts.create(userBankAccountParams).then(function (res) {
                    vm.addUserBankAccountCurrencies(res);
                    vm.getUserBankAccounts();
                    $scope.$apply();
                    $scope.addingUserBankAccount = false;
                    $scope.userBankAccountParams = {status: 'Pending'};
                    toastr.success('Successfully added user bank accountss');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.addingUserBankAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.addUserBankAccountCurrencies = function (userBankAccountParams) {
            $scope.addingUserBankAccount = true;
            if($scope.userBankAccountCurrencies.list.length > 0){
                $scope.userBankAccountCurrencies.list.forEach(function (currency,index,array) {
                    Rehive.admin.users.bankAccounts.currencies.create(userBankAccountParams.id,{currency: currency.code}).then(function (res) {
                        if(index == (array.length - 1)){
                            $scope.addingUserBankAccount = false;
                            toastr.success('You have successfully added the bank account');
                            $scope.newUserBankData = {};
                            $uibModalInstance.close(res);
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.addingUserBankAccount = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                });
            } else {
                $scope.addingUserBankAccount = false;
                toastr.success('You have successfully added the bank account');
                $scope.newUserBankData = {};
                $uibModalInstance.close(true);
            }
        };



    }
})();
