(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.logs')
        .controller('UserLogsCtrl', UserLogsCtrl);

    /** @ngInject */
    function UserLogsCtrl($scope,Rehive,localStorageManagement,errorHandler,$stateParams,$window,$timeout,resourcesList,
                            $rootScope,typeaheadService,serializeFiltersService,$uibModal,$filter,$intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $rootScope.shouldBeBlue = 'Users';
        $scope.userData = JSON.parse($window.sessionStorage.userData);
        $scope.userDisplayName = '';
        $scope.userLogs = [];
        $scope.loadingRequestLogs = false;
        $scope.showingFilters = false;
        $scope.filtersCount = 0;
        $scope.showingColumnFilters = false;
        $scope.initialLoad = true;
        $scope.resourceTypeObj = resourcesList.getResourceTypesObj();

        $scope.showRequestLogsFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.methodsAllowed = {
            get: false,
            post: false,
            patch: false,
            // put: false,
            delete: false
        };

        $scope.filtersObj = {
            methodFilter: false,
            pathFilter: false,
            contentTypeFilter: false,
            statusCodeFilter: false
        };

        $scope.applyFiltersObj = {
            methodFilter: {
                selectedMethods: []
            },
            pathFilter: {
                selectedPath: null
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
            maxSize: 5
        };

        $scope.updateMethodsRequested = function(){
            $scope.applyFiltersObj.methodFilter.selectedMethods = [];
            for(var method in $scope.methodsAllowed){
                if($scope.methodsAllowed[method]){
                    $scope.applyFiltersObj.methodFilter.selectedMethods.push(method.toUpperCase());
                    if(method === 'patch'){
                        $scope.applyFiltersObj.methodFilter.selectedMethods.push("PUT");
                    }
                }
            }
        };
        
        vm.initializeMethodFilters = function(){
            $scope.methodsAllowed = {
                get: false,
                post: true,
                patch: true,
                // put: true,
                delete: true
            };            
        };

        vm.getRequestLogsFiltersObj = function(){
            $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};
            if(!$scope.filtersObj.methodFilter){
                vm.initializeMethodFilters();
            }
            $scope.updateMethodsRequested();
            searchObj = {
                page: $scope.pagination.pageNo || 1,
                page_size: $scope.pagination.itemsPerPage || 25,
                user: $scope.user.id,
                // key: $scope.filtersObj.keyFilter ? ($scope.applyFiltersObj.keyFilter.selectedKey ? $scope.applyFiltersObj.keyFilter.selectedKey : null): null,
                path: $scope.filtersObj.pathFilter ? ($scope.applyFiltersObj.pathFilter.selectedPath ? $scope.applyFiltersObj.pathFilter.selectedPath : null): null,
                method__in: $scope.applyFiltersObj.methodFilter.selectedMethods.join(','),
                content_type: $scope.filtersObj.contentTypeFilter ? ($scope.applyFiltersObj.contentTypeFilter.selectedContentType ? $scope.applyFiltersObj.contentTypeFilter.selectedContentType : null): null,
                status_code: $scope.filtersObj.statusCodeFilter ? ($scope.applyFiltersObj.statusCodeFilter.selectedStatusCode ? $scope.applyFiltersObj.statusCodeFilter.selectedStatusCode : null): null,
                orderby: '-created'
            };
            
            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getRequestLogs = function (applyFilter) {
            if(vm.token) {
                $scope.loadingRequestLogs = true;
                $scope.showingFilters = false;
                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }
                if ($scope.userLogs.length > 0) {
                    $scope.userLogs.length = 0;
                }
                var requestLogsFiltersObj = vm.getRequestLogsFiltersObj();

                Rehive.admin.requests.get({filters: requestLogsFiltersObj}).then(function (res) {
                    $scope.userLogsData = res;
                    vm.formatRequestLogsArray($scope.userLogsData.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingRequestLogs = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingRequestLogs = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.user = res;
                    $scope.userDisplayName = (($scope.user.first_name && $scope.user.first_name !== "") ? 
                    $scope.user.first_name : '');
                    $scope.userDisplayName += $scope.userDisplayName !== '' ? ' ' : '';
                    $scope.userDisplayName += (($scope.user.last_name && $scope.user.last_name !== "") ? 
                    $scope.user.last_name : '');
                    if($scope.userDisplayName === ''){
                        $scope.userDisplayName = $scope.user.email ? $scope.user.email : $scope.user.id;
                    }

                    $scope.getRequestLogs();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingRequestLogs = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        vm.formatRequestLogsArray = function (requestLogsArray) {
            requestLogsArray.forEach(function (requestLogObj,index,array) {
                var userLog = {
                    id: requestLogObj.id,
                    user: requestLogObj.user.email || requestLogObj.user.mobile,
                    key: requestLogObj.key,
                    scheme: requestLogObj.scheme,
                    path: requestLogObj.path,
                    method: requestLogObj.method,
                    content_type: requestLogObj.content_type,
                    resource_type: $scope.resourceTypeObj[requestLogObj.resource] !== undefined ? $scope.resourceTypeObj[requestLogObj.resource].toLowerCase().replace(/_/g, ' ') : requestLogObj.resource,
                    status_code: requestLogObj.status_code,
                    created_date: $filter("date")(requestLogObj.created,'mediumDate') + ' ' + $filter("date")(requestLogObj.created,'shortTime'),
                    updated_date: $filter("date")(requestLogObj.updated,'mediumDate') + ' ' + $filter("date")(requestLogObj.updated,'shortTime')
                };
                userLog.request_action = resourcesList.getFormattedRequestAction($scope.userDisplayName, userLog.method, userLog.path, userLog.status_code, userLog.resource_type);
                userLog.failed_request = (!userLog.status_code || userLog.status_code === 200 || userLog.status_code === 201) ? false : true;
                $scope.userLogs.push(userLog);
            });
            
            $scope.loadingRequestLogs = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                methodFilter: false,
                pathFilter: false,
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
