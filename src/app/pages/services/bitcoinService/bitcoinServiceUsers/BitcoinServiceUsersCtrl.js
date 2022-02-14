(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceUsers')
        .controller('BitcoinServiceUsersCtrl', BitcoinServiceUsersCtrl);

    /** @ngInject */
    function BitcoinServiceUsersCtrl($rootScope, $scope,$http,typeaheadService,extensionsHelper, $location,
                                     localStorageManagement,errorHandler,serializeFiltersService,$intercom) {

        $intercom.update();
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = nul;
        var serviceName = "bitcoin_service";
        
        $rootScope.dashboardTitle = 'Bitcoin extension | Moxey';
        $scope.usersStateMessage = '';
        $scope.users = [];
        $scope.usersData = {};
        $scope.showingFilters = false;
        $scope.loadingUsers = true;
        $scope.filtersCount = 0;

        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            idFilter: false,
            emailFilter: false,
            addressFilter: false,
            pageSizeFilter: false
        };
        $scope.applyFiltersObj = {
            idFilter: {
                selectedId: ''
            },
            emailFilter: {
                selectedEmail: ''
            },
            addressFilter: {
                selectedAddress: ''
            }
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                idFilter: false,
                emailFilter: false,
                addressFilter: false,
                pageSizeFilter: false
            };
            $scope.showFilters();
            $scope.getAllUsers('applyfilter');
        };

        $scope.pageSizeChanged =  function () {
            if($scope.usersPagination.itemsPerPage > 250){
                $scope.usersPagination.itemsPerPage = 250;
            }
        };

        vm.getUsersUrl = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }


            var searchObj = {
                page: $scope.usersPagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.usersPagination.itemsPerPage : 25,
                id: $scope.filtersObj.idFilter ? ($scope.applyFiltersObj.idFilter.selectedId ?  $scope.applyFiltersObj.idFilter.selectedId : null): null,
                email: $scope.filtersObj.emailFilter ?($scope.applyFiltersObj.emailFilter.selectedEmail ?  encodeURIComponent($scope.applyFiltersObj.emailFilter.selectedEmail) : null): null,
                address: $scope.filtersObj.addressFilter ? ($scope.applyFiltersObj.addressFilter.selectedAddress ?  $scope.applyFiltersObj.addressFilter.selectedAddress: null) : null
            };

            return vm.serviceUrl + 'users/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getAllUsers = function(applyFilter){
            $scope.loadingUsers = true;
            $scope.usersStateMessage = '';
            $scope.showingFilters = false;

            if(applyFilter){
                $scope.usersPagination.pageNo = 1;
            }

            if($scope.users.length > 0 ){
                $scope.users.length = 0;
            }

            var usersUrl = vm.getUsersUrl();

            $http.get(usersUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingUsers = false;
                if (res.status === 200 || res.status === 201) {
                    $scope.usersData = res.data.data;
                    $scope.users = res.data.data.results;
                    if($scope.users.length == 0){
                        $scope.usersStateMessage = 'No users have been found';
                        return;
                    }
                    $scope.usersStateMessage = '';
                }
            }).catch(function (error) {
                $scope.loadingUsers = false;
                $scope.usersStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };        

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                
                vm.serviceUrl = serviceUrl;
                $scope.getAllUsers();
            })
            .catch(function(err){
                $scope.loadingUsers = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

            
    }
})();
