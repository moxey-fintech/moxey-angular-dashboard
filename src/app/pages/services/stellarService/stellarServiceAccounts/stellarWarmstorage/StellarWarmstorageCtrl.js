(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .controller('StellarWarmstorageCtrl', StellarWarmstorageCtrl);

    /** @ngInject */
    function StellarWarmstorageCtrl($scope,localStorageManagement,errorHandler,currenciesList,$http,$uibModal,multiOptionsFilterService,animateScroll,$location,
                                    $state,sharedResources,_,environmentConfig,currencyModifiers,toastr,serializeFiltersService,cleanObject,extensionsHelper,Rehive) {

        var vm = this;
        vm.serviceUrl = null; 
        var serviceName = "stellar_service";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.stellarCurrency = currenciesList.find(function (element) {
            return element.code == 'XLM';
        });
        $scope.showOptionsAccountRef = false;
        $scope.loadingWarmstorage = false;
        $scope.loadingWarmStoragePublicAddresses = true;

        $scope.warmstorageCurrencies = null;
        $scope.allCurrenciesPresent = true;

        $scope.warmstorageAccounts = [];
        $scope.primaryWarmstorageAccount = null; 
        $scope.showingWarmstorageDropdown = false;
        $scope.warmstorageTransactions = [];
        $scope.warmstorageTransactionsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };
        $scope.havePrivateKey = false;
        $scope.warmstorageFunded = false;
        $scope.newWarmstorageParams = {
            account_address: null,
            status: "Active",
            primary: true
        };

        vm.getWarmStorageAccount = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/warmstorage/accounts', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var warmstorageAccount = null; 
                    $scope.warmstorageAccounts = res.data.data.results;
                    $scope.warmstorageAccounts.forEach(function(account){
                        if(account.primary === true){
                            warmstorageAccount = account;
                            return false;
                        }
                    });
                    if(warmstorageAccount){
                        $scope.primaryWarmstorageAccount = warmstorageAccount;
                        vm.getOnChainBalances(warmstorageAccount);
                    }
                    else {
                        $scope.primaryWarmstorageAccount = $scope.warmstorageAccounts.length > 0 ? $scope.warmstorageAccounts[0] : null;
                        $scope.loadingWarmstorage = false;
                    }
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getHotwalletPublicAddress = function(warmstorageAccount){
            $http.get(vm.serviceUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
               $scope.allCurrenciesPresent = (res.data.data.account_address === warmstorageAccount.account_address);
            }).catch(function (error) {
                $scope.loadingHotwalletTransactions =  false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getOnChainBalances = function(warmstorageAccount){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/stellar_accounts/' + warmstorageAccount.id + '/?expand=onchain_data', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var allCurrenciesPresent = true;
                    var onchainData = res.data.data.onchain_data;                    
                    $scope.warmstorageCurrencies.forEach(function(currency){
                        onchainData.balances.non_native_balances.forEach(function(balance){
                            if(balance.asset_code && balance.asset_code === currency.currency.code){
                                currency.onchain_balance = balance.balance;
                                currency.exists = true;
                                return;
                            }
                            else if(currency.currency.code === 'XLM'){
                                currency.exists = true;
                                if(balance.asset_type == 'native'){
                                    currency.onchain_balance = balance.balance;
                                }
                            }
                        });
                        if(!currency.exists){
                            allCurrenciesPresent = false;
                        }
                    });

                    if(!allCurrenciesPresent){
                        vm.getHotwalletPublicAddress(warmstorageAccount);
                    }
                    $scope.loadingWarmstorage =  false;
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    if(error.status !== 400){
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        vm.getRehiveCurrencies = function(warmstorageObj){
            var filterObj = serializeFiltersService.objectFilters({
                page: 1,
                page_size: 25,
                reference: warmstorageObj.rehive_account_reference,
            });

            Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                $scope.warmstorageCurrencies = res.results[0].currencies;
                $scope.warmstorageCurrencies.forEach(function(currency){
                    currency.exists = currency.currency.code === 'XLM';
                });
                vm.getWarmStorageAccount();               
                $scope.$apply();
            }, function (error) {
                $scope.loadingWarmstorage =  false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getLatestTransactionsUrl = function(){
            vm.filterParams = '?user=None&tx_type=credit&page=' + $scope.warmstorageTransactionsPagination.pageNo + '&page_size=' + $scope.warmstorageTransactionsPagination.itemsPerPage; 
            
            return vm.serviceUrl + 'admin/transactions/' + vm.filterParams
        };

        $scope.getLatestTransactions = function(){
            if(vm.token) {
                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;
                $scope.warmstorageTransactions = [];

                var latestTransactionsUrl = vm.getLatestTransactionsUrl();

                $http.get(latestTransactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.warmstorageTransactionsData = res.data.data;
                    $scope.warmstorageTransactions = res.data.data.results;
                    if ($scope.warmstorageTransactions.length == 0) {
                        $scope.transactionsStateMessage = 'No transactions have been found';
                    }
                    else {
                        $scope.warmstorageTransactions.forEach(function(transaction){
                            transaction.hash = (transaction.metadata && transaction.metadata.hash) ? transaction.metadata.hash : '--';
                        });
                        $scope.transactionsStateMessage = '';
                    }
                    $scope.loadingTransactions = false;
                }, function (error) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAssignTransactionModal = function(page, size, transaction){
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AssignStellarTransactionModalCtrl',
                resolve: {
                    transaction: function(){
                        return transaction;
                    }
                }
            });

            vm.thePublicAddressModal.result.then(function(transactionAssigned){
                if(transactionAssigned){
                    $scope.getLatestTransactions();
                }
            }, function(){
            });
        };

        vm.getWarmstorage = function (applyFilter) {
            $scope.loadingWarmstorage =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/warmstorage/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.warmstorageObj = res.data.data;
                        vm.getRehiveCurrencies($scope.warmstorageObj);  
                        $scope.getLatestTransactions();                      
                    }
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.openDisplayUnAssignedTxnModal = function(page, size, unassignedTxn){
            vm.theDisplayTxnModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DisplayStellarUnAssignedTxnModalCtrl',
                resolve: {
                    unassignedTxn: function(){
                        return unassignedTxn;
                    }
                }
            });

            vm.theDisplayTxnModal.result.then(function(assigned){
                if(assigned){
                    vm.getLatestTransactions();
                }
            }, function(){
            });            
        };
        
        //Public address logic

        $scope.addStellarPublicAddress = function () {
            if(vm.token){
                $http.post(vm.serviceUrl + 'admin/warmstorage/accounts/', $scope.newWarmstorageParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage = false;
                    toastr.success('Public address successfully added');
                    $scope.warmstorageSetupStep = 3;
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.createWarmstorageAccount = function(){
            if(!$scope.newWarmstorageParams.account_address.startsWith('G')){
                toastr.error("Provided key is not a Stellar public address. Public addresses always start with a 'G'");
                return false;
            }
            if(vm.token){
                $scope.loadingWarmstorage = true;
                $http.get(vm.serviceUrl + 'admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.hotwalletObj = res.data.data;
                    if($scope.hotwalletObj.primary_stellar_account 
                        && $scope.hotwalletObj.primary_stellar_account.account_address
                        && $scope.hotwalletObj.primary_stellar_account.account_address === $scope.newWarmstorageParams.account_address){
                            $scope.loadingWarmstorage = false;
                            toastr.error('Warm storage address cannot be the same as the Hot wallet address');
                            return false;
                    } else {
                        $scope.addStellarPublicAddress();
                    }
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    $scope.transactionsHotwalletStateMessage = 'Failed to load data';
                    if(error.status == 404){
                        $scope.addStellarPublicAddress();
                    } else {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        $scope.goToWarmStoragePage = function(){
            $scope.getWarmStoragePublicAddresses();
        };

        $scope.warmStoragePublicAddressPagination = {
            itemsPerPage: 3,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWarmStoragePublicAddressUrl = function(){

            var searchObj = {
                page: $scope.warmStoragePublicAddressPagination.pageNo,
                page_size: $scope.warmStoragePublicAddressPagination.itemsPerPage
            };

            return vm.serviceUrl + 'admin/warmstorage/accounts/?' +
                serializeFiltersService.serializeFilters(cleanObject.cleanObj(searchObj));
        };

        $scope.getWarmStoragePublicAddresses = function () {
            if(vm.token) {
                $scope.loadingWarmStoragePublicAddresses = true;
                $scope.warmstorageSetupStep = 4;
                var publicAddressUrl = vm.getWarmStoragePublicAddressUrl();

                $http.get(publicAddressUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.warmStoragePublicAddressData = res.data.data;
                    $scope.warmStoragePublicAddressesList = $scope.warmStoragePublicAddressData.results;
                    if($scope.warmStoragePublicAddressesList.length > 0){
                        $scope.loadingWarmstorage = true;
                        vm.getWarmstorage();  
                    } else {
                        $scope.warmstorageSetupStep = 1;
                    }
                    $scope.loadingWarmStoragePublicAddresses = false;
                }).catch(function (error) {
                    $scope.loadingWarmStoragePublicAddresses = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.addWarmStoragePublicAddressModal = function (page,size) {
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddStellarWarmstoragePublicAddressModalCtrl'
            });

            vm.thePublicAddressModal.result.then(function(address){
                if(address){
                    vm.getWarmStorageAccount();
                    $scope.getWarmStoragePublicAddresses();
                }
            }, function(){
            });
        };

        //Public address logic ends

        $scope.openEditingNoteModal = function (page,size, primaryAccount) {
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditStellarWarmstorageNoteModalCtrl',
                resolve: {
                    primaryAccount: function(){
                        return primaryAccount;
                    }
                }
            });

            vm.thePublicAddressModal.result.then(function(note_updated){
                if(note_updated){
                    vm.getWarmstorage();
                }
            }, function(){
            });
        };

        $scope.updateWarmstorageAccountPrimary = function(){
            if(vm.token){
                $scope.loadingWarmstorage =  true;
                
                var message = $scope.primaryWarmstorageAccount.primary ? 'Warmstorage account successfully set as primary' : 'Warmstorage account successfully unset as primary';
                $http.patch(vm.serviceUrl + 'admin/warmstorage/accounts/' + $scope.primaryWarmstorageAccount.id + '/', {primary: $scope.primaryWarmstorageAccount.primary}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage = false;
                    $scope.primaryWarmstorageAccount = res.data.data;
                    toastr.success(message);
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateWarmstorageAccountStatus = function(activityStatus){
            if(vm.token){
                $scope.loadingWarmstorage =  true;
                var message = activityStatus == 'Disabled' ? 'Warmstorage account successfully disabled' : 'Warmstorage account successfully activated';
                $http.patch(vm.serviceUrl + 'admin/warmstorage/accounts/' + $scope.primaryWarmstorageAccount.id + '/', {status: activityStatus}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage = false;
                    $scope.primaryWarmstorageAccount = res.data.data;
                    toastr.success(message);
                }).catch(function (error) {
                    $scope.loadingWarmstorage = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleWarmstoragePrimary = function(){
            $scope.primaryWarmstorageAccount.primary = !$scope.primaryWarmstorageAccount.primary;
            $scope.updateWarmstorageAccountPrimary();
        };

        $scope.toggleWarmstorageDropdown = function(){
            $scope.showingWarmstorageDropdown = !$scope.showingWarmstorageDropdown;
            if($scope.showingWarmstorageDropdown){
                $("#stellarDropdown").trigger("chosen:open");
                event.stopPropagation();
            } else {
                $("#stellarDropdown").trigger("chosen:close");
                // event.stopPropagation();
                $scope.allCurrenciesPresent = false;
                vm.getOnChainBalances($scope.primaryWarmstorageAccount);
            }
        };

        $scope.goToWarmstorageTransactions = function(){
            $state.go('transactions.history', {currencyCode: 'XLM'});
        };

        $scope.scrollToUnassignedTransactions = function(){
            animateScroll.scrollDown($('#unassignedStellarTransactions'));
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
                .then(function(serviceUrl){
                    vm.serviceUrl = serviceUrl;
                    $scope.getWarmStoragePublicAddresses();
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
