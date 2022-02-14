(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .controller('AddPrepaidProviderModalCtrl', AddPrepaidProviderModalCtrl);

    function AddPrepaidProviderModalCtrl($scope,$uibModalInstance,toastr,companyInfo,walletActionsConfig,walletConfigService,$rootScope,
                                    Rehive,localStorageManagement,errorHandler,_,currenciesList,currencyModifiers,customMerger,extensionsHelper, $http, $location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        $scope.depositProviders = ['Bank', 'Indacoin', 'Stripe card'];
        $scope.companyInfo = companyInfo;
        $scope.customMerger = customMerger;
        $scope.currenciesList = currenciesList;
        $scope.walletActionsConfig = walletActionsConfig;
        $scope.addingPrepaidConfig = true;
        $scope.newPrepaidConfig = {
            currency: null,
            providers: [],
            default: 0,
            fixed: [{
                interval: 0,
                amount: 0
            }]
        };

        $scope.trackIntervalChanges = function($index){
            $scope.newPrepaidConfig.default = $index;
        };

        $scope.addInterval = function(){
            $scope.newPrepaidConfig.fixed.push({
                interval: 0,
                amount: 0
            });
        };

        $scope.removeInterval = function($index){
            if($scope.newPrepaidConfig.fixed.length === 1){
                toastr.error('Must have atleast 1 interval defined for Stripe');
                return;
            }
            $scope.newPrepaidConfig.fixed.splice($index, 1);

            if($scope.newPrepaidConfig.default === $index){
                $scope.newPrepaidConfig.default = 0;
            }
        };

        $scope.addPrepaidConfig = function(){
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; } 
            if(!$scope.companyInfo.config.actions) { $scope.companyInfo.config.actions = {}; }
            var walletActionsConfig = walletConfigService.getFormattedWalletActionsConfig($scope.walletActionsConfig);
            if(typeof walletActionsConfig === "string" && walletActionsConfig === "invalidWithdrawPairs"){
                toastr.error("Invalid withdraw pairs. Please provide valid currencies for withdraw pairs.");
                return false;
            }

            $scope.companyInfo.config.actions = _.mergeWith({}, $scope.companyInfo.config.actions, walletActionsConfig, $scope.customMerger);

            if(vm.token){
                $scope.addingPrepaidConfig = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingPrepaidConfig = false;
                    toastr.success('Successfully updated company cards config.');
                    $uibModalInstance.close(res);
                     
                }, function (error) {
                    $scope.addingPrepaidConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                     
                });
            }
        };

        $scope.addPrepaidConfigToCompanyActionConfig = function(){
            var prepaidCurrencyObj = {
                providers: [],
                currency: $scope.newPrepaidConfig.currency
            };
            $scope.newPrepaidConfig.providers.forEach(function(provider){
                prepaidCurrencyObj.providers.push(provider.toLowerCase().replace(/ /g, '_'));
            });
            
            if($scope.newPrepaidConfig.providers.indexOf('Stripe card') > -1){
                prepaidCurrencyObj.fixed = {
                    default: $scope.newPrepaidConfig.fixed[$scope.newPrepaidConfig.default].interval.toString(),
                    options: {}
                };
                $scope.newPrepaidConfig.fixed.forEach(function(obj, idx, arr){
                    prepaidCurrencyObj.fixed.options[obj.interval] = {
                        amount: currencyModifiers.convertToCents(obj.interval, $scope.newPrepaidConfig.currency.divisibility)
                    };
                });
            }

            $scope.walletActionsConfig.prepaid.config.prepaidCurrencies.push(prepaidCurrencyObj);
            $scope.addPrepaidConfig();
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.addingPrepaidConfig = false;
            })
            .catch(function(err){
                $scope.addingPrepaidConfig = false;
                toastr.error("Extension not activated for company");
                $uibModalInstance.close();
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
