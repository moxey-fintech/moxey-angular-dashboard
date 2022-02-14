(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .controller('EditCustomSliderModalCtrl', EditCustomSliderModalCtrl);

    function EditCustomSliderModalCtrl($scope,$uibModalInstance,toastr,companyInfo, walletSlidersConfig,$rootScope,
                                   Rehive,localStorageManagement,errorHandler,_,sliderObj,customMerger,extensionsHelper, $http, $location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        $scope.companyInfo = companyInfo;
        $scope.walletSlidersConfig = walletSlidersConfig;
        $scope.customMerger = customMerger;
        $scope.sliderType = sliderObj.type;
        $scope.sliderId = sliderObj.sliderId;
        $scope.modalTitle = $scope.sliderType === 'preAuth' ? "app welcome" : $scope.sliderType === 'auth' ? "landing page" : "post-registration";
        $scope.updatingCustomSlider = true;
        $scope.editSliderParams = $scope.walletSlidersConfig[$scope.sliderType].find(function (customSlider) {
            return customSlider.id === $scope.sliderId;
        });

        $scope.updateCustomSliderConfig = function() {
            if(!$scope.editSliderParams.title || $scope.editSliderParams.title === ""){
                toastr.error("Please enter a slider title"); return;
            }

            $scope.walletSlidersConfig[$scope.sliderType].forEach(function (customSlider, idx, arr) {
                if(customSlider.id === $scope.editSliderParams.id){
                    $scope.walletSlidersConfig[$scope.sliderType][idx] = $scope.editSliderParams;
                    return false;
                }
            });

            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; } 
            if(!$scope.companyInfo.config.sliders) { $scope.companyInfo.config.sliders = {}; }

            $scope.companyInfo.config.sliders = _.mergeWith(
                {}, $scope.companyInfo.config.sliders, $scope.walletSlidersConfig, $scope.customMerger
            );

            if (vm.token) {
                $scope.updatingCustomSlider = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCustomSlider = false;
                    toastr.success('Successfully updated company slider config.');
                    $uibModalInstance.close(res);
                     
                }, function (error) {
                    $scope.updatingCustomSlider = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                     
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.updatingCustomSlider = false;
            })
            .catch(function(err){
                $scope.updatingCustomSlider = false;
                toastr.error("Extension not activated for company");
                $uibModalInstance.close();
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
