(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts')
        .controller('BitcoinTestnetHotwalletCtrl', BitcoinTestnetHotwalletCtrl);

    /** @ngInject */
    function BitcoinTestnetHotwalletCtrl($scope,localStorageManagement,currenciesList,_,$http,errorHandler,toastr,sharedResources,extensionsHelper,$state,
                                  Rehive,$uibModal,currencyModifiers,serializeFiltersService,environmentConfig,multiOptionsFilterService,$location) {

        $scope.bitcoinAccountSettingView = '';

        var vm = this;
        vm.serviceUrl = null;
        var serviceName = "bitcoin_testnet_service";
        // vm.serviceUrl = "https://bitcoin-testnet.services.rehive.io/api/1/";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.bitcoinCurrency = $scope.bitcoinCurrency = {
            code: "TXBT",
            description: "Bitcoin",
            symbol: "฿",
            unit: "bitcoin",
            divisibility: 8
        };
        $scope.loadingHotwalletTransactions = true;
        $scope.showMenu = false;
        $scope.pendingWithdrawlCount = 0;
        $scope.unfundedTransactionsCount = 0;
        $scope.feeSubtype = null;
        $scope.withdrawSubtype = null;
        $scope.sendSubtype = null;
        $scope.hotwalletObjLength = 0;
        $scope.hotwalletSetupStep = 1;

        $scope.openCurrencyMenu = function(){
            $scope.showMenu = !$scope.showMenu;
        };

        $scope.closeCurrencyMenu = function(){
            $scope.showMenu = false;
        };

        $scope.goToHotwalletTransactions = function(currency){
            $state.go('transactions.history', {
                searchHotwalletTransactions: {
                    reference: $scope.hotwalletObj.rehive_account_reference,
                    currencyCode: currency
                }
            });
        };

        vm.getAccountFilterObj = function(accountRef){
            var searchObj = {
                page: 1,
                page_size: 25,
                user: null,
                reference: accountRef,
                name: null,
                primary: null,
                group: null
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.searchHotwalletFees = function(){
            if($scope.feeSubtype){
                $state.go('transactions.history', {searchHotwalletFees: {code: 'TXBT', subtype: $scope.feeSubtype} });
            }
            else{
                toastr.error('Company subtype for "Fee" has not been set for the extension.');
            }
        };

        $scope.searchHotwalletWithdrawals = function(){
            if($scope.withdrawSubtype){
                $state.go('transactions.history', {searchHotwalletFees: {code: 'TXBT', subtype: $scope.withdrawSubtype, status: 'Pending'} });
            }
            else{
                toastr.error('Company subtype for "Withdraw" has not been set for the extension.');
            }
        };

        $scope.searchUnfundedHotwalletTransactions = function(){
            if($scope.sendSubtype){
                $state.go('transactions.history', {searchHotwalletFees: {code: 'TXBT', subtype: $scope.sendSubtype, status: 'Pending'} });
            }
            else{
                toastr.error('Company subtype for "Send" has not been set for the extension.');
            }
        };

        vm.getHotwalletTotalFees = function(){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/hotwallet/fees/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.hotwalletObj.total_fees = res.data.data.total_fees;
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getRehiveCurrencies = function(hotwalletObj){
            var filterObj = vm.getAccountFilterObj(hotwalletObj.rehive_account_reference);
            $scope.loadingHotwalletTransactions =  true;

            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                $scope.hotWalletCurrencies = res.results[0].currencies;
                $scope.hotWalletCurrencies.forEach(function(currency){
                    currency.showMenu = false;
                });
                $scope.getLatestTransactions();
                $scope.$apply();
            }, function (error) {
                $scope.loadingHotwalletTransactions = false;
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.checkIfUnfundedTransactionsExist = function(){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/transactions/?status=Unfunded', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.unfundedTransactionsCount = res.data.data.count;
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.checkIfPendingHotwalletWithdrawalsExist = function(){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/transactions/?withdrawal_status=pending_withdrawal', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.pendingWithdrawlCount = res.data.data.count;
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToHotWalletPage = function(){
            $state.go('bitcoinTestnetServiceAccounts', {view: 'hotwallet'}, {reload: true});
        };

        $scope.createHotwallet = function () {
            $scope.loadingHotwalletTransactions = true;
            $http.post(vm.serviceUrl + 'admin/hotwallet/', {low_balance_percentage: 0.1}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.hotwalletSetupStep = 2;
                toastr.success('Hotwallet successfully created');
                $scope.loadingHotwalletTransactions = false;
            }).catch(function (error) {
                $scope.loadingHotwalletTransactions = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openSendFromHotwalletModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'SendBitcoinTestnetHotwalletModalCtrl',
                scope: $scope,
                resolve: {
                    hotWalletCurrencies: function () {
                        return $scope.hotWalletCurrencies;
                    }
                }
            });

            vm.theModal.result.then(function(hotwallet){
                if(hotwallet){
                    vm.getHotwalletActive();
                }
            }, function(){
            });
        };

        $scope.openAddHotwalletModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddBitcoinTestnetHotwalletModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(hotwallet){
                if(hotwallet){
                    vm.getHotwalletActive();
                }
            }, function(){
            });
        };

        $scope.openFundHotwalletModal = function (page, size) {
            vm.theFundModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'FundBitcoinTestnetHotwalletModalCtrl',
                scope: $scope
            });
        };

        $scope.getLatestTransactions = function(applyFilter){
            if(vm.token) {
                $scope.transactionsStateMessage = '';

                var filtersObj = {
                    page: 1,
                    page_size: 10,
                    account: $scope.hotwalletObj.rehive_account_reference
                };

                Rehive.admin.transactions.get({filters: filtersObj}).then(function (res) {
                    $scope.transactions = res.results;
                    vm.checkIfPendingHotwalletWithdrawalsExist();
                    vm.checkIfUnfundedTransactionsExist();
                    $scope.loadingHotwalletTransactions = false;
                    if ($scope.transactions.length == 0) {
                        $scope.transactionsStateMessage = 'No transactions have been found';
                        $scope.$apply();
                        return;
                    }
                    $scope.transactions.forEach(function(transaction){
                        transaction.hash = (transaction.metadata && transaction.metadata.hash) ? transaction.metadata.hash : '--';
                    });
                    $scope.transactionsStateMessage = '';
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingHotwalletTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getBitcoinHotwalletSettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company/configuration/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.withdrawalsDisabled = res.data.data.disable_withdrawals;
                    $scope.feeSubtype = res.data.data.transaction_fee_subtype;
                    $scope.withdrawSubtype = res.data.data.transaction_withdraw_subtype;
                    $scope.sendSubtype = res.data.data.transaction_debit_subtype;
                    if($scope.feeSubtype){
                        vm.getHotwalletTotalFees();
                    }
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateBitcoinWithdrawalSetting = function(){
            if(vm.token){
                $scope.loadingHotwalletTransactions = true;
                $http.patch(vm.serviceUrl + 'admin/company/configuration/', { disable_withdrawals: $scope.withdrawalsDisabled }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.withdrawalsDisabled = res.data.data.disable_withdrawals;
                    $scope.loadingHotwalletTransactions = false;
                    var msg = $scope.withdrawalsDisabled ? "Hotwallet withdrawals successfully disabled" : "Hotwallet withdrawals successfully enabled";
                    toastr.success(msg);
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleHotwalletWithdrawls = function(){
            $scope.withdrawalsDisabled = ! $scope.withdrawalsDisabled;
            $scope.updateBitcoinWithdrawalSetting();
        };

        vm.getHotwalletActive = function (applyFilter) {
            $scope.loadingHotwalletTransactions =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.hotwalletObj = res.data.data;
                    $scope.hotwalletObjLength = $scope.hotwalletObj ? Object.keys($scope.hotwalletObj).length : 0;
                    if($scope.hotwalletObjLength > 0){
                        $scope.hotwalletObj.total_fees = 0;
                        vm.getRehiveCurrencies($scope.hotwalletObj);
                        vm.getBitcoinHotwalletSettings();
                    } else {
                        $scope.hotwalletSetupStep = 1;
                        $scope.loadingHotwalletTransactions =  false;
                    }
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions =  false;
                    if(error.status == 404){
                        $scope.transactionsHotwalletStateMessage = 'No active hotwallet created.';
                    } else {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
                .then(function(serviceUrl){
                    vm.serviceUrl = serviceUrl;
                    vm.getHotwalletActive();
                })
                .catch(function(err){
                    $scope.loadingHotwalletTransactions = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
