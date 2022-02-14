(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.userAccList')
        .controller('ExportAccountsConfirmModalCtrl', ExportAccountsConfirmModalCtrl);

    function ExportAccountsConfirmModalCtrl($rootScope,$scope,$filter,filtersObjForExport,localStorageManagement,environmentConfig,
                                    Rehive,visibleColumnsArray,currenciesList,serializeFiltersService,errorHandler,toastr,$http) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');

        delete filtersObjForExport.page;
        delete filtersObjForExport.page_size;
        $scope.filtersObjForExportDeepCopy = Object.assign({}, serializeFiltersService.objectFilters(filtersObjForExport));
        $scope.filtersObjForExport = serializeFiltersService.objectFilters(filtersObjForExport);
        $scope.accountFileOutput = {type: 'csv'};
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
                    if(key == 'name'){
                        $scope.filtersTextsArray.push('Account name: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'reference'){
                        $scope.filtersTextsArray.push('Account reference: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'primary'){
                        $scope.filtersTextsArray.push('Is primary: ' + ($scope.filtersObjForExport[key] === true ? "true" : "false"));
                    }
                    else if(key == 'user'){
                        $scope.filtersTextsArray.push('User: ' + $scope.filtersObjForExport[key]);
                    }
                    else if(key == 'group'){
                        $scope.filtersTextsArray.push('Group: ' + $scope.filtersObjForExport[key]);
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
                    resource: 'account',
                    query: $scope.filtersObjForExportDeepCopy,
                    file_format: $scope.accountFileOutput.type
                }).then(function (res) {
                    $scope.exportingAccounts = false;
                    $scope.accountsExported = true;
                    $scope.accountSetResponse = res;
                    $rootScope.$emit('exportSetCreate', {status: 'account_created'});
                    toastr.success('Successfully exporting account sets');
                }, function (error) {
                    $scope.exportingAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };
    }
})();
