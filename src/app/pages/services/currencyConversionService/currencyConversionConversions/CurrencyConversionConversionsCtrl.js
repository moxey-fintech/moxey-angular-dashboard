(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionsList')
        .controller('CurrencyConversionConversionsCtrl', CurrencyConversionConversionsCtrl);

    /** @ngInject */
    function CurrencyConversionConversionsCtrl($rootScope,Rehive,$scope,localStorageManagement,$uibModal,$filter,sharedResources,
                                                toastr,currencyModifiers,errorHandler,$state,$window,typeaheadService,extensionsHelper,
                                                serializeFiltersService,$location,_,multiOptionsFilterService,$intercom,$http) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null;
        var serviceName = "conversion_service";
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT') ? localStorageManagement.getValue('DATE_FORMAT').toUpperCase() : 'MM/dd/yyyy';
        $scope.loadingConversions =  true;
        $scope.showingColumnFilters = false;
        $scope.visibleColumnsArray = [];
        $scope.visibleColumnsSelectionChanged = false;
        $scope.currencyOptions = [];
        $scope.initializeHeaderCol = function () {
            var headerCols = [
                    {colName: 'Id',fieldName: 'id',visible: true},
                    {colName: 'User',fieldName: 'user',visible: true},
                    {colName: 'Key',fieldName: 'key',visible: true},
                    {colName: 'From amount',fieldName: 'from_amount',visible: true},
                    {colName: 'To amount',fieldName: 'to_amount',visible: true},
                    {colName: 'Rate',fieldName: 'rate',visible: true},
                    {colName: 'Status',fieldName: 'status',visible: true},
                    {colName: 'Created date',fieldName: 'created_at',visible: true},
                    {colName: 'From fee',fieldName: 'from_fee',visible: false},
                    {colName: 'From total amount',fieldName: 'from_total_amount',visible: false},
                    {colName: 'To fee',fieldName: 'to_fee',visible: false},
                    {colName: 'To total amount',fieldName: 'to_total_amount',visible: false},
                    {colName: 'Operational account',fieldName: 'operational_account',visible: false},
                    {colName: 'Metadata',fieldName: 'metadata',visible: false},
                    {colName: 'Updated date',fieldName: 'updated_at',visible: false}
                ];

            return headerCols;
        };

        $scope.headerColumns = $scope.initializeHeaderCol();

        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        
        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.selectAllColumns = function () {
            $scope.visibleColumnsSelectionChanged = true;
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
        };

        $scope.toggleColumnVisibility = function () {
            $scope.visibleColumnsSelectionChanged = true;
        };

        $scope.restoreColDefaults = function () {
            $scope.visibleColumnsSelectionChanged = true;
            var defaultVisibleHeader = ['Id', 'User', 'Key', 'From amount', 'To amount', 'Rate', 'Status', 'Created date'];
                // 'Amount','Fee','Status','Date','Id'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });
        };
                
        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        vm.getConversionsListUrl = function(){
            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering
            return vm.baseUrl + 'admin/conversions/' + vm.filterParams;
        };
        
        vm.getAllCompanyCurrencies = function () {
            Rehive.admin.currencies.get({filters: {
                page:1,
                page_size: 250,
                archived: false
            }}).then(function (res) {
                if($scope.currencyOptions.length > 0){
                    $scope.currencyOptions.length = 0;
                }
                $scope.currencyOptions = res.results.slice();
                $scope.currencyOptions.sort(function(a, b){
                    return a.code.localeCompare(b.code);
                });
                $scope.currencyOptions.sort(function(a, b){
                    return a.unit.localeCompare(b.unit);
                });

                if($scope.conversionList.length > 0){
                    vm.formatConversions();
                }
                else{
                    $scope.loadingConversions =  false;
                }
                
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        
        vm.formatConversions = function(){
            $scope.conversionList.forEach(function(conversion){
                // Format currencies using keys
                var leftKey = conversion.key.split(':')[0], rightKey = conversion.key.split(':')[1];
                var fromCurrency = $scope.currencyOptions.filter(function(currency){
                    return currency.code === leftKey;
                })[0];
                var toCurrency = $scope.currencyOptions.filter(function(currency){
                    return currency.code === rightKey;
                })[0];
                
                conversion.from_amount = currencyModifiers.convertFromCents(conversion.from_amount, fromCurrency.divisibility);
                conversion.from_fee = currencyModifiers.convertFromCents(conversion.from_fee, fromCurrency.divisibility);
                conversion.from_total_amount = currencyModifiers.convertFromCents(conversion.from_total_amount, fromCurrency.divisibility);
                
                conversion.to_amount = currencyModifiers.convertFromCents(conversion.to_amount, toCurrency.divisibility);
                conversion.to_fee = currencyModifiers.convertFromCents(conversion.to_fee, toCurrency.divisibility);
                conversion.to_total_amount = currencyModifiers.convertFromCents(conversion.to_total_amount, toCurrency.divisibility);
                
                // Attached extra fields to handle date formatting
                conversion.created_at = $filter('date')(conversion.created,'MMM d, y') + ' ' +$filter('date')(conversion.created,'shortTime');
                conversion.updated_at = $filter('date')(conversion.updated,'MMM d, y') + ' ' +$filter('date')(conversion.updated,'shortTime');
                
                // Fixed rate's decimal places
                conversion.rate = $filter('roundDecimalPartFilter')(currencyModifiers.convertToCents(conversion.rate, 18), 18);
                
                // Formatted metadata for display
                var metadataObject = {};
                if((conversion.metadata) && (Object.keys(conversion.metadata).length > 0)){
                    for(var key in conversion.metadata){
                        if(conversion.metadata.hasOwnProperty(key)){
                            metadataObject[key] = conversion.metadata[key];
                        }
                    }
                }
                conversion.metadata = conversion.metadata ? JSON.stringify(conversion.metadata) : '';
                conversion = _.extend(conversion,metadataObject);                
            });

            $scope.loadingConversions =  false;
        };

        $scope.getConversionsList = function () {            
            if(vm.token) {
                $scope.loadingConversions =  true;
                $scope.showingColumnFilters = false;
                $scope.visibleColumnsSelectionChanged = false;
                $scope.conversionPairList = [];

                var conversionListUrl = vm.getConversionsListUrl();
        
                $http.get(conversionListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.conversionListData = res.data.data;
                    $scope.conversionList = res.data.data.results;
                    vm.getAllCompanyCurrencies();   
                }).catch(function (error) {
                    $scope.loadingConversions =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
    
        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 10000){
                $scope.pagination.itemsPerPage = 10000;
            }
        };

        $scope.showFilters = function () {
            $scope.showingColumnFilters = false;
        };

        $scope.closeColumnFiltersBox = function (callLatestConversions) {
            if($scope.visibleColumnsSelectionChanged || callLatestConversions){
                $scope.getConversionsList();
            }
            $scope.showingColumnFilters = false;
        };
        
        $scope.goToConversionView = function (page, size,conversion) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DisplayCurrencyConversionModalCtrl',
                scope: $scope,
                resolve: {
                    conversion: function () {
                        return conversion;
                    }
                }
            });

            vm.theModal.result.then(function(conversionStatusUpdated){
                if(conversionStatusUpdated){
                    $scope.getConversionsList();
                }
            }, function(){
            });
        };

        $scope.$on("modalClosing",function(event,conversionUpdated){
            if(conversionUpdated){
                // $scope.clearFilters();
                $scope.getConversionsList();
            }
        });

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl("conversion_service")
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.getConversionsList();
            })
            .catch(function(err){
                $scope.loadingConversions = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }

})();
