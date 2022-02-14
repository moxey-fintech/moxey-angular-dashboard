(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.chiplessCardService.chiplessCardServiceCards')
        .controller('ChiplessCardServiceCardsCtrl', ChiplessCardServiceCardsCtrl);

    function ChiplessCardServiceCardsCtrl($scope,$http,$location,$uibModal,localStorageManagement,serializeFiltersService,toastr,errorHandler,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "chipless_card_service";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.statusOptions = ['Pending','Complete','Failed'];
        $scope.loadingCards = true;
        $scope.chiplessCardCardsList = [];

        $scope.cardsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getChiplessCardCardsUrl = function(){
            // $scope.ordersFiltersCount = 0;

            // for(var x in $scope.ordersFiltersObj){
            //     if($scope.ordersFiltersObj.hasOwnProperty(x)){
            //         if($scope.ordersFiltersObj[x]){
            //             $scope.ordersFiltersCount = $scope.ordersFiltersCount + 1;
            //         }
            //     }
            // }

            var searchObj = {
                page: $scope.cardsPagination.pageNo,
                page_size: $scope.cardsPagination.itemsPerPage || 25,
                // id: $scope.ordersFiltersObj.idFilter ? $scope.applyOrdersFiltersObj.idFilter.selectedId : null,
                // user: $scope.ordersFiltersObj.userFilter ? ($scope.applyOrdersFiltersObj.userFilter.selectedUser ? $scope.applyOrdersFiltersObj.userFilter.selectedUser : null) : null,
                // status: $scope.ordersFiltersObj.statusFilter ? ($scope.applyOrdersFiltersObj.statusFilter.selectedStatus ? $scope.applyOrdersFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null,
                // currency: $scope.ordersFiltersObj.currencyFilter ? ($scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code ? $scope.applyOrdersFiltersObj.currencyFilter.selectedCurrency.code : null): null,
                // total_price: $scope.ordersFiltersObj.totalPriceFilter ? ($scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice ? $scope.applyOrdersFiltersObj.totalPriceFilter.selectedTotalPrice : null): null
            };

            return vm.serviceUrl + 'admin/cards/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getCardsList = function (applyFilter) {
            $scope.loadingCards = true;

            // $scope.showingCardsFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.cardsPagination.pageNo = 1;
            }

            if ($scope.chiplessCardCardsList.length > 0) {
                $scope.chiplessCardCardsList.length = 0;
            }

            var chiplessCardCardsUrl = vm.getChiplessCardCardsUrl();

            if(vm.token) {
                $http.get(chiplessCardCardsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(res.data.data.results.length > 0){
                        $scope.chiplessCardCardsListData = res.data.data;
                        $scope.chiplessCardCardsList = $scope.chiplessCardCardsListData.results;
                    }
                    $scope.loadingCards = false;
                }).catch(function (error) {
                    $scope.loadingCards = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToAddCardView = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'CreateChiplessCardModalCtrl',
                scope: $scope,
            });

            vm.theAddModal.result.then(function(cards){
                if(cards){
                    $scope.getCardsList();
                }

            }, function(){
            });
        };

        $scope.openEditCardModal = function (page, size,card) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditChiplessCardServiceCardModalCtrl',
                scope: $scope,
                resolve: {
                    card: function () {
                        return card;
                    }
                }
            });
            vm.theModal.result.then(function(cardEdited){
                    if(cardEdited){
                        $scope.getCardsList();
                    }
                }, function(){}
            );
        };
        
        $scope.openDeleteCardModal = function (page, size, card) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteChiplessCardServiceCardModalCtrl',
                scope: $scope,
                resolve: {
                    card: function () {
                        return card;
                    }
                }
            });

            vm.theModal.result.then(function(card){
                if(card){
                    $scope.getCardsList();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getCardsList();
            })
            .catch(function(err){
                $scope.loadingCards = false;
                toastr.error("Extension not activated for company");
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
