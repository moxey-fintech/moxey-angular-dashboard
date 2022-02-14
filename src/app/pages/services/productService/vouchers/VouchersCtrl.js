(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.vouchersList')
        .controller('VouchersCtrl', VouchersCtrl);

    /** @ngInject */
    function VouchersCtrl($scope,$http,Rehive,localStorageManagement,serializeFiltersService,extensionsHelper,
                        $uibModal,errorHandler,typeaheadService,$location,toastr, $ngConfirm, $state) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.statusOptions = ['Pending','Complete','Failed'];
        $scope.loadingVouchers = true;
        $scope.vouchersFiltersCount = 0;
        $scope.showingVouchersFilters = false;
        $scope.vouchersList = [];
        $scope.currencyOptions = [];
        $scope.voucherId = '';

        $scope.vouchersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.vouchersFiltersObj = {
            productIdFilter: false,
            productNameFilter: false
        };

        $scope.applyVouchersFiltersObj = {
            productIdFilter: {
                selectedId: null
            },
            productNameFilter: {
                selectedName: null
            }
        };

        vm.getCompanyCurrencies = function () {
            Rehive.admin.currencies.get({filters: {
                page_size: 250,
                archived: false
            }}).then(function (res) {
                if(res.results.length > 0){
                    $scope.currencyOptions = res.results;
                    $scope.$apply();
                }
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        
        $scope.clearVouchersFilters = function () {
            $scope.vouchersFiltersObj = {
                productIdFilter: false,
                productNameFilter: false
            };
            $scope.showVouchersFilters();
            $scope.getVouchersLists('applyfilter');
        };

        $scope.showVouchersFilters = function () {
            $scope.showingVouchersFilters = !$scope.showingVouchersFilters;
        };

        vm.getVouchersUrl = function(){
            $scope.vouchersFiltersCount = 0;

            for(var x in $scope.vouchersFiltersObj){
                if($scope.vouchersFiltersObj.hasOwnProperty(x)){
                    if($scope.vouchersFiltersObj[x]){
                        $scope.vouchersFiltersCount = $scope.vouchersFiltersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.vouchersPagination.pageNo,
                page_size: $scope.vouchersPagination.itemsPerPage || 25,
                product: $scope.vouchersFiltersObj.productIdFilter ? $scope.applyVouchersFiltersObj.productIdFilter.selectedId : (
                    $scope.vouchersFiltersObj.productNameFilter ? $scope.applyVouchersFiltersObj.productNameFilter.selectedName : null
                )
            };

            return vm.serviceUrl + 'admin/vouchers/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getVouchersLists = function (applyFilter) {
            $scope.loadingVouchers = true;

            $scope.showingVouchersFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.vouchersPagination.pageNo = 1;
            }

            if ($scope.vouchersList.length > 0) {
                $scope.vouchersList.length = 0;
            }

            var vouchersUrl = vm.getVouchersUrl();

            if(vm.token) {
                $http.get(vouchersUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.vouchersListData = res.data.data;
                        $scope.vouchersList = $scope.vouchersListData.results;
                        $scope.vouchersList.forEach(function(voucher){
                            if(voucher.item) {
                                voucher.product_or_item = voucher.item
                            } 
                            else {
                                voucher.product_or_item = voucher.product
                            }
                            if(voucher.product_or_item.virtual_format === 'bar'){
                                voucher.product_or_item.virtual_format = 'Bar code';
                            }
                            else if(voucher.product_or_item.virtual_format === 'qr'){
                                voucher.product_or_item.virtual_format = 'QR';
                            }
                            else if(voucher.product_or_item.virtual_format === 'raw'){
                                voucher.product_or_item.virtual_format = 'Raw text';
                            }
                            else {
                                voucher.product_or_item.virtual_format = 'Null';
                            }
                        });
                        $scope.loadingVouchers = false;
                    } else {
                        $scope.loadingVouchers = false;
                    }
                }).catch(function (error) {
                    $scope.loadingVouchers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.showVoucherOptionsBox = function (voucher) {
            $scope.voucherId = voucher.id;
        };

        $scope.closeVoucherOptionsBox = function () {
            $scope.voucherId = '';
        };

        $scope.editVoucherStatus = function(voucherObj){
            voucherObj.editingStatus = true;
            $scope.displayVoucherModal('app/pages/services/productService/vouchers/displayVoucherModal/displayVoucherModal.html', 'md', voucherObj);
        };

        $scope.displayVoucherModal = function(page, size, voucherObj){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DisplayVoucherModalCtrl',
                resolve: {
                    voucher: function () {
                        return voucherObj;
                    }
                }
            });

            vm.theModal.result.then(function(voucher){
                if(voucher){
                    $scope.getVouchersLists();
                }
            }, function(){
            });
        };

        $scope.goToAddVoucher =  function () {
            // $location.path('/services/product/voucher/create');
            $location.path('/extensions/product/vouchers/create');
        };

        $scope.openEditVoucherView = function(voucher){
            // $location.path('/services/product/voucher/edit/' + voucher.id);
            $location.path('/extensions/product/voucher/edit/' + voucher.id);
        };

        $scope.deleteVoucherConfirm = function(voucher){
            $ngConfirm({
                title: 'Delete voucher',
                content: 'Are you sure you want to delete this voucher?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function($scope){
                            $scope.deleteVoucher(voucher);
                        }
                    }
                }
            });
        };

        $scope.deleteVoucher = function (voucher) {
            if(vm.token) {
                $scope.loadingVouchers = true;
                $http.delete(vm.serviceUrl + 'admin/vouchers/' + voucher.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Voucher deleted successfully');
                        $scope.getVouchersLists();
                    }
                }).catch(function (error) {
                    $scope.loadingVouchers =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                vm.getCompanyCurrencies();
                if($state.params.productId){
                    $scope.clearVouchersFilters();
                    $scope.vouchersFiltersObj.productIdFilter = true;
                    $scope.applyVouchersFiltersObj.productIdFilter.selectedId = $state.params.productId;
                    $scope.getVouchersLists('applyFilter');
                }
                else {
                    $scope.getVouchersLists();
                }
            })
            .catch(function(err){
                $scope.loadingVouchers = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
