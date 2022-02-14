(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceSettings')
        .controller('BusinessServiceSettingsCtrl', BusinessServiceSettingsCtrl);

    /** @ngInject */
    function BusinessServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                 extensionsHelper,$timeout,toastr,$location,errorHandler,walletConfigService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.serviceId = null;
        $scope.appServiceUrl = null;
        var serviceName = "business_service";
        // $rootScope.dashboardTitle = 'Business service | Moxey';
        $rootScope.dashboardTitle = 'Business extension | Moxey';
        $scope.payoutDayOptions = [{"value": 0, "text": "Monday"}, {"value": 1, "text": "Tuesday"}, {"value": 2, "text": "Wednesday"}, {"value": 3, "text": "Thursday"}, {"value": 4, "text": "Friday"}, {"value": 5, "text": "Saturday"}, {"value": 6, "text": "Sunday"} ];
        $scope.payoutHourOptions = [{"value": 0, "text": "00:00 Midnight"}, {"value": 1, "text": "01:00"}, {"value": 2, "text": "02:00"}, {"value": 3, "text": "03:00"}, {"value": 4, "text": "04:00"}, {"value": 5, "text": "05:00"}, {"value": 6, "text": "06:00"}, {"value": 7, "text": "07:00"}, {"value": 8, "text": "08:00"}, {"value": 9, "text": "09:00"}, {"value": 10, "text": "10:00"}, {"value": 11, "text": "11:00"}, {"value": 12, "text": "12:00 Midday"}, {"value": 13, "text": "13:00"}, {"value": 14, "text": "14:00"}, {"value": 15, "text": "15:00"}, {"value": 16, "text": "16:00"}, {"value": 17, "text": "17:00"}, {"value": 18, "text": "18:00"}, {"value": 19, "text": "19:00"}, {"value": 20, "text": "20:00"}, {"value": 21, "text": "21:00"}, {"value": 22, "text": "22:00"}, {"value": 23, "text": "23:00"}  ];
        $scope.businessSettingView = '';
        $scope.businessAppConfig = {
            onboarding: walletConfigService.getDefaultWalletOnboardingConfig()
        };
        $scope.companyAppConfig = {};
        $scope.deactivatingBusiness = false;
        $scope.updatingBusinessDetails = true;

        vm.jsonCopy = function(obj){
            return JSON.parse(JSON.stringify(obj));
        };

        vm.fetchBusinessAppconfig = function(){
            if(vm.token){
                $http.get($scope.appServiceUrl + 'admin/company', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.companyAppConfig = res.data.data.config;
                    if(!$scope.companyAppConfig || ($scope.companyAppConfig && Object.keys($scope.companyAppConfig).length == 0)){
                        $scope.companyAppConfig = null;
                    }
                    $scope.businessAppConfig.onboarding = walletConfigService.getUpdatedWalletOnboardingConfig(vm.jsonCopy($scope.companyAppConfig), vm.jsonCopy($scope.businessAppConfig));
                    $scope.updatingBusinessDetails = false;
                }).catch(function (error) {
                    $scope.updatingBusinessDetails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getBusinessSettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.businessCompanySettings = {};
                    vm.businessCompanySettings = {};
                    $scope.businessCompanySettings = res.data.data;
                    $scope.businessCompanySettings.manager_groups.forEach(function(businessGroup, idx, arr){
                        $scope.businessCompanySettings.manager_groups[idx] = $scope.groupsList.find(function(group){return group.name === businessGroup});
                    });    
                    if($scope.appServiceUrl){
                        vm.fetchBusinessAppconfig();
                    } else {
                        $scope.updatingBusinessDetails = false; 
                    }
                }).catch(function (error) {
                    $scope.updatingBusinessDetails = false;
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
                    vm.getBusinessSettings();
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.goToBusinessServiceSetting = function (setting) {
            $scope.businessSettingView = setting;
        };        

        $scope.deactivateBusinessServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/businessService/businessServiceSettings/businessServiceDeactivation/businessDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateBusinessService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateBusinessService = function () {
            if(vm.token) {
                $scope.deactivatingBusiness = true;
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $timeout(function () {
                            $scope.deactivatingBusiness = false;
                            toastr.success('Extension has been successfully deactivated');
                            // toastr.success('Service has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingBusiness = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });              
            }
        };

        $scope.trackUpdatedBusinessSetting = function(fieldName){
            if(fieldName === 'manager_groups'){
                vm.businessCompanySettings[fieldName] = _.map($scope.businessCompanySettings[fieldName], 'name');
            } else {
                vm.businessCompanySettings[fieldName] = $scope.businessCompanySettings[fieldName];
            }
        };

        $scope.trackBusinessAppConfigSectionSelection = function(sectionName){
            var idx = $scope.businessAppConfig.onboarding.business_onboarding.hideSections.indexOf(sectionName);
            if(idx > -1){
                $scope.businessAppConfig.onboarding.business_onboarding.hideSections.splice(idx, 1);
            } else {
                $scope.businessAppConfig.onboarding.business_onboarding.hideSections.push(sectionName);                
            }
        };

        $scope.updateBusinessAppConfig = function(){
            $scope.companyAppConfig['onboarding'] = walletConfigService.getFormattedWalletOnboardingConfig(vm.jsonCopy($scope.businessAppConfig.onboarding));
            if(vm.token){
                $scope.updatingBusinessDetails = true;
                $http.patch($scope.appServiceUrl + 'admin/company/', {config: $scope.companyAppConfig}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingBusinessDetails = false;
                    toastr.success('Successfully updated business app config.');                    
                }, function (error) {
                    $scope.updatingBusinessDetails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    
                });
            }
        };
        
        $scope.updateBusinessCompanySettings = function(){
            if(vm.token){
                $scope.updatingBusinessDetails = true;
                $http.patch(vm.serviceUrl + 'admin/company/', vm.businessCompanySettings, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    toastr.success('Settings updated successfully');
                    $scope.updatingBusinessDetails = false;
                    // vm.getBusinessSettings();
                }).catch(function(error){
                    $scope.updatingBusinessDetails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.serviceId = JSON.parse(localStorageManagement.getValue('extensionsList'))["business_service"].id;
                $scope.goToBusinessServiceSetting('app-config');
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
                $scope.updatingBusinessDetails = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
