(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .controller('ProductSettingsCtrl', ProductSettingsCtrl);

    /** @ngInject */
    function ProductSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                 extensionsHelper,$timeout,toastr,$location,errorHandler,$uibModal,walletConfigService,currenciesList,_,Rehive) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceId = null;
        vm.serviceUrl = null;
        var serviceName = "product_service";
        // $rootScope.dashboardTitle = 'Products service | Moxey';
        $rootScope.dashboardTitle = 'Products extension | Moxey';
        $scope.productSettingView = '';
        $scope.appServiceUrl = null;
        $scope.loadingProductIntegrations =  true;
        $scope.deactivatingProducts = false;
        $scope.productIntegrations = [];
        $scope.deleteIntegrationObj = {};
        $scope.updatingGeneralSettings = true;
        $scope.fetchingAppConfig = false;
        $scope.productExtensionSettings = {};
        $scope.currenciesList = currenciesList ? currenciesList : null;
        $scope.productAppConfig = {
            product: walletConfigService.getDefaultWalletProductConfig()
        };
        $scope.companyAppConfig = {};

        vm.jsonCopy = function(obj){
            return JSON.parse(JSON.stringify(obj));
        };

        vm.fetchProductAppconfig = function(){
            $scope.fetchingAppConfig = true;
            if(vm.token){
                $http.get($scope.appServiceUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.companyAppConfig = res.data.data.config;
                    if(!$scope.companyAppConfig || ($scope.companyAppConfig && Object.keys($scope.companyAppConfig).length == 0)){
                        $scope.companyAppConfig = null;
                    }
                    $scope.productAppConfig.product = walletConfigService.getUpdatedWalletProductConfig(vm.jsonCopy($scope.companyAppConfig), vm.jsonCopy($scope.productAppConfig),$scope.currenciesList,$scope.groupsList);
                    $scope.fetchingAppConfig = false;
                }).catch(function (error) {
                    $scope.fetchingAppConfig = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToProductsSetting = function (setting) {
            $scope.productSettingView = setting;
        };  

        vm.getProductExtensionSettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.productExtensionSettings = res.data.data;
                    vm.productExtensionSettings = {};
                    if($scope.productExtensionSettings.manager_groups.length > 0);
                    $scope.productExtensionSettings.manager_groups.forEach(function(businessGroup, idx, arr){
                        $scope.productExtensionSettings.manager_groups[idx] = $scope.groupsList.find(function(group){ 
                            return group.name === businessGroup; 
                        });
                    });
                    if($scope.appServiceUrl){
                        vm.fetchProductAppconfig();
                    }
                    $scope.updatingGeneralSettings = false;
                }).catch(function (error) {
                    $scope.updatingGeneralSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };  

        vm.getCompanyGroups = function() {
            if(vm.token) {
                $http.get(environmentConfig.API + 'admin/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.groupsList = res.data.data.results;
                    vm.getProductExtensionSettings();
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };  

        vm.getAllCompanyCurrencies = function () {
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
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.trackUpdatedProductSetting = function(fieldName){
            vm.productExtensionSettings[fieldName] = $scope.productExtensionSettings[fieldName];
        }; 
        
        $scope.updateProductExtensionSettings = function(){
            if(vm.productExtensionSettings.manager_groups !== undefined){
                vm.productExtensionSettings.manager_groups = _.map(vm.productExtensionSettings.manager_groups, 'name');
            }

            if(vm.token){
                $scope.updatingGeneralSettings = true;
                $http.patch(vm.serviceUrl + 'admin/company/', vm.productExtensionSettings, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    toastr.success('Settings updated successfully');
                    $scope.updatingGeneralSettings = false;
                }).catch(function(error){
                    $scope.updatingGeneralSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleProductSalesInvoiceConfig = function(setting){
            $scope.productAppConfig.product.sales.invoiceConfig[setting] = !$scope.productAppConfig.product.sales.invoiceConfig[setting];
        };

        $scope.updateCompanyConfigProduct = function(){
            if(!$scope.companyAppConfig){ 
                $scope.companyAppConfig = {}; 
            }
            if(!$scope.companyAppConfig.product) { 
                $scope.companyAppConfig.product = {}; 
            }
            $scope.productAppConfig.product = walletConfigService.getFormattedWalletProductConfig(vm.jsonCopy($scope.productAppConfig.product));
            $scope.companyAppConfig.product = _.mergeWith({}, $scope.companyAppConfig.product, $scope.productAppConfig.product, $scope.customMerger);
            $scope.companyAppConfig.product.currencies = vm.jsonCopy($scope.productAppConfig.product.currencies);
            if(vm.token){
                $scope.updatingGeneralSettings = true;
                $http.patch($scope.appServiceUrl + 'admin/company/', {config: $scope.companyAppConfig}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingGeneralSettings = false;
                    toastr.success('Successfully updated company product config.');
                    vm.fetchProductAppconfig('setProductConfig');
                    
                }, function (error) {
                    $scope.updatingGeneralSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }
        };

        $scope.deactivateProductServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/productService/productSettings/productDeactivation/productDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateProductService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateProductService = function () {
            if(vm.token) {
                $scope.deactivatingProducts = true;
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $timeout(function () {
                            $scope.deactivatingProducts = false;
                            toastr.success('Extension has been successfully deactivated');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingProducts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });              
            }
        };

        $scope.getProductIntegrations = function(){
            if(vm.token){
                $scope.loadingProductIntegrations = true;
                $http.get(vm.serviceUrl + 'admin/integrations/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.productIntegrations = res.data.data.results;
                    $scope.loadingProductIntegrations = false;
                }).catch(function (error) {
                    $scope.loadingProductIntegrations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        $scope.deleteProductIntegration = function(){
            if(vm.token){
                $scope.loadingProductIntegrations = true;
                $http.delete(vm.serviceUrl + 'admin/integrations/' + $scope.deleteIntegrationObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    toastr.success("Product integration deleted successfully");
                    $scope.getProductIntegrations();
                }).catch(function (error) {
                    $scope.loadingProductIntegrations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        $scope.openAddProductIntegrationModal = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddProductIntegrationModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(newIntegration){
                if(newIntegration){
                    $scope.getProductIntegrations();
                }
            }, function(){
            });
        };

        $scope.openEditProductIntegrationModal = function(page, size, integration){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditProductIntegrationModalCtrl',
                scope: $scope,
                resolve: {
                    editIntegrationId: function () {
                        return integration.id;
                    }
                }
            });

            vm.theModal.result.then(function(updatedIntegration){
                if(updatedIntegration){
                    $scope.getProductIntegrations();
                }
            }, function(){
            });
        };

        $scope.showDeleteProductIntegrationPrompt = function(integrationObj){
            $scope.deleteIntegrationObj = integrationObj;
            $ngConfirm({
                title: 'Delete product integration',
                columnClass: 'medium',
                contentUrl: 'app/pages/services/productService/productSettings/productIntegrations/deleteProductIntegrationPrompt.html',
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
                            $scope.deleteProductIntegration();
                        }
                    }
                }
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.serviceId = JSON.parse(localStorageManagement.getValue('extensionsList'))[serviceName].id;
                $scope.goToProductsSetting('app-config');
                $scope.getProductIntegrations();
                if(!$scope.currenciesList){
                    vm.getAllCompanyCurrencies();
                } 
                extensionsHelper.getActiveServiceUrl('app_service')
                .then(function(serviceUrl){  
                    $scope.appServiceUrl = serviceUrl;
                    vm.getCompanyGroups();
                })
                .catch(function(err){
                    $scope.appServiceUrl = null;
                    vm.getCompanyGroups();
                });
            })
            .catch(function(err){
                $scope.loadingProductIntegrations = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
