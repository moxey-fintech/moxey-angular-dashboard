(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.editOrder')
        .controller('EditOrderCtrl', EditOrderCtrl);

    function EditOrderCtrl($scope,$http,$location,localStorageManagement,currencyModifiers,extensionsHelper,
                          Rehive,serializeFiltersService,toastr,errorHandler,typeaheadService,
                           $stateParams) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        vm.orderId = $stateParams.orderId;
        $scope.editingOrder = true;
        $scope.loadingProducts = false;
        $scope.loadingUser = false;
        $scope.productList = [];
        $scope.products = [];
        $scope.existingItemsToDelete = [];
        $scope.currencyOptions= [];
        $scope.editOrderObj = {
            user: null,
            status: "pending",
            currency: "",
            total_price: 0,
        };
        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingOrder = true;
                $http.get(vm.serviceUrl + 'admin/currencies/?page_size=250&archived=false', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.currencyOptions = res.data.data.results.slice();
                        $scope.editingOrder = false;
                    }
                }).catch(function (error) {
                    $scope.editingOrder = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        vm.getProductsList = function () {
            if(vm.token) {
                $scope.loadingProducts = true;
                $http.get(vm.serviceUrl + 'admin/products/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.loadingProducts = false;
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

        vm.getUser = function(editObj){
            if(vm.token){
                vm.loadingUser = true;
                Rehive.admin.users.get({filters: {user: editObj.user}}).then(function (res) {
                    vm.loadingUser = false;
                    editObj.user =  res.results[0].email;
                    vm.assignOrderToScope(editObj);
                    $scope.$apply();
                }).catch(function (error) {
                    vm.loadingUser = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getOrder = function(){
            if(vm.token){
                $scope.editingOrder = true;
                $http.get(vm.serviceUrl + 'admin/orders/' + vm.orderId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        vm.getUser(res.data.data);
                    }
                }).catch(function (error) {
                    $scope.editingOrder = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.filterProducts = function(){
            $scope.products = [];
            for(var i = 0; i < $scope.productList.length; ++i){
                for(var j = 0; j < $scope.productList[i].prices.length; ++j){
                    if($scope.productList[i].prices[j].currency.code === $scope.editOrderObj.currency.code && $scope.productList[i].enabled === true){
                        $scope.products.push($scope.productList[i]);
                    }
                }
            }
        };

        vm.assignOrderToScope = function(editObj){
            $scope.editOrderObj = {
                id: editObj.id,
                user: editObj.user,
                status: editObj.status,
                currency: null,
                total_price: editObj.total_price,
                items: []
            };

            for(var i = 0; i < $scope.currencyOptions.length; ++i){
                if(editObj.currency.code === $scope.currencyOptions[i].code){
                    $scope.editOrderObj.currency = $scope.currencyOptions[i];
                    break;
                }
            }
            vm.filterProducts();

            editObj.items.forEach(function (item) {
                for(var i = 0; i < $scope.products.length; ++i){
                    if($scope.products[i].id === item.product){
                        $scope.editOrderObj.items.push({
                            id: item.id,
                            product: $scope.products[i],
                            quantity: item.quantity,
                            toUpdate: false
                        });
                    }
                }
            });
            $scope.editingOrder = false;
        };

        $scope.editOrder = function (editOrderObj) {
            $scope.updatedOrder = serializeFiltersService.objectFilters(editOrderObj);

            $scope.updatedOrder.items.forEach(function(orderItem, idx, array){
                if(orderItem.toUpdate){
                    (idx === array.length - 1) ?
                        vm.updateExistingItems(orderItem.id, {quantity: orderItem.quantity}, "last") :
                        vm.updateExistingItems(orderItem.id, {quantity: orderItem.quantity});
                }else if(!orderItem.id){
                    (idx === array.length - 1) ?
                        vm.addNewOrderItems({product: orderItem.product.id, quantity: orderItem.quantity}, "last") :
                        vm.addNewOrderItems({product: orderItem.product.id, quantity: orderItem.quantity});
                }
            });

            if($scope.existingItemsToDelete.length > 0){
                $scope.existingItemsToDelete.forEach(function(orderItem, idx, array){
                    if(idx === array.length - 1){
                        vm.deleteExistingItem({id: orderItem.id}, 'last');
                        return false;
                    }
                    vm.deleteExistingItem({id: orderItem.id});
                });
            }else{
                // $location.path('/services/product/orders');
                $location.path('/extensions/product/orders');
            }

        };

        vm.updateExistingItems = function (itemId, orderItem,last) {
            $scope.editingOrder =  true;
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/orders/' + vm.orderId + '/items/' + itemId + '/',
                    orderItem, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        $scope.editingOrder =  false;
                        if(last){
                            toastr.success('Order items updated successfully');
                            $scope.editingOrder =  false;
                        }
                    }
                }).catch(function (error) {
                    $scope.editingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.addNewOrderItems = function (orderItem, last){
            $scope.editingOrder =  true;
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/orders/' + vm.orderId + '/items/', orderItem, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        $scope.editingOrder =  false;
                        if(last){
                            toastr.success('New items added successfully');
                        }
                    }
                }).catch(function (error) {
                    $scope.editingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.deleteExistingItem = function(item, last){
            $http.delete(vm.serviceUrl + 'admin/orders/' + vm.orderId + '/items/' + item.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if(last){
                    toastr.success('Order items updated successfully');
                    // $location.path('/services/product/orders');
                    $location.path('/extensions/product/orders');
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.quantityCheck = function(item){
            if(item.id){
                item.toUpdate = true;
            }
        };

        $scope.addOrderItem = function () {
            var item = {
                product: $scope.products[($scope.products.length - 1)],
                quantity: 1,
                toUpdate: false
            };
            $scope.editOrderObj.items.push(item);
        };

        $scope.removeAddOrderItem = function(item){
            if(item.id){
                $scope.editOrderObj.items.splice($scope.editOrderObj.items.indexOf(item), 1);
                $scope.existingItemsToDelete.push(item);
            }
            else {
                $scope.editOrderObj.items.forEach(function (itemObj,index,array) {
                    if(itemObj.product.name === item.product.name){
                        array.splice(index,1);
                    }
                });
            }
        };

        $scope.backToOrderList = function () {
            // $location.path('/services/product/orders');
            $location.path('/extensions/product/orders');
        };

        extensionsHelper.getActiveServiceUrl(serviceName)
        .then(function(serviceUrl){
            $scope.editingOrder = false;
            vm.serviceUrl = serviceUrl;
            vm.getCompanyCurrencies();
            vm.getProductsList();
            vm.getOrder();
        })
        .catch(function(err){
            $scope.editingOrder = false;
            toastr.error("Extension not activated for company");
            $location.path('/extensions');
        });
    }
})();
