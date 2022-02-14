(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .controller('AppServiceAppConfigCtrl', AppServiceAppConfigCtrl)
        .filter('excludeSelectedFromCurrency', excludeSelectedFromCurrency)
        .filter('excludeSelectedToCurrency', excludeSelectedToCurrency);

    /** @ngInject */
    function excludeSelectedFromCurrency() {
        return function(list, ngModel, selectList) {
            var listLength = selectList.length;
            var output = [];

            angular.forEach(list, function(listItem){
                var selected = true;
                for (var index = 0; index < listLength; ++index) {
                    if(selectList[index].fromCurrency.code !== ngModel.code && selectList[index].fromCurrency.code === listItem.code){
                        selected = false;
                        break;
                    }
                }
                if(selected){
                    output.push(listItem);
                }
            });

            return output;
        };
    }

    function excludeSelectedToCurrency() {
        return function(list, ngModel, selectList) {
            var listLength = selectList.length;
            var output = [];

            angular.forEach(list, function(listItem){
                var selected = true;
                for (var index = 0; index < listLength; ++index) {
                    if(selectList[index].toCurrency.code !== ngModel.code && selectList[index].toCurrency.code === listItem.code){
                        selected = false;
                        break;
                    }
                }
                if(selected){
                    output.push(listItem);
                }
            });

            return output;
        };
    }

    function AppServiceAppConfigCtrl($scope,Rehive,$rootScope,environmentConfig,serializeFiltersService,currenciesList,countriesList,_,typeaheadService,$state,
                             $timeout,toastr,localStorageManagement,errorHandler, walletConfigService, $ngConfirm, $uibModal,$filter,extensionsHelper, $http, $location) {

        var vm = this;
        $scope.currenciesList = currenciesList;
        $scope.countriesList = countriesList;
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingWalletConfig = true;
        $scope.appConfigView = 'accounts';
        $scope.tierLevels = [1,2,3,4,5,6,7,8,9,10];
        $scope.wallet_config = {
            accounts: null,
            actions: null,
            auth: null,
            cards: null,
            colors: null,
            product: null,
            profile: null,
            settings: null,
            sliders: null
        };
        vm.companyConfig = {
            accounts: {},
            actions: {},
            auth: {},
            cards: {},
            colors: {},
            product: {},
            profile: {},
            settings: {},
            sliders: {}
        };
        $scope.configView = $location.search().showConfig;
        $scope.companyInfo = {
            config: {}
        };

        $scope.setAppConfigView = function(view){
            $scope.appConfigView = view;
            $location.search({showConfig: view});
        };

        $scope.getGroupsTypeahead = typeaheadService.getGroupsTypeahead();

        $scope.customMerger = function(objValue, srcValue){
            if (_.isArray(objValue) || _.isBoolean(objValue)){
                return srcValue !== undefined ? srcValue : objValue;
            }
        };

        vm.jsonCopy = function(obj){
            return JSON.parse(JSON.stringify(obj));
        };

        // #region Config setup methods
        vm.setAccountsConfig = function(){
            vm.companyConfig.accounts = walletConfigService.getDefaultWalletAccountsConfig();
            $scope.wallet_config.accounts = walletConfigService.getUpdatedtWalletAccountsConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig));
        };

        vm.setActionsConfig = function(){
            vm.companyConfig.actions = walletConfigService.getDefaultWalletActionsConfig();
            $scope.wallet_config.actions = walletConfigService.getUpdatedWalletActionsConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig), $scope.currenciesList, $filter);
        };

        vm.setAuthConfig = function(){
            vm.companyConfig.auth = walletConfigService.getDefaultWalletAuthConfig();
            $scope.wallet_config.auth = walletConfigService.getUpdateWalletAuthConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig), $scope.countriesList);
        };

        vm.setCardsConfig = function(){
            vm.companyConfig.cards = walletConfigService.getDefaultWalletCardsConfig();
            $scope.wallet_config.cards = walletConfigService.getUpdatedWalletCardsConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig));
        };

        vm.setColorsConfig = function(){
            vm.companyConfig.colors = walletConfigService.getDefaultWalletColorsConfig();            
            $scope.wallet_config.colors = walletConfigService.getUpdatedWalletColorsConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig));
        };

        // vm.setProductConfig = function(){
        //     vm.companyConfig.product = walletConfigService.getDefaultWalletProductConfig();
        //     $scope.wallet_config.product = walletConfigService.getUpdatedWalletProductConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig), $scope.currenciesList, $scope.groups);
        // };

        vm.setProfileConfig = function(){
            vm.companyConfig.profile = walletConfigService.getDefaultWalletProfileConfig();
            $scope.wallet_config.profile = walletConfigService.getUpdatedWalletProfileConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig));            
        };

        vm.setSettingsConfig = function(){
            vm.companyConfig.settings = walletConfigService.getDefaultWalletSettingsConfig();
            $scope.wallet_config.settings = walletConfigService.getUpdatedtWalletSettingsConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig));
        };

        vm.setSlidersConfig = function(){
            vm.companyConfig.sliders = walletConfigService.getDefaultWalletSlidersConfig();
            $scope.wallet_config.sliders = walletConfigService.getUpdatedWalletSlidersConfig(vm.jsonCopy($scope.companyInfo.config), vm.jsonCopy(vm.companyConfig));
        };
        // #endregion

        vm.setWalletConfigs = function(targetConfigSetter){
            if(targetConfigSetter){
                vm[targetConfigSetter]();
                return;
            }

            vm.setAccountsConfig();
            vm.setActionsConfig();
            vm.setAuthConfig();
            vm.setCardsConfig();
            vm.setSlidersConfig();
            vm.setColorsConfig();
            // vm.setProductConfig();
            vm.setProfileConfig();
            vm.setSettingsConfig();
        };

        vm.getCompanyInfo = function (targetConfigSetter) {
            if(vm.token) {
                $scope.loadingWalletConfig = true;
                $http.get(vm.serviceUrl + 'admin/company', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.companyInfo = res.data.data;
                    if(!$scope.companyInfo.config || ($scope.companyInfo.config && Object.keys($scope.companyInfo.config).length == 0)){
                        $scope.companyInfo.config = null;
                    }
                    vm.setWalletConfigs(targetConfigSetter);
                    $scope.loadingWalletConfig = false;
                }).catch(function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        vm.getGroups = function(){
            if(vm.token){
                $scope.loadingWalletConfig = true;
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    $scope.groups = res.results;
                    $scope.groups.forEach(function(group){
                        if(!group.label){ group.label = $filter('capitalizeWord')(group.name.replace(/_/g, ' ')); }
                    });
                    vm.getCompanyInfo(null);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCurrencyOptions = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                    if($scope.currenciesList.length > 0){
                        $scope.currenciesList.length = 0;
                    }
                    $scope.currenciesList = res.results.slice();
                    $scope.currenciesList.sort(function(a, b){
                        return a.code.localeCompare(b.code);
                    });
                    vm.getGroups();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                if($scope.configView){
                    $location.search('showConfig', null);
                    $scope.setAppConfigView($scope.configView);
                } else {
                    $scope.setAppConfigView('accounts');                
                }
                vm.getCurrencyOptions();
            })
            .catch(function(err){
                $scope.loadingWalletConfig = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

        // #region Accounts config
        $scope.toggleWalletAccountConfigs = function(setting, newVal){
            $scope.wallet_config.accounts[setting] = newVal;
        };

        $scope.updateCompanyConfigAccounts = function(){
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; } 
            if(!$scope.companyInfo.config.accounts) { $scope.companyInfo.config.accounts = {}; }

            if($scope.wallet_config.accounts.identifier === 'none'){ $scope.wallet_config.accounts.identifier = ""; }
            $scope.companyInfo.config.accounts = _.merge({}, $scope.companyInfo.config.accounts, $scope.wallet_config.accounts);

            if(vm.token){
                $scope.loadingWalletConfig = true;
                
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWalletConfig = false;
                    toastr.success('Successfully updated company accounts config.');
                    vm.getCompanyInfo('setAccountsConfig');
                    
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }
        };
        // #endregion

        // #region Actions config
        $scope.openAddDonationRecipientModal = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddActionDonationRecipientModalCtrl',
                scope: $scope,
                resolve: {
                    companyInfo: function () {
                        return $scope.companyInfo;
                    },
                    walletActionsConfig: function () {
                        return $scope.wallet_config.actions;
                    },
                    customMerger: function () {
                        return $scope.customMerger;
                    }
                }
            });

            vm.theModal.result.then(function(newRecipient){
                if(newRecipient){
                    vm.getCompanyInfo('setActionsConfig');
                }
            }, function(){
            });
        };

        $scope.openEditDonationRecipientModal = function(page, size, $index){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditActionDonationRecipientModalCtrl',
                scope: $scope,
                resolve: {
                    companyInfo: function () {
                        return $scope.companyInfo;
                    },
                    walletActionsConfig: function () {
                        return $scope.wallet_config.actions;
                    },
                    editRecipientIdx: function() {
                        return $index;
                    },
                    customMerger: function () {
                        return $scope.customMerger;
                    }
                }
            });

            vm.theModal.result.then(function(updatedRecipient){
                if(updatedRecipient){
                    vm.getCompanyInfo('setActionsConfig');
                }
            }, function(){
            });            
        };

        $scope.deleteDonationRecipientConfirmation = function($index){
            $scope.deleteDonationRecipient = $scope.wallet_config.actions.donate.config.users[$index];
            $ngConfirm({
                title: "Delete donation recipient",
                contentUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigActions/appActionDonationRecipients/deleteActionDonationRecipientPrompt.html',
                columnClass: 'medium',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.wallet_config.actions.donate.config.users.splice($index, 1);
                            toastr.success("Removed donation recipient user successfully");
                            delete $scope['deleteDonationRecipient'];
                            $scope.updateCompanyConfigActions();
                        }
                    }
                }
            });
        };

        $scope.openAddPrepaidProviderConfigModal = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddPrepaidProviderModalCtrl',
                scope: $scope,
                resolve: {
                    companyInfo: function () {
                        return $scope.companyInfo;
                    },
                    walletActionsConfig: function () {
                        return $scope.wallet_config.actions;
                    },
                    currenciesList: function () {
                        return $scope.currenciesList;
                    },
                    customMerger: function () {
                        return $scope.customMerger;
                    }
                }
            });

            vm.theModal.result.then(function(newRecipient){
                if(newRecipient){
                    vm.getCompanyInfo('setActionsConfig');
                }
            }, function(){
            });
        };

        $scope.openEditPrepaidProviderConfigModal = function(page, size, $index){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditPrepaidProviderModalCtrl',
                scope: $scope,
                resolve: {
                    companyInfo: function () {
                        return $scope.companyInfo;
                    },
                    walletActionsConfig: function () {
                        return $scope.wallet_config.actions;
                    },
                    currenciesList: function () {
                        return $scope.currenciesList;
                    },
                    editPrepaidConfigIdx: function () {
                        return $index;
                    },
                    customMerger: function () {
                        return $scope.customMerger;
                    }
                }
            });

            vm.theModal.result.then(function(updatedRecipient){
                if(updatedRecipient){
                    vm.getCompanyInfo('setActionsConfig');
                }
            }, function(){
            });            
        };

        $scope.openDeletePrepaidProviderConfigPrompt = function($index){
            $scope.deletePrepaidConfig = $scope.wallet_config.actions.prepaid.config.prepaidCurrencies[$index];
            $ngConfirm({
                title: "Delete deposit prepaid config",
                contentUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigActions/appActionPrepaidProviders/deletePrepaidProviderPrompt.html',
                columnClass: 'medium',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.wallet_config.actions.prepaid.config.prepaidCurrencies.splice($index, 1);
                            
                            if($scope.companyInfo.config && $scope.companyInfo.config.actions 
                                && $scope.companyInfo.config.actions.prepaid && $scope.companyInfo.config.actions.prepaid.config){
                                if($scope.companyInfo.config.actions.prepaid.config[$scope.deletePrepaidConfig.currency.code] !== undefined){
                                    delete $scope.companyInfo.config.actions.prepaid.config[$scope.deletePrepaidConfig.currency.code];
                                }
                            }
                            toastr.success("Removed prepaid currency config successfully");
                            delete $scope['deletePrepaidConfig'];
                            $scope.updateCompanyConfigActions();
                        }
                    }
                }
            });
        };
        
        $scope.toggleActionPayConfigs = function(targetToggle){
            $scope.wallet_config.actions.pay.config[targetToggle] = !$scope.wallet_config.actions.pay.config[targetToggle];
        };

        $scope.handleActionsSendRecipientType = function(recipientType){
            var idx = $scope.wallet_config.actions.send.config.recipient.indexOf(recipientType);
            if(idx > -1){
                $scope.wallet_config.actions.send.config.recipient.splice(idx, 1);
            } else {
                $scope.wallet_config.actions.send.config.recipient.push(recipientType);
            }
        };

        $scope.removeWithdrawPair = function(){
            var idx = $scope.wallet_config.actions.withdraw.config.selectedPairs.length - 1;
            $scope.wallet_config.actions.withdraw.config.selectedPairs.splice(idx, 1);
        };

        $scope.addNewWithdrawPair = function(){
            var conversionPair = {
                fromCurrency: {},
                toCurrency: {}
            };
            $scope.wallet_config.actions.withdraw.config.selectedPairs.push(conversionPair);
        };

        $scope.updateCompanyConfigActions = function(){
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; }
            if(!$scope.companyInfo.config.actions) { $scope.companyInfo.config.actions = {}; }
            
            var walletActionsConfig = walletConfigService.getFormattedWalletActionsConfig($scope.wallet_config.actions);
            if(typeof walletActionsConfig === "string" && walletActionsConfig === "invalidWithdrawPairs"){
                toastr.error("Invalid withdraw pairs. Please provide valid currencies for withdraw pairs.");
                return false;
            }

            $scope.companyInfo.config.actions = _.mergeWith({}, $scope.companyInfo.config.actions, walletActionsConfig, $scope.customMerger);

            if(vm.token){
                $scope.loadingWalletConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWalletConfig = false;
                    toastr.success('Successfully updated company actions config.');
                    vm.getCompanyInfo('setActionsConfig');
                    
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }
        };
        // #endregion

        // #region Auth config
        $scope.toggleWalletAuth = function(authField){
            $scope.wallet_config.auth[authField] = !$scope.wallet_config.auth[authField];
        };

        $scope.toggleWalletPin = function(pinField){
            $scope.wallet_config.auth.pin[pinField] = !$scope.wallet_config.auth.pin[pinField];
        };

        $scope.trackWalletAuthNationality = function(nationality){
            $scope.wallet_config.auth.defaultNationality = nationality.code;
        };
        
        $scope.resetWalletAuthNationality = function(){
            $scope.wallet_config.auth.selectedNationality = null;
            $scope.wallet_config.auth.defaultNationality = "";
        };

        $scope.toggleTierAuthCheck = function(){
            $scope.wallet_config.auth.tierCheckOn = !$scope.wallet_config.auth.tierCheckOn;
        };

        $scope.updateCompanyConfigAuth = function(){
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; }
            if(!$scope.companyInfo.config.auth) { $scope.companyInfo.config.auth = {}; }

            if($scope.wallet_config.auth.pin){
                $scope.wallet_config.pin = $scope.wallet_config.auth.pin;
                delete $scope.wallet_config.auth["pin"];
            }
            
            $scope.companyInfo.config.auth = _.merge({}, $scope.companyInfo.config.auth, $scope.wallet_config.auth);

            if($scope.companyInfo.config.auth.localAuth !== ""){
                if(!$scope.companyInfo.config.pin){$scope.companyInfo.config.pin = {};}
                $scope.companyInfo.config.pin = _.merge({}, $scope.companyInfo.config.pin, $scope.wallet_config.pin);
            }

            if(vm.token){
                $scope.loadingWalletConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWalletConfig = false;
                    toastr.success('Successfully updated company auth config.');
                    vm.getCompanyInfo('setAuthConfig');
                    
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }
        };
        // #endregion

        // #region Cards config
        $scope.openAddCardModal = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCustomCardModalCtrl',
                scope: $scope,
                resolve: {
                    companyInfo: function () {
                        return $scope.companyInfo;
                    },
                    walletCardsConfig: function () {
                        return $scope.wallet_config.cards;
                    }
                }
            });

            vm.theModal.result.then(function(newCard){
                if(newCard){
                    vm.getCompanyInfo('setCardsConfig');
                }
            }, function(){
            });
        };

        $scope.openEditCardModal = function(page, size, card){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditCustomCardModalCtrl',
                scope: $scope,
                resolve: {
                    companyInfo: function () {
                        return $scope.companyInfo;
                    },
                    walletCardsConfig: function () {
                        return $scope.wallet_config.cards;
                    },
                    card: function(){
                        return card
                    }
                }
            });

            vm.theModal.result.then(function(updatedCard){
                if(updatedCard){
                    vm.getCompanyInfo('setCardsConfig');
                }
            }, function(){
            });
        };

        $scope.openDeleteCardConfirmation = function(card){
            $scope.deleteCardObj = card;
            $ngConfirm({
                title: 'Delete custom card from config',
                contentUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigContent/appConfigCards/deleteCustomCardPrompt.html',
                columnClass: 'medium',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteCustomCardConfig();
                        }
                    }
                }
            });
        };

        $scope.deleteCustomCardConfig = function(){
            $scope.wallet_config.cards.home.custom.forEach(function(card, idx, arr){
                if(card.id === $scope.deleteCardObj.id){
                    arr.splice(idx, 1);
                    return;
                }
            });

            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; }
            if(!$scope.companyInfo.config.cards) { $scope.companyInfo.config.cards = {}; } 

            $scope.companyInfo.config.cards = _.mergeWith({}, $scope.companyInfo.config.cards, $scope.wallet_config.cards, $scope.customMerger);
            delete $scope['deleteCardObj'];

            if(vm.token){
                $scope.loadingWalletConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWalletConfig = false;
                    toastr.success('Successfully updated company cards config.');
                    vm.getCompanyInfo('setCardsConfig');
                    
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }
        };
        // #endregion

        // #region Sliders Config
        $scope.openAddCustomSliderModal = function(page, size, type){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCustomSliderModalCtrl',
                scope: $scope,
                resolve: {
                    companyInfo: function () {
                        return $scope.companyInfo;
                    },
                    walletSlidersConfig: function () {
                        return $scope.wallet_config.sliders;
                    },
                    sliderType: function() {
                        return type;
                    },
                    customMerger: function () {
                        return $scope.customMerger;
                    }
                }
            });

            vm.theModal.result.then(function(newSlider){
                if(newSlider){
                    vm.getCompanyInfo('setSlidersConfig');
                }
            }, function(){
            });
        };

        $scope.openEditCustomSliderModal = function(page, size, slider, type){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditCustomSliderModalCtrl',
                scope: $scope,
                resolve: {
                    companyInfo: function () {
                        return $scope.companyInfo;
                    },
                    walletSlidersConfig: function () {
                        return $scope.wallet_config.sliders;
                    },
                    sliderObj: function () {
                        return {
                            type: type,
                            sliderId: slider.id
                        };
                    },
                    customMerger: function () {
                        return $scope.customMerger;
                    }
                }
            });

            vm.theModal.result.then(function(updatedSlider){
                if(updatedSlider){
                    vm.getCompanyInfo('setSlidersConfig');
                }
            }, function(){
            });
        };

        $scope.openDeleteCustomSliderConfirm = function(type, slider){
            $scope.deleteSliderObj = {
                type: type,
                slider: slider
            };
            $ngConfirm({
                title: "Delete custom slider from config",
                contentUrl: 'app/pages/services/appService/appServiceAppConfig/appConfigContent/appConfigSliders/deleteCustomSliderPrompt.html',
                columnClass: 'medium',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(){
                            $scope.deleteCustomSliderConfig();
                        }
                    }
                }
            });            
        };

        $scope.deleteCustomSliderConfig = function(){
            $scope.wallet_config.sliders[$scope.deleteSliderObj.type].forEach(function(item, idx, arr){
                if($scope.deleteSliderObj.slider.id === item.id){
                    arr.splice(idx, 1);
                    return;
                }
            });

            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; }
            if(!$scope.companyInfo.config.sliders) { 
                $scope.companyInfo.config.sliders = {};
            } 
            $scope.companyInfo.config.sliders = _.mergeWith(
                {}, $scope.companyInfo.config.sliders, $scope.wallet_config.sliders, $scope.customMerger
            );
            delete $scope['deleteSliderObj'];

            if(vm.token){
                $scope.loadingWalletConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWalletConfig = false;
                    toastr.success('Successfully updated company sliders config.');
                    vm.getCompanyInfo('setSlidersConfig');
                    
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }            
        };
        // #endregion

        // #region Colors config
        $scope.triggerColorPicker = function(elemId){
            $('#' + elemId)[0].click();
        };

        $scope.resetColorConfig = function(colorConfig){
            if(colorConfig){
                $scope.wallet_config.colors[colorConfig] = vm.companyConfig.colors[colorConfig];
            } else {
                $scope.wallet_config.colors = _.merge({}, $scope.wallet_config.colors, vm.companyConfig.colors);
            }
        };

        $scope.updateCompanyConfigColors = function(){
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; }
            if(!$scope.companyInfo.config.colors) { $scope.companyInfo.config.colors = {}; }

            $scope.companyInfo.config.colors = _.merge({}, $scope.companyInfo.config.colors, $scope.wallet_config.colors);

            if(vm.token){
                $scope.loadingWalletConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWalletConfig = false;
                    toastr.success('Successfully updated company colors config.');
                    vm.getCompanyInfo('setColorsConfig');
                    
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }
        };
        // #endregion

        // #region Settings config
        // #region General Settings config
        $scope.toggleWalletSetting = function(setting){
            $scope.wallet_config.settings[setting] = !$scope.wallet_config.settings[setting];
        };

        $scope.updateCompanyConfigSettings = function(){
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; } 
            if(!$scope.companyInfo.config.settings) { $scope.companyInfo.config.settings = {}; }

            $scope.companyInfo.config.settings = _.merge({}, $scope.companyInfo.config.settings, $scope.wallet_config.settings, $scope.customMerger);

            if(vm.token){
                $scope.loadingWalletConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWalletConfig = false;
                    toastr.success('Successfully updated company settings config.');
                    vm.getCompanyInfo('setSettingsConfig');
                    
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }

        };
        // #endregion

        // #region Product settings config
        // $scope.toggleProductSalesInvoiceConfig = function(setting){
        //     $scope.wallet_config.product.sales.invoiceConfig[setting] = !$scope.wallet_config.product.sales.invoiceConfig[setting];
        // };

        // $scope.updateCompanyConfigProduct = function(){
        //     if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; }
        //     if(!$scope.companyInfo.config.product) { $scope.companyInfo.config.product = {}; }

        //     $scope.wallet_config.product = walletConfigService.getFormattedWalletProductConfig(vm.jsonCopy($scope.wallet_config.product));
        //     $scope.companyInfo.config.product = _.mergeWith({}, $scope.companyInfo.config.product, $scope.wallet_config.product, $scope.customMerger);

        //     if(vm.token){
        //         $scope.loadingWalletConfig = true;
        //         $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
        //             headers: {
        //                 'Content-type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function (res) {
        //             $scope.loadingWalletConfig = false;
        //             toastr.success('Successfully updated company product config.');
        //             vm.getCompanyInfo('setProductConfig');
                    
        //         }, function (error) {
        //             $scope.loadingWalletConfig = false;
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
                    
        //         });
        //     }
        // };
        // #endregion

        // #region Profile settings config
        $scope.toggleWalletProfile = function(profileField){
            $scope.wallet_config.profile[profileField] = !$scope.wallet_config.profile[profileField];
        };

        $scope.handleProfileAddressType = function(addressType){
            var idx = $scope.wallet_config.profile.addressTypes.indexOf(addressType);
            if(idx > -1){
                $scope.wallet_config.profile.addressTypes.splice(idx, 1);
            }
            else{
                $scope.wallet_config.profile.addressTypes.push(addressType);
            }
        };

        $scope.updateCompanyConfigProfile = function(){
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; }
            if(!$scope.companyInfo.config.profile) { $scope.companyInfo.config.profile = {}; }
            var showLabelEditor = $scope.wallet_config.profile.showLabelEditor;
            delete $scope.wallet_config.profile["showLabelEditor"];
            
            $scope.companyInfo.config.profile = _.mergeWith({}, $scope.companyInfo.config.profile, $scope.wallet_config.profile, $scope.customMerger);
            $scope.companyInfo.config.profile.labelID = showLabelEditor ? $scope.companyInfo.config.profile.labelID : "";

            if(vm.token){
                $scope.loadingWalletConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWalletConfig = false;
                    toastr.success('Successfully updated company profile config.');
                    vm.getCompanyInfo('setProfileConfig');
                    
                }, function (error) {
                    $scope.loadingWalletConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }

        };
        // #endregion

        // #endregion
    }
})();
