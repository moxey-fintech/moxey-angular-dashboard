(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .controller('AddProductVariantModalCtrl', AddProductVariantModalCtrl);

    /** @ngInject */
    function AddProductVariantModalCtrl($scope,localStorageManagement,errorHandler,$uibModalInstance,$http,extensionsHelper,$location,toastr, productId, productOptions, currencyModifiers, currencyOptions) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        vm.productId = productId;
        $scope.currencyOptions = currencyOptions;
        $scope.productOptions = productOptions;
        $scope.addingNewProductVariant = true;

        $scope.newVariantParams = {
            code: null,
            label: null,
            options: {},
            quantity: null,
            tracked: 'true',
            allow_custom_amount: false,
            prices: []
        };

        $scope.addPriceRow = function () {
            $scope.newVariantParams.prices.push({
                currency: {}, 
                amount: null,
                min_custom_amount: null, 
                max_custom_amount: null,
                allow_custom_amount: $scope.newVariantParams.allow_custom_amount
            });
        };

        $scope.removeAddPriceRow = function ($index) {
            $scope.newVariantParams.prices.splice($index,1);
        };

        $scope.updateAllowCustomAmountOnPrices = function(){
            $scope.newVariantParams.prices.forEach(function(priceItem){
                priceItem.allow_custom_amount = $scope.newVariantParams.allow_custom_amount;
            });            
        };

        $scope.saveNewVariant = function(){
            var valuesAreProvided = true;
            $scope.productOptions.forEach(function(option){
                if($scope.newVariantParams.options[option.name] === undefined){
                    valuesAreProvided = false;
                    return false;
                }
            });
            
            if(!valuesAreProvided){
                toastr.error("Please provide all the values correctly");
                return;
            }
            $scope.newVariantParams.tracked = $scope.newVariantParams.tracked == 'true';
            if(vm.productId === null){
                $scope.addingNewProductVariant = true;
                setTimeout(function(){
                    $scope.addingNewProductVariant = false;
                    toastr.success("Product variant added successfully");
                    $uibModalInstance.close($scope.newVariantParams);
                }, 1200);
            } else {
                $scope.addNewProductVariant();
            }
        };

        $scope.addNewProductVariant = function(){
            if(vm.token){
                $scope.addingNewProductVariant = true;
                var variantHasCustomPrices = $scope.newVariantParams.allow_custom_amount;
                var variantPrices = Object.assign([], $scope.newVariantParams.prices);
                delete $scope.newVariantParams['prices'];
                $http.post(vm.serviceUrl + 'admin/products/' + vm.productId + '/variants/', $scope.newVariantParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.newVariantParams = res.data.data;
                    $scope.newVariantParams.allow_custom_amount = variantHasCustomPrices;
                    $scope.newVariantParams.prices = [];
                    if(variantPrices.length > 0){
                        variantPrices.forEach(function(priceObj, idx, arr){
                            var newPriceObj = {
                                currency: priceObj.currency.code,
                                amount: priceObj.amount ? currencyModifiers.convertToCents(priceObj.amount, priceObj.currency.divisibility) : null,
                                min_custom_amount: priceObj.min_custom_amount ? currencyModifiers.convertToCents(priceObj.min_custom_amount, priceObj.currency.divisibility) : null,
                                max_custom_amount: priceObj.max_custom_amount ? currencyModifiers.convertToCents(priceObj.max_custom_amount, priceObj.currency.divisibility) : null,
                                allow_custom_amount: variantHasCustomPrices
                            };
                            $scope.addVariantPrice($scope.newVariantParams.id, newPriceObj, (idx === (arr.length - 1)));
                        });
                    } else {
                        $scope.addingNewProductVariant = false;
                        toastr.success("Product variant added successfully");
                        $uibModalInstance.close($scope.newVariantParams);
                    }
                }).catch(function (error) {
                    $scope.addingNewProductVariant = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addVariantPrice = function(variantId, priceObj, isLast){
            if(vm.token){
                $http.post(vm.serviceUrl + 'admin/products/' + vm.productId + '/variants/' + variantId + '/prices/', priceObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.newVariantParams.prices.push(res.data.data);
                    if(isLast){
                        $scope.addingNewProductVariant = false;
                        toastr.success("Product variant added successfully");
                        $uibModalInstance.close($scope.newVariantParams);
                    }
                }).catch(function (error) {
                    $scope.addingNewProductVariant = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.addingNewProductVariant = false;                
            })
            .catch(function(err){
                $scope.addingNewProductVariant = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();