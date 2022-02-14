(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.ordersList')
        .controller('OrdersCtrl', OrdersCtrl);

    /** @ngInject */
    function OrdersCtrl($scope,$http,Rehive,localStorageManagement,serializeFiltersService,environmentConfig,$state,categoriesHelper,
                        $uibModal,errorHandler,typeaheadService,$location,toastr, $ngConfirm,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.statusOptions = ['Pending','Complete','Failed'];
        $scope.loadingOrders = true;
        $scope.ordersFiltersCount = 0;
        $scope.showingOrdersFilters = false;
        $scope.ordersList = [];
        $scope.currencyOptions = [];
        $scope.orderId = '';
        $scope.availableCategories = [];

        $scope.ordersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.ordersFiltersObj = {
            idFilter: false,
            userFilter: false,
            statusFilter: false,
            currencyFilter: false,
            totalPriceFilter: false,
            sellerFilter: false,
            categoryFilter: false
        };

        $scope.applyOrdersFiltersObj = {
            idFilter: {
                selectedId: null
            },
            userFilter: {
                selectedUser: null
            },
            statusFilter: {
                selectedStatus: 'Pending'
            },
            currencyFilter: {
                selectedCurrency: {}
            },
            totalPriceFilter: {
                selectedTotalPrice: null
            },
            sellerFilter: {
                selectedSeller: null
            },
            categoryFilter: {
                selectedCategories: []
            }
        };

        vm.getCompanyCurrencies = function () {
            Rehive.admin.currencies.get({filters: {
                page_size: 250,
                archived: false
            }}).then(function (res) {
                if(res.results.length > 0){
                    $scope.currencyOptions = res.results;
                    $scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency = res.results[0];
                    $scope.$apply();
                }
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        }; 

        $scope.clearOrdersFilters = function () {
            $scope.ordersFiltersObj = {
                idFilter: false,
                userFilter: false,
                statusFilter: false,
                currencyFilter: false,
                totalPriceFilter: false,
                sellerFilter: false,
                categoryFilter: false
            };
            $scope.showOrdersFilters();
            $scope.getOrdersLists('applyFilter');
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.showOrdersFilters = function () {
            $scope.showingOrdersFilters = !$scope.showingOrdersFilters;
        };

        $scope.getSellersList = function(){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/sellers/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.sellersList = res.data.data.results;
                }).catch(function (error) {
                    $scope.loadingProducts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getOrdersUrl = function(){
            $scope.ordersFiltersCount = 0;

            for(var x in $scope.ordersFiltersObj){
                if($scope.ordersFiltersObj.hasOwnProperty(x)){
                    if($scope.ordersFiltersObj[x]){
                        $scope.ordersFiltersCount = $scope.ordersFiltersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.ordersPagination.pageNo,
                page_size: $scope.ordersPagination.itemsPerPage || 25,
                id: $scope.ordersFiltersObj.idFilter ? $scope.applyOrdersFiltersObj.idFilter.selectedId : null,
                user: $scope.ordersFiltersObj.userFilter ? ($scope.applyOrdersFiltersObj.userFilter.selectedUser ? $scope.applyOrdersFiltersObj.userFilter.selectedUser : null) : null,
                seller: $scope.ordersFiltersObj.sellerFilter ? ($scope.applyOrdersFiltersObj.sellerFilter.selectedSeller ? $scope.applyOrdersFiltersObj.sellerFilter.selectedSeller.id : null) : null,
                status: $scope.ordersFiltersObj.statusFilter ? ($scope.applyOrdersFiltersObj.statusFilter.selectedStatus ? $scope.applyOrdersFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null,
                currency: $scope.ordersFiltersObj.currencyFilter ? ($scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code ? $scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code : null): null,
                total_price: $scope.ordersFiltersObj.totalPriceFilter ? ($scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice ? $scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice : null): null
            };

            return vm.serviceUrl + 'admin/orders/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getOrdersLists = function (applyFilter) {
            $scope.loadingOrders = true;

            $scope.showingOrdersFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.ordersPagination.pageNo = 1;
            }

            if ($scope.ordersList.length > 0) {
                $scope.ordersList.length = 0;
            }

            var ordersUrl = vm.getOrdersUrl();

            if(vm.token) {
                $http.get(ordersUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(res.data.data.results.length > 0){
                            $scope.ordersListData = res.data.data;
                            $scope.ordersList = $scope.ordersListData.results;
                            $scope.loadingOrders = false;
                        } else {
                            $scope.loadingOrders = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingOrders = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.showOrderOptionsBox = function (order) {
            $scope.orderId = order.id;
        };

        $scope.closeOrderOptionsBox = function () {
            $scope.orderId = '';
        };

        $scope.displayOrderModal = function(page, size, orderObj){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DisplayOrderModalCtrl',
                resolve: {
                    order: function () {
                        return orderObj;
                    }
                }
            });

            vm.theModal.result.then(function(order){
                if(order){
                    $scope.getOrdersLists();
                }
            }, function(){
            });
        };

        $scope.goToAddOrder =  function () {
            // $location.path('/services/product/order/create');
            $location.path('/extensions/product/order/create');
        };

        $scope.openEditOrderView = function(order){
            // $location.path('/services/product/order/edit/' + order.id);
            $location.path('/extensions/product/order/edit/' + order.id);
        };

        $scope.deleteOrderConfirm = function(order){
            $ngConfirm({
                title: 'Delete order',
                content: 'Are you sure you want to delete this order?',
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
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function($scope){
                            $scope.deleteOrder(order);
                        }
                    }
                }
            });
        };

        $scope.deleteOrder = function (order) {
            if(vm.token) {
                $scope.loadingOrders = true;
                $http.delete(vm.serviceUrl + 'admin/orders/' + order.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Order successfully deleted');
                        $scope.getOrdersLists();
                    }
                }).catch(function (error) {
                    $scope.loadingOrders =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.getUserObjEmail = function (id) {
            $scope.userEmailObj = '';
            $http.get(environmentConfig.API + 'admin/users/?user=' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    if(res.data.data.results.length == 1){
                        $scope.userEmailObj = res.data.data.results[0];
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getOrderObject = function(orderId){
            if(vm.token){
                $http.get(vm.serviceUrl  + 'admin/orders/?page=1&page_size=1&id=' + orderId, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.displayOrderModal('app/pages/services/productService/orders/displayOrderModal/displayOrderModal.html', 'md', res.data.data.results[0]);
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };       

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                categoriesHelper.getProductCategoryList('availableCategories', vm.serviceUrl)
                .then(function(res){
                    $scope.availableCategories = res;
                    vm.getCompanyCurrencies();     
                    if($state.params.openPurchaseOrder){
                        $scope.clearOrdersFilters();
                        $scope.ordersFiltersObj.idFilter = true;
                        $scope.applyOrdersFiltersObj.idFilter.selectedId = $state.params.openPurchaseOrder;
            
                        $scope.getOrdersLists('applyFilter');
                        vm.getOrderObject($state.params.openPurchaseOrder);
                    }
                    else {
                        $scope.getOrdersLists();
                    }
                    $scope.getSellersList();
                })
                .catch(function(err){
                    $scope.loadingOrders = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                });                
            })
            .catch(function(err){
                $scope.loadingOrders = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
