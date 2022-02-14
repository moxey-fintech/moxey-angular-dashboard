(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.categoriesList')
    .controller('EditProductCategoryCtrl', EditProductCategoryCtrl);

    function EditProductCategoryCtrl($scope,$http,$location,localStorageManagement,extensionsHelper,categoriesHelper,
                                    serializeFiltersService,toastr,errorHandler,$uibModalInstance,category) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.categoryId = category ? category.id : null;
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        $scope.updatingCategory = true;
        $scope.loadingCategories = false;
        $scope.loadingCategory = false;
        $scope.availableCategories = [];
        vm.editCategoryObj = {};
        $scope.editCategoryObj = category;
        $scope.editCategoryObj.isParent = $scope.editCategoryObj.isType == 'parent';

        $scope.trackCategoryChanges = function(field){ 
            if(field === 'isParent'){
                vm.editCategoryObj.parent = {};
                vm.editCategoryObj.parent = $scope.editCategoryObj[field] ? null : $scope.editCategoryObj.parent.id; 
            }
            else if(field === 'parent'){
                vm.editCategoryObj[field] = $scope.editCategoryObj[field].id;
            }
            else {
                vm.editCategoryObj[field] = $scope.editCategoryObj[field];
            }
        };

        $scope.updateCategory = function(){
            if(vm.token) {
                $scope.updatingCategory = true;
                $http.patch(vm.serviceUrl + 'admin/categories/' + $scope.editCategoryObj.id + '/', vm.editCategoryObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCategory = false;
                    toastr.success('Category updated successfully.');
                    $uibModalInstance.close(true);
                }).catch(function (error) {
                    $scope.updatingCategory = false;
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
                .then(function(res){
                    $scope.availableCategories = res;
                    if($scope.editCategoryObj.parent && $scope.editCategoryObj.parent.id){
                        $scope.editCategoryObj.parent = $scope.availableCategories.find(function(category){
                            return category.id === $scope.editCategoryObj.parent.id;
                        });
                    }                    
                    $scope.updatingCategory = false;
                })
                .catch(function(err){
                    $scope.updatingCategory = false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                    $uibModalInstance.close(false);
                });
            })
            .catch(function(err){
                $scope.updatingCategory = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(false);
            });
        };
        vm.fetchServiceUrl(serviceName);
        
    }
})();
