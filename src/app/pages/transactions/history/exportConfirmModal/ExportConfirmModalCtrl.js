(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('ExportConfirmModalCtrl', ExportConfirmModalCtrl);

    function ExportConfirmModalCtrl($rootScope,$scope,$filter,filtersObjForExport,localStorageManagement,
                                    Rehive,visibleColumnsArray,currenciesList,serializeFiltersService,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');

        delete filtersObjForExport.page;
        delete filtersObjForExport.page_size;
        $scope.filtersObjForExportDeepCopy = Object.assign({}, serializeFiltersService.objectFilters(filtersObjForExport));
        $scope.filtersObjForExport = serializeFiltersService.objectFilters(filtersObjForExport);
        $scope.fileOutput = {type: 'csv'};
        $scope.transactionSetResponse =  {};
        $scope.filtersTextsArray = [];
        $scope.filterCurrencyObj = {};
        $scope.currencyObjectsList = currenciesList.slice();
        $scope.exportingTransactions = false;
        $scope.transactionsExported = false;
        $scope.visibleColumnsArray = visibleColumnsArray;

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.exportingTransactions = true;
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.currenciesList = res.results;
                        if($scope.filtersObjForExport.currency){
                            $scope.filterCurrencyObj = $scope.currenciesList.find(function (element) {
                                return (element.code == $scope.filtersObjForExport.currency);
                            });
                        }
                        vm.filtersObjToText();
                        $scope.$apply();
                    } else {
                        vm.filtersObjToText();
                        $scope.exportingTransactions = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.exportingTransactions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.filtersObjToText = function () {
            for(var key in $scope.filtersObjForExport){
                if($scope.filtersObjForExport.hasOwnProperty(key)) {
                    if(key == 'created__gt'){
                        $scope.filtersObjForExport[key] = $filter("date")($scope.filtersObjForExport[key],'mediumDate') + ' ' + $filter("date")($scope.filtersObjForExport[key],'shortTime');
                        $scope.filtersTextsArray.push('Date greater than: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'created__lt'){
                        $scope.filtersObjForExport[key] = $filter("date")($scope.filtersObjForExport[key],'mediumDate') + ' ' + $filter("date")($scope.filtersObjForExport[key],'shortTime');
                        $scope.filtersTextsArray.push('Date less than: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'currency'){
                        $scope.filtersTextsArray.push('Currency: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'amount'){
                        $scope.filtersTextsArray.push('Amount: ' + $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")($scope.filtersObjForExport[key],$scope.filterCurrencyObj.divisibility)));
                    } else if(key == 'amount__gt'){
                        $scope.filtersTextsArray.push('Amount greater than: ' + $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")($scope.filtersObjForExport[key],$scope.filterCurrencyObj.divisibility)));
                    } else if(key == 'amount__lt'){
                        $scope.filtersTextsArray.push('Amount less than: ' + $filter("commaSeperateNumberFilter")($filter("currencyModifiersFilter")($scope.filtersObjForExport[key],$scope.filterCurrencyObj.divisibility)));
                    } else if(key == 'status'){
                        $scope.filtersTextsArray.push('Status: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'tx_type'){
                        $scope.filtersTextsArray.push('Transaction type: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'id'){
                        $scope.filtersTextsArray.push('Transaction id: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'subtype'){
                        $scope.filtersTextsArray.push('Subtype: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'destination_transaction'){
                        $scope.filtersTextsArray.push('Has destination transaction');
                    } else if(key == 'source_transaction'){
                        $scope.filtersTextsArray.push('Has source transaction');
                    } else if(key == 'user'){
                        $scope.filtersTextsArray.push('User: ' + decodeURIComponent($scope.filtersObjForExport[key]));
                    } else if(key == 'account__name'){
                        $scope.filtersTextsArray.push('Account name: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'account'){
                        $scope.filtersTextsArray.push('Account reference: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'group'){
                        $scope.filtersTextsArray.push('Group: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'group__isnull'){
                        $scope.filtersObjForExport[key] == 'true' ? $scope.filtersTextsArray.push('Users with no group') : $scope.filtersTextsArray.push('Users with group');
                    }
                }
            }
            $scope.filtersTextsArray.push('Fields: ' + $scope.visibleColumnsArray.join(', '));
            $scope.exportingTransactions = false;
        };

        $scope.exportTransansactionsSet = function() {
            $scope.exportingTransactions = true;
            $scope.filtersObjForExportDeepCopy.fields = $scope.visibleColumnsArray.join(',');

            Rehive.admin.exports.sets.create({
                page_size: 50000,
                section: 'admin',
                resource: 'transaction',
                query: $scope.filtersObjForExportDeepCopy,
                file_format: $scope.fileOutput.type
            }).then(function (res) {
                $scope.exportingTransactions = false;
                $scope.transactionsExported = true;
                $scope.transactionSetResponse = res;
                $rootScope.$emit('exportSetCreate', {status: 'created'});
                toastr.success('Successfully exporting transaction sets');
                $scope.$apply();
            }, function (error) {
                $scope.exportingTransactions = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
    }
})();
