(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceCategories')
        .controller('EditBusinessServiceCategoryModalCtrl', EditBusinessServiceCategoryModalCtrl);

    function EditBusinessServiceCategoryModalCtrl($scope,$uibModalInstance,_,toastr,category,extensionsHelper,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "business_service";
        vm.exisitingCategories = [];
        vm.editCategoryParams = category;
        $scope.editingCategory = true;
        $scope.editCategoryParams = {}; 

        vm.getCategory = function(){
            if(vm.token) {
                $scope.editingCategory = true;
                $http.get(vm.baseUrl + 'admin/business-categories/' + vm.editCategoryParams.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                        $scope.editingCategory =  false;
                        $scope.editCategoryParams= res.data.data;
                }).catch(function (error) {
                    $scope.editingCategory =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };   
        
        $scope.editCategoryFunction = function () {            

            var editedCategory = {
                name: $scope.editCategoryParams.name,
                description: $scope.editCategoryParams.description
            };

            if(vm.token){
                $scope.editingCategory = true;
                $http.patch(vm.baseUrl + 'admin/business-categories/' + $scope.editCategoryParams.id + '/', editedCategory, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingCategory = false;
                    toastr.success('Category successfully updated');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.editingCategory = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        
        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.editingCategory = false;
                vm.baseUrl = serviceUrl;
                vm.getCategory();
            })
            .catch(function(err){
                $scope.editingCategory = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();