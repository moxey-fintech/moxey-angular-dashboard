(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionsList')
        .controller('DisplayCurrencyConversionModalCtrl', DisplayCurrencyConversionModalCtrl);

    function DisplayCurrencyConversionModalCtrl($scope,metadataTextService,conversion,environmentConfig,$filter,currencyModifiers,$location,extensionsHelper,
                                                 $http,localStorageManagement,$window,$state,Rehive,toastr,errorHandler,$uibModalInstance) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.conversion = conversion;
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText($scope.conversion.metadata);
        $scope.dataEdited = false;
        $scope.editingConversion = true;
        $scope.updatingConversion = false;
        $scope.displayingMetadata = false;
        $scope.prevStatus = $scope.conversion.status;
        if($scope.conversion.rate){
            $scope.conversion.rate = $filter('roundDecimalPartFilter')(currencyModifiers.convertToCents($scope.conversion.rate, 18), 18);
        }

        vm.getUser = function(){
            if(vm.token) {
                $scope.updatingConversion = true;
                $scope.conversion.userEmail = null;
                Rehive.admin.users.get({id: $scope.conversion.user}).then(function (res) {
                    $scope.conversion.userEmail = res.email;
                    $scope.updatingConversion = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingConversion = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };   

        vm.getTransactionsByCollection = function(){
            var filterObj = {
                id: $scope.conversion.collection
            };
            Rehive.admin.transaction_collections.get({filters: filterObj}).then(function (res) {
                $scope.conversion.txns = res.results[0].transactions;
                $scope.editingConversion = false;
                $scope.$apply();
            }, function (error) {
                $scope.editingConversion = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        
        $scope.goToUser = function () {
            $window.open('/#/user/' + $scope.conversion.user + '/details','_blank');
        };
        
        $scope.goToTransactions = function (transactionId) {
            $state.go('transactions.history',{transactionId: transactionId});
        };

        $scope.toggleEditingConversion = function(){
            $scope.editingConversion = !$scope.editingConversion;
        };

        $scope.trackStatusChanged = function(){
            $scope.dataEdited = ($scope.conversion.status !== $scope.prevStatus); 
        };

        $scope.updateConversion = function(){
            if(!$scope.dataEdited){
                return false;
            }
            if(vm.token){
                $scope.updatingConversion = true;
                $http.patch(vm.baseUrl + 'admin/conversions/' + $scope.conversion.id + '/', {status: $scope.conversion.status}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingConversion = false;
                    $scope.editingConversion = false;
                    toastr.success('Conversion status successfully updated');
                    $uibModalInstance.close('Updated status');
                }).catch(function (error) {
                    $scope.updatingConversion = false;
                    $scope.editingConversion = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }   
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                if($scope.conversion.collection){
                    vm.getTransactionsByCollection();
                } else {
                    $scope.editingConversion = false;
                }
                vm.getUser();
            })
            .catch(function(err){
                $scope.editingConversion = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
