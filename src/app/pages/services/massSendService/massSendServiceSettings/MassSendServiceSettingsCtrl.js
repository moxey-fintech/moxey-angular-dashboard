(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.massSendService.massSendServiceSettings')
        .controller('MassSendServiceSettingsCtrl', MassSendServiceSettingsCtrl);

    /** @ngInject */
    function MassSendServiceSettingsCtrl(environmentConfig,$rootScope,$scope,$http,$ngConfirm,$timeout,$location,serializeFiltersService,
                                             localStorageManagement,toastr,errorHandler,Upload,extensionsHelper) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceId = null;
        var serviceName = "batch_send_service";
        $rootScope.dashboardTitle = 'Mass Send Extension | Moxey';
        $scope.massSendServiceViews = '';
        $scope.updatingMassSendSettings = true;
        $scope.loadingMassSendHistory = true;
        $scope.massSendHistory = [];
        $scope.massSendCsv = null;
        $scope.massSendPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.goToMassSendSetting = function (setting) {
            $scope.massSendServiceViews = setting;
        };

        $scope.deactivateServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/massSendService/massSendServiceSettings/massSendServiceDeactivation/deactivateMassSendPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateService();
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateService = function () {
            if(vm.token) {
                $scope.updatingMassSendSettings = true;
                $http.patch(environmentConfig.API + 'admin/services/' + vm.serviceId + '/',{active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $timeout(function () {
                            $scope.updatingMassSendSettings = false;
                            toastr.success('Extension has been successfully deactivated');
                            // toastr.success('Service has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.updatingMassSendSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.uploadCsv = function () {
            if(!$scope.massSendCsv.name){
                return;
            }
            $scope.updatingMassSendSettings = true;

            var uploadDataObj = {
                file: $scope.massSendCsv.name ? $scope.massSendCsv : null,
                section: "admin"
            };

            Upload.upload({
                url: vm.serviceUrl + 'admin/uploads/',
                data: serializeFiltersService.objectFilters(uploadDataObj),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "POST"
            }).then(function (res) {
                setTimeout(function(){
                    $scope.updatingMassSendSettings = false; 
                    toastr.success('Mass send executed successfully');
                    $scope.getMassSendHistory();
                    $scope.massSendCsv = null;
                },10);
            }).catch(function (error) {
                $scope.updatingMassSendSettings = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getMassSendUrl = function(){
            var searchObj = {
                page: $scope.massSendPagination.pageNo,
                page_size: $scope.massSendPagination.itemsPerPage || 25,
                section: "admin"
            };

            return vm.serviceUrl + 'admin/uploads/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getMassSendHistory = function (applyFilter) {
            $scope.loadingMassSendHistory = true;
            
            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.massSendPagination.pageNo = 1;
            }
            
            if ($scope.massSendHistory.length > 0) {
                $scope.massSendHistory.length = 0;
            }
            
            var massSendUrl = vm.getMassSendUrl();
            
            if(vm.token) {
                $http.get(massSendUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.massSendHistoryData = res.data.data;
                        $scope.massSendHistory = $scope.massSendHistoryData.results;
                    }
                    $scope.loadingMassSendHistory= false;
                }).catch(function (error) {
                    $scope.loadingMassSendHistory = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.serviceId = JSON.parse(localStorageManagement.getValue('extensionsList'))["batch_send_service"].id;
                $scope.goToMassSendSetting('instructions');
                $scope.getMassSendHistory();
                $scope.updatingMassSendSettings = false;
            })
            .catch(function(err){
                $scope.updatingMassSendSettings = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
