(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.sellerList')
        .controller('ViewSellerModalCtrl', ViewSellerModalCtrl);

    /** @ngInject */
    function ViewSellerModalCtrl($scope,$http,Rehive,localStorageManagement,serializeFiltersService,environmentConfig,$state,$window,
        $uibModalInstance,errorHandler,sellerId,$location,toastr, $ngConfirm,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        vm.sellerId = sellerId;
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.editingSeller = true;
        $scope.editSellerObj = {};
        $scope.updatedSellerObj = {};
        $scope.editModeOn = false;

        $scope.isEmpty = function(obj){
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    return false;
                }
            }
            return true;
        };

        $scope.toggleEditingSeller = function(){
            $scope.editModeOn = !$scope.editModeOn;
        };

        $scope.sellerDetailsChanged = function(fieldName){
            $scope.updatedSellerObj[fieldName] = $scope.editSellerObj[fieldName];
        };
        
        $scope.goToUser = function () {
            $window.open('/#/user/' + $scope.editSellerObj.owner + '/details','_blank');
        };
        
        vm.getSellerOwner = function(){
            if(vm.token){
                Rehive.admin.users.get({id: $scope.editSellerObj.owner}).then(function (res) {
                    $scope.user = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.editingSeller = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        }; 

        $scope.getSeller = function () {
            if(vm.token) {
                $scope.editingSeller = true;
                $http.get(vm.serviceUrl + 'admin/sellers/' + vm.sellerId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editSellerObj = res.data.data;
                    $scope.editSellerObj.metadata = $scope.editSellerObj.metadata ? JSON.stringify($scope.editSellerObj.metadata) : null;
                    vm.getSellerOwner();
                    $scope.editingSeller = false;
                }).catch(function (error) {
                    $scope.editingSeller = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.saveSellerChanges = function(){
            if(vm.token) {
                $scope.editingSeller = true;
                $http.patch(vm.serviceUrl + 'admin/sellers/' + vm.sellerId + '/', $scope.updatedSellerObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editSellerObj = res.data.data;
                    $scope.editingSeller = false;
                    toastr.success("Seller updated successfully");
                    $uibModalInstance.close(true);
                }).catch(function (error) {
                    $scope.editingSeller = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getSeller();
            })
            .catch(function(err){
                $scope.editingSeller = false;
                toastr.error("Extension not activated for company");
                $uibModalInstance.close(false);
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();