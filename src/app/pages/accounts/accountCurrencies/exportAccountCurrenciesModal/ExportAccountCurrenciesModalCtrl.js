(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.currencies')
        .controller('ExportAccountCurrenciesModalCtrl', ExportAccountCurrenciesModalCtrl);

    function ExportAccountCurrenciesModalCtrl($rootScope,$scope,$filter,filtersObjForExport,localStorageManagement,environmentConfig,
                                    Rehive,visibleColumnsArray,currenciesList,serializeFiltersService,errorHandler,toastr,$http) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');

        delete filtersObjForExport.page;
        delete filtersObjForExport.page_size;
        $scope.filtersObjForExportDeepCopy = Object.assign({}, serializeFiltersService.objectFilters(filtersObjForExport));
        $scope.filtersObjForExport = serializeFiltersService.objectFilters(filtersObjForExport);
        $scope.accountCurrenciesFileOutput = {type: 'csv'};
        $scope.accountSetResponse =  {};
        $scope.filtersTextsArray = [];
        $scope.filterCurrencyObj = {};
        $scope.currencyObjectsList = currenciesList.slice();
        $scope.exportingAccounts = false;
        $scope.accountsExported = false;
        $scope.visibleColumnsArray = visibleColumnsArray;

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.exportingAccounts = true;
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
                        $scope.exportingAccounts = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.exportingAccounts = false;
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
                    if(key == 'user'){
                        $scope.filtersTextsArray.push('User: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'account'){
                        $scope.filtersTextsArray.push('Account reference: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'account__name'){
                        $scope.filtersTextsArray.push('Account name: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'account__name__contains'){
                        $scope.filtersTextsArray.push('Account partial name: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'active'){
                        $scope.filtersTextsArray.push('Is active: ' + ($scope.filtersObjForExport[key] === true ? "true" : "false"));
                    }
                    else if(key == 'currency'){
                        $scope.filtersTextsArray.push('Currency: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'balance'){
                        $scope.filtersTextsArray.push('Balance: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'balance__gt'){
                        $scope.filtersTextsArray.push('Balance greater than: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'balance__lt'){
                        $scope.filtersTextsArray.push('Balance less than: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'historic'){
                        $scope.filtersTextsArray.push('Historic balance for: ' + ($filter("date")($scope.filtersObjForExport[key],'mediumDate') + ' ' + $filter("date")($scope.filtersObjForExport[key],'shortTime')));
                    }
                }
            }
            $scope.filtersTextsArray.push('Fields: ' + $scope.visibleColumnsArray.join(', '));
            $scope.exportingAccounts = false;
        };

        $scope.exportAccountsSet = function() {
            $scope.exportingAccounts = true;
            $scope.filtersObjForExportDeepCopy.fields = $scope.visibleColumnsArray.join(',');
            if(vm.token){
                Rehive.admin.exports.sets.create({
                    page_size: 50000,
                    section: 'admin',
                    resource: 'account_asset',
                    query: $scope.filtersObjForExportDeepCopy,
                    file_format: $scope.accountCurrenciesFileOutput.type
                }).then(function (res) {
                    $scope.exportingAccounts = false;
                    $scope.accountsExported = true;
                    $scope.accountSetResponse = res;
                    $rootScope.$emit('exportSetCreate', {status: 'account_asset_created'});
                    toastr.success('Successfully exporting account currency sets');
                }, function (error) {
                    $scope.exportingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };
    }
})();
