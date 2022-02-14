(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.categoriesList')
        .controller('AddProductCategoryCtrl', AddProductCategoryCtrl);

    function AddProductCategoryCtrl($scope,$http,$location,localStorageManagement,serializeFiltersService,toastr,errorHandler,$uibModalInstance,extensionsHelper,categoriesHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        $scope.addingCategory = false;
        $scope.loadingCategories = true;
        $scope.availableCategories = [];
        $scope.newCategoryParams = {
            name: null,
            isParent: false,
            parent: null
        };

        $scope.trackParentChange = function(parentCategory){
            // $scope.newCategoryParams.parent = parentCategory;
        };

        $scope.addNewCategory = function(newCategoryParams){
            if(!newCategoryParams.isParent && !newCategoryParams.parent){
                toastr.error("Please select a parent category or check to make this category a parent.");
                return;
            }
            
            var newCategory = {
                name: newCategoryParams.name,
                parent: newCategoryParams.isParent ? null : newCategoryParams.parent.id
            };

            newCategory = serializeFiltersService.objectFilters(newCategory);

            if(vm.token) {
                $scope.addingCategory = true;
                $http.post(vm.serviceUrl + 'admin/categories/', newCategory, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingCategory = false;
                    toastr.success('Category added successfully.');
                    $uibModalInstance.close(true);
                }).catch(function (error) {
                    $scope.addingCategory = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        $scope.closeModal = function () {
            $uibModalInstance.close(true);
        };

        $scope.backToCategoryList = function () {
            $location.path('/extensions/product/categories');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                categoriesHelper.getProductCategoryList('availableCategories', vm.serviceUrl)
                .then(function (res){
                    $scope.loadingCategories = false;
                    $scope.availableCategories = res;
                })
                .catch(function (err){
                    $scope.loadingCategories = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                    $uibModalInstance.close(true);
                });
            })
            .catch(function(err){
                $scope.loadingCategories = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
