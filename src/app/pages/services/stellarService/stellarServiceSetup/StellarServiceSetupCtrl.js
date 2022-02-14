(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceSetup')
        .controller('StellarServiceSetupCtrl', StellarServiceSetupCtrl);

    /** @ngInject */
    function StellarServiceSetupCtrl($rootScope,$scope,$http,environmentConfig,localStorageManagement,errorHandler,$location,toastr,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "stellar_service";
        // $rootScope.dashboardTitle = 'Stellar service | Moxey';
        $rootScope.dashboardTitle = 'Stellar extension | Moxey';
        $scope.loadingStellarService = true;
        $scope.stellarConfigComplete = false;

        $scope.checkStellarServiceInitialState = function () {
            $scope.loadingStellarService = true;
            $http.get(vm.serviceUrl + 'admin/company/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingStellarService = false;
                if (res.status === 200 || res.status === 201) {
                    var stellarFullySetup = res.data.data.has_completed_setup;
                    // var stellarFullySetup = true;
                    // for(var state in res.data.data){
                    //     if(res.data.data.hasOwnProperty(state)){
                    //         if(!res.data.data[state]){
                    //             stellarFullySetup = false;
                    //         }
                    //     }
                    // }

                    if(stellarFullySetup){
                        // $location.path('/services/stellar/accounts');
                        $location.path('/extensions/stellar/accounts');
                    } else {
                        $scope.loadingStellarService = false;
                    }
                }
            }).catch(function (error) {
                $scope.loadingStellarService = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };        

        vm.updateSetupCompletionStatus = function(){
            if(vm.token){
                $http.patch(vm.serviceUrl + 'admin/company/', {has_completed_setup: true}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    $scope.loadingStellarService = false;
                    $scope.stellarConfigComplete = true;
                    // $location.path('/services/stellar/configuration');
                    $location.path('/extensions/stellar/configuration');
                }).catch(function(error){
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.checkXLMCurrency = function () {
            if(vm.token){
                $scope.loadingStellarService = true;
                $http.get(environmentConfig.API + 'admin/currencies/?archived=false&page_size=250&code=XLM', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        // if(res.data.data.results.length == 1){
                        //     vm.checkUserGroup();
                        // } else if(res.data.data.results.length == 0){
                        //     vm.createXLMCurrency();
                        // }
                        // $location.path('/services/stellar/configuration');
                        if(res.data.data.results.length == 1){
                            vm.updateSetupCompletionStatus();
                        } else if(res.data.data.results.length == 0){
                            vm.createXLMCurrency();
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingStellarService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.createXLMCurrency = function () {
            if(vm.token){
                $scope.loadingStellarService = true;
                var XLMCurrencyObj = {
                    code: "XLM",
                    description: "Stellar Lumen",
                    symbol: "*",
                    unit: "lumen",
                    divisibility: 7
                };

                $http.post(environmentConfig.API + 'admin/currencies/', XLMCurrencyObj,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        // vm.checkUserGroup();
                        vm.updateSetupCompletionStatus();
                    }
                }).catch(function (error) {
                    $scope.loadingStellarService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                // $scope.checkStellarServiceInitialState();
                $location.path('/extensions/stellar/accounts');
            })
            .catch(function(err){
                $scope.loadingStellarService = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

        /**** Uncomment for complete setup -
        vm.checkUserGroup = function () {
            if(vm.token){
                $scope.loadingStellarService = true;
                $http.get(environmentConfig.API + 'admin/groups/?name=user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(res.data.data.results.length == 1){
                            vm.checkDefaultAccConfig();
                        } else if(res.data.data.results.length == 0){
                            vm.createUserGroup();
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingStellarService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.createUserGroup = function () {
            if(vm.token){
                $scope.loadingStellarService = true;
                var UserGroupObj = {
                    name: "user",
                    label: "User",
                    public: true,
                    default: true
                };

                $http.post(environmentConfig.API + 'admin/groups/', UserGroupObj,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        vm.checkDefaultAccConfig();
                    }
                }).catch(function (error) {
                    $scope.loadingStellarService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.checkDefaultAccConfig = function () {
            if(vm.token){
                $scope.loadingStellarService = true;
                $http.get(environmentConfig.API + 'admin/groups/user/account-configurations/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        var defaultAccConfigExists = false;
                        if(res.data.data.results.length > 0){
                            res.data.data.results.forEach(function (account) {
                                if(account.name == 'default'){
                                    defaultAccConfigExists = true;
                                }
                            });
                        }

                        if(defaultAccConfigExists){
                            vm.addXLMToDefaultAccConfig();
                        } else{
                            vm.createDefaultAccConfig();
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingStellarService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.createDefaultAccConfig = function () {
            if(vm.token){
                $scope.loadingStellarService = true;
                var defaultAccConfigObj = {
                    name: "default",
                    label: "Default",
                    primary: true,
                    default: true
                };

                $http.post(environmentConfig.API + 'admin/groups/user/account-configurations/', defaultAccConfigObj,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        vm.addXLMToDefaultAccConfig();
                    }
                }).catch(function (error) {
                    $scope.loadingStellarService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.addXLMToDefaultAccConfig = function () {
            if(vm.token){
                $scope.loadingStellarService = true;
                $http.post(environmentConfig.API + 'admin/groups/user/account-configurations/default/currencies/', {currency: 'XLM'},{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.loadingStellarService = false;
                        $scope.stellarConfigComplete = true;
                    }
                }).catch(function (error) {
                    $scope.loadingStellarService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        ****/
    }
})();
