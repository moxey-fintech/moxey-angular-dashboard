(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService.stripeServiceSettings')
        .controller('StripeServiceSettingsCtrl', StripeServiceSettingsCtrl);

    /** @ngInject */
    function StripeServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,$state,extensionsHelper,
                                    $timeout,toastr,$location,errorHandler,Rehive,_,$uibModal, serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.serviceId = null;
        var serviceName = "stripe_service";
        $rootScope.dashboardTitle = 'Stripe extension | Moxey';
        $scope.stripeSettingView = '';
        $scope.updatingStripeDetails = true;
        $scope.deactivatingStripe = false;
        $scope.currenciesList = [];
        $scope.stripeCompanySettings = {};
        vm.stripeCompanySettings = {};

        vm.getCompanyCurrencies = function() {
            if(vm.token) {
                $http.get(environmentConfig.API + 'admin/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.currenciesList = res.data.data.results;
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToStripeSetting = function (setting) {
            $scope.stripeSettingView = setting;
        };

        $scope.deactivateStripeConfirm = function () {
            $ngConfirm({
                title: 'Deactivate Stripe extension',
                contentUrl: 'app/pages/services/stripeService/stripeServiceSettings/stripeServiceDeactivation/stripeDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateStripeService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateStripeService = function () {
            if(vm.token) {
                $scope.deactivatingStripe = true; 
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $timeout(function () {
                                $scope.deactivatingStripe = false;
                                toastr.success('Extension has been successfully deactivated');
                                $location.path('/extensions');
                            },600);
                        }
                    }).catch(function (error) {
                        $scope.deactivatingStripe = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
            }
        };
        
        vm.getStripeSettings = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.stripeCompanySettings = {};
                    vm.stripeCompanySettings = {};
                    $scope.stripeCompanySettings = res.data.data;
                    $scope.updatingStripeDetails = false;
                }).catch(function (error) {
                    $scope.updatingStripeDetails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.trackUpdatedStripeSetting = function(fieldName){
            if(fieldName === 'stripe_currencies'){
                vm.stripeCompanySettings[fieldName] = _.map($scope.stripeCompanySettings[fieldName], 'code');
            } else {
                vm.stripeCompanySettings[fieldName] = $scope.stripeCompanySettings[fieldName];
            }
        };
        
        $scope.updateStripeCompanySettings = function(){
            if(vm.token){
                $scope.updatingStripeDetails = true;
                $http.patch(vm.serviceUrl + 'admin/company/', vm.stripeCompanySettings, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    toastr.success('Settings updated successfully');
                    vm.getStripeSettings();
                }).catch(function(error){
                    $scope.updatingStripeDetails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.serviceId = extensionsHelper.getActiveServiceId(serviceName);
                if(!vm.serviceId){
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                }
                $scope.goToStripeSetting('settings');
                vm.getCompanyCurrencies();
                vm.getStripeSettings();
            })
            .catch(function(err){
                $scope.updatingStripeDetails = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
       
    }
})();
