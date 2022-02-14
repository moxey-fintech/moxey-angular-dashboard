(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserStellarAddressInfoCtrl', UserStellarAddressInfoCtrl);

    /** @ngInject */
    function UserStellarAddressInfoCtrl($scope,Rehive,$stateParams,localStorageManagement,$http,errorHandler,environmentConfig,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserStellarInfo = false;
        $scope.stellarUrl = "";


        vm.getUser = function(){
            if(vm.token) {
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.user = res;
                    vm.getStellarUser();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserStellarInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getStellarUser = function() {
            if(vm.token){
                var stellarUrl = $scope.stellarUrl + 'admin/users/?' + serializeFiltersService.serializeFilters({
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
                        $scope.user.federation_address = user.crypto ? user.crypto.reference : null;
                        $scope.user.stellar_memo = user.crypto ? user.crypto.memo : user.memo;
                        
                        $scope.loadingUserStellarInfo = false;
                        if(user.crypto){
                            $scope.user.stellar_public_address = user.crypto.public_address ? user.crypto.public_address : null;
                        }
                        else {
                            $scope.loadingUserStellarInfo = true;
                            vm.getStellarWarmstorage();
                        }
                    }
                    else{
                        $scope.user.federation_address = null;
                        $scope.user.stellar_memo = null;
                        $scope.user.stellar_public_address = null;
                        $scope.loadingUserStellarInfo = false;
                    }
                                        
                }).catch(function (error) {
                    $scope.loadingUserStellarInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getStellarWarmstorage = function(){
            if(vm.token) {
                var publicAddressUrl = $scope.stellarUrl + 'admin/warmstorage/accounts/?' +
                serializeFiltersService.serializeFilters({
                    page: 1,
                    page_size: 25
                });

                $http.get(publicAddressUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.user.stellar_public_address = res.data.data.results[0];
                        $scope.loadingUserStellarInfo = false;
                    }
                    else{
                        vm.getStellarHotWallet();
                    }                    
                }).catch(function (error) {
                    $scope.loadingUserStellarInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getStellarHotWallet = function(){
            if(vm.token) {
                var url = $scope.stellarUrl + 'admin/stellar_accounts/?' +
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
                    $scope.user.stellar_public_address = res.data.data.results.length > 0 ? res.data.data.results[0].account_address : null;
                    $scope.loadingUserStellarInfo = false;                   
                }).catch(function (error) {
                    $scope.loadingUserStellarInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


        vm.getServices = function(){
            if(vm.token){
                $scope.loadingUserStellarInfo = true;
                $http.get(environmentConfig.API + 'admin/services/?active=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var servicesList =  res.data.data.results;
                    if(servicesList.length > 0){
                        for(var i = 0; i < servicesList.length; ++i){
                            if(servicesList[i].slug === 'stellar_service'){
                                $scope.stellarUrl = servicesList[i].url;
                                vm.getUser();
                                break;
                            }                                
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserStellarInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getServices();
    }
})();
