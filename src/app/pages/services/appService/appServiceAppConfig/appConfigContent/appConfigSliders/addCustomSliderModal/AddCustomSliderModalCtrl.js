(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .controller('AddCustomSliderModalCtrl', AddCustomSliderModalCtrl);

    function AddCustomSliderModalCtrl($scope,$uibModalInstance,toastr,companyInfo, walletSlidersConfig,$rootScope,
                                    Rehive,localStorageManagement,errorHandler,_,sliderType, customMerger,extensionsHelper, $http, $location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        $scope.companyInfo = companyInfo;
        $scope.customMerger = customMerger;
        $scope.walletSlidersConfig = walletSlidersConfig;
        $scope.sliderType = sliderType;
        $scope.modalTitle = $scope.sliderType === 'preAuth' ? "app welcome" : $scope.sliderType === 'auth' ? "landing page" : "post-registration";
        $scope.addingCustomSlider = true;
        $scope.newSliderParams = {
            id: $scope.walletSlidersConfig[$scope.sliderType].length,
            image: "",
            title: "",
            description: "",
        };

        $scope.addCustomSliderToConfig = function(){
            if(!$scope.newSliderParams.title || $scope.newSliderParams.title === ""){
                toastr.error("Please enter a slider title"); return;
            }

            $scope.walletSlidersConfig[$scope.sliderType].push($scope.newSliderParams);

            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; } 
            if(!$scope.companyInfo.config.sliders) { $scope.companyInfo.config.sliders = {}; }

            $scope.companyInfo.config.sliders = _.mergeWith(
                {}, $scope.companyInfo.config.sliders, $scope.walletSlidersConfig, $scope.customMerger
            );

            if(vm.token){
                $scope.addingCustomSlider = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingCustomSlider = false;
                    toastr.success('Successfully updated company sliders config.');
                    $uibModalInstance.close(res);
                     
                }, function (error) {
                    $scope.addingCustomSlider = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                     
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.addingCustomSlider = false;
            })
            .catch(function(err){
                $scope.addingCustomSlider = false;
                toastr.error("Extension not activated for company");
                $uibModalInstance.close();
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
