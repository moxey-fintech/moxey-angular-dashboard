(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .controller('BitcoinServiceSettingsCtrl', BitcoinServiceSettingsCtrl)
        .filter('excludeSelectedGroups', excludeSelectedGroups);

    /** @ngInject */
    function excludeSelectedGroups() {
        return function(groupOptions, ngModel, testnetGroupsList) {
            var listLength = testnetGroupsList.length;
            var output = [];

            angular.forEach(groupOptions, function(groupOption){
                var enabled = true;
                for (var index = 0; index < listLength; ++index) {
                    if(testnetGroupsList[index].group.name !== ngModel.name && testnetGroupsList[index].group.name === groupOption.name){
                        enabled = false;
                        break;
                    }
                }
                if(enabled){
                    output.push(groupOption);
                }
            });

            return output;
        };
    }
    function BitcoinServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,$state,extensionsHelper,
                                    $timeout,toastr,$location,errorHandler,Rehive,$intercom,$uibModal, serializeFiltersService) {

        $intercom.update();
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "bitcoin_service";
        // vm.serviceId = localStorageManagement.getValue('SERVICEID');
        // $rootScope.dashboardTitle = 'Bitcoin service | Moxey';
        $rootScope.dashboardTitle = 'Bitcoin extension | Moxey';
        $scope.bitcoinTestnetSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.updatingHotwalletSettings = false;
        $scope.deactivatingBitcoin = false;
        $scope.confirmations = vm.editConfirmations = 6;        

        $scope.goToBitcoinSetting = function (setting) {
            $scope.bitcoinSettingView = setting;
        };        

        $scope.deactivateBitcoinServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinDeactivation/bitcoinDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateBitcoinService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateBitcoinService = function () {
            if(vm.token) {
                $scope.deactivatingBitcoin = true;
                $http.get(environmentConfig.API + 'admin/services/?slug=' + serviceName, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var serviceId = res.data.data.results[0].id;
                    $http.patch(environmentConfig.API + 'admin/services/' + serviceId + '/',{active: false}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $timeout(function () {
                                $scope.deactivatingBitcoin = false;
                                toastr.success('Extension has been successfully deactivated');
                                // $location.path('/services');
                                $location.path('/extensions');
                            },600);
                        }
                    }).catch(function (error) {
                        $scope.deactivatingBitcoin = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }).catch(function (error) {
                    $scope.deactivatingBitcoin = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getBitcoinConfirmations = function(){
            if(vm.token) {
                $scope.updatingHotwalletSettings = true;
                $http.get(vm.serviceUrl + 'admin/company/configuration/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {

                    $scope.confirmations = vm.editConfirmations = res.data.data.confirmations_to_confirm;
                    $scope.updatingHotwalletSettings = false;
                }).catch(function (error) {
                    $scope.updatingHotwalletSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.updateBitcoinConfirmations = function(){
            if(vm.token) {
                $scope.updatingHotwalletSettings = true;
                $http.patch(vm.serviceUrl + 'admin/company/configuration/', {confirmations_to_confirm: $scope.confirmations}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.confirmations = vm.editConfirmations = res.data.data.confirmations_to_confirm;
                    $scope.updatingHotwalletSettings = false;
                    toastr.success('Number of required confirmations has been successfully updated');
                }).catch(function (error) {
                    $scope.updatingHotwalletSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.changeConfirmations = function(){
            vm.editConfirmations = ($scope.confirmations === null) ? vm.editConfirmations : $scope.confirmations;
        };

        $scope.revertConfirmations = function(){
            $scope.confirmations = vm.editConfirmations;
        };

        vm.getBitcoinHotwalletSettings = function(){
            if(vm.token){
                $scope.updatingHotwalletSettings = true;
                $http.get(vm.serviceUrl + 'admin/company/configuration/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingHotwalletSettings = false;
                    $scope.withdrawalsDisabled = res.data.data.disable_withdrawals;
                }).catch(function (error) {
                    $scope.updatingHotwalletSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateBitcoinWithdrawalSetting = function(){
            if(vm.token){
                $scope.updatingHotwalletSettings = true;
                $http.patch(vm.serviceUrl + 'admin/company/configuration/', { disable_withdrawals: $scope.withdrawalsDisabled }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.withdrawalsDisabled = res.data.data.disable_withdrawals;
                    $scope.updatingHotwalletSettings = false;
                    var msg = $scope.withdrawalsDisabled ? "Hotwallet withdrawals successfully disabled" : "Hotwallet withdrawals successfully enabled";
                    toastr.success(msg);
                }).catch(function (error) {
                    $scope.updatingHotwalletSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleHotwalletWithdrawls = function(){
            $scope.withdrawalsDisabled = ! $scope.withdrawalsDisabled;
            $scope.updateBitcoinWithdrawalSetting();
        };

        vm.getBitcoinMultiAddressSetting = function(){
            if(vm.token){
                $scope.updatingHotwalletSettings = true;
                $http.get(vm.serviceUrl + 'admin/company/configuration/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingHotwalletSettings = false;
                    $scope.multiAddressesDisabled = res.data.data.allow_multiple_addresses_per_user;
                }).catch(function (error) {
                    $scope.updatingHotwalletSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateBitcoinMultiAddressSetting = function(){
            if(vm.token){
                $scope.updatingHotwalletSettings = true;
                $http.patch(vm.serviceUrl + 'admin/company/configuration/', { allow_multiple_addresses_per_user: $scope.multiAddressesDisabled }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.multiAddressesDisabled = res.data.data.allow_multiple_addresses_per_user;
                    $scope.updatingHotwalletSettings = false;
                    var msg = $scope.multiAddressesDisabled ? "Allow multiple addresses per user successfully enabled" : "Allow multiple addresses per user successfully disabled";
                    toastr.success(msg);
                }).catch(function (error) {
                    $scope.updatingHotwalletSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleMultiAddresses = function(){
            $scope.multiAddressesDisabled = ! $scope.multiAddressesDisabled;
            $scope.updateBitcoinMultiAddressSetting();
        };

        /* Subtypes and user defaults logic */
        $scope.allSubtypes = [];
        $scope.defaultConfig = [];
        $scope.editExtensionSubtypes = {};
        $scope.loadingGroups = false;
        vm.editExtensionSubtypes = $scope.editExtensionSubtypes = {
            transaction_fund_subtype: null,
            transaction_debit_subtype: null,
            transaction_credit_subtype: null,
            transaction_fee_subtype: null,
            transaction_withdraw_subtype: null
        };
        $scope.editingSubtypes = {
            fund: false,
            debit: false,
            credit: false,
            fee: false,
            withdraw: false
        };
        $scope.noSubtypes = false;
        $scope.noSelectedSubtype = false;
        $scope.noSelectedText = "";
        $scope.nonDefaultSet = false;
        $scope.defaultSet = false;
        $scope.debitSubtypes = [];
        $scope.creditSubtypes = [];
        $scope.loadingSubtypes = false;
        $scope.savingUserDefaults = false;

        vm.initialize = function(){
            $scope.userDefaults = {};
            $scope.userDefaults.groups = [];
            $scope.userDefaults.configured = true;
            $scope.deletePairs = [];
        };
        
        $scope.toggleEditingSubtypes = function(field){
            $scope.editingSubtypes[field] = !$scope.editingSubtypes[field];
        };

        vm.matchProperty = function(property){
            switch(property){
                case("transaction_credit_subtype"): return true;
                case("transaction_debit_subtype"): return true;
                case("transaction_fee_subtype"): return true;
                case("transaction_fund_subtype"): return true;
                case("transaction_withdraw_subtype"): return true;
                default: return false;
            }
        };

        $scope.getPresetSubtype = function(type){
            switch(type){
                case "fund":
                    return {
                        name: "hotwallet_deposit",
                        label: "Hotwallet Deposit",
                        tx_type: "credit",
                        description: "Crypto-specific deposit transaction that represents on-chain activity. It is used to fund the hotwallet. Blockchain Extensions automatically make this transaction on Rehive when detecting an on-chain transaction."
                    };
                case "fee":
                    return {
                        name: "fee_hotwallet",
                        label: "Hotwallet fee",
                        tx_type: "debit",
                        description: "On-chain fee paid by the Hot Wallet for sending transactions."
                    };
                case "deposit":
                    return {
                        name: "deposit_crypto",
                        label: "Deposit crypto",
                        tx_type: "credit",
                        description: "Crypto-specific extensions processing automated deposits."
                    };
                case "withdraw":
                    return {
                        name: "withdraw_crypto",
                        label: "Withdraw crypto",
                        tx_type: "debit",
                        description: "Crypto-specific extensions processing automated withdrawals. This may or may not still include manual approval."
                    };
                case "send":
                    return {
                        name: "send_crypto",
                        label: "Send to crypto address",
                        tx_type: "debit",
                        description: "Sending money to a cryptocurrency address on-chain."
                    };
            }
        };

        vm.getAllSubtypes = function(){
            $scope.noSubtypes = false;
            $scope.noSelectedSubtype = false;
            $scope.nonDefaultSet = false;
            $scope.defaultSet = false;
            if(vm.token) {
                $scope.loadingSubtypes = true;
                Rehive.admin.subtypes.get().then(function (res) {
                    $scope.allSubtypes = res;
                    $scope.debitSubtypes = [];
                    $scope.creditSubtypes = [];
                    if($scope.allSubtypes.length < 1){
                        $scope.noSubtypes = true;
                    }
                    else{
                        $scope.allSubtypes.forEach(function(subtype){
                            if(subtype.tx_type === "debit"){
                                $scope.debitSubtypes.push(subtype);
                            }
                            else{
                                $scope.creditSubtypes.push(subtype);
                            }
                        });
                    }
                    vm.getDefaultSubtypes();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSubtypes = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.resetSubtype = function(property){
            $scope.editExtensionSubtypes[property] = 'none';
        };
        
        vm.getDefaultSubtypes = function(){
            if(vm.token){
                $scope.loadingSubtypes = true;
                $http.get(vm.serviceUrl + 'admin/company/configuration/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.defaultConfig = res.data.data;
                    if(!$scope.noSubtypes){
                        var cnt = 0;
                    }
                    for (var property in $scope.defaultConfig) {

                        if ($scope.defaultConfig.hasOwnProperty(property)) {
                            $scope.editExtensionSubtypes[property] = $scope.defaultConfig[property];
                            if(!$scope.editExtensionSubtypes[property] && vm.matchProperty(property)){
                                $scope.editExtensionSubtypes[property] = "none";
                            } else if(vm.matchProperty(property)) {
                                ++cnt;
                            }
                            vm.editExtensionSubtypes = $scope.editExtensionSubtypes;
                        }
                    }
                    if(cnt < 5){
                        $scope.noSelectedSubtype = true;
                        $scope.noSelectedText = cnt > 0 ? "Not all subtypes have been selected." : "No subtypes have been selected.";
                    }
                    $scope.checkCompanySubtypes();
                    $scope.loadingSubtypes = false;
                }).catch(function (error) {
                    $scope.loadingSubtypes = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.setupDefaultSubtypes = function(){
            var subtypes = [];

            subtypes.push($scope.getPresetSubtype("fund"));
            subtypes.push($scope.getPresetSubtype("fee"));
            subtypes.push($scope.getPresetSubtype("deposit"));
            subtypes.push($scope.getPresetSubtype("send"));
            subtypes.push($scope.getPresetSubtype("withdraw"));

            vm.editExtensionSubtypes = {
                transaction_fund_subtype: "hotwallet_deposit",
                transaction_debit_subtype: "send_crypto",
                transaction_credit_subtype: "deposit_crypto",
                transaction_fee_subtype: "fee_hotwallet",
                transaction_withdraw_subtype: "withdraw_crypto"
            };
            $scope.addDefaultSubtypes(subtypes, vm.editExtensionSubtypes);
        };

        $scope.addDefaultSubtypes = function(subtypes, extensionSubtypes){
            for (var i = 0; i < subtypes.length; ++i) {
                if (i === (subtypes.length - 1)) {
                    vm.addTransactionSubtype(subtypes[i], 'last', extensionSubtypes);
                } else {
                    vm.addTransactionSubtype(subtypes[i], null, extensionSubtypes);
                }
            }
        };

        vm.addTransactionSubtype =  function (subtypeObj, last, extensionSubtypes) {
            if (vm.token) {
                $scope.loadingSubtypes = true;
                Rehive.admin.subtypes.create(subtypeObj).then(function (res) {
                    if (last) {
                        extensionSubtypes ? vm.updateBitcoinSubtypes(extensionSubtypes) : vm.getAllSubtypes();
                    }
                    $scope.loadingSubtypes = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSubtypes = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        vm.updateBitcoinSubtypes = function(bitcoinSubtypes){
            if(vm.token){
                $scope.loadingSubtypes = true;
                $http.patch(vm.serviceUrl + 'admin/company/configuration/', bitcoinSubtypes, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingSubtypes = false;
                    $scope.editingSubtypes = {
                        fund: false,
                        debit: false,
                        credit: false,
                        fee: false,
                        withdraw: false
                    };
                    vm.getAllSubtypes();
                }).catch(function (error) {
                    $scope.loadingSubtypes = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.changeSubtype = function(field, type){
            if($scope.editExtensionSubtypes[field].name && $scope.editExtensionSubtypes[field].name !== vm.editExtensionSubtypes[field]){
                $scope.editExtensionSubtypes[field] = $scope.editExtensionSubtypes[field].name;
                vm.editExtensionSubtypes[field] = $scope.editExtensionSubtypes[field];
            }

            $scope.toggleEditingSubtypes(type);
        };

        $scope.revertSubtype = function(field, type){
            $scope.editExtensionSubtypes[field] = vm.editExtensionSubtypes[field];
            $scope.toggleEditingSubtypes(type);
        };
        
        $scope.checkCompanySubtypes = function(){
            $scope.loadingSubtypes = true;
            if(!$scope.noSubtypes && !$scope.noSelectedSubtype){
                $scope.nonDefaultSet = false;
                for (var property in vm.editExtensionSubtypes) {
                    if (vm.editExtensionSubtypes.hasOwnProperty(property) && vm.matchProperty(property)) {
                        switch (property) {
                            case "transaction_credit_subtype":
                                if(vm.editExtensionSubtypes.transaction_credit_subtype !== "deposit_crypto"){
                                    $scope.nonDefaultSet = true;
                                }
                                break;
                            case "transaction_debit_subtype":
                                if(vm.editExtensionSubtypes.transaction_debit_subtype !== "send_crypto"){
                                    $scope.nonDefaultSet = true;
                                }
                                break;
                            case "transaction_fee_subtype":
                                if(vm.editExtensionSubtypes.transaction_fee_subtype !== "fee_hotwallet"){
                                    $scope.nonDefaultSet = true;
                                }
                                break;
                            case "transaction_fund_subtype":
                                if(vm.editExtensionSubtypes.transaction_fund_subtype !== "hotwallet_deposit"){
                                    $scope.nonDefaultSet = true;
                                }
                                break;
                            case "transaction_withdraw_subtype":
                                if(vm.editExtensionSubtypes.transaction_withdraw_subtype !== "withdraw_crypto"){
                                    $scope.nonDefaultSet = true;
                                }
                                break;
                        }
                    }
                }

                if(!$scope.nonDefaultSet){
                    $scope.defaultSet = true;
                }
                $scope.loadingSubtypes = false;
            } else {
                $scope.loadingSubtypes = false;
            }
        };
        
        $scope.updateDefaultSubtypes = function(){
            var subtypes = [],
                extensionSubtypes = {
                    transaction_fund_subtype: null,
                    transaction_debit_subtype: null,
                    transaction_credit_subtype: null,
                    transaction_fee_subtype: null,
                    transaction_withdraw_subtype: null
                };
            for(var idx = 0; idx < $scope.allSubtypes.length; ++idx){
                if($scope.allSubtypes[idx].name === "deposit_crypto"){
                    extensionSubtypes.transaction_credit_subtype = "deposit_crypto";
                }
                if($scope.allSubtypes[idx].name === "send_crypto"){
                    extensionSubtypes.transaction_debit_subtype = "send_crypto";
                }
                if($scope.allSubtypes[idx].name === "hotwallet_deposit"){
                    extensionSubtypes.transaction_fund_subtype = "hotwallet_deposit";
                }
                if($scope.allSubtypes[idx].name === "fee_hotwallet"){
                    extensionSubtypes.transaction_fee_subtype = "fee_hotwallet";
                }
                if($scope.allSubtypes[idx].name === "withdraw_crypto"){
                    extensionSubtypes.transaction_withdraw_subtype = "withdraw_crypto";
                }
            }

            if(!extensionSubtypes.transaction_credit_subtype){
                extensionSubtypes.transaction_credit_subtype = "deposit_crypto";
                subtypes.push($scope.getPresetSubtype("deposit"));
            }
            if(!extensionSubtypes.transaction_debit_subtype){
                extensionSubtypes.transaction_debit_subtype = "send_crypto";
                subtypes.push($scope.getPresetSubtype("send"));
            }
            if(!extensionSubtypes.transaction_fund_subtype){
                extensionSubtypes.transaction_fund_subtype = "hotwallet_deposit";
                subtypes.push($scope.getPresetSubtype("fund"));
            }
            if(!extensionSubtypes.transaction_fee_subtype){
                extensionSubtypes.transaction_fee_subtype = "fee_hotwallet";
                subtypes.push($scope.getPresetSubtype("fee"));
            }
            if(!extensionSubtypes.transaction_withdraw_subtype){
                extensionSubtypes.transaction_withdraw_subtype = "withdraw_crypto";
                subtypes.push($scope.getPresetSubtype("withdraw"));
            }


            if(subtypes.length > 0){
                $scope.addDefaultSubtypes(subtypes, extensionSubtypes);
            } else {
                vm.updateBitcoinSubtypes(extensionSubtypes);
            }
        };
        
        $scope.patchExtensionSubtypes = function(){
            var extensionSubtypes = {
                transaction_fund_subtype: null,
                transaction_debit_subtype: null,
                transaction_credit_subtype: null,
                transaction_withdraw_subtype: null,
                transaction_fee_subtype: null
            };

            for(var property in vm.editExtensionSubtypes){
                if(vm.editExtensionSubtypes.hasOwnProperty(property) && vm.matchProperty(property)){
                    extensionSubtypes[property] = vm.editExtensionSubtypes[property].name ? vm.editExtensionSubtypes[property].name : vm.editExtensionSubtypes[property];
                    extensionSubtypes[property] = extensionSubtypes[property] === "none" ? null : extensionSubtypes[property];
                }
            }

            vm.updateBitcoinSubtypes(extensionSubtypes);
        };

        $scope.openAddSubtypeModal = function(){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/transactions/subtypes/addSubtypeModal/addSubtypeModal.html',
                size: 'md',
                controller: 'AddSubtypeModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(subtype){
                if(subtype){
                    vm.getAllSubtypes();
                }
            }, function(){
            });
        };
        /// Uncomment when account-groups has been added for Bitcoin endpoint
        // vm.getGroups = function(){
        //     if(vm.token) {
        //         var groupFiltersObj = serializeFiltersService.objectFilters({
        //             page_size: 250
        //         });
        //         $scope.groupOptions = [];
        //         $scope.loadingGroups = true;
        //         Rehive.admin.groups.get({filters: groupFiltersObj}).then(function (res) {
        //             res.results.forEach(function(group){
        //                 if(group.name !== "service" && group.name !== "admin"){
        //                     $scope.groupOptions.push(group);
        //                 }
        //             });
        //             $scope.maxOptions = $scope.groupOptions.length;
        //             $scope.addedCount = 0;
        //             if($scope.groupOptions.length > 0){
        //                 $scope.groupOptions.forEach(function(group, idx, arr){
        //                     group.accountConfigs = [];
        //                     group.primaryConfig = null;
    
        //                     if(idx === arr.length - 1){
        //                         $scope.getGroupAccountConfig(group, idx, 'last');
        //                     }
        //                     else{
        //                         $scope.getGroupAccountConfig(group, idx, null);
        //                     }
        //                 });
        //             }
        //             else {
        //                 $scope.loadingGroups = false;
        //             }                    
        //             $scope.$apply();
        //         }, function (error) {
        //             $scope.loadingGroups = false;
        //             errorHandler.evaluateErrors(error);
        //             errorHandler.handleErrors(error);
        //             $scope.$apply();
        //         });
        //     }
        // };
        // vm.getGroups();

        // $scope.getGroupAccountConfig = function(group, idx, last){
        //     if(vm.token) {
        //         var groupAccountConfigurationsFilterObj = serializeFiltersService.objectFilters({
        //             page: 1,
        //             page_size: 250
        //         });
        //         Rehive.admin.groups.accountConfigurations.get(group.name,{filters: groupAccountConfigurationsFilterObj}).then(function (res)
        //         {
        //             $scope.groupOptions[idx].accountConfigs = res.results;
        //             if($scope.groupOptions[idx].accountConfigs.length > 0){
        //                 $scope.groupOptions[idx].accountConfigs.forEach(function(config){
        //                     if(config.primary){
        //                         $scope.groupOptions[idx].primaryConfig = config;
        //                         return;
        //                     }
        //                 });
        //             }

        //             if(last){
        //                 vm.searchDefaultGroupAccountPairs();                        
        //             }
        //             $scope.$apply();
        //         }, function (error) {
        //             $scope.loadingGroups = false;
        //             errorHandler.evaluateErrors(error);
        //             errorHandler.handleErrors(error);
        //             $scope.$apply();
        //         });
        //     }
        // };

        // vm.searchDefaultGroupAccountPairs = function(){
        //     if(vm.token){
        //         $scope.loadingGroups = true;
        //         $http.get(vm.serviceUrl + 'admin/company/configuration/account-groups/', {
        //             headers: {
        //                 'Content-type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function(res){
        //             $scope.defaultPairs = res.data.data;
        //             $scope.addedCount = $scope.defaultPairs.length;
        //             if($scope.addedCount > 0){
        //                 vm.setGroupAccountPairs();
        //             }
        //             else {
        //                 vm.addDefaultGroupConfiguration();
        //             }
        //             $scope.loadingGroups = false;
        //         }).catch(function(error){
        //             $scope.loadingGroups = false;
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
        //         });
        //     }
        // };

        // vm.addDefaultGroupConfiguration = function(){
        //     $scope.userDefaults.groups = [];
        //     $scope.groupOptions.forEach(function(groupOption){
        //         if(groupOption.default){
        //             $scope.userDefaults.groups.push({
        //                 id: null,
        //                 group: groupOption,
        //                 config: groupOption.primaryConfig ? groupOption.primaryConfig : (groupOption.accountConfigs.length > 0 ? groupOption.accountConfigs[0] : null),
        //                 onSave: 'add'
        //             });
        //             return;
        //         }
        //     });
        //     if($scope.userDefaults.groups.length == 0){
        //         $scope.userDefaults.groups.push({
        //             id: null,
        //             group: $scope.groupOptions[0],
        //             config: $scope.groupOptions[0].primaryConfig ? $scope.groupOptions[0].primaryConfig : ($scope.groupOptions[0].accountConfigs.length > 0 ? $scope.groupOptions[0].accountConfigs[0] : null),
        //             onSave: 'add'
        //         });
        //     }
        //     ++$scope.addedCount;
        //     $scope.hasChanges = true;
        //     $scope.checkIfAllAccountConfigsPresent();
        // };

        // vm.setGroupAccountPairs = function(){
        //     $scope.userDefaults.groups = [];
        //     $scope.defaultPairs.forEach(function(groupAccountPair){
        //         var config = null;
        //         $scope.groupOptions.forEach(function(groupOption){
        //             if(groupOption.name === groupAccountPair.group){
        //                 groupOption.accountConfigs.forEach(function(accountConfig){
        //                     if(accountConfig.name === groupAccountPair.account){
        //                         config = accountConfig;
        //                         return;
        //                     }
        //                 });
        //                 $scope.userDefaults.groups.push({
        //                     id: groupAccountPair.id,
        //                     group: groupOption,
        //                     config: config ? config : (groupOption.primaryConfig ? groupOption.primaryConfig : (groupOption.accountConfigs.length > 0 ? groupOption.accountConfigs[0] : null)),
        //                     onSave: 'none'
        //                 });
        //                 return;
        //             }
        //         });
        //     });
        //     $scope.checkIfAllAccountConfigsPresent();            
        // };

        // $scope.checkIfAllAccountConfigsPresent = function(){
        //     $scope.configured = true;
        //     $scope.userDefaults.groups.forEach(function(groupObj){
        //         if(!groupObj.group.accountConfigs.length > 0){
        //             $scope.configured = false;
        //             return;
        //         }
        //     });
        // };

        // $scope.trackChange = function(groupObj){
        //     $scope.hasChanges = true;
        //     if(groupObj){
        //         $scope.userDefaults.groups.forEach(function(group){
        //             if(group.group.name === groupObj.name){
        //                 group.config = groupObj.primaryConfig ? groupObj.primaryConfig : (groupObj.accountConfigs.length > 0 ? groupObj.accountConfigs[0] : null);
        //                 group.onSave = group.id ?  'change' : 'add';
        //                 return false;
        //             }
        //         });
        //     }
        //     $scope.checkIfAllAccountConfigsPresent();
        // };
        
        // $scope.openAddGroupModal = function () {
        //     $state.go('groups.overview', {externalCall: "bitcoin"});
        // };

        // $scope.addGroupAccountConfig = function(groupObj){
        //     $scope.loadingGroups = true;
        //     vm.theModal = $uibModal.open({
        //         animation: true,
        //         templateUrl: 'app/pages/groups/groupAccountConfigurations/addGroupAccountConfigModal/addGroupAccountConfigModal.html',
        //         size: 'md',
        //         controller: 'AddGroupAccountConfigModalCtrl',
        //         resolve: {
        //             groupObj: function () {
        //                 return groupObj;
        //             }
        //         }
        //     });

        //     vm.theModal.result.then(function(account){
        //         var idx = -1;
        //         for(var i = 0; i < $scope.groupOptions.length; ++i){
        //             if(groupObj.name === $scope.groupOptions[i].name){
        //                 idx = i;
        //                 break;
        //             }
        //         }
        //         var groupAccountConfigurationsFilterObj = serializeFiltersService.objectFilters({
        //             page: 1,
        //             page_size: 250
        //         });
        //         Rehive.admin.groups.accountConfigurations.get(groupObj.name,{filters: groupAccountConfigurationsFilterObj}).then(function (res)
        //         {
        //             if(idx !== -1){
        //                 $scope.groupOptions[idx].accountConfigs = res.results;
        //                 if($scope.groupOptions[idx].accountConfigs.length > 0){
        //                     $scope.groupOptions[idx].accountConfigs.forEach(function(config){
        //                         if(config.primary){
        //                             $scope.groupOptions[idx].primaryConfig = config;
        //                             return;
        //                         }
        //                     });
        //                 }
        //                 var idx = -1;
        //                 for(var i = 0; i < $scope.userDefaults.groups.length; ++i){
        //                     if(groupObj.name === $scope.userDefaults.groups[i].group.name){
        //                         $scope.userDefaults.groups[i].group = $scope.groupOptions[idx];
        //                         $scope.userDefaults.groups[i].config = $scope.groupOptions[idx].primaryConfig ? 
        //                         $scope.groupOptions[idx].primaryConfig : ($scope.groupOptions[idx].accountConfigs.length > 0 ?
        //                              $scope.groupOptions[idx].accountConfigs[idx] : null)
        //                     }
        //                 }
        //             }
        //             $scope.loadingGroups = false;
        //             $scope.$apply();
        //         }, function (error) {
        //             $scope.loadingGroups = false;
        //             errorHandler.evaluateErrors(error);
        //             errorHandler.handleErrors(error);
        //             $scope.$apply();
        //         });
        //     }, function(){
        //     });
        // };

        // $scope.addGroupConfig = function(){            
        //     for(var i = 0; i < $scope.groupOptions.length; ++i){
        //         var newGroup = true;
        //         for(var j = 0; j < $scope.userDefaults.groups.length; ++j){
        //             if($scope.groupOptions[i].name === $scope.userDefaults.groups[j].group.name){
        //                 newGroup = false;
        //                 break;
        //             }
        //         }
        //         if(newGroup){
        //             var newGroupObj = {
        //                 id: null,
        //                 group: $scope.groupOptions[i],
        //                 config: $scope.groupOptions[i].primaryConfig ? $scope.groupOptions[i].primaryConfig : ($scope.groupOptions[i].accountConfigs.length > 0 ? $scope.groupOptions[i].accountConfigs[0] : null),
        //                 onSave: 'none'
        //             };
        //             $scope.userDefaults.groups.push(newGroupObj);
        //             ++$scope.addedCount;
        //             $scope.trackChange($scope.groupOptions[i]);
        //             break;
        //         }
        //     }
        // };

        // $scope.removeGroupConfig = function(groupObj){
        //     $scope.userDefaults.groups.forEach(function(item, index, array){
        //         if(item.group.name === groupObj.group.name){    
        //             if(groupObj.id){
        //                 $scope.deletePairs.push(item);
        //                 $scope.hasChanges = true;
        //             }
        //             array.splice(index, 1);
        //             --$scope.addedCount;
        //             $scope.checkIfAllAccountConfigsPresent();
        //             return false;
        //         }
        //     });
        // };

        // $scope.saveGroupAccountChanges = function(){
        //     if($scope.hasChanges){
        //         $scope.savingUserDefaults = true;
                
        //         if($scope.deletePairs.length > 0){
        //             $scope.userDefaults.groups.forEach(function(groupObj){
        //                 if(groupObj.id && groupObj.onSave === 'change'){
        //                     $scope.updateGroupAccountPair(groupObj, null);
        //                 }
        //                 else if(groupObj.onSave === 'add'){
        //                     $scope.checkIfTXLMExistsOnConfig(groupObj, null);
        //                 }
        //             });
        //             $scope.deletePairs.forEach(function(groupObj, index, array){
        //                 if(index === array.length - 1){
        //                     $scope.deleteGroupAccountPair(groupObj, 'last');
        //                 }
        //                 else {
        //                     $scope.deleteGroupAccountPair(groupObj, null);
        //                 }
        //             });
        //         } else {
        //             $scope.userDefaults.groups.forEach(function(groupObj, index, array){
        //                 if(index === (array.length - 1)){
        //                     if(groupObj.id && groupObj.onSave === 'change'){
        //                         $scope.updateGroupAccountPair(groupObj, 'last');
        //                     }
        //                     else if(groupObj.onSave === 'add'){
        //                         $scope.checkIfTXLMExistsOnConfig(groupObj, 'last');
        //                     }
        //                 }
        //                 else {
        //                     if(groupObj.id && groupObj.onSave === 'change'){
        //                         $scope.updateGroupAccountPair(groupObj, null);
        //                     }
        //                     else if(groupObj.onSave === 'add'){
        //                         $scope.checkIfTXLMExistsOnConfig(groupObj, null);
        //                     }
        //                 }
        //             });
        //         }
        //     }            
        // };

        // $scope.updateGroupAccountPair = function(groupObj, last){
        //     if(vm.token){
        //         $http.patch(vm.serviceUrl + 'admin/company/configuration/account-groups/' + groupObj.id + '/', {group: groupObj.group.name, account: groupObj.config.name}, {
        //             headers: {
        //                 'Content-type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function(res){
        //             if(last){
        //                 $scope.savingUserDefaults = false;
        //                 $scope.hasChanges = false; 
        //                 toastr.success('Group account pairs updated successfully');
        //                 vm.getGroups();
        //             }
        //         }).catch(function(error){
        //             $scope.savingUserDefaults = false;
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
        //         });
        //     }
        // };

        // $scope.checkIfTXLMExistsOnConfig = function(groupObj, last){
        //     if(vm.token){
        //         $http.get(environmentConfig.API + 'admin/groups/' + groupObj.group.name + '/account-configurations/' + groupObj.config.name + '/currencies/',{
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function(res){
        //             var accountCurrencies = res.data.data.results, txlmExists = false;
        //             accountCurrencies.forEach(function(currency){
        //                 if(currency.code === 'TXLM'){
        //                     txlmExists = true;
        //                     return;
        //                 }
        //             });
        //             if(!txlmExists){
        //                 $http.post(environmentConfig.API + 'admin/groups/' + groupObj.group.name + '/account-configurations/' + groupObj.config.name + '/currencies/', {currency: 'TXLM'},{
        //                     headers: {
        //                         'Content-Type': 'application/json',
        //                         'Authorization': vm.token
        //                     }
        //                 }).then(function (res) {
        //                     last ?  $scope.addGroupAccountPair(groupObj, "last") : $scope.addGroupAccountPair(groupObj, null);
        //                 }).catch(function (error) {
        //                     errorHandler.evaluateErrors(error.data);
        //                     errorHandler.handleErrors(error);
        //                 });
        //             }
        //             else {
        //                 last ?  $scope.addGroupAccountPair(groupObj, "last") : $scope.addGroupAccountPair(groupObj, null);
        //             }
        //         }).catch(function (error) {
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
        //         });
                
        //     }
        // };

        // $scope.addGroupAccountPair = function(groupObj, last){
        //     if(vm.token){
        //         $http.post(vm.serviceUrl + 'admin/company/configuration/account-groups/', {group: groupObj.group.name, account: groupObj.config.name}, {
        //             headers: {
        //                 'Content-type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function(res){
        //             if(last){
        //                 $scope.savingUserDefaults = false;
        //                 $scope.hasChanges = false; 
        //                 toastr.success('Group account pairs updated successfully');
        //                 vm.getGroups();
        //             }
        //         }).catch(function(error){
        //             $scope.savingUserDefaults = false;
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
        //         });
        //     }
        // };

        // $scope.deleteGroupAccountPair = function(groupObj, last){
        //     if(vm.token){
        //         $http.delete(vm.serviceUrl + 'admin/company/configuration/account-groups/' + groupObj.id + '/', {
        //             headers: {
        //                 'Content-type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function(res){
        //             if(last){
        //                 $scope.savingUserDefaults = false;
        //                 $scope.deletePairs = [];
        //                 $scope.hasChanges = false; 
        //                 toastr.success('Group account pairs updated successfully');
        //                 vm.getGroups();
        //             }
        //         }).catch(function(error){
        //             $scope.savingUserDefaults = false;
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
        //         });
        //     }
        // };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.goToBitcoinSetting('settings');
                vm.initialize();
                vm.getAllSubtypes();
                vm.getBitcoinHotwalletSettings();
                vm.getBitcoinMultiAddressSetting();
                vm.getBitcoinConfirmations();
            })
            .catch(function(err){
                $scope.loadingHdkeys = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
