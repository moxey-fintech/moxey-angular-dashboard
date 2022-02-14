(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceJSONConfig')
        .controller('AppServiceJSONConfigCtrl', AppServiceJSONConfigCtrl);

    /** @ngInject */
    function AppServiceJSONConfigCtrl($scope,Rehive,$rootScope,environmentConfig,$http,$location,
                             $timeout,toastr,localStorageManagement,errorHandler,extensionsHelper, $state) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceId = null;
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        $scope.loadingWalletJSON = true;
        $scope.companySettings = {
            config : null
        };
        vm.updatedCompanyInfo = {};
        $scope.editorEnabled= false;

        $scope.codemirrorEditorOptions = {
            lineWrapping : true,
            lineNumbers: true,
            theme: 'monokai',
            autoCloseTags: true,
            smartIndent: false,
            mode: 'xml',
            height: 'auto'
        };

        $scope.enableEditor = function() {
            //used to refresh the codemirror element to display latest ng-model
            $scope.editorEnabled = true;
        };

        vm.getCompanyInfo = function () {
            if(vm.token) {
                $scope.loadingWalletJSON = true;
                $http.get(vm.serviceUrl + 'admin/company', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data && res.data.data.config){
                        $scope.companySettings = res.data.data;
                        if(Object.keys($scope.companySettings.config).length == 0){
                            $scope.companySettings.config = '';
                        } else {
                            $scope.companySettings.config = JSON.stringify($scope.companySettings.config, null, 4);
                        }
                    }
                    $scope.enableEditor();
                    $scope.loadingWalletJSON = false;
                }).catch(function (error) {
                    $scope.loadingWalletJSON = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.companyInfoChanged = function(field){
            if(field == 'public'){
                $scope.companySettings[field] = !$scope.companySettings[field];
            }
            vm.updatedCompanyInfo[field] = $scope.companySettings[field];
        };

        var isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.updateCompanyInfo = function () {
            $scope.loadingWalletJSON = true;
            //reintailize scopes
            $scope.editorEnabled = false;
            $scope.company = {
                details : {
                    settings: {}
                }
            };

            if(vm.updatedCompanyInfo.config){
                if(isJson(vm.updatedCompanyInfo.config)){
                    vm.updatedCompanyInfo.config = JSON.parse(vm.updatedCompanyInfo.config);
                } else {
                    toastr.error('Must be a valid json object','Config');
                    vm.updatedCompanyInfo.config = $scope.companySettings.config;
                    vm.getCompanyInfo();
                    return;
                }
            } else if(vm.updatedCompanyInfo.config ===''){
                vm.updatedCompanyInfo.config = {};
            }
            
            $http.patch(vm.serviceUrl + 'admin/company/', {config: vm.updatedCompanyInfo.config}, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                vm.updatedCompanyInfo = {};
                toastr.success('You have successfully updated the company info');
                $scope.loadingWalletJSON = false;
            }, function (error) {
                $scope.loadingWalletJSON = false;
                vm.updatedCompanyInfo = {};
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getCompanyInfo();
            })
            .catch(function(err){
                $scope.loadingWalletJSON = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
