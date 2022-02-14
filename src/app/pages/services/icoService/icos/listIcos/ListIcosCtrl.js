(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.listIcos')
        .controller('ListIcosCtrl', ListIcosCtrl);

    /** @ngInject */
    function ListIcosCtrl($scope,$http,localStorageManagement,errorHandler,$location,toastr,$ngConfirm) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.icosList = [];
        $scope.icoSettingView = '';
        $scope.searchIcoParams = {
            searchId: '',
            searchStatus: 'Status',
            searchCurrency: {code: 'Currency'}
        };
        $scope.statusOptions = ['Status','Open','Closed','Hidden'];
        $scope.currencyOptions = [];

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.getCurrenciesList = function () {
            $scope.loadingIcos =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingIcos =  false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.currencyOptions = res.data.data.results;
                        $scope.currencyOptions.splice(0,0,{code: 'Currency'});
                    }
                }).catch(function (error) {
                    $scope.loadingIcos =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getCurrenciesList();

        vm.getIcoListUrl = function(){
            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage
            +  '&id=' + ($scope.searchIcoParams.searchId ? $scope.searchIcoParams.searchId : '')
            +  '&status=' + ($scope.searchIcoParams.searchStatus == 'Status' ? '' : $scope.searchIcoParams.searchStatus.toLowerCase())
            +  '&currency__code=' + ($scope.searchIcoParams.searchCurrency.code == 'Currency' ? '' : $scope.searchIcoParams.searchCurrency.code);

            return vm.serviceUrl + 'admin/icos/' + vm.filterParams;
        };

        $scope.getIcosList = function (applyFilter) {
            $scope.loadingIcos =  true;
            $scope.icosList = [];

            if (applyFilter) {
                // if function is called from filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.icosList.length > 0) {
                $scope.icosList.length = 0;
            }

            var icoListUrl = vm.getIcoListUrl();

            if(vm.token) {
                $http.get(icoListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.icosListData = res.data.data;
                        $scope.icosList = res.data.data.results;
                        $scope.loadingIcos =  false;
                    }
                }).catch(function (error) {
                    $scope.searchIcoParams = {
                        searchId: '',
                        searchStatus: 'Status',
                        searchCurrency: {code: 'Currency'}
                    };
                    $scope.loadingIcos =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getIcosList();

        $scope.goToAddIcoView = function () {
            // $location.path('/services/ico/add');
            $location.path('/extensions/ico/add');
        };

        $scope.deleteIcoPrompt = function(ico) {
            $ngConfirm({
                title: 'Delete ico',
                contentUrl: 'app/pages/services/icoService/icos/listIcos/deleteIcoPrompt.html',
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
                        action: function(scope,button){
                            if(scope.proceedText != 'confirm'){
                                toastr.error('Please enter confirm to proceed');
                                return;
                            }
                            scope.deleteIco(ico);
                        }
                    }
                }
            });
        };

        $scope.deleteIco = function (ico) {
            $scope.loadingIcos =  true;
            if(vm.token) {
                $http.delete(vm.serviceUrl + 'admin/icos/' + ico.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.searchIcoParams = {
                            searchId: '',
                            searchStatus: 'Status',
                            searchCurrency: {code: 'Currency'}
                        };
                        toastr.success('Ico successfully deleted');
                        $scope.getIcosList();
                    }
                }).catch(function (error) {
                    $scope.searchIcoParams = {
                        searchId: '',
                        searchStatus: 'Status',
                        searchCurrency: {code: 'Currency'}
                    };
                    $scope.loadingIcos =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToIcoView = function (ico) {
            // $location.path('/services/ico/' + ico.id);
            $location.path('/extensions/ico/' + ico.id);
        };

        $scope.goToEditView = function(ico){
            // $location.path('/services/ico/' + ico.id + '/edit');
            $location.path('/extensions/ico/' + ico.id + '/edit');
        };


    }

})();
