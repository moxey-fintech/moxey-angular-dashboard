(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.businessService.businessServiceBusinesses')
        .controller('BusinessServiceBusinessesCtrl', BusinessServiceBusinessesCtrl);

    function BusinessServiceBusinessesCtrl($rootScope,$scope,$http,$location,localStorageManagement,serializeFiltersService,toastr,errorHandler,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Business extension | Moxey';
        vm.serviceUrl = null; 
        var serviceName = "business_service";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingBusinesses = true;
        $scope.businessesList = [];

        $scope.businessesPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getBusinessesUrl = function(){
            // $scope.ordersFiltersCount = 0;

            // for(var x in $scope.ordersFiltersObj){
            //     if($scope.ordersFiltersObj.hasOwnProperty(x)){
            //         if($scope.ordersFiltersObj[x]){
            //             $scope.ordersFiltersCount = $scope.ordersFiltersCount + 1;
            //         }
            //     }
            // }

            var searchObj = {
                page: $scope.businessesPagination.pageNo,
                page_size: $scope.businessesPagination.itemsPerPage || 25,
                // id: $scope.ordersFiltersObj.idFilter ? $scope.applyOrdersFiltersObj.idFilter.selectedId : null,
                // user: $scope.ordersFiltersObj.userFilter ? ($scope.applyOrdersFiltersObj.userFilter.selectedUser ? $scope.applyOrdersFiltersObj.userFilter.selectedUser : null) : null,
                // status: $scope.ordersFiltersObj.statusFilter ? ($scope.applyOrdersFiltersObj.statusFilter.selectedStatus ? $scope.applyOrdersFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null,
                // currency: $scope.ordersFiltersObj.currencyFilter ? ($scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code ? $scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code : null): null,
                // total_price: $scope.ordersFiltersObj.totalPriceFilter ? ($scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice ? $scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice : null): null
            };

            return vm.serviceUrl + 'admin/businesses/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getBusinessesList = function (applyFilter) {
            $scope.loadingBusinesses = true;

            // $scope.showingBusinessesFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.businessesPagination.pageNo = 1;
            }

            if ($scope.businessesList.length > 0) {
                $scope.businessesList.length = 0;
            }

            var businessesUrl = vm.getBusinessesUrl();

            if(vm.token) {
                $http.get(businessesUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.businessesListData = res.data.data;
                        $scope.businessesList = $scope.businessesListData.results;
                    }
                    $scope.loadingBusinesses = false;
                }).catch(function (error) {
                    $scope.loadingBusinesses = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToBusinessDetails = function(businessId){
            $location.path('/extensions/business/businesses/' + businessId);
        };
        

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getBusinessesList();
            })
            .catch(function(err){
                $scope.loadingBusinesses = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
