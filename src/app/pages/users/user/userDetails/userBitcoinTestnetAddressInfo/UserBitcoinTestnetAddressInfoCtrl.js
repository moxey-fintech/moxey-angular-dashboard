(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBitcoinTestnetAddressInfoCtrl', UserBitcoinTestnetAddressInfoCtrl);

    /** @ngInject */
    function UserBitcoinTestnetAddressInfoCtrl($scope,Rehive,$stateParams,localStorageManagement,$http,errorHandler,environmentConfig,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserBitcoinTestnetInfo = false;
        $scope.bitcoinTestnetUrl = "";
        
        vm.getServices = function(){
            if(vm.token){
                $scope.loadingUserBitcoinTestnetInfo = true;
                $http.get(environmentConfig.API + 'admin/services/?active=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.cryptoExtensions = {};
                    var servicesList =  res.data.data.results;
                    if(servicesList.length > 0){
                        for(var i = 0; i < servicesList.length; ++i){
                            if(servicesList[i].slug === 'bitcoin_testnet_service'){
                                $scope.bitcoinTestnetUrl = servicesList[i].url;
                                vm.getUser();
                                break;
                            }                                
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserBitcoinTestnetInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getServices();

        vm.getUser = function(){
            if(vm.token) {
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.user = res;
                    vm.getBitcoinTestnetUser();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserBitcoinTestnetInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getBitcoinTestnetUser = function() {
            if(vm.token){
                var bitcoinUrl = $scope.bitcoinTestnetUrl + 'admin/users/?' + serializeFiltersService.serializeFilters({
                    // page: 1,
                    // page_size: 250,
                    identifier: $scope.user.id
                });

                $http.get(bitcoinUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var user = res.data.data.results[0];
                    if(user){
                        $scope.user.bitcoin_testnet_public_address = user.crypto ? user.crypto.address : null;
                    }
                    else {
                        $scope.user.bitcoin_testnet_public_address = null;
                    }
                    $scope.loadingUserBitcoinTestnetInfo = false;
                }).catch(function (error) {
                    $scope.loadingUserBitcoinTestnetInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        
    }
})();
