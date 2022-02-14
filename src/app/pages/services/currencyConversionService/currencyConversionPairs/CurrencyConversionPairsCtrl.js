(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionPairList')
        .controller('CurrencyConversionPairsCtrl', CurrencyConversionPairsCtrl);

    /** @ngInject */
    function CurrencyConversionPairsCtrl($rootScope, $scope,$http,localStorageManagement,errorHandler,$uibModal,$ngConfirm,toastr,currencyModifiers,$filter,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        $rootScope.dashboardTitle = 'Conversion pairs | Moxey';
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.loadingConversions =  true;
        $scope.deletingConversionPair = false;
        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getConversionsListUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering

            return vm.baseUrl + 'admin/conversion-pairs/' + vm.filterParams;
        };

        $scope.getConversionPairsList = function () {
            $scope.loadingConversionPairsList =  true;
            $scope.conversionPairList = [];

            var conversionListUrl = vm.getConversionsListUrl();

            if(vm.token) {
                $http.get(conversionListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingConversionPairsList =  false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.conversionListData = res.data.data;
                        $scope.conversionPairList = res.data.data.results;

                        if($scope.conversionPairList.length > 0){
                            $scope.conversionPairList.forEach(function(conversionPair){
                                if(conversionPair.path){
                                    conversionPair.rate = "--";
                                }
                                else if(conversionPair.rate){
                                    conversionPair.rate = $filter('roundDecimalPartFilter')(currencyModifiers.convertToCents(conversionPair.rate, 18), 18);
                                    conversionPair.path = "--";
                                }
                                else{
                                    conversionPair.path = "--";
                                    conversionPair.rate = "Automatic";
                                }
                            });
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingConversionPairsList =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.openAddNewConversionPairModal = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddConversionPairModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(conversionPairAdded){
                if(conversionPairAdded){
                    $scope.getConversionPairsList();
                }
            }, function(){
            });
        };

        $scope.openEditConversionPairModal = function (page, size,conversionPair) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditCurrencyConversionPairsModalCtrl',
                scope: $scope,
                resolve: {
                    conversionPair: function () {
                        return conversionPair;
                    }
                }
            });
            vm.theModal.result.then(function(conversionPairEdited){
                    if(conversionPairEdited){
                        $scope.getConversionPairsList();
                    }
                }, function(){}
            );
        };

        $scope.openDeletePairPrompt = function(conversionPair){
            $scope.deletePairObj = conversionPair;
            $ngConfirm({
                title: 'Delete conversion pair',
                contentUrl: "app/pages/services/currencyConversionService/currencyConversionPairs/currencyConversionPairDeletePrompt.html",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete",
                        keys: ['enter'], // will trigger when enter is pressed
                        btnClass: 'btn-danger dashboard-btn',
                        action: function(scope){
                            $scope.deleteConversionPair(conversionPair);
                        }
                    }
                }
            });
        };

        $scope.deleteConversionPair = function(conversionPair){
            if(vm.token) {
                $scope.deletingConversionPair = true;
                $http.delete(vm.baseUrl + 'admin/conversion-pairs/' + conversionPair.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    toastr.success("Conversion pair successfully deleted.");
                    $scope.deletingConversionPair = false;
                    $scope.getConversionPairsList();
                }).catch(function (error) {
                    $scope.deletingConversionPair = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.loadingConversions = false;
                vm.baseUrl = serviceUrl;
                $scope.getConversionPairsList();
            })
            .catch(function(err){
                $scope.loadingConversions = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }

})();
