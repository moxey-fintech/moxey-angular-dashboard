(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .controller('GroupUsersCtrl', GroupUsersCtrl);

    /** @ngInject */
    function GroupUsersCtrl($rootScope,$state,$scope,localStorageManagement,typeaheadService,Rehive,multiOptionsFilterService,currenciesList,
                            $location,$stateParams,errorHandler,$window,toastr,serializeFiltersService,$filter,$uibModal,$ngConfirm) {

        var vm = this;
        $scope.groupName = ($stateParams.groupName == 'service') ? 'extension' : $stateParams.groupName;
        vm.token = localStorageManagement.getValue('token');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.savedGroupUsersTableColumns = vm.companyIdentifier + $scope.groupName + 'usersTable';
        $rootScope.dashboardTitle = 'Groups | Moxey';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.usersStateMessage = '';
        $scope.users = [];
        $scope.usersData = {};
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.statusOptions = ['Status','Pending', 'Obsolete', 'Declined', 'Verified', 'Incomplete'];
        $scope.orderByOptions = ['Created','Last login date'];
        $scope.currencyOptions = [];
        $scope.filtersCount = 0;
        $scope.optionsGroupName = '';

        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        //renaming active field
        if(localStorageManagement.getValue(vm.savedGroupUsersTableColumns)){
            var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedGroupUsersTableColumns));
            headerColumns.forEach(function (col,index,array) {
                if(col.colName == 'Identifier'){
                    col.colName = 'Id';
                    col.fieldName = 'id';
                }
            });

            localStorageManagement.setValue(vm.savedGroupUsersTableColumns,JSON.stringify(headerColumns));
        }

        $scope.headerColumns = localStorageManagement.getValue(vm.savedGroupUsersTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedGroupUsersTableColumns)) : [
            {colName: 'Id',fieldName: 'id',visible: true},
            {colName: 'First name',fieldName: 'first_name',visible: true},
            {colName: 'Last name',fieldName: 'last_name',visible: true},
            {colName: 'Email',fieldName: 'email',visible: true},
            {colName: 'Mobile number',fieldName: 'mobile',visible: true},
            {colName: 'Group name',fieldName: 'groupName',visible: true},
            {colName: 'Created',fieldName: 'created',visible: true},
            {colName: 'Updated',fieldName: 'updated',visible: false},
            {colName: 'Status',fieldName: 'status',visible: false},
            {colName: 'KYC status',fieldName: 'kycStatus',visible: false},
            {colName: 'Archived',fieldName: 'archived',visible: false},
            {colName: 'Last login',fieldName: 'last_login',visible: false},
            {colName: 'Verified',fieldName: 'verified',visible: false},
            {colName: 'ID Number',fieldName: 'id_number',visible: false},
            {colName: 'Nationality',fieldName: 'nationality',visible: false},
            {colName: 'Language',fieldName: 'language',visible: false},
            {colName: 'Timezone',fieldName: 'timezone',visible: false},
            {colName: 'Birth date',fieldName: 'birth_date',visible: false},
            {colName: 'Username',fieldName: 'username',visible: false}
        ];
        $scope.filtersObj = {
            idFilter: false,
            emailFilter: false,
            mobileFilter: false,
            firstNameFilter: false,
            lastNameFilter: false,
            accountReferenceFilter: false,
            currencyFilter: false,
            createdFilter: false,
            updatedFilter: false,
            lastLoginDateFilter: false,
            kycFilter:  false,
            pageSizeFilter: false
        };
        $scope.applyFiltersObj = {
            idFilter: {
                selectedId: ''
            },
            emailFilter: {
                selectedEmail: $state.params.email || ''
            },
            mobileFilter: {
                selectedMobile: $state.params.mobile || ''
            },
            firstNameFilter: {
                selectedFirstName: ''
            },
            lastNameFilter: {
                selectedLastName: ''
            },
            accountReferenceFilter: {
                selectedAccountReference: ''
            },
            currencyFilter: {
                selectedCurrency: {}
            },
            createdFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            updatedFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            lastLoginDateFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            kycFilter: {
                selectedKycFilter: 'Status'
            },
            orderByFilter: {
                selectedOrderByOption: 'Created'
            }
        };

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.selectAllColumns = function () {
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedGroupUsersTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleColumnVisibility = function () {
            localStorageManagement.setValue(vm.savedGroupUsersTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreColDefaults = function () {
            var defaultVisibleHeader = ['Id','First name','Last name','Email',
                'Mobile number','Group name','Created'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedGroupUsersTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.getGroups = function () {
            if(vm.token) {
                Rehive.admin.groups.get({filters: {
                    page_size: 250
                }}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.groupOptions = res.results;
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroups();

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            vm.currenciesList.splice(0,0,{code: 'Currency'});
            $scope.applyFiltersObj.currencyFilter.selectedCurrency.code = 'Currency';
            $scope.currencyOptions = vm.currenciesList;
        };
        vm.getCompanyCurrencies();

        if($state.params.currencyCode){
            $scope.filtersObj.currencyFilter = true;
            vm.currenciesList.forEach(function (element) {
                if(element.code == $state.params.currencyCode){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrency = element;
                }
            });
        }

        if($state.params.email){
            $scope.filtersObj.emailFilter = true;
        }

        if($state.params.mobile){
            $scope.filtersObj.mobileFilter = true;
        }

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = $scope.companyDateFormatString;
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup2 = {};
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.popup3 = {};
        $scope.open3 = function() {
            $scope.popup3.opened = true;
        };

        $scope.popup4 = {};
        $scope.open4 = function() {
            $scope.popup4.opened = true;
        };

        $scope.popup5 = {};
        $scope.open5 = function() {
            $scope.popup5.opened = true;
        };

        $scope.popup6 = {};
        $scope.open6 = function() {
            $scope.popup6.opened = true;
        };
        // end

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getUsersMobileTypeahead = typeaheadService.getUsersMobileTypeahead();

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
            $scope.showingColumnFilters = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                idFilter: false,
                emailFilter: false,
                mobileFilter: false,
                firstNameFilter: false,
                lastNameFilter: false,
                accountReferenceFilter: false,
                currencyFilter: false,
                createdFilter: false,
                updatedFilter: false,
                lastLoginDateFilter: false,
                kycFilter:  false,
                pageSizeFilter: false
            };
            $scope.showFilters();
            $scope.getAllUsers('applyfilter');
        };

        $scope.createdDayIntervalChanged = function () {
            if($scope.applyFiltersObj.createdFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.lastLoginDayIntervalChanged = function () {
            if($scope.applyFiltersObj.lastLoginDateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.pageSizeChanged =  function () {
            if($scope.usersPagination.itemsPerPage > 250){
                $scope.usersPagination.itemsPerPage = 250;
            }
        };

        $scope.orderByFunction = function () {
            return ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Created' ? '-created' : '-last_login');
        };

        vm.getCreatedFilters = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersObj.createdFilter);

            var dateObj = {
                created__lt: evaluatedDateObj.date__lt,
                created__gt: evaluatedDateObj.date__gt
            };

            return dateObj;
        };

        vm.getLastLoginDateFilters = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersObj.lastLoginDateFilter);

            var dateObj = {
                last_login__lt: evaluatedDateObj.date__lt,
                last_login__gt: evaluatedDateObj.date__gt
            };

            return dateObj;
        };

        vm.getUpdatedDateFilters = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersObj.updatedFilter);

            var dateObj = {
                updated__lt: evaluatedDateObj.date__lt,
                updated__gt: evaluatedDateObj.date__gt
            };

            return dateObj;
        };

        vm.getUsersFiltersObj = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            if($scope.filtersObj.createdFilter){
                vm.dateObj = vm.getCreatedFilters();
            } else{
                vm.dateObj = {
                    created__gt: null,
                    created__lt: null
                };
            }

            if($scope.filtersObj.updatedFilter){
                vm.updatedDateObj = vm.getUpdatedDateFilters();
            } else{
                vm.updatedDateObj = {
                    updated__gt: null,
                    updated__lt: null
                };
            }

            if($scope.filtersObj.lastLoginDateFilter){
                vm.lastLogindateObj = vm.getLastLoginDateFilters();
            } else{
                vm.lastLogindateObj = {
                    last_login__gt: null,
                    last_login__lt: null
                };
            }

            var searchObj = {
                page: $scope.usersPagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.usersPagination.itemsPerPage : 25,
                id__contains: $scope.filtersObj.idFilter ? ($scope.applyFiltersObj.idFilter.selectedId ?  $scope.applyFiltersObj.idFilter.selectedId : null): null,
                email__contains: $scope.filtersObj.emailFilter ?($scope.applyFiltersObj.emailFilter.selectedEmail ?  $scope.applyFiltersObj.emailFilter.selectedEmail : null): null,
                mobile__contains: $scope.filtersObj.mobileFilter ? ($scope.applyFiltersObj.mobileFilter.selectedMobile ?  $scope.applyFiltersObj.mobileFilter.selectedMobile : null): null,
                first_name__contains: $scope.filtersObj.firstNameFilter ? ($scope.applyFiltersObj.firstNameFilter.selectedFirstName ?  $scope.applyFiltersObj.firstNameFilter.selectedFirstName : null): null,
                last_name__contains: $scope.filtersObj.lastNameFilter ? ($scope.applyFiltersObj.lastNameFilter.selectedLastName ?  $scope.applyFiltersObj.lastNameFilter.selectedLastName : null): null,
                account: $scope.filtersObj.accountReferenceFilter ? ($scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference ?  $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference : null): null,
                group: ($scope.groupName == 'extension') ? 'service' : $scope.groupName,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                updated__gt: vm.updatedDateObj.updated__gt ? Date.parse(vm.updatedDateObj.updated__gt +'T00:00:00') : null,
                updated__lt: vm.updatedDateObj.updated__lt ? Date.parse(vm.updatedDateObj.updated__lt +'T00:00:00') : null,
                last_login__gt: vm.lastLogindateObj.last_login__gt ? Date.parse(vm.lastLogindateObj.last_login__gt +'T00:00:00') : null,
                last_login__lt: vm.lastLogindateObj.last_login__lt ? Date.parse(vm.lastLogindateObj.last_login__lt +'T00:00:00') : null,
                kyc__status: $scope.filtersObj.kycFilter ? ($scope.applyFiltersObj.kycFilter.selectedKycFilter == 'Status' ? null : $scope.applyFiltersObj.kycFilter.selectedKycFilter.toLowerCase()): null,
                currency__code: $scope.filtersObj.currencyFilter ? ($scope.applyFiltersObj.currencyFilter.selectedCurrency.code ? ($scope.applyFiltersObj.currencyFilter.selectedCurrency.code == 'Currency' ? null : $scope.applyFiltersObj.currencyFilter.selectedCurrency.code) : null): null
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getAllUsers = function(applyFilter){
            $scope.usersStateMessage = '';
            $scope.loadingGroup = true;
            $scope.showingFilters = false;

            if(applyFilter){
                $scope.usersPagination.pageNo = 1;
            }

            if($scope.users.length > 0 ){
                $scope.users.length = 0;
            }

            var usersFiltersObj = vm.getUsersFiltersObj();

            Rehive.admin.users.get({filters: usersFiltersObj}).then(function (res) {
                $scope.usersData = res;
                vm.formatUsersArray(res.results);
                if($scope.users.length == 0){
                    $scope.usersStateMessage = 'No users have been found';
                    return;
                }
                $scope.usersStateMessage = '';
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroup = false;
                $scope.usersStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        $scope.getAllUsers();

        vm.formatUsersArray = function (usersArray) {
            usersArray.forEach(function (userObj) {
                var firstName = userObj.first_name, groupName = (userObj.groups.length > 0) ? ((userObj.groups[0].name == 'service') ? $scope.groupName : userObj.groups[0].name) : null;
                if(groupName === "extension"){
                    var arr = firstName.split(' ');
                    firstName = "";
                    for(var i = 0; i < arr.length - 1; ++i){
                        firstName += arr[i] + ' ';
                    }
                    firstName += "Extension";
                }
                $scope.users.push({
                    id: userObj.id,
                    // first_name: userObj.first_name,
                    first_name: firstName,
                    last_name: userObj.last_name,
                    email: userObj.email,
                    mobile: userObj.mobile,
                    // groupName: userObj.groups.length > 0 ? userObj.groups[0].name : null,
                    groupName: groupName,
                    created: userObj.created ? $filter("date")(userObj.created,'mediumDate') + ' ' + $filter("date")(userObj.created,'shortTime'): null,
                    updated: userObj.updated ? $filter("date")(userObj.updated,'mediumDate') + ' ' + $filter("date")(userObj.updated,'shortTime'): null,
                    status: $filter("capitalizeWord")(userObj.status),
                    kycStatus: userObj.kyc ? $filter("capitalizeWord")(userObj.kyc.status) : null,
                    archived: $filter("capitalizeWord")(userObj.archived),
                    last_login: userObj.last_login ? $filter("date")(userObj.last_login,'mediumDate') + ' ' + $filter("date")(userObj.last_login,'shortTime'): null,
                    verified: userObj.verified ? 'Yes' : 'No',
                    id_number: userObj.id_number,
                    nationality: userObj.nationality ? $filter("isoCountry")(userObj.nationality): null,
                    language: userObj.language,
                    timezone: userObj.timezone,
                    birth_date: userObj.birth_date,
                    username: userObj.username
                });
            });

            $scope.getGroup();

        };

        $scope.getGroup = function () {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;

            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: groupName}).then(function (res) {
                    $scope.editGroupObj = res;
                    if($scope.editGroupObj.name == 'service'){
                        $scope.editGroupObj.name = 'extension';
                    }
                    $scope.loadingGroup = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.displayGroupUser = function (user) {
            $location.path('/user/' + user.id + '/details');
        };

        $scope.openAddUserToGroupModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'GroupUsersAddModalCtrl',
                resolve: {
                    group: function () {
                        return $scope.editGroupObj;
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    $scope.getAllUsers();
                }
            }, function(){
            });
        };

        $scope.openReassignUserToGroupModal = function (page, size,user) {
            vm.theReassignModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ReassignGroupUserModalCtrl',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            vm.theReassignModal.result.then(function(user){
                if(user){
                    $scope.getAllUsers();
                }
            }, function(){
            });
        };

        $scope.deleteUserFromGroupConfirm = function (user) {
            $ngConfirm({
                title: 'Remove user from group',
                content: 'Are you sure you want to remove this user?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteUserFromGroup(user);
                        }
                    }
                }
            });
        };

        $scope.deleteUserFromGroup = function (user) {
            $scope.loadingGroup = true;
            Rehive.admin.users.groups.delete(user.id,$scope.groupName).then(function (res) {
                $scope.getAllUsers();
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroup = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
