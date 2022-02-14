(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserStellarTestnetAddressInfoCtrl', UserStellarTestnetAddressInfoCtrl);

    /** @ngInject */
    function UserStellarTestnetAddressInfoCtrl($scope,Rehive,$stateParams,localStorageManagement,$http,errorHandler,environmentConfig,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserStellarTestnetInfo = false;
        $scope.stellarTestnetUrl = "";        

        vm.getUser = function(){
            if(vm.token) {
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.user = res;
                    vm.getStellarTestnetUser();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserStellarTestnetInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getStellarTestnetUser = function() {
            if(vm.token){
                var stellarUrl = $scope.stellarTestnetUrl + 'admin/users/?' + serializeFiltersService.serializeFilters({
                    // page: 1,
                    // page_size: 250,
                    identifier: $scope.user.id
                });

                $http.get(stellarUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var user = res.data.data.results[0];
                    
                    if(user){
                        $scope.user.testnet_federation_address = user.crypto ? user.crypto.reference : null;
                        $scope.user.stellar_testnet_memo = user.crypto ? user.crypto.memo : user.memo;
                        
                        $scope.loadingUserStellarTestnetInfo = false;
                        if(user.crypto){
                            $scope.user.stellar_testnet_public_address = user.crypto.public_address ? user.crypto.public_address : null;
                        }
                        else {
                            vm.getStellarWarmstorage();
                        }
                    }
                    else{
                        $scope.user.testnet_federation_address = null;
                        $scope.user.stellar_testnet_memo = null;
                        $scope.user.stellar_testnet_public_address = null;
                        $scope.loadingUserStellarInfo = false;
                    }
                }).catch(function (error) {
                    $scope.loadingUserStellarTestnetInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        vm.getStellarTestnetWarmstorage = function(){
            if(vm.token) {
                $scope.loadingUserStellarTestnetInfo = true;
                var publicAddressUrl = $scope.stellarTestnetUrl + 'admin/warmstorage/accounts/?' +
                serializeFiltersService.serializeFilters({
                    page: 1,
                    page_size: 250
                });

                $http.get(publicAddressUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.user.stellar_testnet_public_address = res.data.data.results[0];
                        $scope.loadingUserStellarTestnetInfo = false;
                    }
                    else{
                        vm.getStellarHotWallet();
                    }                    
                }).catch(function (error) {
                    $scope.loadingUserStellarTestnetInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getStellarHotWallet = function(){
            if(vm.token) {
                var url = $scope.stellarTestnetUrl + 'admin/stellar_accounts/?' +
                serializeFiltersService.serializeFilters({
                    page: 1,
                    page_size: 25
                });

                $http.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.user.stellar_testnet_public_address = res.data.data.results.length > 0 ? res.data.data.results[0].account_address : null;
                    $scope.loadingUserStellarTestnetInfo = false;                   
                }).catch(function (error) {
                    $scope.loadingUserStellarTestnetInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getServices = function(){
            if(vm.token){
                $scope.loadingUserStellarTestnetInfo = true;
                $http.get(environmentConfig.API + 'admin/services/?active=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var servicesList =  res.data.data.results;
                    if(servicesList.length > 0){
                        for(var i = 0; i < servicesList.length; ++i){
                            if(servicesList[i].slug === 'stellar_testnet_service'){
                                $scope.stellarTestnetUrl = servicesList[i].url;
                                vm.getUser();
                                break;
                            }                                
                        }
                    }
                    else {
                        $scope.loadingUserStellarTestnetInfo = false;
                    }
                }).catch(function (error) {
                    $scope.loadingUserStellarTestnetInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getServices();
    }
})();
