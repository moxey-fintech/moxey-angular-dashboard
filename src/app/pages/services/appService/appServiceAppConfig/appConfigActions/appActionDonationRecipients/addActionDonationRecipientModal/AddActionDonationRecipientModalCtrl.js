(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.appService.appServiceAppConfig')
        .controller('AddActionDonationRecipientModalCtrl', AddActionDonationRecipientModalCtrl);

    function AddActionDonationRecipientModalCtrl($scope,$uibModalInstance,toastr,companyInfo,walletConfigService,walletActionsConfig,$rootScope,
                                    Rehive,localStorageManagement,errorHandler,_,customMerger, extensionsHelper, $http, $location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "app_service";
        $rootScope.dashboardTitle = 'App extension | Moxey';
        $scope.companyInfo = companyInfo;
        $scope.customMerger = customMerger;
        $scope.walletActionsConfig = walletActionsConfig;
        $scope.addingDonationRecipient = true;
        $scope.newRecipientParams = {
            name: null,
            email: null,
            profile: null
        };

        $scope.addDonationRecipient = function(){
            if(!$scope.newRecipientParams.name){
                toastr.error("Please enter a recipient name");
                return;
            }
            $scope.walletActionsConfig.donate.config.users.push($scope.newRecipientParams);            
            
            if(!$scope.companyInfo.config){ $scope.companyInfo.config = {}; } 
            if(!$scope.companyInfo.config.actions) { $scope.companyInfo.config.actions = {}; }            
            
            var walletActionsConfig = walletConfigService.getFormattedWalletActionsConfig($scope.walletActionsConfig);
            if(typeof walletActionsConfig === "string" && walletActionsConfig === "invalidWithdrawPairs"){
                toastr.error("Invalid withdraw pairs. Please provide valid currencies for withdraw pairs.");
                return false;
            }
            $scope.companyInfo.config.actions = _.mergeWith({}, $scope.companyInfo.config.actions, walletActionsConfig, $scope.customMerger);

            if(vm.token){
                $scope.addingDonationRecipient = true;                
                $http.patch(vm.serviceUrl + 'admin/company/', {config: $scope.companyInfo.config}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingDonationRecipient = false;
                    toastr.success('Successfully updated company actions config.');
                    $uibModalInstance.close(res);
                     
                }, function (error) {
                    $scope.addingDonationRecipient = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                     
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.addingDonationRecipient = false;
            })
            .catch(function(err){
                $scope.addingDonationRecipient = false;
                toastr.error("Extension not activated for company");
                $uibModalInstance.close();
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
