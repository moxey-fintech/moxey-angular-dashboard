(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .controller('StellarTestnetServiceConfigCtrl', StellarTestnetServiceConfigCtrl)
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

    function StellarTestnetServiceConfigCtrl($scope,$http,localStorageManagement,toastr,errorHandler,$location,environmentConfig,extensionsHelper,
                                         Rehive, serializeFiltersService, $uibModal, $state, currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "stellar_testnet_service";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.stellarTestnetConfigurations = vm.companyIdentifier + "_stellarTestnetConfigs";
        // vm.serviceUrl = "https://stellar-testnet.services.rehive.io/api/1/";
        $scope.currentConfigView = 'user defaults';
        $scope.groupOptions = [];
        $scope.maxOptions = 0;
        $scope.addedCount = 0;
        $scope.testnetConfig = {};
        $scope.hotwalletHasBeenFunded = false;
        $scope.warmStorageHasBeenFunded = false;
        $scope.warmStorage = {
            publicKey: '',
            privateKey: ''
        };
        $scope.confirmedPrivateKeyCopied = false;
        $scope.warmStoragePublicKeyLengthValid = false;
        $scope.showHelpMessage = false;
        $scope.fundingAccountUsingTestnet = false;
        $scope.fundingHotwallet = true;
        $scope.hasAccountConfigs = true;
        $scope.accountConfigsPresent = 0;
        $scope.fundingIssuerAccount = false;
        $scope.creatingAsset = false;
        $scope.finishDisabled = false;
        $scope.loadingAccountConfigs = false;
        vm.initialize = function(){
            $scope.testnetConfig.userDefaults = {};
            vm.testnetConfigs = localStorageManagement.getValue(vm.stellarTestnetConfigurations) ?
                JSON.parse(localStorageManagement.getValue(vm.stellarTestnetConfigurations)) : null;

            if(!vm.testnetConfigs){
                vm.testnetConfigs = {
                    step1Completed: false,
                    step2Completed: false,
                    currentStep: "user defaults",
                    userDefaults: null,
                    customAssetStep: null,
                    customAsset: null,
                    warmStorageIssued: false,
                    warmStorageIssuer: null,
                    warmStoragePrivate: null
                }
            }

            $scope.currentConfigView = vm.testnetConfigs.currentStep;

            $scope.testnetConfig.userDefaults.defaultGroup = null;
            $scope.testnetConfig.userDefaults.primaryAccountConfig = null;
            $scope.testnetConfig.userDefaults.groupAccountConfigs = null;
            $scope.testnetConfig.userDefaults.groups = [];
            $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;
            $scope.testnetConfig.customAsset = null;

            $scope.warmStorage = {
                publicKey: '',
                privateKey: ''
            };

            $scope.customAssetSetupComplete = false;
        };        

        $scope.goToConfigView = function (view) {
            $scope.currentConfigView = view;
        };

        $scope.copiedSuccessfully = function () {
            toastr.success('Address copied successfully');
        };

        vm.getGroups = function(){
            if(vm.token) {
                var groupFiltersObj = serializeFiltersService.objectFilters({
                    page_size: 250
                });
                $scope.groupOptions = [];
                Rehive.admin.groups.get({filters: groupFiltersObj}).then(function (res) {
                    res.results.forEach(function(group){
                        if(group.name !== "service" && group.name !== "admin"){
                            $scope.groupOptions.push(group);
                        }
                        if(group.default){
                            $scope.testnetConfig.userDefaults.defaultGroup = group;
                        }
                    });
                    $scope.maxOptions = $scope.groupOptions.length;
                    $scope.addedCount = 0;
                    var defaultIdx = -1;
                    $scope.groupOptions.forEach(function(group, idx, arr){
                        group.accountConfigs = [];
                        group.hasAccountConfigs = false;
                        group.primaryConfig = null;
                        if(group.default){
                            defaultIdx = idx;
                        }

                        if(idx === arr.length - 1){
                            $scope.getGroupAccountConfig(group, idx, 'last');
                        }
                        else{
                            $scope.getGroupAccountConfig(group, idx, null);
                        }
                    });
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.getGroupAccountConfig = function(group, idx, last){
            if(vm.token) {
                var groupAccountConfigurationsFilterObj = serializeFiltersService.objectFilters({
                    page: 1,
                    page_size: 250
                });
                $scope.loadingAccountConfigs = true;
                Rehive.admin.groups.accountConfigurations.get(group.name,{filters: groupAccountConfigurationsFilterObj}).then(function (res)
                {
                    $scope.groupOptions[idx].accountConfigs = res.results;
                    if($scope.groupOptions[idx].accountConfigs.length > 0){
                        $scope.groupOptions[idx].hasAccountConfigs = true;
                        $scope.groupOptions[idx].accountConfigs.forEach(function(accountConfig){
                            if(accountConfig.primary){
                                $scope.groupOptions[idx].primaryConfig = accountConfig;
                            }
                        });
                    }

                    if(group.default){
                        $scope.assignDefaultGroup(group);
                    }

                    if(last){
                        if($scope.testnetConfig.userDefaults.groups.length === 0){
                            $scope.assignDefaultGroup($scope.groupOptions[0]);
                        }
                        $scope.loadingAccountConfigs = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccountConfigs = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.checkIfAllAccountConfigsPresent = function(){
            $scope.hasAccountConfigs = true;
            $scope.testnetConfig.userDefaults.groups.forEach(function(groupObj){
                if(!groupObj.hasAccountConfigs){
                    $scope.hasAccountConfigs = false;
                    return;
                }
            });
        };

        $scope.assignDefaultGroup = function(defaultGroup){
            $scope.testnetConfig.userDefaults.groups = [];

            if(vm.testnetConfigs.userDefaults){
                $scope.testnetConfig.userDefaults.groups = vm.testnetConfigs.userDefaults;
                $scope.addedCount = $scope.testnetConfig.userDefaults.groups.length;
            }
            else if($scope.maxOptions > 0){              
                defaultGroup.isSelected = true;  
                $scope.testnetConfig.userDefaults.groups.push({
                    group: defaultGroup,
                    config: defaultGroup.primaryConfig ? defaultGroup.primaryConfig : (defaultGroup.accountConfigs.length > 0 ? defaultGroup.accountConfigs[0] : null),
                    hasAccountConfigs: defaultGroup.accountConfigs.length > 0,
                    groupAccountConfigs: defaultGroup.accountConfigs,
                    isDefault: defaultGroup.default,
                    primaryConfig: defaultGroup.accountConfigs.length > 0 ? (defaultGroup.primaryConfig ? defaultGroup.primaryConfig : null) : null
                });
                ++$scope.addedCount;
                $scope.checkIfAllAccountConfigsPresent();
            }
        };

        $scope.trackGroupChange = function(group){
            for(var i = 0; i < $scope.testnetConfig.userDefaults.groups.length; ++i){
                if($scope.testnetConfig.userDefaults.groups[i] === group){
                    $scope.groupOptions.forEach(function(groupOption){
                        if(groupOption.name === $scope.testnetConfig.userDefaults.groups[i].group.name){
                            groupOption.isSelected = true;
                            $scope.testnetConfig.userDefaults.groups[i] = {
                                group: groupOption,
                                config: groupOption.primaryConfig ? groupOption.primaryConfig : (groupOption.accountConfigs.length > 0 ? groupOption.accountConfigs[0] : null),
                                hasAccountConfigs: groupOption.accountConfigs.length > 0,
                                groupAccountConfigs: groupOption.accountConfigs,
                                isDefault: groupOption.default,
                                primaryConfig: groupOption.accountConfigs.length > 0 ? (groupOption.primaryConfig ? groupOption.primaryConfig : null) : null
                            }
                            $scope.checkIfAllAccountConfigsPresent();
                            return;
                        }
                    });
                    break;
                }
            };
        };

        $scope.openAddGroupModal = function () {
            $state.go('groups.overview', {externalCall: "stellar-testnet"});
        };

        $scope.addGroupAccountConfig = function(groupObj){
            // if(groupObj.name.indexOf("(default)") > 0){
            //     groupObj.name = groupObj.name.split(' ')[0];
            // }
            
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/groups/groupAccountConfigurations/addGroupAccountConfigModal/addGroupAccountConfigModal.html',
                size: 'md',
                controller: 'AddGroupAccountConfigModalCtrl',
                resolve: {
                    groupObj: function () {
                        return groupObj;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.trackGroupChange(groupObj);
                }
            }, function(){
            });
        };

        $scope.addGroupConfig = function(){
            ++$scope.addedCount;
            for(var i = 0; i < $scope.groupOptions.length; ++i){
                var newGroup = true;
                for(var j = 0; j < $scope.testnetConfig.userDefaults.groups.length; ++j){
                    if($scope.groupOptions[i].name === $scope.testnetConfig.userDefaults.groups[j].group.name){
                        newGroup = false;
                        break;
                    }
                }
                if(newGroup){
                    $scope.testnetConfig.userDefaults.groups.push({
                        group: $scope.groupOptions[i],
                        config: $scope.groupOptions[i].primaryConfig ? $scope.groupOptions[i].primaryConfig : ($scope.groupOptions[i].accountConfigs.length > 0 ? $scope.groupOptions[i].accountConfigs[0] : null),
                        hasAccountConfigs: $scope.groupOptions[i].accountConfigs.length > 0,
                        groupAccountConfigs: $scope.groupOptions[i].accountConfigs,
                        isDefault: $scope.groupOptions[i].default,
                        primaryConfig: $scope.groupOptions[i].accountConfigs.length > 0 ? ($scope.groupOptions[i].primaryConfig ? $scope.groupOptions[i].primaryConfig : null) : null
                    });
                    $scope.checkIfAllAccountConfigsPresent();
                    break;
                }
            }
        };

        $scope.removeGroupConfig = function(groupObj){
            $scope.testnetConfig.userDefaults.groups.forEach(function(item, index, array){
                if(item.group.name === groupObj.group.name){
                    --$scope.addedCount;                    
                    array.splice(index, 1);
                    return;
                }
            });            
            $scope.checkIfAllAccountConfigsPresent();
        };

        $scope.goBack = function(view){
            vm.testnetConfigs.currentStep = view;
            if(view == "user defaults"){
                $scope.testnetConfig.userDefaults.groups = null;
                $scope.testnetConfig.userDefaults.groups = vm.testnetConfigs.userDefaults;
            }
            localStorageManagement.setValue(vm.stellarTestnetConfigurations ,JSON.stringify(vm.testnetConfigs));
            $scope.goToConfigView(view);
        };

        $scope.goToNext = function(currentView, nextView){
            if(currentView == "user defaults"){
                vm.testnetConfigs.step1Completed = true;
                vm.testnetConfigs.userDefaults = $scope.testnetConfig.userDefaults.groups;
                $scope.checkHotwalletFundStatus();

            } else if(currentView == "hotwallet warmstorage"){
                vm.testnetConfigs.step2Completed = true;
                // $scope.testnetConfig.customAssetStep = "2";
                if(!vm.testnetConfigs.customAssetStep){
                    vm.testnetConfigs.customAssetStep = "1";
                    $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;

                } else {
                    $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;
                }
                if(!$scope.testnetConfig.customAsset){
                    $scope.testnetConfig.customAsset = {
                        code: "",
                        description: "",
                        symbol: null,
                        unit: null,
                        supply: null
                    };
                }
                if(vm.testnetConfigs.warmStorageIssuer){
                    $scope.warmStorage.publicKey = vm.testnetConfigs.warmStorageIssuer;
                }
            }
            vm.testnetConfigs.currentStep = nextView;

            localStorageManagement.setValue(vm.stellarTestnetConfigurations ,JSON.stringify(vm.testnetConfigs));
            $scope.goToConfigView(nextView);
        };

        $scope.checkHotwalletFundStatus = function(){            
            if(vm.token && !vm.testnetConfigs.step2Completed){
                $scope.fundingAccountUsingTestnet = true;
                $http.get(vm.serviceUrl + 'admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    if(res.data.data.balance == 0){
                       $scope.fundAccountUsingFriendbot();
                    } else {
                        $scope.fundingAccountUsingTestnet = false;
                        vm.testnetConfigs.step2Completed = true;
                        localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));
                        $scope.fundingAccountUsingTestnet = false;
                        $scope.hotwalletHasBeenFunded = true;
                    }
                }).catch(function(error){
                    $scope.fundingAccountUsingTestnet = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.fundAccountUsingFriendbot = function () {
            var address = $scope.hotWalletFundObj.account_address;
            var url = "https://stellar-friendbot.extensions.rehive.io/fund?addr=" + address + "&network=TESTNET" ;
            $http.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    vm.testnetConfigs.step2Completed = true;
                    localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));
                    $scope.fundingAccountUsingTestnet = false;
                    $scope.hotwalletHasBeenFunded = true;
                }
            }).catch(function (error) {
                $scope.fundingAccountUsingTestnet = false;
                $scope.hotwalletHasBeenFunded = false;
                if(error.status !== 400){
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                }
                else{
                    vm.testnetConfigs.step2Completed = true;
                    localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));
                }
            });
        };

        $scope.getFundHotwallet = function () {
            $scope.fundingHotwallet = true;
            $http.get(vm.serviceUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.hotWalletFundObj = res.data.data;
                    $scope.hotWalletFundObj.qr_code = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + $scope.hotWalletFundObj.account_address + '&choe=UTF-8';
                    $scope.fundingHotwallet = false;
                }
            }).catch(function (error) {
                $scope.fundingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        
        $scope.addWarmStoragePublicKey = function () {
            $scope.addingPublicKey = true;
            $http.post(vm.serviceUrl + 'admin/warmstorage/accounts/', {account_address: $scope.warmStorage.publicKey,status: 'Active'}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingPublicKey = false;
                // if (res.status === 201) {
                //     $scope.goToConfigView('finish');
                // }
            }).catch(function (error) {
                $scope.addingPublicKey = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.createIssuer = function(){
            if(vm.token){
                $http.post('https://stellar-testnet.services.rehive.io/api/1/admin/stellar_accounts/generate/',
                    {type: 'issue'}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        $scope.issuerAddress = res.data.data.account_address;
                        var url = "https://stellar-friendbot.extensions.rehive.io/fund?addr=" + $scope.issuerAddress + "&network=TESTNET" ;
                        $http.get(url, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (res) {
                            $scope.createCustomAsset();
                        }).catch(function (error) {
                            if (error.status === 400) {
                                $scope.createCustomAsset();
                            } else {
                                errorHandler.evaluateErrors(error.data);
                                errorHandler.handleErrors(error);
                            }
                        });
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                });
            }
        };

        $scope.createCustomAsset = function() {
            $scope.creatingAsset = true;
            var customAssetParams = {
                    currency_code: $scope.testnetConfig.customAsset.code,
                    address: $scope.issuerAddress,
                    description: $scope.testnetConfig.customAsset.description,
                    symbol: $scope.testnetConfig.customAsset.symbol,
                    unit: $scope.testnetConfig.customAsset.unit
                };
            customAssetParams = serializeFiltersService.objectFilters(customAssetParams);

            $http.post('https://stellar-testnet.services.rehive.io/api/1/admin/asset/', customAssetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.creatingAsset = false;
                $scope.finishDisabled = true;
                vm.testnetConfigs.customAssetStep = "2";
                vm.testnetConfigs.customAsset = res.data.data.currency_code;
                vm.testnetConfigs.warmStorageIssued = true;
                vm.testnetConfigs.warmStorageIssuer = $scope.issuerAddress;
                localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));

                $scope.warmStorage.publicKey = $scope.issuerAddress;
                $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;
            }).catch(function (error) {
                $scope.creatingAsset = false;
                errorHandler.handleErrors(error);
            });
        };

        $scope.confirmPrivateKeyCopied = function(){
            vm.testnetConfigs.customAssetStep = "3";
            localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));
            $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;
            $scope.addingPublicKey = true;
            $scope.getCurrencies();
        };

        $scope.getCurrencies = function(){
            Rehive.admin.currencies.get({
                filters: {
                    page: 1,
                    page_size: 250,
                    archived: false
                }
            }).then(function (res) {
                vm.currencyOptions = res.results.slice();

                vm.currencyOptions.sort(function (a, b) {
                    return a.code.localeCompare(b.code);
                });
                vm.currencyOptions.sort(function (a, b) {
                    return a.unit.localeCompare(b.unit);
                });

                vm.currencyOptions.forEach(function (currency) {
                    if (currency.code === $scope.testnetConfig.customAsset.code) {
                        $scope.customAsset = currency;
                    }
                });
                $scope.fundIssuerWithCustomAsset();
                $scope.$apply();
            }, function (error) {
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.fundIssuerWithCustomAsset = function(){
            if(vm.token){
                $scope.fundingIssuerAccount = true;
                $http.get('https://stellar-testnet.services.rehive.io/api/1/admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var creditTransactionData = {
                        account: res.data.data.rehive_account_reference,
                        amount: currencyModifiers.convertToCents($scope.testnetConfig.customAsset.supply, $scope.customAsset.divisibility),
                        currency: $scope.testnetConfig.customAsset.code,
                        metadata: {},
                        note: "Custom currency for funding Stellar Testnet hotwallet",
                        reference: "Stellar Testnet custom asset fund",
                        status: "Complete",
                        subtype: '',
                        user: res.data.data.user_account_identifier,
                    };
                    creditTransactionData = serializeFiltersService.objectFilters(creditTransactionData);
                    Rehive.admin.transactions.createCredit(creditTransactionData).then(function (res) {
                        $scope.addingPublicKey = false;
                        $scope.finishDisabled = false;
                        $scope.$apply();
                    }, function (error) {
                        $scope.addingPublicKey = false;
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }).catch(function (error) {
                    $scope.addingPublicKey = false;
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.onPublicKeyChange = function (warmStorage) {
            $scope.showHelpMessage = false;
            if(warmStorage.publicKey.length == 56){
                $scope.warmStoragePublicKeyLengthValid = true;
            } else {
                $scope.warmStoragePublicKeyLengthValid = false;
            }
        };

        $scope.copiedMetadataSuccessfully = function(){
            toastr.success('Metadata copied to clipboard');
        };

        $scope.addConfigurations = function(){
            var group_account_pairs = [];
            $scope.testnetConfig.userDefaults.groups.forEach(function(item){
                group_account_pairs.push({
                    group: item.group.name,
                    account: item.config.name
                });
            });

            group_account_pairs.forEach(function(pair, index, array){
                if(index === array.length-1){
                    vm.checkIfTXLMExistsInAccountConfig(pair, "last");
                } else {
                    vm.checkIfTXLMExistsInAccountConfig(pair, null);
                }
            });
        };

        vm.checkIfTXLMExistsInAccountConfig = function (groupAccountPair, last) {
            if(vm.token){
                $http.get(environmentConfig.API + 'admin/groups/' + groupAccountPair.group + '/account-configurations/' + groupAccountPair.account + '/currencies/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    var accountCurrencies = res.data.data.results, txlmExists = false;
                    accountCurrencies.forEach(function(currency){
                        if(currency.code === 'TXLM'){
                            txlmExists = true;
                            return;
                        }
                    });
                    if(!txlmExists){
                        $http.post(environmentConfig.API + 'admin/groups/' + groupAccountPair.group + '/account-configurations/' + groupAccountPair.account + '/currencies/', {currency: 'TXLM'},{
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function (res) {
                            last ?  $scope.addGroupAccountConfiguration(groupAccountPair, "last") : $scope.addGroupAccountConfiguration(groupAccountPair, null);
                        }).catch(function (error) {
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }
                    else {
                        last ?  $scope.addGroupAccountConfiguration(groupAccountPair, "last") : $scope.addGroupAccountConfiguration(groupAccountPair, null);
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
                
            }
        };

        $scope.addGroupAccountConfiguration = function(group_account_pair, last){
            if(vm.token){
                $http.post(vm.serviceUrl + 'admin/company/configuration/account-groups/', group_account_pair, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    if(last){
                        $scope.finishConfig();
                    }
                }).catch(function(error){
                    if(last){
                        $scope.finishConfig();
                    } else{
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    }
                });
            }
        };

        $scope.finishConfig = function(){
            localStorageManagement.deleteValue(vm.stellarTestnetConfigurations);
            if(vm.token){
                $http.patch(vm.serviceUrl + 'admin/company/', {has_completed_setup: true}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    // $location.path('/services/stellar-testnet/configuration');
                    $location.path('/extensions/stellar-testnet/accounts');
                }).catch(function(error){
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToAccountsView = function () {
            $location.path('services/stellar-testnet/accounts');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.initialize();
                vm.getGroups();
                $scope.getFundHotwallet();
            })
            .catch(function(err){
                $scope.fundingHotwallet = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
