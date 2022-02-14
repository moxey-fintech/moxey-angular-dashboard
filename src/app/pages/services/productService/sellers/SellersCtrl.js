(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.sellerList')
        .controller('SellersCtrl', SellersCtrl);

    /** @ngInject */
    function SellersCtrl($scope,$http,Rehive,localStorageManagement,serializeFiltersService,environmentConfig,$state,categoriesHelper,
                        $uibModal,errorHandler,typeaheadService,$location,toastr, $ngConfirm,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingSellers = true;

        $scope.sellersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.getSellersList = function () {  
            var searchObj = {
                page: $scope.sellersPagination.pageNo,
                page_size: $scope.sellersPagination.itemsPerPage || 25
            }          
            if(vm.token) {
                $scope.loadingSellers = true;
                var sellersUrl = vm.serviceUrl + 'admin/sellers/?' + serializeFiltersService.serializeFilters(searchObj);
                $http.get(sellersUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.sellersListData = res.data.data;
                    $scope.sellersList = $scope.sellersListData.results;
                    $scope.loadingSellers = false;
                }).catch(function (error) {
                    $scope.loadingSellers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openViewSellerModal = function(page, size, seller){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ViewSellerModalCtrl',
                resolve: {
                    sellerId: function () {
                        return seller.id;
                    }
                }
            });

            vm.theModal.result.then(function(order){
                if(order){
                    $scope.getSellersList();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getSellersList();
            })
            .catch(function(err){
                $scope.loadingSellers = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
