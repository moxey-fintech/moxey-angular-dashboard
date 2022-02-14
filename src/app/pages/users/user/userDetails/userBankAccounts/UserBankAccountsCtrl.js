(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBankAccountsCtrl', UserBankAccountsCtrl);

    /** @ngInject */
    function UserBankAccountsCtrl($scope,Rehive,$stateParams,$uibModal,$window,
                                  localStorageManagement,errorHandler,toastr,$ngConfirm) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.isBankDetailsCollapsed = true;
        $scope.uncollapsedBank = {};
        $scope.loadingUserBankAccount = true;
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        $scope.optionsId = '';

        $scope.closeBankOptionsBox = function () {
            $scope.optionsId = '';
        };

        $scope.showBankOptionsBox = function (bank) {
            $scope.optionsId = bank.id;
        };

        vm.getUserBankAccounts = function(){
            if(vm.token) {
                $scope.loadingUserBankAccount = true;
                Rehive.admin.users.bankAccounts.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserBankAccount = false;
                    $scope.userBanks = res.results;
                    $window.sessionStorage.userBanks = JSON.stringify(res.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserBankAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserBankAccounts();

        $scope.verifyBankAccountConfirm = function (bank) {
            $ngConfirm({
                title: 'Verify user bank account',
                content: 'Are you sure you want to verify this bank account?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.verifyBankAccount(bank);
                        }
                    }
                }
            });
        };

        $scope.verifyBankAccount = function(bank){
            if(vm.token) {
                $scope.loadingUserBankAccount = true;
                Rehive.admin.users.bankAccounts.update(bank.id,{
                    status: 'verified'
                }).then(function (res) {
                    $scope.loadingUserBankAccount = false;
                    $scope.optionsId = '';
                    toastr.success('Bank account verified');
                    vm.getUserBankAccounts();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserBankAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.showCollapsedBankDetails = function (bank) {
            if(bank.id == $scope.uncollapsedBank.id){
                $scope.isBankDetailsCollapsed = true;
            } else {
                $scope.isBankDetailsCollapsed = false;
            }

            if($scope.isBankDetailsCollapsed){
                $scope.uncollapsedBank = {};
            } else {
                $scope.uncollapsedBank = bank;
            }
        };

        $scope.openAddUserBankAccountModal = function (page, size) {
            $scope.uncollapsedBank = {};
            $scope.isBankDetailsCollapsed = true;
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserBankAccountModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(bankAccount){
                if(bankAccount){
                    $scope.optionsId = '';
                    vm.getUserBankAccounts();
                }
            }, function(){
            });
        };

        $scope.openEditUserBankAccountModal = function (page, size, bankAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserBankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theModal.result.then(function(bankAccount){
                if(bankAccount){
                    $scope.optionsId = '';
                    vm.getUserBankAccounts();
                }
            }, function(){
            });
        };

        $scope.openUserBankAccountModal = function (page, size, bankAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserBankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theModal.result.then(function(bankAccount){
                if(bankAccount){
                    $scope.optionsId = '';
                    vm.getUserBankAccounts();
                }
            }, function(){
            });
        };


    }
})();
