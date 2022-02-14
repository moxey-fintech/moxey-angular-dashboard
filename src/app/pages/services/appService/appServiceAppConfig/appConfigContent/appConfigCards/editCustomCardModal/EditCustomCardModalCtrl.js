(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .controller('EditCustomCardModalCtrl', EditCustomCardModalCtrl);

    function EditCustomCardModalCtrl($scope,$uibModalInstance,toastr,companyInfo, walletCardsConfig,card,$rootScope,
                                   Rehive,localStorageManagement,errorHandler,_,extensionsHelper, $http, $location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        $scope.cardImageOptions = ["alert","blocks-card","circles-card","custom","info","product","reward"];
        $scope.companyInfo = companyInfo;
        $scope.walletCardsConfig = walletCardsConfig;
        $scope.card = card;
        $scope.updatingCustomCard = true;
        $scope.editCardParams = $scope.walletCardsConfig.home.custom.find(function (customCard) {
            return customCard.id == $scope.card.id;
        });

        $scope.toggleCardDismissable = function(){
            $scope.editCardParams.dismiss = !$scope.editCardParams.dismiss;
        };

        $scope.updateCustomCardConfig = function() {
            if ($scope.editCardParams.optionSelected !== 'custom') {
                $scope.editCardParams.image = $scope.editCardParams.optionSelected;
            }

            $scope.walletCardsConfig.home.custom.forEach(function (customCard, idx, arr) {
                if(customCard.id === $scope.editCardParams.id){
                    $scope.walletCardsConfig.home.custom[idx] = $scope.editCardParams;
                    return false;
                }
            });

            if (!$scope.companyInfo.config) { $scope.companyInfo.config = {}; }
            if (!$scope.companyInfo.config.cards) { $scope.companyInfo.config.cards = {}; }

            $scope.companyInfo.config.cards = _.merge({}, $scope.companyInfo.config.cards, $scope.walletCardsConfig);

            if (vm.token) {
                $scope.updatingCustomCard = true;
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCustomCard = false;
                    toastr.success('Successfully updated company cards config.');
                    $uibModalInstance.close(res);
                     
                }, function (error) {
                    $scope.updatingCustomCard = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                     
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.updatingCustomCard = false;
            })
            .catch(function(err){
                $scope.updatingCustomCard = false;
                toastr.error("Extension not activated for company");
                $uibModalInstance.close();
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
