(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .controller('EditProductVariantModalCtrl', EditProductVariantModalCtrl);

    /** @ngInject */
    function EditProductVariantModalCtrl($scope,localStorageManagement,errorHandler,$uibModalInstance,$http,extensionsHelper,$location,toastr,
        currencyModifiers,productId,productOptions,editVariantObj,currencyOptions) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        vm.productId = productId;
        vm.editVariantObj = editVariantObj ? Object.assign({}, editVariantObj) : null;
        vm.editVariantParams = {};
        $scope.currencyOptions = currencyOptions;
        $scope.productOptions = productOptions;
        $scope.editingProductVariant = true;
        $scope.deletePricesList = [];

        $scope.initEditObj = function(){
            $scope.editVariantParams = vm.editVariantObj ? vm.editVariantObj : {
                code: null,
                label: null,
                options: {},
                quantity: null,
                tracked: true,
                allow_custom_amount: false,
                prices: []
            };
            $scope.editVariantParams.allow_custom_amount = ($scope.editVariantParams.prices.length > 0 && $scope.editVariantParams.prices[0].allow_custom_amount);
            $scope.editVariantParams.tracked = $scope.editVariantParams.tracked.toString();
            if($scope.editVariantParams.prices.length > 0){
                $scope.editVariantParams.prices.forEach(function(priceObj){
                    priceObj.currency = $scope.currencyOptions.find(function(currency){
                        return currency.code === priceObj.currency.code;
                    });
                });
            }
        };

        $scope.trackBasicVariantChanges = function(fieldName, priceIdx){
            if(fieldName == 'options'){
                vm.editVariantParams['options'] = Object.assign({}, $scope.editVariantParams['options']);
            } else if (fieldName == 'tracked'){
                vm.editVariantParams['tracked'] = $scope.editVariantParams['tracked'] === 'true';
            } else if (fieldName == 'prices'){
                if(vm.editVariantParams.prices === undefined){vm.editVariantParams.prices = [];}
                var price = $scope.editVariantParams.prices[priceIdx];
                var idx = vm.editVariantParams.prices.indexOf(function(editedPriceObj){
                    return editedPriceObj.currency.code === price.currency.code;
                });
                idx === -1 ? vm.editVariantParams.prices.push(price) : vm.editVariantParams.prices[idx] = price;
            } else {
                vm.editVariantParams[fieldName] = $scope.editVariantParams[fieldName];
            }
        };

        $scope.addPriceRow = function () {
            $scope.editVariantParams.prices.push({
                currency: {}, 
                amount: null,
                min_custom_amount: null, 
                max_custom_amount: null,
                allow_custom_amount: $scope.editVariantParams.allow_custom_amount
            });
        };

        $scope.removeAddPriceRow = function ($index) {
            var priceObj = $scope.editVariantParams.prices[$index];
            if(priceObj.id){ $scope.deletePricesList.push(priceObj.id); }
            
            if(vm.editVariantParams.prices && vm.editVariantParams.prices.length > 0){
                vm.editVariantParams.prices.forEach(function (updatedPriceObj,index,array) {
                    if(updatedPriceObj.currency.code === priceObj.currency.code){
                        array.splice(index,1);
                        return;
                    }
                });
            }
            $scope.editVariantParams.prices.splice($index, 1);
        };

        $scope.trackVariantPriceChanges = function(price){
            if(!vm.editVariantParams.prices){ vm.editVariantParams.prices = []; }
            var idx = vm.editVariantParams.prices.findIndex(function(updatePrice){
                return updatePrice.currency.code === price.currency.code;
            });
            idx > -1 ? vm.editVariantParams.prices[idx] = price : vm.editVariantParams.prices.push(price);
        };

        $scope.updateAllowCustomAmountOnPrices = function(){
            $scope.editVariantParams.prices.forEach(function(priceItem){
                priceItem.allow_custom_amount = $scope.editVariantParams.allow_custom_amount;
            });            
        };

        $scope.saveUpdatedVariant = function(){
            var valuesAreProvided = true;
            $scope.productOptions.forEach(function(option){
                if($scope.editVariantParams.options[option.name] === undefined){
                    valuesAreProvided = false;
                    return false;
                }
            });
            
            if(!valuesAreProvided){
                toastr.error("Please provide all the values correctly");
                return;
            }
            $scope.editVariantParams.tracked = $scope.editVariantParams.tracked === 'true';
            if(vm.productId === null){
                $scope.editingProductVariant = true;
                setTimeout(function(){
                    $scope.editingProductVariant = false;
                    toastr.success("Product variant updated successfully");
                    $uibModalInstance.close($scope.editVariantParams);
                }, 1200);
            } else {
                $scope.updateProductVariant();
            }
        };

        $scope.updateProductVariant = function(){
            if(vm.token){
                $scope.editingProductVariant = true;
                var variantHasCustomPrices = $scope.editVariantParams.allow_custom_amount;
                var variantPrices = Object.assign([], $scope.editVariantParams.prices);
                var updatedPrices = [];
                if(vm.editVariantParams.prices && vm.editVariantParams.prices.length > 0){
                    updatedPrices = Object.assign([], vm.editVariantParams.prices);
                    delete vm.editVariantParams['prices'];
                }
                $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/variants/' + vm.editVariantObj.id, vm.editVariantParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editVariantParams = res.data.data;
                    $scope.editVariantParams.prices = variantPrices;
                    $scope.editVariantParams.allow_custom_amount = variantHasCustomPrices;
                    if(updatedPrices.length > 0 || $scope.deletePricesList.length > 0){
                        $scope.handleVariantPriceUpdates(updatedPrices);
                    } else {
                        $scope.editingProductVariant = false;
                        toastr.success("Product variant updated successfully");
                        $uibModalInstance.close($scope.editVariantParams);
                    }
                }).catch(function (error) {
                    $scope.editingProductVariant = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.handleVariantPriceUpdates = function(updatedPrices){
            $scope.deletePricesList.forEach(function(priceId, idx, arr){
                var isLast = !(updatedPrices.length > 0) && idx === (arr.length - 1);
                $scope.deleteVariantPrice($scope.editVariantParams.id, priceId, isLast); 
            });

            updatedPrices.forEach(function(priceObj, idx, arr){
                var formattedPriceObj = {
                    currency: priceObj.currency.code,
                    amount: priceObj.amount ? currencyModifiers.convertToCents(priceObj.amount, priceObj.currency.divisibility) : null,
                    min_custom_amount: priceObj.min_custom_amount ? currencyModifiers.convertToCents(priceObj.min_custom_amount, priceObj.currency.divisibility) : null,
                    max_custom_amount: priceObj.max_custom_amount ? currencyModifiers.convertToCents(priceObj.max_custom_amount, priceObj.currency.divisibility) : null,
                    allow_custom_amount: $scope.editVariantParams.allow_custom_amount
                };
                var isLast = idx === (arr.length - 1);
                priceObj.id ? $scope.updateVariantPrice($scope.editVariantParams.id, priceObj.id, formattedPriceObj, isLast)
                 : $scope.addVariantPrice($scope.editVariantParams.id, formattedPriceObj, isLast);
            });
        };

        $scope.deleteVariantPrice = function(variantId, priceId, isLast){
            if(vm.token){
                $http.delete(vm.serviceUrl + 'admin/products/' + vm.productId + '/variants/' + variantId + '/prices/' + priceId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(isLast){
                        $scope.editingProductVariant = false;
                        toastr.success("Product variant updated successfully");
                        $uibModalInstance.close($scope.editVariantParams);
                    }
                }).catch(function (error) {
                    $scope.editingProductVariant = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateVariantPrice = function(variantId, priceId, priceObj, isLast){
            if(vm.token){
                $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/variants/' + variantId + '/prices/' + priceId + '/',
                 priceObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(isLast){
                        $scope.editingProductVariant = false;
                        toastr.success("Product variant updated successfully");
                        $uibModalInstance.close($scope.editVariantParams);
                    }
                }).catch(function (error) {
                    $scope.editingProductVariant = false;
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
                    var newPrice = res.data.data;
                    var idx = $scope.editVariantParams.prices.indexOf(function(priceObj){
                        return priceObj.currency.code === newPrice.currency;
                    });
                    if(idx > -1){
                        $scope.editVariantParams.prices[idx] = newPrice;
                    }
                    if(isLast){
                        $scope.editingProductVariant = false;
                        toastr.success("Product variant updated successfully");
                        $uibModalInstance.close($scope.editVariantParams);
                    }
                }).catch(function (error) {
                    $scope.editingProductVariant = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.initEditObj();
                $scope.editingProductVariant = false;              
            })
            .catch(function(err){
                $scope.editingProductVariant = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();