(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .controller('DisplayProductModalCtrl', DisplayProductModalCtrl);

    function DisplayProductModalCtrl($scope,$http,productObj,localStorageManagement,errorHandler,countriesList,metadataTextService,
                                    toastr,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        $scope.loadingProduct = true;
        $scope.countriesList = countriesList;

        vm.compareCountries = function(countryA, countryB){
            if(countryA.name < countryB.name){
                return -1;
            }
            else if(countryA.name > countryB.name){
                return 1;
            }
            return 0;
        }

        vm.getProduct = function(){
            if(vm.token) {
                $scope.loadingProduct = true;
                $http.get(vm.serviceUrl + 'admin/products/' + productObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        var allowedCountries = [];
                        $scope.loadingProduct =  false;
                        $scope.productObj = res.data.data;
                        $scope.productObj.type = $scope.productObj.type[0].toUpperCase() + $scope.productObj.type.substring(1, $scope.productObj.type.length);
                        if($scope.productObj.countries.length > 0){
                            $scope.productObj.countries.forEach(function(allowedCountry){
                                $scope.countriesList.forEach(function(country){
                                    if(country.code === allowedCountry){
                                        allowedCountries.push(country);
                                    }
                                });
                            });
                            $scope.productObj.countries = allowedCountries.sort(vm.compareCountries);
                            $scope.productObj.metadata = metadataTextService.convertToText($scope.productObj.metadata);
                        }                        
                    }
                }).catch(function (error) {
                    $scope.loadingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getProduct();
            })
            .catch(function(err){
                $scope.loadingProduct = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
