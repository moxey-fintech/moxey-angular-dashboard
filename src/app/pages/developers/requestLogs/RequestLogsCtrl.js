(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.requestLogs')
        .controller('RequestLogsCtrl', RequestLogsCtrl);

    /** @ngInject */
    function RequestLogsCtrl($scope,Rehive,localStorageManagement,errorHandler,urlHandlerService,
                             typeaheadService,serializeFiltersService,$uibModal,$filter,$intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedRequestTableColumns = vm.companyIdentifier + 'requestTable';
        vm.savedRequestLogsTableFilters = vm.companyIdentifier + 'requestLogsTableFilters';
        $scope.requestLogs = [];
        $scope.loadingRequestLogs = true;
        $scope.showingFilters = false;
        $scope.filtersCount = 0;
        $scope.showingColumnFilters = false;
        $scope.initialLoad = true;
        $scope.requestMethodsAvailable = ["GET", "POST", "PATCH", "PUT", "DELETE"];

        $scope.requestHeaderColumns = localStorageManagement.getValue(vm.savedRequestTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedRequestTableColumns)) : [
            {colName: 'Id',fieldName: 'id',visible: true},
            {colName: 'User',fieldName: 'user',visible: false},
            {colName: 'Key',fieldName: 'key',visible: false},
            {colName: 'Scheme',fieldName: 'scheme',visible: false},
            {colName: 'Path',fieldName: 'path',visible: true},
            {colName: 'Method',fieldName: 'method',visible: true},
            {colName: 'Content type',fieldName: 'content_type',visible: false},
            {colName: 'Status code',fieldName: 'status_code',visible: true},
            {colName: 'Created',fieldName: 'createdDate',visible: true},
            {colName: 'Updated',fieldName: 'updatedDate',visible: false}
        ];

        $scope.selectAllColumns = function () {
            $scope.requestHeaderColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedRequestTableColumns,JSON.stringify($scope.requestHeaderColumns));
        };

        $scope.toggleColumnVisibility = function () {
            localStorageManagement.setValue(vm.savedRequestTableColumns,JSON.stringify($scope.requestHeaderColumns));
        };

        $scope.restoreColDefaults = function () {
            var defaultVisibleHeader = ['Id','Path','Status code','Method','Created'];

            $scope.requestHeaderColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedRequestTableColumns,JSON.stringify($scope.requestHeaderColumns));
        };

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.showRequestLogsFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.filtersObj = {
            userFilter: false,
            keyFilter: false,
            schemeFilter: false,
            pathFilter: false,
            methodFilter: false,
            contentTypeFilter: false,
            statusCodeFilter: false
        };

        $scope.applyFiltersObj = {
            userFilter: {
                selectedUserOption: null
            },
            keyFilter: {
                selectedKey: null
            },
            schemeFilter: {
                selectedScheme: null
            },
            pathFilter: {
                selectedPath: null
            },
            methodFilter: {
                selectedMethod: null
            },
            contentTypeFilter: {
                selectedContentType: null
            },
            statusCodeFilter: {
                selectedStatusCode: null
            }
        };

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5,
            currentCursor: null,
            prevCursor: null,
            nextCursor: null
        };

        $scope.handleSearchObjFilterChange = function(searchObj){
            // Handle cursor pagination:
            if($scope.pagination.currentCursor){ 
                searchObj.cursor = $scope.pagination.currentCursor; 
            } else if(searchObj.cursor !== undefined) {
                delete searchObj['cursor'];
            }
            if(searchObj.page){ delete searchObj['page']; }
            searchObj.pagination = "cursor";

            return searchObj;
        };

        vm.getRequestLogsFiltersObj = function(){
            $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};

            if($scope.initialLoad) {
                $scope.initialLoad = false;
                if (localStorageManagement.getValue(vm.savedRequestLogsTableFilters)) {
                    filterObjects = JSON.parse(localStorageManagement.getValue(vm.savedRequestLogsTableFilters));

                    $scope.filtersObj = filterObjects.filtersObj;

                    $scope.applyFiltersObj = {
                        userFilter: {
                            selectedUserOption: filterObjects.applyFiltersObj.userFilter.selectedUserOption
                        },
                        keyFilter: {
                            selectedKey: filterObjects.applyFiltersObj.keyFilter.selectedKey
                        },
                        schemeFilter: {
                            selectedScheme: filterObjects.applyFiltersObj.schemeFilter.selectedScheme
                        },
                        pathFilter: {
                            selectedPath: filterObjects.applyFiltersObj.pathFilter.selectedPath
                        },
                        methodFilter: {
                            selectedMethod: filterObjects.applyFiltersObj.methodFilter.selectedMethod
                        },
                        contentTypeFilter: {
                            selectedContentType: filterObjects.applyFiltersObj.contentTypeFilter.selectedContentType
                        },
                        statusCodeFilter: {
                            selectedStatusCode: filterObjects.applyFiltersObj.statusCodeFilter.selectedStatusCode
                        }
                    };

                    searchObj = filterObjects.searchObj;
                    $scope.handleSearchObjFilterChange(searchObj);

                } else {
                    searchObj = {
                        page: 1,
                        page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25
                    };
                    $scope.handleSearchObjFilterChange(searchObj);
                }
            } else {

                searchObj = {
                    page: $scope.pagination.pageNo,
                    page_size: $scope.pagination.itemsPerPage || 25,
                    user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? $scope.applyFiltersObj.userFilter.selectedUserOption : null): null,
                    key: $scope.filtersObj.keyFilter ? ($scope.applyFiltersObj.keyFilter.selectedKey ? $scope.applyFiltersObj.keyFilter.selectedKey : null): null,
                    path: $scope.filtersObj.pathFilter ? ($scope.applyFiltersObj.pathFilter.selectedPath ? $scope.applyFiltersObj.pathFilter.selectedPath : null): null,
                    method: $scope.filtersObj.methodFilter ? ($scope.applyFiltersObj.methodFilter.selectedMethod ? $scope.applyFiltersObj.methodFilter.selectedMethod : null): null,
                    content_type: $scope.filtersObj.contentTypeFilter ? ($scope.applyFiltersObj.contentTypeFilter.selectedContentType ? $scope.applyFiltersObj.contentTypeFilter.selectedContentType : null): null,
                    status_code: $scope.filtersObj.statusCodeFilter ? ($scope.applyFiltersObj.statusCodeFilter.selectedStatusCode ? $scope.applyFiltersObj.statusCodeFilter.selectedStatusCode : null): null,
                    orderby: '-created'
                };
                $scope.handleSearchObjFilterChange(searchObj);

                vm.saveRequestTableFiltersToLocalStorage({
                    searchObj: serializeFiltersService.objectFilters(searchObj),
                    filtersObj: $scope.filtersObj,
                    applyFiltersObj: $scope.applyFiltersObj
                });
            }


            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }


            return serializeFiltersService.objectFilters(searchObj);
        };

        vm.saveRequestTableFiltersToLocalStorage = function (filterObjects) {
            localStorageManagement.setValue(vm.savedRequestLogsTableFilters,JSON.stringify(filterObjects));
        };

        $scope.paginationChanged = function(pageCursor){
            if($scope.pagination[pageCursor] === null) return;

            $scope.pagination.currentCursor = $scope.pagination[pageCursor];
            $scope.getRequestLogs();
        };

        $scope.getRequestLogs = function (applyFilter) {
            if(vm.token) {
                $scope.loadingRequestLogs = true;

                $scope.showingFilters = false;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                    $scope.pagination.currentCursor = null;
                }

                if ($scope.requestLogs.length > 0) {
                    $scope.requestLogs.length = 0;
                }

                var requestLogsFiltersObj = vm.getRequestLogsFiltersObj();

                Rehive.admin.requests.get({filters: requestLogsFiltersObj}).then(function (res) {
                    $scope.requestLogsData = res;
                    var prevParams = urlHandlerService.getUrlParams(res.previous);
                    var nextParams = urlHandlerService.getUrlParams(res.next);
                    $scope.pagination.prevCursor = prevParams['cursor'] !== undefined ? prevParams['cursor'] : null; 
                    $scope.pagination.nextCursor = nextParams['cursor'] !== undefined ? nextParams['cursor'] : null;
                    vm.formatRequestLogsArray($scope.requestLogsData.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingRequestLogs = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.getRequestLogs();

        vm.formatRequestLogsArray = function (requestLogsArray) {
            requestLogsArray.forEach(function (requestLogObj,index,array) {
                $scope.requestLogs.push({
                    id: requestLogObj.id,
                    user: requestLogObj.user.email || requestLogObj.user.mobile,
                    key: requestLogObj.key,
                    scheme: requestLogObj.scheme,
                    path: requestLogObj.path,
                    method: requestLogObj.method,
                    content_type: requestLogObj.content_type,
                    status_code: requestLogObj.status_code,
                    createdDate: $filter("date")(requestLogObj.created,'mediumDate') + ' ' + $filter("date")(requestLogObj.created,'shortTime'),
                    updatedDate: $filter("date")(requestLogObj.updated,'mediumDate') + ' ' + $filter("date")(requestLogObj.updated,'shortTime')
                });
            });
            
            $scope.loadingRequestLogs = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                userFilter: false,
                keyFilter: false,
                schemeFilter: false,
                pathFilter: false,
                methodFilter: false,
                contentTypeFilter: false,
                statusCodeFilter: false
            };
            $scope.showRequestLogsFilters();
            $scope.getRequestLogs('applyfilter');
        };

        $scope.goToRequestLog = function (page,size,log) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'RequestLogModalCtrl',
                scope: $scope,
                resolve: {
                    log: function () {
                        return log;
                    }
                }
            });
        };

        $scope.closeColumnFiltersBox = function () {
            $scope.showingColumnFilters = false;
        };
    }
})();
