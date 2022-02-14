(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.categoriesList')
        .controller('ProductCategoriesCtrl', ProductCategoriesCtrl);

    /** @ngInject */
    function ProductCategoriesCtrl($scope,$http,Rehive,localStorageManagement,serializeFiltersService,$state,categoriesHelper,
                                    $uibModal,errorHandler,typeaheadService,$location,toastr, $ngConfirm,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.statusOptions = ['Pending','Complete','Failed'];
        $scope.loadingCategories = true;
        $scope.categoriesFiltersCount = 0;
        $scope.showingCategoriesFilters = false;
        $scope.categoriesList = [];
        $scope.parentCategoriesList = [];
        $scope.productCategories = [];
        $scope.currencyOptions = [];
        $scope.categoryId = '';
        $scope.isOpen = false;
        $scope.categoriesPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        }; 

        $scope.categoriesFiltersObj = {
            idFilter: false,
            userFilter: false,
            statusFilter: false,
            currencyFilter: false,
            totalPriceFilter: false
        };

        $scope.applyCategoriesFiltersObj = {
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
            }
        };

        $scope.clearOrdersFilters = function () {
            $scope.categoriesFiltersObj = {
                idFilter: false,
                userFilter: false,
                statusFilter: false,
                currencyFilter: false,
                totalPriceFilter: false
            };
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.showCategoriesFilters = function () {
            $scope.showingCategoriesFilters = !$scope.showingCategoriesFilters;
        };

        vm.getCategoriesUrl = function(){
            $scope.categoriesFiltersCount = 0;

            for(var x in $scope.categoriesFiltersObj){
                if($scope.categoriesFiltersObj.hasOwnProperty(x)){
                    if($scope.categoriesFiltersObj[x]){
                        $scope.categoriesFiltersCount = $scope.categoriesFiltersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.categoriesPagination.pageNo,
                page_size: $scope.categoriesPagination.itemsPerPage || 25,
                // id: $scope.categoriesFiltersObj.idFilter ? $scope.applyCategoriesFiltersObj.idFilter.selectedId : null,
                // user: $scope.categoriesFiltersObj.userFilter ? ($scope.applyCategoriesFiltersObj.userFilter.selectedUser ? $scope.applyCategoriesFiltersObj.userFilter.selectedUser : null) : null,
                // status: $scope.categoriesFiltersObj.statusFilter ? ($scope.applyCategoriesFiltersObj.statusFilter.selectedStatus ? $scope.applyCategoriesFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null,
                // currency: $scope.categoriesFiltersObj.currencyFilter ? ($scope.applyCategoriesFiltersObj.currencyFilter.selectedCurrency.code ? $scope.applyCategoriesFiltersObj.currencyFilter.selectedCurrency.code : null): null,
                // total_price: $scope.categoriesFiltersObj.totalPriceFilter ? ($scope.applyCategoriesFiltersObj.totalPriceFilter.selectedTotalPrice ? $scope.applyCategoriesFiltersObj.totalPriceFilter.selectedTotalPrice : null): null
            };

            return vm.serviceUrl + 'admin/categories/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getCategoriesLists = function (applyFilter) {
            $scope.loadingCategories = true;

            $scope.showingCategoriesFilters = false;

            if (applyFilter) {
                $scope.categoriesPagination.pageNo = 1;
            }

            if ($scope.categoriesList.length > 0) {
                $scope.categoriesList.length = 0;
            }

            var categoriesUrl = vm.getCategoriesUrl();

            if(vm.token) {
                $http.get(categoriesUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(res.data.data.results.length > 0){
                            $scope.categoriesListData = res.data.data;
                            $scope.categoriesList = $scope.categoriesListData.results;
                            $scope.loadingCategories = false;
                        } else {
                            $scope.loadingCategories = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingCategories = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };  

        $scope.showCategoriesOptionsBox = function (category) {
            $scope.categoryId = category.id;
        };

        $scope.closeCategoryOptionsBox = function () {
            $scope.categoryId = '';
        };

        $scope.displayCategoryModal = function(page, size, categoryObj){
            // vm.theModal = $uibModal.open({
            //     animation: true,
            //     templateUrl: page,
            //     size: size,
            //     controller: 'DisplayCategoryModalCtrl',
            //     resolve: {
            //         category: function () {
            //             return categoryObj;
            //         }
            //     }
            // });

            // vm.theModal.result.then(function(category){
            //     if(category){
            //         $scope.getCategoriesLists();
            //     }
            // }, function(){
            // });
        };

        $scope.goToAddCategory =  function () {
            // $location.path('/extensions/product/category/create');

            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/services/productService/categories/addProductCategory/addProductCategory.html',
                size: 'md',
                controller: 'AddProductCategoryCtrl'
            });

            vm.theModal.result.then(function(category){
                if(category){
                    vm.clearProductCategories();
                    vm.fetchProductCategories();
                }
            }, function(){
            });
        };

        $scope.openEditCategoryView = function(categoryObj){
            // $location.path('/extensions/product/category/edit/' + category.id);
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/services/productService/categories/editProductCategory/editProductCategory.html',
                size: 'md',
                controller: 'EditProductCategoryCtrl',
                resolve: {
                    category: function () {
                        return categoryObj;
                    }
                }
            });

            vm.theModal.result.then(function(category){
                if(category){
                    vm.clearProductCategories();
                    vm.fetchProductCategories();
                }
            }, function(){
            });
        };

        $scope.deleteCategoryConfirm = function(category){
            var ngTitle = '';
            var ngContent = '';

            if(category.isType === 'parent'){
                ngTitle = 'Delete parent category';
                ngContent = 'Deleting a parent category will delete all of its first and second subcategories. Delete parent category?'
            }
            else if(category.isType === 'subCategory'){
                ngTitle = 'Delete first subcategory';
                ngContent = 'Deleting a first subcategory will delete all of its subcategories. Delete first subcategory?';
            }
            else if(category.isType === 'subChildren'){
                ngTitle = 'Delete category';
                ngContent = 'Are you sure you want to delete this category?';                
            }

            $ngConfirm({
                title: ngTitle,
                content: ngContent,
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
                            $scope.deleteCategory(category);
                        }
                    }
                }
            });            
        };

        $scope.deleteCategory = function (category) {
            if(vm.token) {
                $scope.loadingCategories = true;
                $http.delete(vm.serviceUrl + 'admin/categories/' + category.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Category has been successfully deleted');
                        vm.clearProductCategories();
                        vm.fetchProductCategories();
                    }
                }).catch(function (error) {
                    $scope.loadingCategories =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.clearProductCategories = function(){
            if(localStorageManagement.getValue('availableCategories')){ localStorageManagement.deleteValue('availableCategories'); }
            if(localStorageManagement.getValue('productCategories')){ localStorageManagement.deleteValue('productCategories'); }
        };

        vm.fetchProductCategories = function(){
            categoriesHelper.getProductCategoryList('productCategories', vm.serviceUrl)
            .then(function(res){
                $scope.productCategories = res;  
                $scope.loadingCategories = false;
                $scope.getCategoriesLists();

                if($state.params.openAddCategory){
                    $scope.goToAddCategory();
                }                  
            })
            .catch(function(err){
                $scope.loadingCategories = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl; 
                vm.fetchProductCategories();
            })
            .catch(function(err){
                $scope.loadingCategories = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

       
    }
})();
