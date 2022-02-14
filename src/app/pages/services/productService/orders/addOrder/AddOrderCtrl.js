(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.createOrder')
        .controller('AddOrderCtrl', AddOrderCtrl);

    function AddOrderCtrl($scope,$http,$location,localStorageManagement,currencyModifiers,extensionsHelper,
                          Rehive,serializeFiltersService,toastr,errorHandler,typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        $scope.addingOrder = false;
        $scope.loadingProducts = true;
        $scope.productList = [];
        $scope.products = [];
        $scope.currencyOptions= [];
        $scope.newOrderParams = {
            user: null,
            status: "pending",
            currency: null,
            total_price: 0,
            items: []
        };
        $scope.orderInfoCorrect = false;
        $scope.orderTotal = false;

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/currencies/?page_size=250&archived=false', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.currencyOptions = res.data.data.results.slice();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        vm.getProductsList = function () {
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/products/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(res.data.data.results.length > 0){
                            $scope.productList = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingProducts =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };   

        $scope.allItemsCorrect = function(newOrderParams){
            $scope.orderInfoCorrect = false;
            var idx = -1, error = 'qty', len = newOrderParams.items.length;
            for(var i = 0; i < len; ++i){
                if(!newOrderParams.items[i].quantity || newOrderParams.items[i].quantity == ''){
                    idx = i;
                    break;
                } else if((newOrderParams.items[i].product.tracked 
                    && newOrderParams.items[i].product.quantity 
                    && newOrderParams.items[i].quantity > newOrderParams.items[i].product.quantity) 
                ||((newOrderParams.items[i].variant 
                    && newOrderParams.items[i].variant.tracked 
                    && newOrderParams.items[i].variant.quantity 
                    && newOrderParams.items[i].quantity > newOrderParams.items[i].variant.quantity))){
                        idx = i;
                        error = 'qty_over';
                } else if((newOrderParams.items[i].product.prices.length > 0 && newOrderParams.items[i].product.prices[0].allow_custom_amount)
                || (newOrderParams.items[i].variant && newOrderParams.items[i].variant.prices[0].allow_custom_amount)){
                    if(!newOrderParams.items[i].custom_amount){
                        idx = i;
                        error = 'custom';
                        break;
                    } 
                    var customAmount = currencyModifiers.convertToCents(newOrderParams.items[i].custom_amount, newOrderParams.currency.divisibility);
                    var minAmount = newOrderParams.items[i].variant ? newOrderParams.items[i].variant.prices[0].min_custom_amount : newOrderParams.items[i].product.prices[0].min_custom_amount;
                    var maxAmount = newOrderParams.items[i].variant ? newOrderParams.items[i].variant.prices[0].max_custom_amount : newOrderParams.items[i].product.prices[0].max_custom_amount;
                    if(customAmount < minAmount || customAmount > maxAmount){
                        idx = i;
                        error = 'invalid';
                    }
                }
            }

            if(idx !== -1){
                var errorMsg = error == 'qty' ? "Please enter all item quantities correctly" : ( error == 'qty_over' ? "Qualtity of product item " + (idx+1) + " exceeds available quantity": (
                    error == 'custom' ? "Please provide all custom amounts where applicable" : "Custom price of product item " + (idx+1) + " is outside the min and max price range" 
                ));
                toastr.error(errorMsg);
                return false;
            }
            $scope.orderInfoCorrect = true;
            return true;
        };
        
        $scope.calculateOrderTotal = function(newOrderParams){
            if(!$scope.allItemsCorrect(newOrderParams)){
                return false;
            }
            $scope.orderTotal = 0;
            newOrderParams.items.forEach(function(orderItem){
                var hasCustomPrice = ((orderItem.variant && orderItem.variant.prices[0].allow_custom_amount) || (orderItem.product.prices.length > 0 && orderItem.product.prices[0].allow_custom_amount));
                orderItem.price = hasCustomPrice ? currencyModifiers.convertToCents(orderItem.custom_amount, newOrderParams.currency.divisibility) : (orderItem.variant ? orderItem.variant.prices[0].amount : orderItem.product.prices[0].amount);
                orderItem.price *= orderItem.quantity;
                $scope.orderTotal += parseInt(orderItem.price);
            });
        };

        $scope.addNewOrder = function (newOrderParams) {
            if(!$scope.allItemsCorrect(newOrderParams)){
                return false;
            }
            var newOrder = {
                user: null,
                currency: newOrderParams.currency.code
            };
            newOrder = serializeFiltersService.objectFilters(newOrder);

            $scope.addingOrder =  true;
            if(vm.token) {
                Rehive.admin.users.get({filters: {user: newOrderParams.user}}).then(function (res) {

                    newOrder.user = res.results[0].id;
                    $http.post(vm.serviceUrl + 'admin/orders/', newOrder, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201 || res.status === 200) {
                            if($scope.newOrderParams.items.length > 0){
                                vm.formatItemsForOrder(res.data.data);
                            } else{
                                toastr.success('Order added successfully');
                                // $location.path('/services/product/orders');
                                $location.path('/extensions/product/orders');
                            }
                        }
                    }).catch(function (error) {
                        $scope.addingOrder =  false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.formatItemsForOrder = function (order) {
            $scope.newOrderParams.items.forEach(function(orderItem,idx,array){
                var newOrderItem = {
                    product: orderItem.product.id,
                    quantity: orderItem.quantity,
                    variant: orderItem.product.variants.length > 0 && orderItem.variant && orderItem.variant.id ? orderItem.variant.id : null,
                    custom_amount: orderItem.custom_amount ? currencyModifiers.convertToCents(orderItem.custom_amount, $scope.newOrderParams.currency.divisibility) : null
                };
                newOrderItem = serializeFiltersService.objectFilters(newOrderItem);
                vm.addOrderItems(order, newOrderItem, (idx === array.length - 1));
            });
        };

        vm.addOrderItems = function (order,orderItem,last) {
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/orders/' + order.id + '/items/', orderItem, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            toastr.success('Order items added successfully');
                            // $location.path('/services/product/orders');
                            $location.path('/extensions/product/orders');
                        }
                    }
                }).catch(function (error) {
                    $scope.addingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateProductList = function(){
            $scope.products = [];
            for(var i = 0; i < $scope.productList.length; ++i){
                if($scope.productList[i].enabled){
                    var tempProduct = Object.assign({}, $scope.productList[i]);
                    if($scope.productList[i].prices.length > 0){  
                        tempProduct.prices = [];
                        for(var j = 0; j < $scope.productList[i].prices.length; ++j){
                            if($scope.productList[i].prices[j].currency.code === $scope.newOrderParams.currency.code){
                                tempProduct.prices = [$scope.productList[i].prices[j]];
                                $scope.products.push(tempProduct);
                                break;
                            }
                        }                  
                    } else if($scope.productList[i].variants.length > 0){  
                        tempProduct.variants = [];
                        for(var j = 0; j < $scope.productList[i].variants.length; ++j){
                            if($scope.productList[i].variants[j].prices.length > 0){                                
                                for(var k = 0; k < $scope.productList[i].variants[j].prices.length; ++k){
                                    if($scope.productList[i].variants[j].prices[k].currency.code === $scope.newOrderParams.currency.code){
                                        var tempVariant = Object.assign({}, $scope.productList[i].variants[j]);
                                        tempVariant.prices = [$scope.productList[i].variants[j].prices[k]];
                                        tempProduct.variants.push(tempVariant);
                                        break;
                                    }
                                }
                            }
                        }
                        if(tempProduct.variants.length > 0){
                            $scope.products.push(tempProduct);
                        }                  
                    }
                }
            }
        };

        $scope.trackHasVariant = function($index){
            $scope.newOrderParams.items[$index].variant = ($scope.newOrderParams.items[$index].product.variants.length > 0) ? 
            $scope.newOrderParams.items[$index].product.variants[0] : null;
        };

        $scope.addOrderItem = function () {
            var item = {
                product: $scope.products[($scope.products.length - 1)],
                price: null,
                quantity: null,
                variant: null,
                custom_amount: null
            };
            $scope.newOrderParams.items.push(item);
        };

        $scope.removeAddOrderItem = function(item){
            $scope.newOrderParams.items.forEach(function (itemObj,index,array) {
                itemObj.product ? (itemObj.product.name == item.product.name) ? array.splice(index,1) : null : array.splice(index,1);
            });
        };

        $scope.backToOrderList = function () {
            // $location.path('/services/product/orders');
            $location.path('/extensions/product/orders');
        };

        extensionsHelper.getActiveServiceUrl(serviceName)
        .then(function(serviceUrl){
            $scope.loadingProducts = false;
            vm.serviceUrl = serviceUrl;
            vm.getCompanyCurrencies();
            vm.getProductsList();
        })
        .catch(function(err){
            $scope.loadingProducts = false;
            toastr.error("Extension not activated for company");
            $location.path('/extensions');
        });
    }
})();
