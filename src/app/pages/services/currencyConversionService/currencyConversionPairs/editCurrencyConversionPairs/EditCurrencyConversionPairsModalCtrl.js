(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionPairList')
        .controller('EditCurrencyConversionPairsModalCtrl', EditCurrencyConversionPairsModalCtrl);

    function EditCurrencyConversionPairsModalCtrl($scope,conversionPair,$http,localStorageManagement,$location,extensionsHelper,
        toastr,errorHandler,cleanObject,typeaheadService,$uibModalInstance,Rehive,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        vm.editConversionObj = conversionPair;
        $scope.editConversionPairObj = null;
        $scope.editingPair = true;
        $scope.pathPlaceholder = "e.g {{ rates|get:'USD:EUR' }}"; 
        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getAccountsReferenceTypeahead = typeaheadService.getAccountsReferenceTypeahead();
        $scope.editingConversionPair = false;
        $scope.loadingAccounts = false;
        $scope.searchAccountBy = 'user';
        $scope.conversionPairUserAccounts = null;
        $scope.conversionPairReferenceAccounts = null;
        $scope.showEmailSearchAccounts = false;
        $scope.showRefSearchAccounts = false;
        $scope.showRefSearchAccounts = false;
        $scope.conversionPairUserEmail = null;
        $scope.conversionPairAccountRef = null;
        $scope.searchAccount = false;
        $scope.searchUser = false;
        $scope.noOperationalAccount = false;
        $scope.showAdvancedOption = false;

        $scope.toggleAdvancedOption = function(){
            $scope.showAdvancedOption = !$scope.showAdvancedOption;
        };

        vm.getConversionPair = function(){
            if(vm.token){
                $scope.editingConversionPair = true;
                $http.get(vm.baseUrl + 'admin/conversion-pairs/' + vm.editConversionObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editConversionPairObj = res.data.data;
                    $scope.editConversionPairObj.fromCurrency = $scope.editConversionPairObj.key.split(':')[0];
                    $scope.editConversionPairObj.toCurrency = $scope.editConversionPairObj.key.split(':')[1];
                    $scope.editConversionPairObj.option = $scope.editConversionPairObj.rate ? "rate" : $scope.editConversionPairObj.path ? "path" : "auto";
                    $scope.editingConversionPair = false;
                    vm.getOperationalAccount($scope.editConversionPairObj.operational_account);
                }).catch(function (error) {
                    $scope.editingConversionPair = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        vm.getOperationalAccount = function(reference){
            if(vm.token){
                $scope.loadingAccounts = true;
                Rehive.admin.accounts.get({filters: {reference: reference}}).then(function (res) {
                    $scope.conversionPairAccountRef = '';
                    $scope.conversionPairUserEmail = '';
                    if(res.results && res.results.length > 0){
                        var conversionAccount = res.results[0];
                        if(conversionAccount.user){
                            $scope.conversionPairUserEmail = conversionAccount.user.email;
                            $scope.searchAccountBy = 'user';
                            $scope.getUserAccounts($scope.conversionPairUserEmail);
                        } else {
                            $scope.conversionPairAccountRef = conversionAccount.reference;
                            $scope.searchAccountBy = 'reference';
                            $scope.getReferenceAccounts($scope.conversionPairAccountRef);
                        }  
                    }  else {
                        $scope.noOperationalAccount = true;
                    }                
                    $scope.loadingAccounts = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.getReferenceAccounts = function(accountReference){            
            if(vm.token){
                var filtersObj = {
                    page_size: 250
                };
                
                if(accountReference){
                    filtersObj.reference = accountReference;
                }
                $scope.loadingAccounts = true;
                Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.conversionPairReferenceAccounts = [];
                        $scope.conversionPairReferenceAccounts = res.results.slice();
                        if($scope.conversionPairReferenceAccounts.length > 0){
                            $scope.showRefSearchAccounts = true;
                            $scope.searchAccount = false;
                            $scope.editConversionPairObj.operational_account = $scope.conversionPairReferenceAccounts.find(function(account){
                                return account.reference === accountReference;
                            });                           
                        }
                    } 
                    $scope.loadingAccounts = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }            
        };

        $scope.getUserAccounts = function(userEmail){            
            if(vm.token){
                var filtersObj = {
                    page_size: 250
                };
                
                if(userEmail){
                    filtersObj.user = userEmail;
                }
                $scope.loadingAccounts = true;
                Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.conversionPairUserAccounts = [];
                        $scope.conversionPairUserAccounts = res.results.slice();
                        if($scope.conversionPairUserAccounts.length > 0){
                            $scope.showEmailSearchAccounts = true;
                            $scope.searchUser = false;
                            var accountFound = false;
                            $scope.conversionPairUserAccounts.forEach(function(account){
                                if(account.reference === $scope.editConversionPairObj.operational_account){
                                    $scope.editConversionPairObj.operational_account = account;
                                    accountFound = true;
                                    return false;
                                }
                            });   
                            if(!accountFound){
                                $scope.editConversionPairObj.operational_account = $scope.conversionPairUserAccounts[0];
                            }
                        }
                    } 
                    $scope.loadingAccounts = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }            
        };

        $scope.emailChanging = function(){
            $scope.showEmailSearchAccounts = false;
            $scope.searchUser = false;
        };

        $scope.onUserSelect = function($model){
            $scope.searchUser = true;
            $scope.conversionPairUserEmail = $model;           
        };

        $scope.triggerSearchByUser = function(){
            $scope.getUserAccounts($scope.conversionPairUserEmail);
        };

        $scope.referenceChanging = function(){
            $scope.showRefSearchAccounts = false;
            $scope.searchAccount = false;
        };

        $scope.onReferenceSelect = function($model) {
            $scope.searchAccount = true;
            $scope.conversionPairAccountRef = $model;
        };

        $scope.triggerSearchByReference = function(){   
            $scope.getReferenceAccounts($scope.conversionPairAccountRef);
        };

        $scope.openAddAccountModal = function(page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NewAccountModalCtrl',
                scope: $scope,
                resolve: {
                    userEmail: function() {
                        return $scope.conversionPairUserEmail;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getUserAccounts($scope.conversionPairUserEmail);
                }
            }, function(){
            });
        };

        $scope.updateConversionPair = function(){

            if($scope.editConversionPairObj.option  === "rate" && $scope.editConversionPairObj.rate == 0){
                toastr.error("Conversion pair rate provided is invalid.");
                return false;
            }

            var updatedConversionPair = {
                rate: ($scope.editConversionPairObj.option === "rate") ? $scope.editConversionPairObj.rate : null,
                path: ($scope.editConversionPairObj.option === "path") ? $scope.editConversionPairObj.path : null,
                operational_account: $scope.editConversionPairObj.operational_account ? $scope.editConversionPairObj.operational_account.reference : null,
                enabled: $scope.editConversionPairObj.enabled,
                quote_duration: $scope.editConversionPairObj.quote_duration
            };

            if(!updatedConversionPair.quote_duration){
                updatedConversionPair.quote_duration = 10;
            }

            if(vm.token){
                $scope.editingConversionPair = true;
                $http.patch(vm.baseUrl + 'admin/conversion-pairs/' + $scope.editConversionPairObj.id + '/', updatedConversionPair, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingConversionPair = false;
                    toastr.success('Conversion pair successfully updated');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.editingConversionPair = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.editingPair = false;
                vm.baseUrl = serviceUrl;
                vm.getConversionPair();
            })
            .catch(function(err){
                $scope.editingPair = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
