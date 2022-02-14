(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .controller('AddCustomCardModalCtrl', AddCustomCardModalCtrl);

    function AddCustomCardModalCtrl($scope,$uibModalInstance,toastr,companyInfo, walletCardsConfig,$rootScope,
                                    Rehive,localStorageManagement,errorHandler,_,extensionsHelper, $http, $location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        $scope.cardImageOptions = ["alert","blocks-card","circles-card","custom","info","product","reward"];
        $scope.companyInfo = companyInfo;
        $scope.walletCardsConfig = walletCardsConfig;
        $scope.addingCustomCard = true;
        $scope.newCardParams = {
            id: $scope.walletCardsConfig.home.custom.length,
            image: "",
            title: "",
            dismiss: false,
            description: "",
            optionSelected: "blocks-card"
        };

        $scope.toggleCardDismissable = function(){
            $scope.newCardParams.dismiss = !$scope.newCardParams.dismiss;
        };

        $scope.addCustomCardToConfig = function(){
            if($scope.newCardParams.optionSelected !== 'custom'){
                $scope.newCardParams.image = $scope.newCardParams.optionSelected;
            }

            $scope.walletCardsConfig.home.custom.push($scope.newCardParams);

            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; } 
            if(!$scope.companyInfo.config.cards) { $scope.companyInfo.config.cards = {}; }

            // $scope.companyInfo.config.cards = mergeHandlerService.deepMerge($scope.companyInfo.config.cards, $scope.walletCardsConfig);
            $scope.companyInfo.config.cards = _.merge({}, $scope.companyInfo.config.cards, $scope.walletCardsConfig);

            if(vm.token){
                $scope.addingCustomCard = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingCustomCard = false;
                    toastr.success('Successfully updated company cards config.');
                    $uibModalInstance.close(res);
                     
                }, function (error) {
                    $scope.addingCustomCard = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                     
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.addingCustomCard = false;
            })
            .catch(function(err){
                $scope.addingCustomCard = false;
                toastr.error("Extension not activated for company");
                $uibModalInstance.close();
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
