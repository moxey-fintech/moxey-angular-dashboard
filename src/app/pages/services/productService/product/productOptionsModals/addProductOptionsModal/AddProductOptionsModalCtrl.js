(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .controller('AddProductOptionsModalCtrl', AddProductOptionsModalCtrl);

    /** @ngInject */
    function AddProductOptionsModalCtrl($scope,localStorageManagement,$uibModalInstance,$http,extensionsHelper,$location,toastr, productId,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        vm.productId = productId;
        $scope.addingNewProductOption = true;

        $scope.newOptionParams = {
            name: null,
            values: []
        };

        $scope.addValue = function(){
            $scope.newOptionParams.values.push({key: $scope.newOptionParams.values.length, val: ""});
        };

        $scope.removeValue = function($index){
            $scope.newOptionParams.values.splice($index, 1);
        };

        $scope.saveNewOption = function(){
            var valuesAreProvided = true, optionValues = [];
            if($scope.newOptionParams.values.length === 0){
                toastr.error("Please add atleast one value to the option");
                return;
            } else {
                $scope.newOptionParams.values.forEach(function(item, idx, arr){
                    if(!item || item.val === ''){
                        valuesAreProvided = false;
                        return false;
                    }
                    optionValues.push(item.val);
                });
            }
            
            if(!valuesAreProvided){
                toastr.error("Please provide all the values correctly");
                return;
            }
            $scope.newOptionParams.values = optionValues;
            if(vm.productId === null){
                $scope.addingNewProductOption = true;
                setTimeout(function(){
                    $scope.addingNewProductOption = false;
                    toastr.success("Product option added successfully");
                    $uibModalInstance.close($scope.newOptionParams);
                }, 1200);
            } else {
                $scope.addNewProductOption();
            }
        };

        $scope.addNewProductOption = function(){
            if(vm.token){
                $scope.addingNewProductOption = true;
                $http.post(vm.serviceUrl + 'admin/products/' + vm.productId + '/options/', $scope.newOptionParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.newOptionParams = res.data.data;
                    $scope.addingNewProductOption = false;
                    toastr.success("Product option added successfully");
                    $uibModalInstance.close($scope.newOptionParams);
                }).catch(function (error) {
                    $scope.addingNewProductOption = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.addingNewProductOption = false;                
            })
            .catch(function(err){
                $scope.addingNewProductOption = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();