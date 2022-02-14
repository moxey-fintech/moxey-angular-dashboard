(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .controller('StellarHotwalletCtrl', StellarHotwalletCtrl);

    /** @ngInject */
    function StellarHotwalletCtrl($scope,localStorageManagement,currenciesList,$http,errorHandler,toastr,sharedResources,$location,extensionsHelper,$state,
                                  $uibModal,_,currencyModifiers,serializeFiltersService,environmentConfig,multiOptionsFilterService,Rehive) {

        $scope.stellarAccountSettingView = '';

        var vm = this;
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = null; 
        var serviceName = "stellar_service";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.stellarCurrency = currenciesList.find(function (element) {
            return element.code == 'XLM';
        });
        $scope.loadingHotwalletTransactions = true;
        $scope.pendingWithdrawlCount = 0;
        $scope.hotwalletObjLength = 0;
        $scope.feeSubtype = null;
        $scope.withdrawSubtype = null;
        $scope.hotwalletSetupStep = 4;
        $scope.onchainData = null;

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

        $scope.openCurrencyMenu = function(currency){
            $scope.hotWalletCurrencies.forEach(function(item){
                if(item === currency){
                    item.showMenu = true;
                }
            }); 
        };

        $scope.closeCurrencyMenu = function(currency){
            $scope.hotWalletCurrencies.forEach(function(item){
                if(item === currency){
                    item.showMenu = false;
                }
            }); 
        };

        $scope.goToHotwalletTransactions = function(currency){
            $state.go('transactions.history', {
                searchHotwalletTransactions: {
                    reference: $scope.hotwalletObj.rehive_account_reference,
                    currencyCode: currency
                }
            });
        };

        $scope.searchHotwalletFees = function(){
            if($scope.feeSubtype){
                $state.go('transactions.history', {searchHotwalletFees: {code: 'XLM', subtype: $scope.feeSubtype} });
            }
            else{
                toastr.error('Company subtype for "Fee" has not been set for the extension.');
            }
        };

        $scope.searchHotwalletWithdrawals = function(){            
            if($scope.withdrawSubtype){
                $state.go('transactions.history', {searchHotwalletFees: {code: 'XLM', subtype: $scope.withdrawSubtype, status: 'Pending'} });
            }
            else{
                toastr.error('Company subtype for "Withdraw" has not been set for the extension.');
            }
        };

        vm.getOnChainBalances = function(){
            if(vm.token) {
                $scope.loadingHotwalletTransactions = true;
                $http.get(vm.serviceUrl + 'admin/stellar_accounts/' + $scope.hotwalletObj.primary_stellar_account.id + '/?expand=onchain_data', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.onchainData = res.data.data.onchain_data;
                    $scope.hotWalletCurrencies.forEach(function(currency){
                        $scope.onchainData.balances.non_native_balances.forEach(function(balance){                            
                            if(balance.asset_code && balance.asset_code === currency.currency.code){
                                currency.onchain_balance = balance.balance;
                                return;
                            }
                            else if(currency.currency.code === 'XLM'){
                                if(balance.asset_type == 'native'){
                                    currency.onchain_balance = balance.balance;
                                }
                            }
                        });
                    });

                    $scope.loadingHotwalletTransactions = false;
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions = false;
                    if(error.status === 400){
                        $scope.onchainData = null;
                    } else {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };
        
        vm.getHotwalletTotalFees = function(){
            if(vm.token && $scope.feeSubtype){
                $http.get(vm.serviceUrl + 'admin/hotwallet/fees/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.hotwalletObj.total_fees = res.data.data.total_fees;
                    $scope.loadingHotwalletTransactions =  false;
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
            else{
                $scope.loadingHotwalletTransactions =  false;
            }
        };

        vm.getRehiveCurrencies = function(){
            var filterObj = vm.getAccountFilterObj($scope.hotwalletObj.rehive_account_reference);

            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                $scope.hotWalletCurrencies = res.results[0].currencies;
                $scope.hotWalletCurrencies.forEach(function(currency){
                    currency.showMenu = false;
                });
                vm.getOnChainBalances();
                vm.getHotwalletTotalFees();
                $scope.$apply();
            }, function (error) {
                $scope.loadingHotwalletTransactions = false;
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
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
        
        vm.getStellarHotwalletSettings = function(){
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

                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.copiedMetadataSuccessfully= function () {
            toastr.success('Successfully copied hotwallet public key to clipboard');
        };

        $scope.goToHotWalletPage = function(){
            $state.go('stellarServiceAccounts', {view: 'hotwallet'}, {reload: true});
            $scope.hotwalletSetupStep = 4;
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
                    $scope.hotwalletObj.total_fees = 0;
                    $scope.hotwalletObjLength = Object.keys($scope.hotwalletObj).length;
                    vm.getRehiveCurrencies();
                    $scope.getLatestTransactions();
                    vm.getStellarHotwalletSettings();
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions =  false;
                    $scope.transactionsHotwalletStateMessage = 'Failed to load data';
                    if(error.status == 404){
                        $scope.transactionsHotwalletStateMessage = 'No active hotwallet created.';
                    } else {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };        

        $scope.openSendFromHotwalletModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'SendStellarHotwalletModalCtrl',
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
                controller: 'AddStellarHotwalletModalCtrl',
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
                controller: 'FundStellarHotwalletModalCtrl',
                scope: $scope
            });
        };

        $scope.getLatestTransactions = function(applyFilter){
            if(vm.token) {
                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;

                var filtersObj = {
                    page: 1,
                    page_size: 10,
                    account: $scope.hotwalletObj.rehive_account_reference
                };

                Rehive.admin.transactions.get({filters: filtersObj}).then(function (res) {
                    $scope.transactions = res.results;
                    $scope.loadingTransactions = false;
                    vm.checkIfPendingHotwalletWithdrawalsExist();
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
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };        

        $scope.updateStellarWithdrawalSetting = function(){
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
            $scope.updateStellarWithdrawalSetting();
        };

        $scope.openHotwalletModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'StellarHotwalletTransactionsModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    },
                    uuid: function () {
                        return $scope.hotwalletObj.user_account_identifier;
                    }
                }
            });

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.clearHotwalletFilters();
                    $scope.getLatestHotwalletTransactions();
                }
            }, function(){
            });
        };

        $scope.updateCompanySettings = function(isCompleted){
            $scope.loadingHotwalletTransactions = true;
            if(vm.token){
                $http.patch(vm.serviceUrl + 'admin/company/', {has_completed_setup: isCompleted}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.hotwalletSetupStep = 3;
                    toastr.success('Hotwallet successfully created');
                    $scope.loadingHotwalletTransactions = false;
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.getFundHotwallet = function () {
            $http.get(vm.serviceUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.hotWalletFundObj = res.data.data;
                $scope.hotWalletFundObj.qr_code = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + $scope.hotWalletFundObj.account_address + '&choe=UTF-8';
            }).catch(function (error) {
                $scope.loadingHotwalletTransactions = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getCompanySettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(!res.data.data.has_completed_setup){
                        $scope.hotwalletSetupStep = 1;
                        $scope.getFundHotwallet();
                    }
                    vm.getHotwalletActive();
                }).catch(function (error) {
                    $scope.loadingHotwalletTransactions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getCompanySettings();
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
