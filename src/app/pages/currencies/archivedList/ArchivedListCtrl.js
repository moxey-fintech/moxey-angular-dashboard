(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies.archivedList')
        .controller('ArchivedListCtrl', ArchivedListCtrl);

    /** @ngInject */
    function ArchivedListCtrl($rootScope,$scope,$location,localStorageManagement,$window,$ngConfirm,toastr,
                            errorHandler,$state,_,serializeFiltersService,$uibModal,Rehive, $intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Currencies | Moxey';
        vm.createNewCurrencyRequest = $location.search();
        $scope.deleteText = null;
        $scope.showingFilters = false;
        $scope.loadingCurrencies = true;
        $scope.optionsCode = '';
        $scope.showingRowsCurrencyCode = '';
        $scope.codeArray = [];
        $scope.currencyOptions = [];
        $scope.filtersCount = 0;
        $scope.filtersObj = {
            currencyFilter: false,
            unitFilter: false
        };
        $scope.applyFiltersObj = {
            currencyFilter:{
                selectedCurrencyOption: {}
            },
            unitFilter: {
                selectedCurrencyOption: {}
            }
        };
        $scope.pagination = {
            itemsPerPage: 15,
            pageNo: 1,
            maxSize: 5
        };

        $scope.findIndexOfCode = function (currency) {
            return $scope.codeArray.findIndex(function (element) {
                return element == currency.code;
            });
        };

        $scope.toggleRowsVisibility = function (currency) {
            if($scope.findIndexOfCode(currency) >= 0){
                var index = $scope.findIndexOfCode(currency);
                $scope.codeArray.splice(index,1);
            } else {
                $scope.codeArray.push(currency.code);
            }
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.hideFilters = function () {
            $scope.showingFilters = false;
        };

        $scope.closeOptionsBox = function () {
            $scope.optionsCode = '';
        };

        $scope.showCurrenciesOptions = function (code) {
            $scope.optionsCode = code;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                currencyFilter: false,
                unitFilter: false
            };
            $scope.filtersCount = 0;
            $scope.hideFilters();
            $scope.getCompanyArchivedCurrencies('applyfilter');
        };

        vm.getAllCompanyCurrencies = function () {
            Rehive.admin.currencies.get({filters: {
                page:1,
                page_size: 250
            }}).then(function (res) {
                if($scope.currencyOptions.length > 0){
                    $scope.currencyOptions.length = 0;
                }
                $scope.currencyOptions = res.results.slice();
                $scope.currencyOptions.sort(function(a, b){
                    return a.code.localeCompare(b.code);
                });
                $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = $scope.currencyOptions[0];
                $scope.currencyOptions.sort(function(a, b){
                    return a.unit.localeCompare(b.unit);
                });
                $scope.applyFiltersObj.unitFilter.selectedCurrencyOption = $scope.currencyOptions[0];
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getAllCompanyCurrencies();

        vm.getCurrenciesFiltersObj = function(){
            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage,
                archived: true,
                code: $scope.filtersObj.currencyFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                unit: $scope.filtersObj.unitFilter ? $scope.applyFiltersObj.unitFilter.selectedCurrencyOption.unit: null
            };

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        ++$scope.filtersCount;
                    }
                }
            }

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getCompanyArchivedCurrencies = function(applyFilter){
            if($scope.showingFilters) {
                $scope.showFilters();
            }

            if(applyFilter){
                $scope.pagination.pageNo = 1;
            }

            var currenciesFiltersObj = vm.getCurrenciesFiltersObj();

            if(vm.token) {
                $scope.loadingCurrencies = true;

                Rehive.admin.currencies.get({filters: currenciesFiltersObj}).then(function (res) {
                    $scope.archivedCurrencies = [];
                    $scope.archivedCurrenciesData = res;
                    $scope.archivedCurrencies = res.results;
                    if($scope.archivedCurrencies.length > 0){
                        $scope.archivedCurrencies.forEach(function(element,idx,array){
                            if(idx === array.length - 1){
                                vm.getCurrencyOverview(element,'last');
                                return false;
                            }
                            vm.getCurrencyOverview(element);
                        });
                    } else {
                        $scope.loadingCurrencies = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getCompanyArchivedCurrencies();

        vm.getCurrencyOverview = function (currency,last) {
            if(vm.token) {
                $scope.loadingCurrencies = true;
                Rehive.admin.currencies.overview.get(currency.code).then(function (res) {
                    $scope.archivedCurrencies.forEach(function (element,index) {
                        if(element.code == currency.code){
                            // _.extendOwn(element,res); // underscorejs version
                            /* Lodash version */
                            var elementKeys = _.keysIn(res);
                            _.assign(element, _.pick(res, elementKeys));
                        }
                    });
                    if(last){
                        $scope.loadingCurrencies = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openCurrencyRestoreModal = function (page, size, archivedCurrency) {
            vm.theRestoreModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'RestoreCurrencyModalCtrl',
                scope: $scope,
                resolve: {
                    archivedCurrency: function () {
                        return archivedCurrency;
                    }
                }
            });

            vm.theRestoreModal.result.then(function(restoredCurrency){
                if(restoredCurrency){
                    $scope.getCompanyArchivedCurrencies();
                }
            }, function(){
            });
        };

        $scope.restoreCompanyCurrencyPrompt = function(archivedCurrency) {
            $scope.archivedCurrency = archivedCurrency;
            $ngConfirm({
                title: 'Reinstate currency',
                contentUrl: 'app/pages/currencies/archivedList/restoreCurrencyModal.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default'
                    },
                    Add: {
                        text: "Reinstate",
                        btnClass: 'btn-primary',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.restoreCurrency();
                        }
                    }
                }
            });
        };

        $scope.restoreCurrency = function(){
            $scope.loadingCurrencies = true;
            if(vm.token && $scope.archivedCurrency){
                Rehive.admin.currencies.update($scope.archivedCurrency.code,{archived : false}).then(function (res) {
                    toastr.success('Currency successfully reinstated');
                    $scope.loadingCurrencies = false;
                    $scope.getCompanyArchivedCurrencies();
                    // $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteCompanyCurrencyPrompt = function(archivedCurrency) {
            $scope.currency = archivedCurrency;
            $ngConfirm({
                title: 'Delete currency',
                contentUrl: 'app/pages/currencies/currenciesList/deleteCurrencyModal/deleteCurrencyPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText !== 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            scope.deleteCompanyCurrency();
                        }
                    }
                }
            });
        };

        $scope.deleteCompanyCurrency = function () {
            if(vm.token && $scope.currency) {
                $scope.loadingCurrencies = true;
                Rehive.admin.currencies.delete($scope.currency.code).then(function (res) {
                    toastr.success('Currency successfully deleted');
                    $scope.loadingCurrencies = false;
                    $scope.getCompanyArchivedCurrencies();
                    // $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
    }
})();
