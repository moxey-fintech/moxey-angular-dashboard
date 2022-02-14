(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /** @ngInject */
    function PageTopCtrl($rootScope,$scope,Rehive,localStorageManagement,$state,$timeout,serializeFiltersService,
                         $location,errorHandler,$window,identifySearchInput,$intercom,$http,environmentConfig,$uibModal) {
        
        var vm = this;

        vm.token = localStorageManagement.getValue('TOKEN');
        vm.searchBox = document.getElementById("searchBox");
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedAccountsTableFilters = vm.companyIdentifier + 'accountsTableFilters';
        vm.savedTransactionTableFilters = vm.companyIdentifier + 'transactionTableFilters';
        $scope.currencies = [];
        $rootScope.missing2FA = false;
        $scope.hideSearchBar = true;
        $scope.searchString = '';
        vm.searchedAccounts = vm.searchedUsers = vm.searchedTransactions = [];
        $scope.searchedTransactions = [];
        $scope.searchedUsers = [];
        $scope.loadingResults = false;
        $scope.inCompanySetupViews = false;
        $scope.profileImageAvailable = false;
        $scope.useRehiveLogo = true;
        $scope.rehiveLogo  = '../../assets/img/_rehiveLogo.svg';
        $scope.onWelcomePage = (($location.path().indexOf('/login') >= 0) || ($location.path().indexOf('/register') >= 0));

        $scope.displayOptions = false;
        $scope.tagAdded = false;
        $scope.selectedTag = "";
        $scope.selectedFilter = "users,accounts,transactions";
        $scope.showAllReferences = true;
        $scope.showAccountsOnly = $scope.showTransactionsOnly = $scope.showUsersOnly = false;
        $scope.selectSearchCategory = [];
        $scope.selectSearchCategory = [
            {name: "accounts", placeholder: "   Show accounts results only"},
            {name: "transactions", placeholder: "   Show transaction results only"},
            {name: "users", placeholder: "   Show user results only"}
        ];

        document.onclick = function(event){           

            if($scope.displayOptions && event.target !== vm.searchBox){
                $scope.displaySearchOptions();
            }
        };

        $scope.displaySearchOptions = function(){
            $scope.displayOptions = !$scope.displayOptions;
            vm.searchBox.placeholder = "";
            if(!$scope.displayOptions){
                vm.searchBox.placeholder = "Search by email, mobile number or transaction id";
            }
        };

        vm.checkMultiFactorAuthEnabled = function () {
            if(vm.token) {
                Rehive.auth.mfa.status.get().then(function (res) {
                    var mfaInUse = null;
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                mfaInUse = key;
                                $scope.$apply();
                            }
                        }
                    }
                    $rootScope.missing2FA = mfaInUse === null;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.checkMultiFactorAuthEnabled();

        vm.getAdminEmails = function(){
            if(vm.token && !localStorageManagement.getValue('mfaUnverified')){
                Rehive.user.emails.get().then(function (res) {
                    var adminEmails = res;
                    $rootScope.unverifiedAdminEmail = false;
                    adminEmails.forEach(function(email){
                        if(email.primary && !email.verified){
                            $rootScope.unverifiedAdminEmail = true;
                            return;
                        }                                    
                    });
                    $rootScope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $rootScope.$apply();
                });
            }
        };

        vm.getAdminProfile = function(){
            if(vm.token && !localStorageManagement.getValue('mfaUnverified')){
                $scope.loadingCompanyInfo = true;
                Rehive.user.get().then(function (res) {
                    $scope.profileImage = res.profile;
                    $scope.profileImageAvailable = $scope.profileImage ? true : false;
                    $scope.useRehiveLogo = !$scope.profileImageAvailable;
                    vm.getAdminEmails();
                    $scope.loadingCompanyInfo = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanyInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };        

        vm.getCompanyInfo = function () {
            if(vm.token && !localStorageManagement.getValue('mfaUnverified')) {
                $scope.loadingCompanyInfo = true;
                Rehive.admin.company.get().then(function (res) {
                    $rootScope.pageTopObj.companyObj = {};
                    $rootScope.pageTopObj.companyObj = res;
                    $scope.companyImageUrl = res.logo;
                    $scope.companyIconUrl = res.icon;
                    $rootScope.isInTestMode = res.mode === 'test';
                    $rootScope.isRestricted = res.status === 'restricted';
                    localStorageManagement.setValue('companyIdentifier', $rootScope.pageTopObj.companyObj.id);
                    localStorageManagement.setValue('companyCreatedAt', res.created);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanyInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getUserInfo = function () {
            if(vm.token && !localStorageManagement.getValue('mfaUnverified')){
                Rehive.user.get().then(function(user){
                    $rootScope.pageTopObj.userInfoObj = {};
                    $rootScope.pageTopObj.userInfoObj = user;
                    vm.getAdminEmails();
                    $rootScope.$apply();
                },function(err){
                });
            }
        };

        vm.currentLocation = $location.path();
        $rootScope.$on('$locationChangeStart', function (event,newUrl,oldURl) {
            vm.currentLocation = $location.path();
            vm.checkIfInCompanySetup(vm.currentLocation);
        });

        $scope.goToCreditUser = function (email) {
            $scope.hidingSearchBar();
            $scope.searchString = '';
            var creditUser = "credit:" + email;
            $state.go('transactions.history', {openNewTransaction: creditUser}, {reload: true, inherit: false});
            // var currentPath = $location.path();
            // if(currentPath == '/transactions/history'){
            //     $location.search('userEmail',(email).toString());
            //     location.reload();
            // } else {
            //     $location.path('/transactions/history').search({userEmail: (email).toString()});
            // }
        };

        $scope.goToCreditDepositTransaction = function(){
            $scope.hidingSearchBar();
            $scope.searchString = '';
            
            $state.go('transactions.history', {openNewTransaction: "credit_deposit", withdrawalFor: null}, {reload: true, inherit: false});
        };

        $scope.goToTransactionWithdrawls = function(userEmail){
            $scope.hidingSearchBar();
            $scope.searchString = '';
            
            $state.go('transactions.history', {openNewTransaction: null, withdrawalFor: userEmail}, {reload: true, inherit: false});
        };

        $scope.goToCreditUserAccount = function (account, userObj) {
            $scope.hidingSearchBar();
            $scope.searchString = '';
            var creditUserAccountObj = {
                type: 'credit',
                account: account.reference,
                user: userObj,
                currencies: account.currencies
            };
            $state.go('transactions.history', {openNewAccountTransaction: creditUserAccountObj}, {reload: true, inherit: false});
        };

        $scope.goToCreditDepositAccountTransaction = function(account){
            $scope.hidingSearchBar();
            $scope.searchString = '';
            var reference = account.name + ' - ' + account.reference;
            var creditDepositUserAccountObj = {
                type: 'credit_deposit',
                account: reference,
                currencies: account.currencies
            };
            $state.go('transactions.history', {openNewAccountTransaction: creditDepositUserAccountObj, withdrawalForAccount: null}, {reload: true, inherit: false});
        };

        $scope.goToAccountTransactionWithdrawls = function(accountRef){
            $scope.hidingSearchBar();
            // $scope.searchString = '';
            
            $state.go('transactions.history', {openNewAccountTransaction: null, withdrawalForAccount: accountRef}, {reload: true, inherit: false});
        };

        //when page refreshed
        
        if(!$scope.onWelcomePage){
            vm.getAdminProfile();
            if(!$rootScope.pageTopObj.companyObj){ vm.getCompanyInfo(); }
            if(!$rootScope.pageTopObj.userInfoObj){ vm.getUserInfo(); }
            vm.checkMultiFactorAuthEnabled();
        }

        //when page refreshed

        vm.checkIfInCompanySetup = function (currentLocation) {
            if(currentLocation.indexOf('company/setup') > 0 || currentLocation.indexOf('demo') > 0 || currentLocation.indexOf('template') > 0){
                $scope.inCompanySetupViews = true;
            } else {
                $scope.inCompanySetupViews = false;
            }
        };
        vm.checkIfInCompanySetup(vm.currentLocation);

        $scope.hidingSearchBar = function () {
            $scope.hideSearchBar =  true;
        };

        vm.showSearchBar = function () {
            $scope.hideSearchBar =  false;
        };

        $scope.viewProfile = function () {
            $location.path('/account-info');
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token && !localStorageManagement.getValue('mfaUnverified')){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    if(res.results.length > 0){
                        $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                    }
                }, function (error) {
                    if(error.status == 401){
                        $rootScope.gotToken = false;
                        $rootScope.securityConfigured = true;
                        $rootScope.pageTopObj = {};
                        localStorageManagement.deleteValue('TOKEN');
                        localStorageManagement.deleteValue('token');
                        Rehive.removeToken();
                        $location.path('/login');
                    }
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.resetCaretPosition = function(){
            $scope.tagAdded = false;
            $scope.selectedTag = "";
            $scope.selectedFilter = "users,accounts,transactions";
            $scope.showAllReferences = true;
            $scope.showAccountsOnly = $scope.showTransactionsOnly = $scope.showUsersOnly = false;
        };

        $scope.detectKeyPress = function(keyCode){
            var caretPosition = vm.searchBox.selectionStart;
            
            if(keyCode === 13){
                $scope.displayOptions = false;
                $scope.searchGlobal($scope.searchString);
            } else if(keyCode === 8 || keyCode === 46){
                if(!$scope.searchString || $scope.searchString === "" || caretPosition === 0){
                    $scope.resetCaretPosition();
                }
            }
        };

       $scope.searchSelectedOption = function(option){
            $scope.displayOptions = false;
            $scope.tagAdded = true;
            $scope.selectedTag = option.name;
            $scope.showAllReferences = $scope.showAccountsOnly = $scope.showTransactionsOnly = $scope.showUsersOnly = false;
            switch(option.name){
                case "accounts": 
                    $scope.selectedFilter = "accounts";
                    $scope.showAccountsOnly = true;
                    break;
                case "transactions": 
                    $scope.selectedFilter = "transactions";
                    $scope.showTransactionsOnly = true;
                    break;
                case "users": 
                    $scope.selectedFilter = "users";
                    $scope.showUsersOnly = true;
                    break;
                case "default": 
                    $scope.selectedFilter = "users,accounts,transactions";
                    $scope.showAllReferences = true;
            }
            vm.searchBox.focus();
        };

        $scope.searchGlobal = function (searchString) {
            $scope.searchedAccounts = $scope.searchedTransactions = $scope.searchedUsers = [];

            if($scope.loadingResults){
                return;
            }

            if(!searchString){
                $scope.hidingSearchBar();
                return;
            }

            searchString = encodeURIComponent(searchString);
            
            if(vm.token){
                $scope.loadingResults = true;
                vm.showSearchBar();

                $http.get(environmentConfig.API + 'admin/search/?query=' + searchString + '&resources=' + $scope.selectedFilter + '&page_size=2', {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.searchedAccounts = res.data.data.results.accounts ? res.data.data.results.accounts : [];
                    $scope.searchedTransactions = res.data.data.results.transactions ? res.data.data.results.transactions : [];
                    $scope.searchedUsers = res.data.data.results.users ? res.data.data.results.users : [];
                    $scope.loadingResults = false;
                }, function (error) {
                    $scope.loadingResults = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }            
        };

        $scope.viewMoreResults = function(resourceSelected){
            var queryObj = {
                searchString: $scope.searchString,
                showAccountsOnly: resourceSelected === 'accounts',
                showTransactionsOnly: resourceSelected === 'transactions',
                showUsersOnly: resourceSelected === 'users',
                resource: (resourceSelected === 'accounts') ? 'accounts' : (resourceSelected === 'transactions') ? 'transactions' : 'users'
            };
            $scope.hidingSearchBar();
            $state.go('searchResults', {searchQueryObj: queryObj}, {reload: true, inherit: false});
        };

        $scope.goToUserProfile = function (user) {
            $scope.hidingSearchBar();
            $location.path('/user/' + user.id + '/details');
        };

        $scope.goToTransactionsHistory = function (transaction) {
            $scope.hidingSearchBar();
            $state.go('transactions.history',{transactionId: transaction.id}, {reload: true, inherit: false});
        };

        $scope.goToAccounts = function (account) {
            $scope.hidingSearchBar();
            account.user ? 
            $state.go('accounts.userAccList',{accountRef: account.reference}, {reload: true, inherit: false}) 
            : $state.go('accounts.standaloneList',{accountRef: account.reference}, {reload: true, inherit: false});
        };

        // Export tasks handling start

        /* Common */
        $scope.showingDashboardTasks = false;
        $scope.showingDashboardBelow1200Tasks = false;

        $scope.toggleExportTabs = function(tabSelected){
            $scope.showTransactionExports = (tabSelected === 'transaction');
            $scope.showAccountExports = (tabSelected === 'account');
            $scope.showAccountCurrencyExports = (tabSelected === 'accountCurrencies');
        };

        $scope.transactionsPagination = $scope.accountsPagination = $scope.accountCurrenciesPagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.openDashboardTasks = function () {
            $scope.showingDashboardTasks = !$scope.showingDashboardTasks;
            if($scope.showingDashboardTasks && !$scope.transactionSetsExportingInProgress 
                && !$scope.accountSetsExportingInProgress && !$scope.accountCurrencySetsExportingInProgress){
                $scope.allTasksDone = true;
                $scope.allAccountSetsDone = true;
            }
        };

        $scope.openDashboardBelow1200Tasks = function () {
            $scope.showingDashboardBelow1200Tasks = !$scope.showingDashboardBelow1200Tasks;
            if($scope.showingDashboardBelow1200Tasks && !$scope.transactionSetsExportingInProgress 
                && !$scope.accountSetsExportingInProgress && !$scope.accountCurrencySetsExportingInProgress){
                $scope.allTasksDone = true;
                $scope.allAccountSetsDone = true;
            }
        };

        $scope.downloadExportFile = function (file) {
            $window.open(file,'_blank');
        };

        $rootScope.$on('exportSetCreate', function(event, obj){
            if(obj.status == 'created'){
                $scope.transactionSetsExportingInProgress = true;
                $scope.getTransactionSetsList();
            }
            else if(obj.status == 'account_created'){
                $scope.accountSetsExportingInProgress = true;
                $scope.getAccountsSetsList();
            }
            else if(obj.status == 'account_asset_created'){
                $scope.accountCurrencySetsExportingInProgress = true;
                $scope.getAccountCurrencySetsList();
            }
        });

        $scope.closeDashboardTasksBox = function () {
            $scope.showingDashboardTasks = false;
        };

        $scope.closeDashboardBelow1200TasksBox = function () {
            $scope.showingDashboardBelow1200Tasks = false;
        };

        /* Transaction export handling: */
        vm.unfinishedDashboardTasks = [];
        $scope.transactionSetsExportingInProgress = false;
        $scope.loadingTransactionSets = false;
        $scope.inProgressTransactionsSets = false;
        $scope.dashboardTasksLists = [];
        $scope.allTasksDone = true;
        $scope.showTransactionExports = true;

        $scope.getTransactionSetsFiltersObj = function(){
            var searchObj = {
                page: $scope.transactionsPagination.pageNo,
                page_size: $scope.transactionsPagination.itemsPerPage,
                section: 'admin',
                resource: 'transaction'                
            };

            return serializeFiltersService.objectFilters(searchObj);
        };
        
        $scope.getTransactionSetsList = function(noLoadingImage){
            if(vm.token && !localStorageManagement.getValue('mfaUnverified')) {
                if(!noLoadingImage){
                    $scope.loadingTransactionSets = true;
                }

                $scope.inProgressTransactionsSets = false;

                var transactionSetsFiltersObj = $scope.getTransactionSetsFiltersObj();

                Rehive.admin.exports.sets.get({filters: transactionSetsFiltersObj}).then(function (res) {
                    if(res.results.length > 0){
                        vm.unfinishedDashboardTasks.length = 0;
                        $scope.dashboardTasksData = res;
                        $scope.dashboardTasksLists = $scope.dashboardTasksData.results;
                        vm.getFinishedTransactionSets($scope.dashboardTasksLists);
                        $scope.$apply();
                    } else {
                        $scope.loadingTransactionSets = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingTransactionSets = false;
                    if(error.status == 401){
                        $rootScope.gotToken = false;
                        $rootScope.securityConfigured = true;
                        $rootScope.pageTopObj = {};
                        localStorageManagement.deleteValue('TOKEN');
                        localStorageManagement.deleteValue('token');
                        Rehive.removeToken();
                        $location.path('/login');
                    }
                    $scope.$apply();
                });
            }
        };
        $scope.getTransactionSetsList();

        vm.getFinishedTransactionSets = function (setList) {
            setList.forEach(function (set,index,array) {
                if(index == (array.length - 1)){
                    if(set.progress == 100){
                        vm.getSingleTransactionSet(set,'last');
                        $scope.$apply();
                    } else {
                        // scenario if array length is 1
                        set.untouched = true;
                        vm.unfinishedDashboardTasks.push(set);
                        $scope.inProgressTransactionsSets = true;
                        vm.getSingleTransactionSet(null,'last');
                        $scope.$apply();
                    }
                } else{
                    if(set.progress == 100){
                        vm.getSingleTransactionSet(set);
                        $scope.$apply();
                    } else {
                        set.untouched = true;
                        vm.unfinishedDashboardTasks.push(set);
                        $scope.inProgressTransactionsSets = true;
                        $scope.loadingTransactionSets = false;
                        $scope.$apply();
                    }
                }
            });
        };

        vm.getSingleTransactionSet = function (set,last) {
            if(set){
                Rehive.admin.exports.sets.get({id: set.id}).then(function (res) {
                    set.pages = res.pages;
                    if(last){
                        $scope.loadingTransactionSets = false;
                        if($scope.inProgressTransactionsSets){
                            $scope.transactionSetsExportingInProgress = true;
                            $scope.allTasksDone = false;
                            $timeout(function () {
                                $scope.checkWhetherTransactionsTaskCompleteOrNot();
                            },10000);
                            $scope.$apply();
                        } else {
                            $scope.transactionSetsExportingInProgress = false;
                            if($scope.showingDashboardTasks){
                                $scope.allTasksDone = true;
                            }
                            $scope.$apply();
                        }
                    }
                }, function (error) {
                    $scope.loadingTransactionSets = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                // scenario if array length is 1

                $scope.loadingTransactionSets = false;
                if($scope.inProgressTransactionsSets){
                    $scope.transactionSetsExportingInProgress = true;
                    $scope.allTasksDone = false;
                    $timeout(function () {
                        $scope.checkWhetherTransactionsTaskCompleteOrNot();
                    },10000);
                } else {
                    $scope.transactionSetsExportingInProgress = false;
                    if($scope.showingDashboardTasks){
                        $scope.allTasksDone = true;
                    }
                }
            }
        };

        $scope.checkWhetherTransactionsTaskCompleteOrNot = function(){
            if(vm.unfinishedDashboardTasks.length > 0){
                vm.unfinishedDashboardTasks.forEach(function (set,index,array) {
                    if(index == (array.length -1)){
                        Rehive.admin.exports.sets.get({id: set.id}).then(function (res) {
                            if(res.progress == 100){
                                vm.unfinishedDashboardTasks.splice(index,1);
                                $scope.dashboardTasksLists.forEach(function (element,ind,arr) {
                                    if(element.id == res.id){
                                        res.untouched = true;
                                        $scope.dashboardTasksLists.splice(ind,1,res);
                                        $scope.$apply();
                                    }
                                });
                                if(vm.unfinishedDashboardTasks.length == 0){
                                    $scope.transactionSetsExportingInProgress = false;
                                    if($scope.showingDashboardTasks){
                                        $scope.allTasksDone = true;
                                    }
                                    $scope.$apply();
                                } else {
                                    $timeout(function () {
                                        $scope.checkWhetherTransactionsTaskCompleteOrNot();
                                    },10000);
                                    $scope.$apply();
                                }
                            } else if((res.progress >= 0) && (res.progress < 100)){
                                $scope.dashboardTasksLists.forEach(function (element,ind,arr) {
                                    if(element.id == res.id){
                                        res.untouched = true;
                                        $scope.dashboardTasksLists.splice(ind,1,res);
                                    }
                                });
                                $timeout(function () {
                                    $scope.checkWhetherTransactionsTaskCompleteOrNot();
                                },10000);
                                $scope.$apply();
                            }
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                    }
                });
            } else {
                if($scope.showingDashboardTasks){
                    $scope.allTasksDone = true;
                }
            }
        };


        /* Account export handling */
        vm.unfinishedAccountTasks = [];
        $scope.accountSetsExportingInProgress = false;
        $scope.loadingAccountSets = false;
        $scope.inProgressAccountsSets = false;
        $scope.accountTasksLists = [];
        $scope.allAccountSetsDone = true;
        $scope.showAccountExports = false;

        $scope.getAccountSetsFiltersObj = function(){
            var searchObj = {
                page: $scope.accountsPagination.pageNo,
                page_size: $scope.accountsPagination.itemsPerPage,
                section: 'admin',
                resource: 'account'
            };

            return serializeFiltersService.objectFilters(searchObj);
        };
        
        $scope.getAccountsSetsList = function(noLoadingImage){
            if(vm.token && !localStorageManagement.getValue('mfaUnverified')) {
                if(!noLoadingImage){
                    $scope.loadingAccountSets = true;
                }
                $scope.inProgressTransactionsSets = false;
                var accountsSetsFiltersObj = $scope.getAccountSetsFiltersObj();

                Rehive.admin.exports.sets.get({filters: accountsSetsFiltersObj}).then(function (res) {
                    if(res.results.length > 0){
                        vm.unfinishedAccountTasks.length = 0;
                        $scope.accountTasksData = res;
                        $scope.accountTasksLists = $scope.accountTasksData.results;
                        vm.getFinishedAccountSets($scope.accountTasksLists);
                        $scope.$apply();
                    } else {
                        $scope.loadingAccountSets = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingAccountSets = false;
                    if(error.status == 401){
                        $rootScope.gotToken = false;
                        $rootScope.securityConfigured = true;
                        $rootScope.pageTopObj = {};
                        localStorageManagement.deleteValue('TOKEN');
                        localStorageManagement.deleteValue('token');
                        Rehive.removeToken();
                        $location.path('/login');
                    }
                    $scope.$apply();
                });
            }
        };
        $scope.getAccountsSetsList();

        vm.getFinishedAccountSets = function (setList) {
            setList.forEach(function (set,index,array) {
                if(index == (array.length - 1)){
                    if(set.progress == 100){
                        vm.getSingleAccountSet(set,'last');
                        $scope.$apply();
                    } else {
                        set.untouched = true;
                        vm.unfinishedAccountTasks.push(set);
                        $scope.inProgressAccountsSets = true;
                        vm.getSingleAccountSet(null,'last');
                        $scope.$apply();
                    }
                } else{
                    if(set.progress == 100){
                        vm.getSingleAccountSet(set);
                        $scope.$apply();
                    } else {
                        set.untouched = true;
                        vm.unfinishedAccountTasks.push(set);
                        $scope.inProgressAccountsSets = true;
                        $scope.loadingAccountSets = false;
                        $scope.$apply();
                    }
                }
            });
        };

        vm.getSingleAccountSet = function (set,last) {
            if(set){
                Rehive.admin.exports.sets.get({id: set.id}).then(function (res) {
                    set.pages = res.pages;
                    if(last){
                        $scope.loadingAccountSets = false;
                        if($scope.inProgressAccountsSets){
                            $scope.accountSetsExportingInProgress = true;
                            $scope.allAccountSetsDone = false;
                            $timeout(function () {
                                $scope.checkWhetherAccountsTaskCompleteOrNot();
                            },10000);
                            $scope.$apply();
                        } else {
                            $scope.accountSetsExportingInProgress = false;
                            if($scope.showingDashboardTasks){
                                $scope.allAccountSetsDone = true;
                            }
                            $scope.$apply();
                        }
                    }
                }, function (error) {
                    $scope.loadingAccountSets = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                $scope.loadingAccountSets = false;
                if($scope.inProgressAccountsSets){
                    $scope.accountSetsExportingInProgress = true;
                    $scope.allAccountSetsDone = false;
                    $timeout(function () {
                        $scope.checkWhetherAccountsTaskCompleteOrNot();
                    },10000);
                } else {
                    $scope.accountSetsExportingInProgress = false;
                    if($scope.showingDashboardTasks){
                        $scope.allAccountSetsDone = true;
                    }
                }
            }
        };
        
        $scope.checkWhetherAccountsTaskCompleteOrNot = function(){
            if(vm.unfinishedAccountTasks.length > 0){
                vm.unfinishedAccountTasks.forEach(function (set,index,array) {
                    if(index == (array.length -1)){
                        Rehive.admin.exports.sets.get({id: set.id}).then(function (res) {
                            if(res.progress == 100){
                                vm.unfinishedAccountTasks.splice(index,1);
                                $scope.accountTasksLists.forEach(function (element,ind,arr) {
                                    if(element.id == res.id){
                                        res.untouched = true;
                                        $scope.accountTasksLists.splice(ind,1,res);
                                        $scope.$apply();
                                    }
                                });
                                if(vm.unfinishedAccountTasks.length == 0){
                                    $scope.accountSetsExportingInProgress = false;
                                    if($scope.showingDashboardTasks){
                                        $scope.allAccountSetsDone = true;
                                    }
                                    $scope.$apply();
                                } else {
                                    $timeout(function () {
                                        $scope.checkWhetherAccountsTaskCompleteOrNot();
                                    },10000);
                                    $scope.$apply();
                                }
                            } else if((res.progress >= 0) && (res.progress < 100)){
                                $scope.accountTasksLists.forEach(function (element,ind,arr) {
                                    if(element.id == res.id){
                                        res.untouched = true;
                                        $scope.accountTasksLists.splice(ind,1,res);
                                    }
                                });
                                $timeout(function () {
                                    $scope.checkWhetherAccountsTaskCompleteOrNot();
                                },10000);
                                $scope.$apply();
                            }
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                    }
                });
            } else {
                if($scope.showingDashboardTasks){
                    $scope.allAccountSetsDone = true;
                }
            }
        };


        /* Account Currencies export handling */

        vm.unfinishedAccountCurrencyTasks = [];
        $scope.accountCurrencySetsExportingInProgress = false;
        $scope.loadingAccountCurrencySets = false;
        $scope.inProgressAccountsCurrencySets = false;
        $scope.accountCurrencyTasksLists = [];
        $scope.allAccountCurrencySetsDone = true;
        $scope.showAccountCurrencyExports = false;

        $scope.getAccountCurrencySetsFiltersObj = function(){
            var searchObj = {
                page: $scope.accountCurrenciesPagination.pageNo,
                page_size: $scope.accountCurrenciesPagination.itemsPerPage,
                section: 'admin',
                resource: 'account_asset'
            };

            return serializeFiltersService.objectFilters(searchObj);
        };
        
        $scope.getAccountCurrencySetsList = function(noLoadingImage){
            if(vm.token && !localStorageManagement.getValue('mfaUnverified')) {
                if(!noLoadingImage){
                    $scope.loadingAccountCurrencySets = true;
                }
                $scope.inProgressAccountsCurrencySets = false;
                var accountsCurrencySetsFiltersObj = $scope.getAccountCurrencySetsFiltersObj();

                Rehive.admin.exports.sets.get({filters: accountsCurrencySetsFiltersObj}).then(function (res) {
                    if(res.results.length > 0){
                        vm.unfinishedAccountCurrencyTasks.length = 0;
                        $scope.accountCurrencyTasksData = res;
                        $scope.accountCurrencyTasksLists = $scope.accountCurrencyTasksData.results;
                        vm.getFinishedAccountCurrencySets($scope.accountCurrencyTasksLists);
                        $scope.$apply();
                    } else {
                        $scope.loadingAccountCurrencySets = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingAccountCurrencySets = false;
                    if(error.status == 401){
                        $rootScope.gotToken = false;
                        $rootScope.securityConfigured = true;
                        $rootScope.pageTopObj = {};
                        localStorageManagement.deleteValue('TOKEN');
                        localStorageManagement.deleteValue('token');
                        Rehive.removeToken();
                        $location.path('/login');
                    }
                    $scope.$apply();
                });
            }
        };
        $scope.getAccountCurrencySetsList();

        vm.getFinishedAccountCurrencySets = function (setList) {
            setList.forEach(function (set,index,array) {
                if(index == (array.length - 1)){
                    if(set.progress == 100){
                        vm.getSingleAccountCurrencySet(set,'last');
                        $scope.$apply();
                    } else {
                        set.untouched = true;
                        vm.unfinishedAccountCurrencyTasks.push(set);
                        $scope.inProgressAccountsCurrencySets = true;
                        vm.getSingleAccountCurrencySet(null,'last');
                        $scope.$apply();
                    }
                } else{
                    if(set.progress == 100){
                        vm.getSingleAccountCurrencySet(set);
                        $scope.$apply();
                    } else {
                        set.untouched = true;
                        vm.unfinishedAccountCurrencyTasks.push(set);
                        $scope.inProgressAccountsCurrencySets = true;
                        $scope.loadingAccountCurrencySets = false;
                        $scope.$apply();
                    }
                }
            });
        };

        vm.getSingleAccountCurrencySet = function (set,last) {
            if(set){
                Rehive.admin.exports.sets.get({id: set.id}).then(function (res) {
                    set.pages = res.pages;
                    if(last){
                        $scope.loadingAccountCurrencySets = false;
                        if($scope.inProgressAccountsCurrencySets){
                            $scope.accountCurrencySetsExportingInProgress = true;
                            $scope.allAccountCurrencySetsDone = false;
                            $timeout(function () {
                                $scope.checkWhetherAccountCurrencyTaskCompleteOrNot();
                            },10000);
                            $scope.$apply();
                        } else {
                            $scope.accountCurrencySetsExportingInProgress = false;
                            if($scope.showingDashboardTasks){
                                $scope.allAccountCurrencySetsDone = true;
                            }
                            $scope.$apply();
                        }
                    }
                }, function (error) {
                    $scope.loadingAccountCurrencySets = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                $scope.loadingAccountCurrencySets = false;
                if($scope.inProgressAccountsCurrencySets){
                    $scope.accountCurrencySetsExportingInProgress = true;
                    $scope.allAccountCurrencySetsDone = false;
                    $timeout(function () {
                        $scope.checkWhetherAccountCurrencyTaskCompleteOrNot();
                    },10000);
                } else {
                    $scope.accountCurrencySetsExportingInProgress = false;
                    if($scope.showingDashboardTasks){
                        $scope.allAccountCurrencySetsDone = true;
                    }
                }
            }
        };
        
        $scope.checkWhetherAccountCurrencyTaskCompleteOrNot = function(){
            if(vm.unfinishedAccountCurrencyTasks.length > 0){
                vm.unfinishedAccountCurrencyTasks.forEach(function (set,index,array) {
                    if(index == (array.length -1)){
                        Rehive.admin.exports.sets.get({id: set.id}).then(function (res) {
                            if(res.progress == 100){
                                vm.unfinishedAccountCurrencyTasks.splice(index,1);
                                $scope.accountCurrencyTasksLists.forEach(function (element,ind,arr) {
                                    if(element.id == res.id){
                                        res.untouched = true;
                                        $scope.accountCurrencyTasksLists.splice(ind,1,res);
                                        $scope.$apply();
                                    }
                                });
                                if(vm.unfinishedAccountCurrencyTasks.length == 0){
                                    $scope.accountCurrencySetsExportingInProgress = false;
                                    if($scope.showingDashboardTasks){
                                        $scope.allAccountCurrencySetsDone = true;
                                    }
                                    $scope.$apply();
                                } else {
                                    $timeout(function () {
                                        $scope.checkWhetherAccountCurrencyTaskCompleteOrNot();
                                    },10000);
                                    $scope.$apply();
                                }
                            } else if((res.progress >= 0) && (res.progress < 100)){
                                $scope.accountCurrencyTasksLists.forEach(function (element,ind,arr) {
                                    if(element.id == res.id){
                                        res.untouched = true;
                                        $scope.accountCurrencyTasksLists.splice(ind,1,res);
                                    }
                                });
                                $timeout(function () {
                                    $scope.checkWhetherAccountCurrencyTaskCompleteOrNot();
                                },10000);
                                $scope.$apply();
                            }
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                    }
                });
            } else {
                if($scope.showingDashboardTasks){
                    $scope.allAccountCurrencySetsDone = true;
                }
            }
        };

        // Export tasks handling end

        $scope.logout = function(){
            $rootScope.logOutFromApp();
        };
    }

})();
