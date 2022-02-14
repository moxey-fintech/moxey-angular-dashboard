(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .controller('EditPrepaidProviderModalCtrl', EditPrepaidProviderModalCtrl);

    function EditPrepaidProviderModalCtrl($scope,$uibModalInstance,toastr,companyInfo,walletActionsConfig,walletConfigService,$rootScope,
                                    Rehive,localStorageManagement,errorHandler,_,currenciesList,currencyModifiers,customMerger,editPrepaidConfigIdx,extensionsHelper, $http, $location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        vm.editIdx = editPrepaidConfigIdx;
        $scope.depositProviders = ['Bank', 'Indacoin', 'Stripe card'];
        $scope.companyInfo = companyInfo;
        $scope.customMerger = customMerger;
        $scope.currenciesList = currenciesList;
        $scope.walletActionsConfig = walletActionsConfig;
        $scope.targetConfig = $scope.walletActionsConfig.prepaid.config.prepaidCurrencies[vm.editIdx];
        $scope.editingPrepaidConfig = true;
        $scope.editPrepaidConfig = {
            currency: null,
            providers: [],
            default: 0,
            fixed: []
        };

        vm.initEditObj = function(){
            $scope.editPrepaidConfig.currency = $scope.currenciesList.find(function(currency){
                return currency.code === $scope.targetConfig.currency.code;
            });
            $scope.editPrepaidConfig.providers = $scope.targetConfig.providers;
            var idx = -1;
            var fixedItem = $scope.targetConfig.fixed ? $scope.targetConfig.fixed : null;
            $scope.editPrepaidConfig.fixed = [{
                interval: 0,
                amount: 0
            }];
            if(fixedItem && fixedItem.default && fixedItem.options){
                var cnt = 0;
                $scope.editPrepaidConfig.fixed = [];
                for(var option in fixedItem.options){
                    if(fixedItem.options.hasOwnProperty(option)){
                        if(idx === -1 && option == fixedItem.default){
                            idx = cnt;
                        }
                        ++cnt;
                        $scope.editPrepaidConfig.fixed.push({
                            interval: parseInt(currencyModifiers.convertFromCents(fixedItem.options[option].amount, $scope.editPrepaidConfig.currency.divisibility)),
                            amount: fixedItem.options[option].amount
                        })
                    }
                }
                if(cnt == 0){
                    $scope.editPrepaidConfig.fixed = [{
                        interval: 0,
                        amount: 0
                    }];
                }
            }
            
            $scope.editPrepaidConfig.default = (idx === -1) ? 0 : idx;
        };
        vm.initEditObj();

        $scope.trackIntervalChanges = function($index){
            $scope.editPrepaidConfig.default = $index;
        };

        $scope.addInterval = function(){
            $scope.editPrepaidConfig.fixed.push({
                interval: 0,
                amount: 0
            });
        };

        $scope.removeInterval = function($index){
            if($scope.editPrepaidConfig.fixed.length === 1){
                toastr.error('Must have atleast 1 interval defined for Stripe');
                return;
            }
            $scope.editPrepaidConfig.fixed.splice($index, 1);

            if($scope.editPrepaidConfig.default === $index){
                $scope.editPrepaidConfig.default = 0;
            }
        };

        $scope.updateActionConfig = function(){
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; } 
            if(!$scope.companyInfo.config.actions) { $scope.companyInfo.config.actions = {}; }
            var walletActionsConfig = walletConfigService.getFormattedWalletActionsConfig($scope.walletActionsConfig);
            if(typeof walletActionsConfig === "string" && walletActionsConfig === "invalidWithdrawPairs"){
                toastr.error("Invalid withdraw pairs. Please provide valid currencies for withdraw pairs.");
                return false;
            }

            $scope.companyInfo.config.actions = _.mergeWith({}, $scope.companyInfo.config.actions, walletActionsConfig, $scope.customMerger);

            if(vm.token){
                $scope.editingPrepaidConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingPrepaidConfig = false;
                    toastr.success('Successfully updated company cards config.');
                    $uibModalInstance.close(res);
                     
                }, function (error) {
                    $scope.editingPrepaidConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                     
                });
            }
        };

        $scope.updatePrepaidConfigToCompanyActionConfig = function(){
            var prepaidCurrencyObj = {
                providers: [],
                currency: $scope.editPrepaidConfig.currency
            };
            $scope.editPrepaidConfig.providers.forEach(function(provider){
                prepaidCurrencyObj.providers.push(provider.toLowerCase().replace(/ /g, '_'));
            });
            
            if($scope.editPrepaidConfig.providers.indexOf('Stripe card') > -1){
                prepaidCurrencyObj.fixed = {
                    default: $scope.editPrepaidConfig.fixed[$scope.editPrepaidConfig.default].interval.toString(),
                    options: {}
                };
                $scope.editPrepaidConfig.fixed.forEach(function(obj, idx, arr){
                    prepaidCurrencyObj.fixed.options[obj.interval] = {
                        amount: currencyModifiers.convertToCents(obj.interval, $scope.editPrepaidConfig.currency.divisibility)
                    };
                });
            }

            $scope.walletActionsConfig.prepaid.config.prepaidCurrencies.push(prepaidCurrencyObj);
            $scope.updateActionConfig();
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.editingPrepaidConfig = false;
            })
            .catch(function(err){
                $scope.editingPrepaidConfig = false;
                toastr.error("Extension not activated for company");
                $uibModalInstance.close();
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
