(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.createVoucher')
        .controller('AddVoucherCtrl', AddVoucherCtrl);

    function AddVoucherCtrl($scope,$http,$location,localStorageManagement,extensionsHelper,
                          Rehive,serializeFiltersService,toastr,errorHandler,Upload) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        $scope.addingVoucher = true;
        $scope.loadingProducts = false;
        $scope.productList = [];
        $scope.products = [];
        $scope.virtualFormat = null;
        $scope.newVoucherParams = {
            product: null,
            codes: [],
            csv: null
        };

        vm.getProductsList = function () {
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/products/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.productList = res.data.data.results.filter(function(product){
                            return product.type === 'virtual';
                        });
                        $scope.newVoucherParams.product = $scope.productList[0];
                        $scope.trackVirtualFormat();
                    }
                }).catch(function (error) {
                    $scope.loadingProducts =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.trackVirtualFormat = function(){
            $scope.virtualFormat = $scope.newVoucherParams.product ? (
                $scope.newVoucherParams.product.virtual_format === 'raw' ? "Raw text" : $scope.newVoucherParams.product.virtual_format === 'qr' ? "QR" : "Bar code"
                ) : "Raw text";
        };

        $scope.addNewVoucher = function (newVoucherParams) {
            if(newVoucherParams.codes.length > 0){
                if(newVoucherParams.csv && newVoucherParams.csv.name){
                    $scope.upload(null);
                }
                newVoucherParams.codes.forEach(function(voucher, index, array){
                    if(index === array.length - 1){
                        vm.addVoucherCodes({product: newVoucherParams.product.id, code: voucher.code}, 'last');
                    }
                    else{
                        vm.addVoucherCodes({product: newVoucherParams.product.id, code: voucher.code}, null);
                    }
                });              
            }
            else{
                if(newVoucherParams.csv && newVoucherParams.csv.name){
                    $scope.upload('last');
                }
                else {
                    toastr.error('Please add a voucher code or upload a csv to create a voucher.');
                    return false;
                }
            }
        };

        $scope.upload = function (last) {
            if(!$scope.newVoucherParams.csv.name){
                return;
            }
            $scope.addingVoucher = true;

            var uploadDataObj = {
                product: $scope.newVoucherParams.product.id,
                file: $scope.newVoucherParams.csv.name ? $scope.newVoucherParams.csv : null
            };

            Upload.upload({
                url: vm.serviceUrl + 'admin/vouchers/import/',
                data: serializeFiltersService.objectFilters(uploadDataObj),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "POST"
            }).then(function (res) {
                setTimeout(function(){
                    if(last){
                        $scope.addingVoucher = false;                        
                    }
                },10);
                toastr.success('Voucher added successfully');
                $location.path('/extensions/product/vouchers');
            }).catch(function (error) {
                $scope.addingVoucher = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.addVoucherCodes = function (voucherItem,last) {
            if(vm.token) {
                $scope.addingVoucher = true;
                $http.post(vm.serviceUrl + 'admin/vouchers/', voucherItem, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last){
                        $scope.addingVoucher = false;
                        toastr.success('Voucher added successfully');
                        $location.path('/extensions/product/vouchers');
                    }
                }).catch(function (error) {
                    $scope.addingVoucher =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addVoucherCode = function () {
            var voucher = {
                code: null
            };
            $scope.newVoucherParams.codes.push(voucher);
        };

        $scope.removeVoucherCode = function(voucher){
            $scope.newVoucherParams.codes.forEach(function (item,index,array) {
                if(item.code === voucher.code){
                    array.splice(index, 1);
                }
            });
        };

        $scope.backToVoucherList = function () {
            $location.path('/extensions/product/vouchers');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getProductsList();
                $scope.addingVoucher = false;
            })
            .catch(function(err){
                $scope.addingVoucher = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
