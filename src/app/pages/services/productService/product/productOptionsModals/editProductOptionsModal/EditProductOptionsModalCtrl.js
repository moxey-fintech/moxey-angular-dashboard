(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .controller('EditProductOptionsModalCtrl', EditProductOptionsModalCtrl);

    /** @ngInject */
    function EditProductOptionsModalCtrl($scope,localStorageManagement,$uibModalInstance,$http,extensionsHelper,$location,toastr, productId, editProductOption,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        vm.productId = productId;
        vm.editProductOption = editProductOption;
        $scope.editingProductOption = true;
        $scope.editOptionParams = {};
        $scope.optionValuesToDelete = [];

        $scope.addValue = function(){
            $scope.editOptionParams.values.push({key: $scope.editOptionParams.values.length, val: ""});
        };

        $scope.removeValue = function($index){
            $scope.editOptionParams.values.splice($index, 1);
        };

        $scope.saveEditedOption = function(){
            var valuesAreProvided = true, optionValues = [];
            if($scope.editOptionParams.values.length === 0){
                toastr.error("Please add atleast one value to the option");
                return;
            } else {
                $scope.editOptionParams.values.forEach(function(item, idx, arr){
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
            $scope.editOptionParams.values = optionValues;
            if(vm.productId === null){
                $scope.editingProductOption = true;
                setTimeout(function(){
                    $scope.editingProductOption = false;
                    toastr.success("Product option updated successfully");
                    $uibModalInstance.close($scope.editOptionParams);
                }, 1200);
            } else {
                $scope.updateProductOption();
            }
        };

        $scope.formatOptionValues = function(){    
            var tempOptionValues = $scope.editOptionParams.values;        
            $scope.editOptionParams.values = [];        
            tempOptionValues.forEach(function(value, idx, arr){
                var formattedValue = {
                    key: idx,
                    val: value
                };
                $scope.editOptionParams.values.push(formattedValue);
            });
        };

        $scope.initDummyEditParams = function(){
            $scope.editOptionParams = {
                name: vm.editProductOption.name,
                values: vm.editProductOption.values
            };
            $scope.formatOptionValues();
            $scope.editingProductOption = false;
        };

        $scope.getProductOption = function(){
            if(vm.token){
                $scope.editingProductOption = true;
                $http.get(vm.serviceUrl + 'admin/products/' + vm.productId + '/options/' + vm.editProductOption.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editOptionParams = res.data.data;
                    $scope.formatOptionValues();
                    $scope.editingProductOption = false;
                }).catch(function (error) {
                    $scope.editingProductOption = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateProductOption = function(){
            var updatedOption = {
                name: $scope.editOptionParams.name,
                values: $scope.editOptionParams.values
            };
            if(vm.token){
                $scope.editingProductOption = true;
                $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/options/' + vm.editProductOption.id + '/', updatedOption, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editOptionParams = res.data.data;
                    $scope.editingProductOption = false;
                    toastr.success("Product option updated successfully");
                    $uibModalInstance.close($scope.editOptionParams);
                }).catch(function (error) {
                    $scope.editingProductOption = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                (vm.productId === null && vm.editProductOption.id === undefined) ? $scope.initDummyEditParams() : $scope.getProductOption();                
            })
            .catch(function(err){
                $scope.editingProductOption = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();