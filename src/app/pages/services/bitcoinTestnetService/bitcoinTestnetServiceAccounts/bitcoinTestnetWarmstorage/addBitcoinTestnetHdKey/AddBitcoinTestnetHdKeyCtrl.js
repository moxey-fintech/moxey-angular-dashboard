(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService.bitcoinTestnetServiceAccounts')
        .controller('AddBitcoinTestnetHdKeyCtrl', AddBitcoinTestnetHdKeyCtrl);

    /** @ngInject */
    function AddBitcoinTestnetHdKeyCtrl($scope,$http,localStorageManagement,toastr,errorHandler,$ngConfirm,$uibModalInstance,extensionsHelper,$location) {


        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.serviceUrl = null;
        var serviceName = "bitcoin_testnet_service";
        // vm.serviceUrl = "https://bitcoin-testnet.services.rehive.io/api/1/";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingHdkeys = true;
        $scope.newHdKey = {
            primary: false,
            key_type: 'xpub'
        };
        $scope.keyTypeOptions = ['xpub','xpriv'];

        $scope.toggleAddHdkeyView = function(){
            $scope.addingHdkey = !$scope.addingHdkey;
        };

        $scope.$dismiss = function(){
            $uibModalInstance.close();
        };

        $scope.createHdKey = function(newHdKey){
            $scope.loadingHdkeys =  true;
            newHdKey.key_type = 'xpub';
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/hdkeys/',newHdKey, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.newHdKey = {
                        primary: false,
                        key_type: 'xpub'
                    };
                    toastr.success('Public key successfully created');
                    $scope.loadingHdkeys =  false;
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.newHdKey = {
                        primary: false,
                        key_type: 'xpub'
                    };
                    $scope.loadingHdkeys =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
                .then(function(serviceUrl){
                    vm.serviceUrl = serviceUrl;
                    $scope.loadingHdkeys = false;
                })
                .catch(function(err){
                    $scope.loadingHdkeys = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                    $uibModalInstance.close();
                });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
