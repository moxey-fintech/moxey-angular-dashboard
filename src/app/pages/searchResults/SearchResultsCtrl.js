(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('SearchResultsCtrl', SearchResultsCtrl);

    /** @ngInject */
    function SearchResultsCtrl($scope,localStorageManagement,errorHandler,$http,environmentConfig,$state,$location) {
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.cachedSearchQuery = vm.companyIdentifier + '_LastQuery';
        $scope.searchQueryObj = $state.params.searchQueryObj ? $state.params.searchQueryObj : (
            localStorageManagement.getValue(vm.cachedSearchQuery) ? JSON.parse(localStorageManagement.getValue(vm.cachedSearchQuery)) : {
                searchString: '',
                showAccountsOnly: true,
                showTransactionsOnly: true,
                showUsersOnly: true,
                resource: "users,accounts,transactions"
            }
        );
        $scope.loadingSearchResults = false;
        $scope.searchedTransactions = $scope.searchedTransactions = $scope.searchedUsers = [];
        
        vm.formatUserResults = function(){
            $scope.searchedUsers.forEach(function(user){
                if(user.first_name.indexOf('Service') > -1){
                    user.first_name = user.first_name.replace('Service', 'Extension');
                }             
            });
        };
        
        $scope.goToUserProfile = function (user) {
            $location.path('/user/' + user.id + '/details');
        };

        $scope.goToTransactionsHistory = function (transaction) {
            $state.go('transactions.history',{transactionId: transaction.id}, {reload: true});
        };

        $scope.goToAccounts = function (account) {
            account.user ? $state.go('accounts.userAccList',{accountRef: account.reference}, {reload: true}) : $state.go('accounts.standaloneList',{accountRef: account.reference}, {reload: true});
        };

        vm.onLoadSearch = function(){
            $scope.searchedTransactions = $scope.searchedTransactions = $scope.searchedUsers = [];
            var query = encodeURIComponent($scope.searchQueryObj.searchString);
            if(vm.token){
                $scope.loadingSearchResults = true;              
                $http.get(environmentConfig.API + 'admin/search/?query=' + query + '&resources=' + $scope.searchQueryObj.resource + '&page_size=15', {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.searchedAccounts = res.data.data.results.accounts ? res.data.data.results.accounts : [];
                    $scope.searchedTransactions = res.data.data.results.transactions ? res.data.data.results.transactions : [];
                    $scope.searchedUsers = res.data.data.results.users ? res.data.data.results.users : [];
                    
                    if($scope.searchedUsers.length > 0){
                        vm.formatUserResults();
                    }


                    localStorageManagement.setValue(vm.cachedSearchQuery, JSON.stringify($scope.searchQueryObj));
                    if($scope.searchQueryObj.resource == "users,accounts,transactions"){
                        $scope.searchQueryObj.resource = "all";
                    }
                    $scope.loadingSearchResults = false;
                }, function (error) {
                    $scope.loadingSearchResults = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.onLoadSearch();     
    }

})();
