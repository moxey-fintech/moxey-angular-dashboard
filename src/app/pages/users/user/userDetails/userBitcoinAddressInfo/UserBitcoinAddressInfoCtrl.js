(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBitcoinAddressInfoCtrl', UserBitcoinAddressInfoCtrl);

    /** @ngInject */
    function UserBitcoinAddressInfoCtrl($scope,Rehive,$stateParams,localStorageManagement,$http,errorHandler,environmentConfig,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserBitcoinInfo = false;
        $scope.bitcoinUrl = "";

        vm.getServices = function(){
            if(vm.token){
                $scope.loadingUserBitcoinInfo = true;
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
                            if(servicesList[i].slug === 'bitcoin_service'){
                                $scope.bitcoinUrl = servicesList[i].url;
                                vm.getUser();
                                break;
                            }                                
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserBitcoinInfo = false;
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
                    vm.getBitcoinUser();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserBitcoinInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getBitcoinUser = function() {
            if(vm.token){
                var bitcoinUrl = $scope.bitcoinUrl + 'admin/users/?' + serializeFiltersService.serializeFilters({
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
                        $scope.user.bitcoin_public_address = user.crypto ? user.crypto.address : null;
                    }
                    else {
                        $scope.user.bitcoin_public_address = null;
                    }
                    $scope.loadingUserBitcoinInfo = false;
                }).catch(function (error) {
                    $scope.loadingUserBitcoinInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };       
    }
})();
