(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.vouchersList')
        .controller('DisplayVoucherModalCtrl', DisplayVoucherModalCtrl);

    function DisplayVoucherModalCtrl($rootScope, $uibModalInstance, $scope,$http, voucher,localStorageManagement,errorHandler,toastr, $location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        vm.voucherObj = voucher;
        $scope.loadingVoucher = true;
        $scope.loadingOrders = false;
        $scope.editingVoucher = vm.voucherObj.editingStatus ? vm.voucherObj.editingStatus : false;
        $scope.voucherChanged = false;
        $scope.voucherStatusChanged = false;
        $scope.disablePending = false;
        $scope.completedPayment = false;
        $scope.voucherObj = {};
        $scope.disableAvailable = false;
        $scope.orderStatusOptions = ["purchased","redeemed"];

        vm.getVoucher = function(){
            if(vm.token) {
                $scope.loadingVoucher = true;
                $http.get(vm.serviceUrl + 'admin/vouchers/' + vm.voucherObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingVoucher =  false;
                    $scope.voucherObj = res.data.data;
                    if($scope.voucherObj.item) {
                        $scope.voucherObj.product_or_item = $scope.voucherObj.item
                    }
                    else {
                        $scope.voucherObj.product_or_item = $scope.voucherObj.product
                    }
                    $scope.voucherObj.product_or_item.virtual_format = ($scope.voucherObj.product_or_item.virtual_format === 'raw') ? "Raw text" : ($scope.voucherObj.product_or_item.virtual_format === 'qr' ? "QR" : "Barcode");
                    $scope.disableAvailable = ($scope.voucherObj.status === 'purchased');
                }).catch(function (error) {
                    $scope.loadingVoucher =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.toggleEditingVoucher = function(){
            $scope.editingVoucher = !$scope.editingVoucher;
        };

        $scope.voucherStatusChanged = function(){
          if(vm.voucherObj.status !== $scope.voucherObj.status){
              $scope.voucherChanged = true;
          } else {
              $scope.voucherChanged = false;
          }
        };

        $scope.updateVoucherStatus = function(){
            if(vm.token){
                if($scope.voucherChanged){
                    $scope.loadingVoucher = true;
                    $http.patch(vm.serviceUrl + 'admin/vouchers/' + vm.voucherObj.id + '/', {status: $scope.voucherObj.status}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        $scope.loadingVoucher =  false;                            
                        toastr.success('Order status updated successfully');
                        $scope.closeModal();
                    }).catch(function (error) {
                        $scope.loadingVoucher =  false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }         
            }
        };

        $scope.closeModal = function () {
            $uibModalInstance.close(true);
            $location.path('/extensions/product/vouchers');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getVoucher();
            })
            .catch(function(err){
                $scope.loadingVoucher = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
