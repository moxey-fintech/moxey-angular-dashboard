(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.paymentRequestsService.paymentRequestsServiceSettings')
        .controller('PaymentRequestsServiceSettingsCtrl', PaymentRequestsServiceSettingsCtrl);

    /** @ngInject */
    function PaymentRequestsServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                 extensionsHelper,$timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.serviceId = null;
        var serviceName = "payment_requests_service";
        $rootScope.dashboardTitle = 'Payment Requests Extension | Moxey';
        $scope.paymentRequestsSettingView = '';
        $scope.deactivatingPaymentRequests = false;
        $scope.updatingExtensionDetails = true;
        $scope.updatingCompanyDetails =  true;
        $scope.paymentRequestsCompanyProcessors = [];
        $scope.company = {};
        vm.updatedCompany = {};

        vm.getCompanyDetails = function () {
            $scope.updatingCompanyDetails =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/company/configuration/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyDetails =  false;
                    $scope.company = res.data.data;
                    $scope.prevBaseRedirectURL = $scope.company.base_redirect_url;
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.companyDetailsChanged = function (field) {
            $scope.changedCompanyInfo = (
                $scope.prevBaseRedirectURL !== $scope.company.base_redirect_url
            );
            vm.updatedCompany[field] = $scope.company[field];
        };

        $scope.updateCompanyDetails = function () {
            $scope.updatingCompanyDetails =  true;
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/company/configuration/', vm.updatedCompany, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.company = {};
                    $scope.updatingCompanyDetails =  false;
                        toastr.success('Company details have been successfully updated');
                        $scope.company = res.data.data;
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getPaymentRequestsCompanyProcessors = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/company_payment_processors/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.paymentRequestsCompanyProcessors = res.data.data.results;
                    $scope.updatingExtensionDetails = false;
                }).catch(function (error) {
                    $scope.updatingExtensionDetails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.goToPaymentRequestsServiceSetting = function (setting) {
            $scope.paymentRequestsSettingView = setting;
        };        

        $scope.deactivatePaymentRequestsServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/paymentRequestsService/paymentRequestsServiceSettings/paymentRequestsServiceDeactivation/paymentRequestsDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivatePaymentRequestsService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivatePaymentRequestsService = function () {
            if(vm.token) {
                $scope.deactivatingPaymentRequests = true;
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $timeout(function () {
                            $scope.deactivatingPaymentRequests = false;
                            toastr.success('Extension has been successfully deactivated');
                            // toastr.success('Service has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingPaymentRequests = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });              
            }
        };
        
        $scope.togglePaymentRequestsProcessor = function(processor){
            if(vm.token){
                $scope.updatingExtensionDetails = true;
                processor.active = !processor.active;
                $http.patch(vm.serviceUrl + 'admin/company_payment_processors/' + processor.id + '/', {'active': processor.active}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    toastr.success('Settings updated successfully');
                    $scope.updatingExtensionDetails = false;
                }).catch(function(error){
                    $scope.updatingExtensionDetails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.serviceId = JSON.parse(localStorageManagement.getValue('extensionsList'))["payment_requests_service"].id;
                $scope.goToPaymentRequestsServiceSetting('settings');
                vm.getPaymentRequestsCompanyProcessors();
                vm.getCompanyDetails();
            })
            .catch(function(err){
                $scope.updatingPaymentRequestsDetails = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
