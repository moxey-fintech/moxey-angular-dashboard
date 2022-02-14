(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceCategories')
        .controller('BusinessServiceCategoriesCtrl', BusinessServiceCategoriesCtrl);

    function BusinessServiceCategoriesCtrl($scope,$http,$location,localStorageManagement,serializeFiltersService,toastr,$uibModal,errorHandler,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "business_service";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingCategories = true;
        $scope.businessCategoriesList = [];

        $scope.categoriesPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getBusinessCategoriesUrl = function(){
            // $scope.ordersFiltersCount = 0;

            // for(var x in $scope.ordersFiltersObj){
            //     if($scope.ordersFiltersObj.hasOwnProperty(x)){
            //         if($scope.ordersFiltersObj[x]){
            //             $scope.ordersFiltersCount = $scope.ordersFiltersCount + 1;
            //         }
            //     }
            // }

            var searchObj = {
                page: $scope.categoriesPagination.pageNo,
                page_size: $scope.categoriesPagination.itemsPerPage || 25,
                // id: $scope.ordersFiltersObj.idFilter ? $scope.applyOrdersFiltersObj.idFilter.selectedId : null,
                // user: $scope.ordersFiltersObj.userFilter ? ($scope.applyOrdersFiltersObj.userFilter.selectedUser ? $scope.applyOrdersFiltersObj.userFilter.selectedUser : null) : null,
                // status: $scope.ordersFiltersObj.statusFilter ? ($scope.applyOrdersFiltersObj.statusFilter.selectedStatus ? $scope.applyOrdersFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null,
                // currency: $scope.ordersFiltersObj.currencyFilter ? ($scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code ? $scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code : null): null,
                // total_price: $scope.ordersFiltersObj.totalPriceFilter ? ($scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice ? $scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice : null): null
            };

            return vm.serviceUrl + 'admin/business-categories/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getCategoriesList = function (applyFilter) {
            $scope.loadingCategories = true;

            // $scope.showingCategoriesFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.categoriesPagination.pageNo = 1;
            }

            if ($scope.businessCategoriesList.length > 0) {
                $scope.businessCategoriesList.length = 0;
            }

            var businessCategoriesUrl = vm.getBusinessCategoriesUrl();

            if(vm.token) {
                $http.get(businessCategoriesUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.businessCategoriesListData = res.data.data;
                        $scope.businessCategoriesList = $scope.businessCategoriesListData.results;
                    }
                    $scope.loadingCategories = false;
                }).catch(function (error) {
                    $scope.loadingCategories = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditCategoryModal = function (page, size, category) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditBusinessServiceCategoryModalCtrl',
                scope: $scope,
                resolve: {
                    category: function () {
                        return category;
                    }
                }
            });
            vm.theModal.result.then(function(categoryEdited){
                    if(categoryEdited){
                        $scope.getCategoriesList();
                    }   
                }, function(){}
            );
        };

        $scope.goToAddCategoryView = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'CreateBusinessCategoryModalCtrl',
                scope: $scope,
            });

            vm.theAddModal.result.then(function(categories){
                if(categories){
                    $scope.getCategoriesList();
                }

            }, function(){
            });
        };

        $scope.openDeleteCategoryModal = function (page, size, category) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteBusinessServiceCategoryModalCtrl',
                scope: $scope,
                resolve: {
                    category: function () {
                        return category;
                    }
                }
            });

            vm.theModal.result.then(function(category){
                if(category){
                    $scope.getCategoriesList();
                }
            }, function(){
            });
        };

        // $scope.displayCategoryModal = function (page,size,categoryObj) {
        //     vm.theModal = $uibModal.open({
        //         animation: true,
        //         templateUrl: page,
        //         size: size,
        //         controller: 'ViewBusinessCategoryModalCtrl',
        //         resolve: {
        //             categoryObj: function () {
        //                 return categoryObj;
        //             }
        //         }
        //     });

        //     vm.theModal.result.then(function(categories){
        //         if(categories){
        //             $scope.getCategoriesLists();
        //         }
        //     }, function(){
        //     });
        // };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getCategoriesList();
            })
            .catch(function(err){
                $scope.loadingCategories = false;
                toastr.error("Extension not activated for company");
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
