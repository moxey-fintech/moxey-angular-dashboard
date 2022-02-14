(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.list')
        .controller('UsersListCtrl', UsersListCtrl);

    /** @ngInject */
    function UsersListCtrl($rootScope,$state,Rehive,$scope,typeaheadService,$location,$uibModal,multiOptionsFilterService,currenciesList,
                       localStorageManagement,errorHandler,$window,toastr,serializeFiltersService,$filter,$intercom,$http,environmentConfig) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.savedUserTableColumns = vm.companyIdentifier + 'usersTable';
        vm.savedUserTableFilters = vm.companyIdentifier + 'usersTableFilters';
        $rootScope.dashboardTitle = 'Users | Moxey';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        vm.savedGroupColors = [];
        vm.companyColors = localStorageManagement.getValue('companyIdentifier') + "_group_colors";
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        vm.accountRef = null;
        if($scope.locationIndicator.indexOf('?account') > -1){
            var arr = $scope.locationIndicator.split('?account=');
            $scope.locationIndicator = arr[0];
            vm.accountRef = arr[1];
            $location.search('account', null);
        }
        $scope.usersStateMessage = '';
        $scope.users = [];
        $scope.usersData = {};
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.archivedOptions = ['True','False'];
        $scope.statusOptions = ['Status','Pending', 'Obsolete', 'Declined', 'Verified', 'Incomplete'];
        $scope.orderByOptions = ['Created','Last login date'];
        $scope.groupFilterOptions = ['User group','In a group'];
        $scope.userTypeOptions = ['Permanent', 'Temporary'];
        $scope.currencyOptions = [];
        $scope.filtersCount = 0;
        $scope.initialLoad = true;
        $scope.orderByVariable = '-createdJSTime';
        $scope.cryptoExtensions = null;
        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.hasStellarActivated = false;
        $scope.hasStellarTestnetActivated = false;
        $scope.hasBitcoinActivated = false;
        $scope.hasBitcoinTestnetActivated = false;

        // if(localStorageManagement.getValue(vm.savedUserTableColumns)){
        //     var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedUserTableColumns));
        //     var recipientFieldExists = false;
        //     headerColumns.forEach(function (col) {
        //         if(col.colName == 'Archived' || col.fieldName == 'archived'){
        //             recipientFieldExists = true;
        //         }
        //     });
        //
        //     if(!recipientFieldExists){
        //         headerColumns.splice(8,0,{colName: 'Archived',fieldName: 'archived',visible: false});
        //     }
        //
        //     localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify(headerColumns));
        // }

        //removing active field
        if(localStorageManagement.getValue(vm.savedUserTableColumns)){
             var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedUserTableColumns));
             headerColumns.forEach(function (col,index,array) {
                 if(col.colName == 'Identifier'){
                     col.colName = 'Id';
                     col.fieldName = 'id';
                 }
             });

            localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify(headerColumns));
        }

        $scope.headerColumns = localStorageManagement.getValue(vm.savedUserTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedUserTableColumns)) : [
            {colName: 'Id',fieldName: 'id',visible: true},
            {colName: 'First name',fieldName: 'first_name',visible: true},
            {colName: 'Last name',fieldName: 'last_name',visible: true},
            {colName: 'Email',fieldName: 'email',visible: true},
            {colName: 'Mobile number',fieldName: 'mobile',visible: true},
            {colName: 'User group',fieldName: 'groupName',visible: true},
            {colName: 'Created',fieldName: 'created',visible: true},
            {colName: 'Updated',fieldName: 'updated',visible: false},
            {colName: 'Archived',fieldName: 'archived',visible: false},
            {colName: 'Status',fieldName: 'status',visible: false},
            {colName: 'KYC status',fieldName: 'kycStatus',visible: false},
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
            archivedFilter: false,
            idFilter: false,
            emailFilter: false,
            mobileFilter: false,
            firstNameFilter: false,
            lastNameFilter: false,
            accountReferenceFilter: false,
            groupFilter: false,
            currencyFilter: false,
            createdFilter: false,
            updatedFilter: false,
            lastLoginDateFilter: false,
            kycFilter:  false,
            pageSizeFilter: false,
            stellarMemoFilter: false,
            stellarTestnetMemoFilter: false,
            bitcoinAddressFilter: false,
            bitcoinTestnentAddressFilter: false,
            userTypeFilter: false
        };
        $scope.applyFiltersObj = {
            archivedFilter: {
                selectedArchivedFilter: 'True'
            },
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
            groupFilter: {
                selectedGroupOption: 'User group',
                existsInGroup: false,
                selectedGroup: {}
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
            },
            paginationFilter: {
                itemsPerPage: 25,
                pageNo: 1,
                maxSize: 5
            },
            stellarMemoFilter: {
                selectedStellarMemo: ''
            },
            stellarTestnetMemoFilter: {
                selectedStellarTestnetMemo: ''
            },
            bitcoinAddressFilter: {
                selectedBitcoinAddress: ''
            },
            bitcoinTestnentAddressFilter: {
                selectedBitcoinTestnetAddress: ''
            },
            userTypeFilter: {
                selectedUserTypeOption: 'Permanent'
            }
        };

        $scope.goToUserDocuments = function(){
            $state.go('users.documents', {status: 'Pending'});
        };

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.selectAllColumns = function () {
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleColumnVisibility = function () {
            localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreColDefaults = function () {
            var defaultVisibleHeader = ['Id','First name','Last name','Email',
                'Mobile number','User group','Created'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.getGroups = function () {
            if(vm.token) {
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.groupOptions = res.results;
                        $scope.applyFiltersObj.groupFilter.selectedGroup = $scope.groupOptions[0];
                        // $scope.getAllUsers();
                    } else {
                        // $scope.getAllUsers();
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            vm.currenciesList.splice(0,0,{code: 'Currency'});
            $scope.currencyOptions = vm.currenciesList;
            $scope.getGroups();
        };
        vm.getCompanyCurrencies();

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
                archivedFilter: false,
                idFilter: false,
                emailFilter: false,
                mobileFilter: false,
                firstNameFilter: false,
                lastNameFilter: false,
                accountReferenceFilter: false,
                groupFilter: false,
                currencyFilter: false,
                createdFilter: false,
                updatedFilter: false,
                lastLoginDateFilter: false,
                kycFilter:  false,
                pageSizeFilter: false,
                stellarMemoFilter: false,
                stellarTestnetMemoFilter: false,
                bitcoinAddressFilter: false,
                bitcoinTestnentAddressFilter: false,
                userTypeFilter: false
            };
            $scope.showFilters();
            $scope.getAllUsers('applyfilter');
        };        

        $scope.createdIntervalChanged = function () {
            if($scope.applyFiltersObj.createdFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.updatedIntervalChanged = function () {
            if($scope.applyFiltersObj.updatedFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.lastLoginDayIntervalChanged = function () {
            if($scope.applyFiltersObj.lastLoginDateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.pageSizeChanged =  function () {
            if($scope.applyFiltersObj.paginationFilter.itemsPerPage > 250){
                $scope.applyFiltersObj.paginationFilter.itemsPerPage = 250;
            }
        };

        $scope.orderByFunction = function (header) {
            if(header.orderByDirection == 'desc'){
                header.orderByDirection = 'asc';
                $scope.orderByVariable = header.fieldName;
            } else {
                header.orderByDirection = 'desc';
                $scope.orderByVariable = '-' + header.fieldName;
                localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify($scope.headerColumns));
            }
        };

        vm.getCreatedDateFilters = function () {
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

        vm.getServices = function(applyFilter){
            if(vm.token){
                $scope.loadingUsers = true;
                $scope.cryptoExtensions = {};
                $scope.hasStellarActivated = false;
                $scope.hasStellarTestnetActivated = false;
                $scope.hasBitcoinActivated = false;
                $scope.hasBitcoinTestnetActivated = false;

                $http.get(environmentConfig.API + 'admin/services/?active=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    
                    var servicesList =  res.data.data.results;
                    if(servicesList.length > 0){
                        for(var i = 0; i < servicesList.length; ++i){
                            if(servicesList[i].slug === 'bitcoin_service' || servicesList[i].slug === 'bitcoin_testnet_service' 
                            || servicesList[i].slug === 'stellar_service' || servicesList[i].slug === 'stellar_testnet_service'){
                                $scope.cryptoExtensions[servicesList[i].slug] = servicesList[i].url;

                                if(!$scope.hasStellarActivated){$scope.hasStellarActivated = (servicesList[i].slug === 'stellar_service');}
                                if(!$scope.hasStellarTestnetActivated){$scope.hasStellarTestnetActivated = (servicesList[i].slug === 'stellar_testnet_service');}
                                if(!$scope.hasBitcoinActivated){$scope.hasBitcoinActivated = (servicesList[i].slug === 'bitcoin_service');}
                                if(!$scope.hasBitcoinTestnetActivated){$scope.hasBitcoinTestnetActivated = (servicesList[i].slug === 'bitcoin_testnet_service');}
                            }                                
                        }
                    }
                    $scope.loadingUsers = false;
                    if(applyFilter){
                        if($scope.filtersObj.stellarMemoFilter){ vm.getStellarUserUsingMemo(); }
                        if($scope.filtersObj.stellarTestnetMemoFilter){ vm.getStellarTestnetUserUsingMemo(); }
                        if($scope.filtersObj.bitcoinAddressFilter){ vm.getBitcoinUserUsingAddress(); }
                        if($scope.filtersObj.bitcoinTestnentAddressFilter){ vm.getBitcoinTestnetUserUsingAddress(); }
                    }
                    
                }).catch(function (error) {
                    $scope.loadingUsers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getUsersFiltersObj = function(){
            $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};

            // get saved user table filters on initial load from local storage if any
            if($scope.initialLoad){
                vm.getServices();
                $scope.initialLoad = false;
                if(localStorageManagement.getValue(vm.savedUserTableFilters)){
                    filterObjects = JSON.parse(localStorageManagement.getValue(vm.savedUserTableFilters));

                    $scope.filtersObj = filterObjects.filtersObj;

                    $scope.filtersObj.stellarMemoFilter = false;
                    $scope.filtersObj.stellarTestnetMemoFilter = false;
                    $scope.filtersObj.bitcoinAddressFilter = false;
                    $scope.filtersObj.bitcoinTestnentAddressFilter = false;

                    $scope.applyFiltersObj = {
                        archivedFilter: {
                            selectedArchivedFilter: filterObjects.applyFiltersObj.archivedFilter.selectedArchivedFilter
                        },
                        idFilter: {
                            selectedId: filterObjects.applyFiltersObj.idFilter.selectedId
                        },
                        emailFilter: {
                            selectedEmail: filterObjects.applyFiltersObj.emailFilter.selectedEmail || $state.params.email 
                        },
                        mobileFilter: {
                            selectedMobile: filterObjects.applyFiltersObj.mobileFilter.selectedMobile || $state.params.mobile
                        },
                        firstNameFilter: {
                            selectedFirstName: filterObjects.applyFiltersObj.firstNameFilter.selectedFirstName
                        },
                        lastNameFilter: {
                            selectedLastName: filterObjects.applyFiltersObj.lastNameFilter.selectedLastName
                        },
                        accountReferenceFilter: {
                            selectedAccountReference: filterObjects.applyFiltersObj.accountReferenceFilter.selectedAccountReference
                        },
                        groupFilter: {
                            selectedGroupOption: filterObjects.applyFiltersObj.groupFilter.selectedGroupOption,
                            existsInGroup: filterObjects.applyFiltersObj.groupFilter.existsInGroup,
                            selectedGroup: $scope.groupOptions ? (filterObjects.applyFiltersObj.groupFilter.selectedGroup.name ?
                                $scope.groupOptions.filter(function (group) {
                                    if(group.name == filterObjects.applyFiltersObj.groupFilter.selectedGroup.name){
                                        return group;
                                    }
                                }) : $scope.groupOptions[0]) : null
                        },
                        currencyFilter: {
                            selectedCurrency: filterObjects.applyFiltersObj.currencyFilter.selectedCurrency.code ? filterObjects.applyFiltersObj.currencyFilter.selectedCurrency : filterObjects.applyFiltersObj.currencyFilter.selectedCurrency = { code: 'Currency' }
                        },
                        createdFilter: {
                            selectedDateOption: filterObjects.applyFiltersObj.createdFilter.selectedDateOption,
                            selectedDayIntervalOption: filterObjects.applyFiltersObj.createdFilter.selectedDayIntervalOption,
                            dayInterval: filterObjects.applyFiltersObj.createdFilter.dayInterval,
                            dateFrom: moment(filterObjects.applyFiltersObj.createdFilter.dateFrom).toDate(),
                            dateTo: moment(filterObjects.applyFiltersObj.createdFilter.dateTo).toDate(),
                            dateEqualTo: moment(filterObjects.applyFiltersObj.createdFilter.dateEqualTo).toDate()
                        },
                        updatedFilter: {
                            selectedDateOption: filterObjects.applyFiltersObj.updatedFilter.selectedDateOption,
                            selectedDayIntervalOption: filterObjects.applyFiltersObj.updatedFilter.selectedDayIntervalOption,
                            dayInterval: filterObjects.applyFiltersObj.updatedFilter.dayInterval,
                            dateFrom: moment(filterObjects.applyFiltersObj.updatedFilter.dateFrom).toDate(),
                            dateTo: moment(filterObjects.applyFiltersObj.updatedFilter.dateTo).toDate(),
                            dateEqualTo: moment(filterObjects.applyFiltersObj.updatedFilter.dateEqualTo).toDate()
                        },
                        lastLoginDateFilter: {
                            selectedDateOption: filterObjects.applyFiltersObj.lastLoginDateFilter.selectedDateOption,
                            selectedDayIntervalOption: filterObjects.applyFiltersObj.lastLoginDateFilter.selectedDayIntervalOption,
                            dayInterval: filterObjects.applyFiltersObj.lastLoginDateFilter.dayInterval,
                            dateFrom: moment(filterObjects.applyFiltersObj.lastLoginDateFilter.dateFrom).toDate(),
                            dateTo: moment(filterObjects.applyFiltersObj.lastLoginDateFilter.dateTo).toDate(),
                            dateEqualTo: moment(filterObjects.applyFiltersObj.lastLoginDateFilter.dateEqualTo).toDate()
                        },
                        // kycFilter: {
                        //     selectedKycFilter: filterObjects.applyFiltersObj.kycFilter.selectedKycFilter
                        // },
                        orderByFilter: {
                            selectedOrderByOption: filterObjects.applyFiltersObj.orderByFilter.selectedOrderByOption
                        },
                        paginationFilter: {
                            itemsPerPage: filterObjects.applyFiltersObj.paginationFilter.itemsPerPage,
                            pageNo: filterObjects.applyFiltersObj.paginationFilter.pageNo,
                            maxSize: filterObjects.applyFiltersObj.paginationFilter.maxSize
                        },
                        userTypeFilter: {
                            selectedUserTypeOption: filterObjects.applyFiltersObj.userTypeFilter ? filterObjects.applyFiltersObj.userTypeFilter.selectedUserTypeOption : 'Permanent'
                        }
                        // ,
                        // stellarMemoFilter: {
                        //     selectedStellarMemo: filterObjects.applyFiltersObj.stellarMemoFilter.selectedStellarMemo
                        // },
                        // stellarTestnetMemoFilter: {
                        //     selectedStellarTestnetMemo: filterObjects.applyFiltersObj.stellarTestnetMemoFilter.selectedStellarTestnetMemo
                        // },
                        // bitcoinAddressFilter: {
                        //     selectedBitcoinAddress: filterObjects.applyFiltersObj.bitcoinAddressFilter.selectedBitcoinAddress
                        // },
                        // bitcoinTestnentAddressFilter: {
                        //     selectedBitcoinTestnetAddress: filterObjects.applyFiltersObj.bitcoinTestnentAddressFilter.selectedBitcoinTestnetAddress
                        // }
                    };

                    searchObj = filterObjects.searchObj;
                } else {
                    searchObj = {
                        page: 1,
                        page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25,
                    };
                }
            } else {

                if($scope.filtersObj.createdFilter){
                    vm.dateObj = vm.getCreatedDateFilters();
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

                searchObj = {
                    page: $scope.applyFiltersObj.paginationFilter.pageNo,
                    page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25,
                    id__contains: $scope.filtersObj.idFilter ? ($scope.applyFiltersObj.idFilter.selectedId ?  $scope.applyFiltersObj.idFilter.selectedId : null): null,
                    email__contains: $scope.filtersObj.emailFilter ?($scope.applyFiltersObj.emailFilter.selectedEmail ? $scope.applyFiltersObj.emailFilter.selectedEmail : null): null,
                    mobile__contains: $scope.filtersObj.mobileFilter ? ($scope.applyFiltersObj.mobileFilter.selectedMobile ? $scope.applyFiltersObj.mobileFilter.selectedMobile : null): null,
                    first_name__contains: $scope.filtersObj.firstNameFilter ? ($scope.applyFiltersObj.firstNameFilter.selectedFirstName ?  $scope.applyFiltersObj.firstNameFilter.selectedFirstName : null): null,
                    last_name__contains: $scope.filtersObj.lastNameFilter ? ($scope.applyFiltersObj.lastNameFilter.selectedLastName ?  $scope.applyFiltersObj.lastNameFilter.selectedLastName : null): null,
                    account: $scope.filtersObj.accountReferenceFilter ? ($scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference ?  $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference : null): null,
                    group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'User group'? $scope.applyFiltersObj.groupFilter.selectedGroup.name: null : null,
                    group__isnull: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'In a group'? (!$scope.applyFiltersObj.groupFilter.existsInGroup).toString(): null : null,
                    created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                    created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                    updated__gt: vm.updatedDateObj.updated__gt ? Date.parse(vm.updatedDateObj.updated__gt +'T00:00:00') : null,
                    updated__lt: vm.updatedDateObj.updated__lt ? Date.parse(vm.updatedDateObj.updated__lt +'T00:00:00') : null,
                    last_login__gt: vm.lastLogindateObj.last_login__gt ? Date.parse(vm.lastLogindateObj.last_login__gt +'T00:00:00') : null,
                    last_login__lt: vm.lastLogindateObj.last_login__lt ? Date.parse(vm.lastLogindateObj.last_login__lt +'T00:00:00') : null,
                    // kyc__status: $scope.filtersObj.kycFilter ? ($scope.applyFiltersObj.kycFilter.selectedKycFilter == 'Status' ? null : $scope.applyFiltersObj.kycFilter.selectedKycFilter.toLowerCase()): null,
                    kyc__status: null,
                    currency__code: $scope.filtersObj.currencyFilter ? ($scope.applyFiltersObj.currencyFilter.selectedCurrency.code ? ($scope.applyFiltersObj.currencyFilter.selectedCurrency.code == 'Currency' ? null : $scope.applyFiltersObj.currencyFilter.selectedCurrency.code) : null): null,
                    archived: $scope.filtersObj.archivedFilter ? ($scope.applyFiltersObj.archivedFilter.selectedArchivedFilter == 'True' ?  true : false) : null,
                    temporary: $scope.filtersObj.userTypeFilter ? ($scope.applyFiltersObj.userTypeFilter.selectedUserTypeOption === 'Temporary') : null
                };

                vm.saveUsersTableFiltersToLocalStorage({
                    searchObj: serializeFiltersService.objectFilters(searchObj),
                    filtersObj: $scope.filtersObj,
                    applyFiltersObj: $scope.applyFiltersObj
                });
            }

            if(vm.accountRef){
                $scope.filterObjects.accountReferenceFilter = true;
                $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference  = vm.accountRef;
                searchObj.account = vm.accountRef;
                vm.accountRef = null;
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

        vm.saveUsersTableFiltersToLocalStorage = function (filterObjects) {
            localStorageManagement.setValue(vm.savedUserTableFilters,JSON.stringify(filterObjects));
        };

        vm.getUsersByIdRange = function(idRange){
            $scope.usersStateMessage = '';
            $scope.loadingUsers = true;
            $scope.showingFilters = false;
            $scope.applyFiltersObj.paginationFilter.pageNo = 1;

            if($scope.users.length > 0 ){
                $scope.users.length = 0;
            }
            
            Rehive.admin.users.get({filters: {
                id__in: idRange
            }}).then(function (res) {
                $scope.usersData = res;
                vm.formatUsersArray(res.results, null);
                $scope.usersStateMessage = $scope.users.length == 0 ? 'No users have been found' : '';
                $scope.loadingUsers = false;
                $scope.$apply();
            }, function (error) {
                $scope.loadingUsers = false;
                $scope.usersStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getStellarUserUsingMemo = function() {
            if(vm.token){
                $scope.loadingUsers = true;
                var stellarUrl = $scope.cryptoExtensions['stellar_service'] + 'admin/users/?' + serializeFiltersService.serializeFilters({
                    // page: 1,
                    // page_size: 250,
                    memo: $scope.applyFiltersObj.stellarMemoFilter.selectedStellarMemo
                });
                $http.get(stellarUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var userList = res.data.data.results;
                    var idRange = "";
                    userList.forEach(function(user, idx, arr){
                        idRange += (idx === (arr.length - 1)) ? user.id : (user.id + ',');
                    });
                    vm.getUsersByIdRange(idRange);

                }).catch(function (error) {
                    $scope.loadingUsers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getStellarTestnetUserUsingMemo = function() {
            if(vm.token){
                $scope.loadingUsers = true;
                var stellarTestnetUrl = $scope.cryptoExtensions['stellar_testnet_service'] + 'admin/users/?' + serializeFiltersService.serializeFilters({
                    // page: 1,
                    // page_size: 250,
                    memo: $scope.applyFiltersObj.stellarTestnetMemoFilter.selectedStellarTestnetMemo
                });
                $http.get(stellarTestnetUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var userList = res.data.data.results;
                    var idRange = "";
                    userList.forEach(function(user, idx, arr){
                        idRange += (idx === (arr.length - 1)) ? user.id : (user.id + ',');
                    });
                    vm.getUsersByIdRange(idRange);
                }).catch(function (error) {
                    $scope.loadingUsers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getBitcoinUserUsingAddress = function() {
            if(vm.token){
                $scope.loadingUsers = true;
                var bitcoinUrl = $scope.cryptoExtensions['bitcoin_service'] + 'admin/users/?' + serializeFiltersService.serializeFilters({
                    // page: 1,
                    // page_size: 250,
                    address: $scope.applyFiltersObj.bitcoinAddressFilter.selectedBitcoinAddress
                });
                $http.get(bitcoinUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var userList = res.data.data.results;
                    var idRange = "";
                    userList.forEach(function(user, idx, arr){
                        idRange += (idx === (arr.length - 1)) ? user.id : (user.id + ',');
                    });
                    vm.getUsersByIdRange(idRange);
                }).catch(function (error) {
                    $scope.loadingUsers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getBitcoinTestnetUserUsingAddress = function() {
            if(vm.token){
                $scope.loadingUsers = true;
                var bitcoiTestnetUrl = $scope.cryptoExtensions['bitcoin_testnet_service'] + 'admin/users/?' + serializeFiltersService.serializeFilters({
                    page: 1,
                    page_size: 250,
                    address: $scope.applyFiltersObj.bitcoinTestnentAddressFilter.selectedBitcoinTestnetAddress
                });
                $http.get(bitcoiTestnetUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var userList = res.data.data.results;
                    var idRange = "";
                    userList.forEach(function(user, idx, arr){
                        idRange += (idx === (arr.length - 1)) ? user.id : (user.id + ',');
                    });
                    vm.getUsersByIdRange(idRange);
                }).catch(function (error) {
                    $scope.loadingUsers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getAllUsersApiCall = function (usersFiltersObj) {
            Rehive.admin.users.get({filters: usersFiltersObj}).then(function (res) {
                $scope.usersData = res;
                
                if($scope.filtersObj.stellarMemoFilter || $scope.filtersObj.stellarTestnetMemoFilter 
                    ||  $scope.filtersObj.bitcoinAddressFilter || $scope.filtersObj.bitcoinTestnentAddressFilter){
                    
                    vm.formatUsersArray(res.results, 'cryptoExists');
                    
                    if(!$scope.cryptoExtensions){
                        vm.getServices('applyFilter');
                    }
                    else{
                        if($scope.filtersObj.stellarMemoFilter){ vm.getStellarUserUsingMemo(); }
                        if($scope.filtersObj.stellarTestnetMemoFilter){ vm.getStellarTestnetUserUsingMemo(); }
                        if($scope.filtersObj.bitcoinAddressFilter){ vm.getBitcoinUserUsingAddress(); }
                        if($scope.filtersObj.bitcoinTestnentAddressFilter){ vm.getBitcoinTestnetUserUsingAddress(); }
                    }
                }
                else {
                    vm.formatUsersArray(res.results, null);
                    $scope.usersStateMessage = $scope.users.length == 0 ? 'No users have been found' : '';
                }
                $scope.$apply();
            }, function (error) {
                $scope.loadingUsers = false;
                $scope.usersStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.getAllUsers = function(applyFilter){
            $scope.usersStateMessage = '';
            $scope.loadingUsers = true;
            $scope.showingFilters = false;
            var usersFiltersObj = {};

            if(applyFilter){
                $scope.applyFiltersObj.paginationFilter.pageNo = 1;
            }

            if($scope.users.length > 0 ){
                $scope.users.length = 0;
            }

            usersFiltersObj = vm.getUsersFiltersObj();
            vm.getAllUsersApiCall(usersFiltersObj);

        };

        vm.initializeGroupColor = function(userGroupName){
            if(userGroupName === null){return "#022b36";}
            var idx = -1;
            vm.savedGroupColors = localStorageManagement.getValue(vm.companyColors) ? JSON.parse(localStorageManagement.getValue(vm.companyColors)) : [];
            vm.savedGroupColors.forEach(function(color){
                if(color.group == userGroupName){
                    idx = vm.savedGroupColors.indexOf(color);
                    return;
                }
            });
            return (idx === -1) ? "#022b36" : vm.savedGroupColors[idx].color;
        };

        vm.formatUsersArray = function (usersArray, cryptoExists) {
            var idx = -1;

            usersArray.forEach(function (userObj) {
                var firstName = userObj.first_name, groupName = (userObj.groups.length > 0) ? ((userObj.groups[0].name == 'service') ? "extension" : userObj.groups[0].name) : null;
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
                    first_name: firstName,
                    last_name: userObj.last_name,
                    email: userObj.email,
                    mobile: userObj.mobile,
                    groupName: groupName,
                    created: userObj.created ? $filter("date")(userObj.created,'mediumDate') + ' ' + $filter("date")(userObj.created,'shortTime'): null,
                    updated: userObj.updated ? $filter("date")(userObj.updated,'mediumDate') + ' ' + $filter("date")(userObj.updated,'shortTime'): null,
                    archived: $filter("capitalizeWord")(userObj.archived),
                    status: $filter("capitalizeWord")(userObj.status),
                    kycStatus: userObj.kyc ? $filter("capitalizeWord")(userObj.kyc.status) : null,
                    last_login: userObj.last_login ? $filter("date")(userObj.last_login,'mediumDate') + ' ' + $filter("date")(userObj.last_login,'shortTime'): null,
                    verified: userObj.verified ? 'Yes' : 'No',
                    id_number: userObj.id_number,
                    nationality: userObj.nationality ? $filter("isoCountry")(userObj.nationality): null,
                    language: userObj.language,
                    timezone: userObj.timezone,
                    birth_date: userObj.birth_date,
                    username: userObj.username,
                    createdJSTime: userObj.created,
                    temporary: userObj.temporary
                });
                ++idx;
                if(groupName != "admin" && groupName != "extension"){
                    $scope.users[idx].group_highlight_color = vm.initializeGroupColor(groupName);
                }
            });

            if(!cryptoExists){$scope.loadingUsers = false;}
            $scope.$apply();
        };

        vm.filterCryptoUsers = function(stellarIdFilter, stellarTestnetIdFilter, bitcoinIdFilter, bitcoinTestnetIdFilter){
            $scope.loadingUsers = true;
            if(stellarIdFilter && $scope.users.length > 0){
                $scope.users = $scope.users.filter(function(user){
                    return (user.id === stellarIdFilter);
                });
            }
            
            if(stellarTestnetIdFilter && $scope.users.length > 0){
                $scope.users = $scope.users.filter(function(user){
                    return (user.id === stellarTestnetIdFilter);
                });
            }

            if(bitcoinIdFilter && $scope.users.length > 0){
                $scope.users = $scope.users.filter(function(user){
                    return (user.id === bitcoinIdFilter);
                });
            }

            if(bitcoinTestnetIdFilter && $scope.users.length > 0){
                $scope.users = $scope.users.filter(function(user){
                    return (user.id === bitcoinTestnetIdFilter);
                });
            }

            $scope.usersStateMessage = ($scope.users.length == 0) ? 'No users have been found' : '';
            $scope.loadingUsers = false;
        };

        if($state.params.currencyCode){
            $scope.filtersObj.currencyFilter = true;
            vm.currenciesList.forEach(function (element) {
                if(element.code == $state.params.currencyCode){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrency = element;
                }
            });
            $scope.getAllUsers('applyFilter');
        }
        else if($state.params.email){
            $scope.clearFilters();
            $scope.filtersObj.emailFilter = true;
            $scope.applyFiltersObj.emailFilter.selectedEmail = $state.params.email;

            var filtersObj = null;
            if(localStorageManagement.getValue(vm.savedUserTableFilters)){
                filtersObj = JSON.parse(localStorageManagement.getValue(vm.savedUserTableFilters));
            }
            else {
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }

            filtersObj.searchObj.email__contains = $state.params.email;
            filtersObj.applyFiltersObj.emailFilter.selectedEmail = $state.params.email;

            vm.saveUsersTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });

            $scope.getAllUsers('applyFilter');
        }
        else if($state.params.mobile){
            $scope.clearFilters();
            $scope.filtersObj.mobileFilter = true;
            $scope.applyFiltersObj.mobileFilter.selectedMobile = $state.params.mobile;

            var filtersObj = null;
            if(localStorageManagement.getValue(vm.savedUserTableFilters)){
                filtersObj = JSON.parse(localStorageManagement.getValue(vm.savedUserTableFilters));
            }
            else {
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }

            filtersObj.searchObj.mobile__contains = $state.params.mobile;
            filtersObj.applyFiltersObj.mobileFilter.selectedMobile = $state.params.mobile;

            vm.saveUsersTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });

            $scope.getAllUsers('applyFilter');
        }
        else if($state.params.reference){
            $scope.clearFilters();
            $scope.filtersObj.accountReferenceFilter = true;
            $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference = $state.params.reference;

            var filtersObj = null;
            if(localStorageManagement.getValue(vm.savedUserTableFilters)){
                filtersObj = JSON.parse(localStorageManagement.getValue(vm.savedUserTableFilters));
            }
            else {
                filtersObj = {};
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }

            filtersObj.searchObj.account = $state.params.reference;
            filtersObj.applyFiltersObj.accountReferenceFilter.selectedAccountReference = $state.params.reference;

            vm.saveUsersTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });

            $scope.getAllUsers('applyFilter');
        } else if(vm.accountRef) {
            $scope.getAllUsers('applyFilter');
        } else {
            $scope.getAllUsers(null);
        }

        $scope.openAddUserModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserModalCtrl'
            });

            vm.theAddModal.result.then(function(user){
                if(user){
                    $scope.getAllUsers();
                }
            }, function(){
            });

        };

        $scope.displayUser = function ($event,user) {
            if($event.which === 1){
                $location.path('/user/' + user.id + '/details');
            } else if($event.which === 2){
                $window.open('/#/user/' + user.id + '/details','_blank');
            } else if($event.which === 3){
                $window.open('/#/user/' + user.id + '/details','_blank');
            }
        };

        $scope.closeColumnFiltersBox = function () {
            $scope.showingColumnFilters = false;
        };

        $scope.openMakeNewTransaction = function(user){
            $location.path('/transactions/history').search({
                userEmail: user.email || user.mobile || user.id
            });
        };

    }
})();
