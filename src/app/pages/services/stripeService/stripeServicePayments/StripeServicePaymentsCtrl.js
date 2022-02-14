(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stripeService.stripeServicePayments')
        .controller('StripeServicePaymentsCtrl', StripeServicePaymentsCtrl);

    function StripeServicePaymentsCtrl($scope,$http,$location,localStorageManagement,serializeFiltersService,toastr,errorHandler,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "stripe_service";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.statusOptions = ['Pending','Complete','Failed'];
        $scope.loadingPayments = true;
        $scope.stripePaymentsList = [];

        $scope.paymentsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getStripePaymentsUrl = function(){
            // $scope.ordersFiltersCount = 0;

            // for(var x in $scope.ordersFiltersObj){
            //     if($scope.ordersFiltersObj.hasOwnProperty(x)){
            //         if($scope.ordersFiltersObj[x]){
            //             $scope.ordersFiltersCount = $scope.ordersFiltersCount + 1;
            //         }
            //     }
            // }

            var searchObj = {
                page: $scope.paymentsPagination.pageNo,
                page_size: $scope.paymentsPagination.itemsPerPage || 25,
                // id: $scope.ordersFiltersObj.idFilter ? $scope.applyOrdersFiltersObj.idFilter.selectedId : null,
                // user: $scope.ordersFiltersObj.userFilter ? ($scope.applyOrdersFiltersObj.userFilter.selectedUser ? $scope.applyOrdersFiltersObj.userFilter.selectedUser : null) : null,
                // status: $scope.ordersFiltersObj.statusFilter ? ($scope.applyOrdersFiltersObj.statusFilter.selectedStatus ? $scope.applyOrdersFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null,
                // currency: $scope.ordersFiltersObj.currencyFilter ? ($scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code ? $scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code : null): null,
                // total_price: $scope.ordersFiltersObj.totalPriceFilter ? ($scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice ? $scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice : null): null
            };

            return vm.serviceUrl + 'admin/payments/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getPaymentsList = function (applyFilter) {
            $scope.loadingPayments = true;

            // $scope.showingPaymentsFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.paymentsPagination.pageNo = 1;
            }

            if ($scope.stripePaymentsList.length > 0) {
                $scope.stripePaymentsList.length = 0;
            }

            var stripePaymentsUrl = vm.getStripePaymentsUrl();

            if(vm.token) {
                $http.get(stripePaymentsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.stripePaymentsListData = res.data.data;
                        $scope.stripePaymentsList = $scope.stripePaymentsListData.results;
                    }
                    $scope.loadingPayments = false;
                }).catch(function (error) {
                    $scope.loadingPayments = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getPaymentsList();
            })
            .catch(function(err){
                $scope.loadingPayments = false;
                toastr.error("Extension not activated for company");
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
