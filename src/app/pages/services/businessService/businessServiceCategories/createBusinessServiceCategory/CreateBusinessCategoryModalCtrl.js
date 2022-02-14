(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceCategories')
        .controller('CreateBusinessCategoryModalCtrl', CreateBusinessCategoryModalCtrl);

    function CreateBusinessCategoryModalCtrl($scope,$uibModalInstance,_,toastr,cleanObject,extensionsHelper,$http,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "business_service";
        vm.exisitingCategories = [];
        $scope.addingCategory = true;
        $scope.newCategoryParams = {
            name: "",
            description: ""
        };  

        $scope.addCategory = function () {            

            var newCategory = {
                name: $scope.newCategoryParams.name,
                description: $scope.newCategoryParams.description
            };

           // newCategory= cleanObject.cleanObj(newCategory);  What does this do?

            if(vm.token){
                $scope.addingCategory = true;
                $http.post(vm.baseUrl + 'admin/business-categories/', newCategory, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingCategory = false;
                    toastr.success('Category successfully added');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.addingCategory = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }            
        };
        

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope.addingCategory = false;
                vm.baseUrl = serviceUrl;
            })
            .catch(function(err){
                $scope.addingCategory = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();