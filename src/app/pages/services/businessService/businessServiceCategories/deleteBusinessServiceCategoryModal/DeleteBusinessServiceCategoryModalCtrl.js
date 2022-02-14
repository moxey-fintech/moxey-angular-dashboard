(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceCategories')
        .controller('DeleteBusinessServiceCategoryModalCtrl', DeleteBusinessServiceCategoryModalCtrl);

    function DeleteBusinessServiceCategoryModalCtrl($scope,$uibModalInstance,category,toastr,$http,localStorageManagement,errorHandler,$location,extensionsHelper) {

        var vm = this;

        $scope.category = category;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "business_service";
        $scope.deletingCategory = true;

        $scope.deleteCategory = function () {
            $scope.deletingCategory = true;
            $http.delete(vm.baseUrl + 'admin/business-categories/' + $scope.category.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingCategory = false;
                toastr.success('Category successfully deleted');
                $uibModalInstance.close($scope.category);
            }).catch(function (error) {
                $scope.deletingCategory = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.loadExtensionUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.deletingCategory = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.deletingCategory = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.loadExtensionUrl(serviceName);
        
    }
})();
