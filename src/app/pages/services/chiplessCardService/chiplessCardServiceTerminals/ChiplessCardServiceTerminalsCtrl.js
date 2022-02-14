(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceTerminals')
        .controller('ChiplessCardServiceTerminalsCtrl', ChiplessCardServiceTerminalsCtrl);

    function ChiplessCardServiceTerminalsCtrl($scope,$http,$location,localStorageManagement,serializeFiltersService,toastr,$uibModal,errorHandler,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "chipless_card_service";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.statusOptions = ['Pending','Complete','Failed'];
        $scope.loadingTerminals = true;
        $scope.chiplessCardTerminalsList = [];

        $scope.terminalsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getChiplessCardTerminalsUrl = function(){
            // $scope.ordersFiltersCount = 0;

            // for(var x in $scope.ordersFiltersObj){
            //     if($scope.ordersFiltersObj.hasOwnProperty(x)){
            //         if($scope.ordersFiltersObj[x]){
            //             $scope.ordersFiltersCount = $scope.ordersFiltersCount + 1;
            //         }
            //     }
            // }

            var searchObj = {
                page: $scope.terminalsPagination.pageNo,
                page_size: $scope.terminalsPagination.itemsPerPage || 25,
                // id: $scope.ordersFiltersObj.idFilter ? $scope.applyOrdersFiltersObj.idFilter.selectedId : null,
                // user: $scope.ordersFiltersObj.userFilter ? ($scope.applyOrdersFiltersObj.userFilter.selectedUser ? $scope.applyOrdersFiltersObj.userFilter.selectedUser : null) : null,
                // status: $scope.ordersFiltersObj.statusFilter ? ($scope.applyOrdersFiltersObj.statusFilter.selectedStatus ? $scope.applyOrdersFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null,
                // currency: $scope.ordersFiltersObj.currencyFilter ? ($scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code ? $scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code : null): null,
                // total_price: $scope.ordersFiltersObj.totalPriceFilter ? ($scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice ? $scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice : null): null
            };

            return vm.serviceUrl + 'admin/terminals/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getTerminalsList = function (applyFilter) {
            $scope.loadingTerminals = true;

            // $scope.showingTerminalsFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.terminalsPagination.pageNo = 1;
            }

            if ($scope.chiplessCardTerminalsList.length > 0) {
                $scope.chiplessCardTerminalsList.length = 0;
            }

            var chiplessCardTerminalsUrl = vm.getChiplessCardTerminalsUrl();

            if(vm.token) {
                $http.get(chiplessCardTerminalsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.chiplessCardTerminalsListData = res.data.data;
                        $scope.chiplessCardTerminalsList = $scope.chiplessCardTerminalsListData.results;
                    }
                    $scope.loadingTerminals = false;
                }).catch(function (error) {
                    $scope.loadingTerminals = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditTerminalModal = function (page, size,terminal) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditChiplessCardServiceTerminalModalCtrl',
                scope: $scope,
                resolve: {
                    terminal: function () {
                        return terminal;
                    }
                }
            });
            vm.theModal.result.then(function(terminalEdited){
                    if(terminalEdited){
                        $scope.getTerminalsList();
                    }   
                }, function(){}
            );
        };

        $scope.goToAddTerminalView = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'CreateChiplessCardTerminalModalCtrl',
                scope: $scope,
            });

            vm.theAddModal.result.then(function(terminals){
                if(terminals){
                    $scope.getTerminalsList();
                }

            }, function(){
            });
        };

        $scope.openDeleteTerminalModal = function (page, size, terminal) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteChiplessCardServiceTerminalModalCtrl',
                scope: $scope,
                resolve: {
                    terminal: function () {
                        return terminal;
                    }
                }
            });

            vm.theModal.result.then(function(terminal){
                if(terminal){
                    $scope.getTerminalsList();
                }
            }, function(){
            });
        };

        $scope.displayTerminalModal = function (page,size,terminalObj) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ViewChiplessCardTerminalModalCtrl',
                resolve: {
                    terminalObj: function () {
                        return terminalObj;
                    }
                }
            });

            vm.theModal.result.then(function(terminals){
                if(terminals){
                    $scope.getTerminalsLists();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getTerminalsList();
            })
            .catch(function(err){
                $scope.loadingTerminals = false;
                toastr.error("Extension not activated for company");
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
