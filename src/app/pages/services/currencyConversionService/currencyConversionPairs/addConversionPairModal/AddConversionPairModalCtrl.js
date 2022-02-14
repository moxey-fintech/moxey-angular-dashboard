(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionPairList')
        .controller('AddConversionPairModalCtrl', AddConversionPairModalCtrl);

    function AddConversionPairModalCtrl($scope,$uibModalInstance,currenciesList,toastr,cleanObject,extensionsHelper,$location,
                                         Rehive,$http,localStorageManagement,errorHandler, typeaheadService,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "conversion_service";
        vm.exisitingRatePairs = [];
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.addingConversionPair = true;
        $scope.currencyNotInAcc = false;
        $scope.invalidAmount = false;
        $scope.pathPlaceholder = "e.g {{ rates|get:'USD:EUR' }}"; 
        $scope.searchAccountBy = 'user';
        $scope.conversionPairUserAccounts = null;
        $scope.conversionPairReferenceAccounts = null;
        $scope.showEmailSearchAccounts = false;
        $scope.showRefSearchAccounts = false;
        $scope.conversionPairUserEmail = null;
        $scope.conversionPairAccountRef = null;
        $scope.searchAccount = false;
        $scope.searchUser = false;
        $scope.loadingAccounts = true;
        $scope.showAdvancedOption = false;
        $scope.newConversionPairParams = {
            fromCurrency: null,
            toCurrency: null,
            option: "auto",
            rate: null,
            path: null,
            pad: null,
            enabled: true,
            operational_account: null,
            quote_duration: null
        };
        $scope.currenciesList = currenciesList;

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getAccountsReferenceTypeahead = typeaheadService.getAccountsReferenceTypeahead();

        $scope.toggleAdvancedOption = function(){
            $scope.showAdvancedOption = !$scope.showAdvancedOption;
        };

        $scope.addRate = function () {            
           
            if($scope.newConversionPairParams.option === "rate" && $scope.newConversionPairParams.rate == 0){
                toastr.error("Conversion pair rate provided is invalid.");
                return false;
            }
            $scope.newConversionPairParams.fromCurrency = $scope.newConversionPairParams.fromCurrency.toUpperCase();
            $scope.newConversionPairParams.toCurrency = $scope.newConversionPairParams.toCurrency.toUpperCase();

            var newConversionPair = {
                key: $scope.newConversionPairParams.fromCurrency + ":" + $scope.newConversionPairParams.toCurrency,
                rate: ($scope.newConversionPairParams.option === "rate") ? $scope.newConversionPairParams.rate : null,
                path: ($scope.newConversionPairParams.option === "path") ? $scope.newConversionPairParams.path : null,
                operational_account: $scope.newConversionPairParams.operational_account ? $scope.newConversionPairParams.operational_account.reference : null,
                enabled: $scope.newConversionPairParams.enabled,
                quote_duration: $scope.newConversionPairParams.quote_duration
            };
            
            if($scope.newConversionPairParams.option === "pad" && $scope.newConversionPairParams.pad){
                var padding = parseFloat($scope.newConversionPairParams.pad);
                if(padding === NaN){
                    toastr.error("Conversion pair padding provided is invalid.");
                    return false;
                }
                newConversionPair.path = "";
                if($scope.newConversionPairParams.fromCurrency !== 'USD'){
                    var fromCurrencyPath = "{{ rates|get:'USD:" + $scope.newConversionPairParams.fromCurrency + "' }}";
                    var toCurrencyPath = "{{ rates|get:'USD:" + $scope.newConversionPairParams.toCurrency + "' }}";
                    newConversionPair.path = "(" + toCurrencyPath + " / " + fromCurrencyPath + ") * ";
                } else {
                    newConversionPair.path = "{{ rates|get:'" + $scope.newConversionPairParams.fromCurrency + ":" + $scope.newConversionPairParams.toCurrency + "' }} * ";
                }
                padding = 1 - (padding / 100);
                newConversionPair.path += padding;
            }
            newConversionPair = cleanObject.cleanObj(newConversionPair);  //MANOSHALERT I think this is causing enabled to drop its value when it's false because this treats null as false.
            if(vm.token){
                $scope.addingConversionPair = true;
                $http.post(vm.baseUrl + 'admin/conversion-pairs/', newConversionPair, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingConversionPair = false;
                    toastr.success('Conversion pair successfully added');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.addingConversionPair = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        $scope.trackAccountCurrency = function(){
            $scope.currencyNotInAcc = false;
            if(!$scope.newConversionPairParams.operational_account || !$scope.newConversionPairParams.fromCurrency){ 
                return false;
            }
            var hasCurrency = true;
            $scope.newConversionPairParams.operational_account.currencies.forEach(function(element){
                if(element.currency.code === $scope.newConversionPairParams.fromCurrency.toUpperCase()){
                    hasCurrency = false;
                    return true;
                }
            });

            $scope.currencyNotInAcc = hasCurrency;
        };

        $scope.getAllAccountsByReference = function(accountRef) {
            var filtersObj = {
                page_size: 250
            };
            if(accountRef){
                filtersObj.reference = accountRef;
            }
            $scope.loadingAccounts = true;
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                $scope.loadingAccounts = false;
                if(res.results.length > 0){
                    $scope.conversionPairReferenceAccounts = [];
                    $scope.conversionPairReferenceAccounts = res.results.slice();
                    if($scope.conversionPairReferenceAccounts.length > 0){
                        $scope.showRefSearchAccounts = true;
                        $scope.searchAccount = false;
                        $scope.newConversionPairParams.operational_account = $scope.conversionPairReferenceAccounts[0];
                    }
                } 
                $scope.$apply();
            }, function (error) {
                $scope.loadingAccounts = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.getAllAccountsByUser = function(userEmail){
            var filtersObj = {
                page_size: 250
            };
            if(userEmail){
                filtersObj.user = userEmail;
            }
            $scope.loadingAccounts = true;
            Rehive.admin.accounts.get({filters: filtersObj}).then(function (res) {
                $scope.loadingAccounts = false;
                if(res.results.length > 0){
                    $scope.conversionPairUserAccounts = [];
                    $scope.conversionPairUserAccounts = res.results.slice();
                    if($scope.conversionPairUserAccounts.length > 0){
                        $scope.showEmailSearchAccounts = true;
                        $scope.searchUser = false;
                        $scope.newConversionPairParams.operational_account = $scope.conversionPairUserAccounts[0];
                    }
                } 
                $scope.$apply();
            }, function (error) {
                $scope.loadingAccounts = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
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
            $scope.getAllAccountsByUser($scope.conversionPairUserEmail);
        };

        $scope.onReferenceSelect = function($model) {
            $scope.searchAccount = true;
            $scope.conversionPairAccountRef = $model;
        };

        $scope.referenceChanging = function(){
            $scope.showRefSearchAccounts = false;
            $scope.searchAccount = false;
        };

        $scope.triggerSearchByReference = function(){            
            $scope.getAllAccountsByReference($scope.conversionPairAccountRef);
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
                    $scope.getAllAccountsByUser($scope.conversionPairUserEmail);
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.addingConversionPair = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.addingConversionPair = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();