(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts.account')
        .controller('AccountCtrl', AccountCtrl);

    /** @ngInject */
    function AccountCtrl($scope,Rehive,localStorageManagement,$uibModal,_,toastr,$ngConfirm,
                      $rootScope,errorHandler,$stateParams,$location,$window,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.dashboardTitle = 'Account | Moxey';
        $rootScope.shouldBeBlue = 'Accounts';
        vm.reference = $stateParams.reference;
        $scope.user = {};
        $scope.loadingAccount = false;
        $scope.headerArray = [];
        $scope.profilePictureFile = {
            file: {}
        };
        vm.accountType = $location.search().type;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.$on('$locationChangeStart', function (event,newUrl) {
            vm.location = $location.path();
            vm.locationArray = vm.location.split('/');
            $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
            vm.locationTracker(vm.location);
        });

        vm.locationTracker = function (location) {
            var baseLocation = '/account/' + vm.reference;
            var remainingLocation = location.split(baseLocation).pop();
            var remainingLocationArray = remainingLocation.split('/');

            $scope.settingsTrackedLocation = '';
            if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'account-limits'){
                $scope.settingsTrackedLocation = 'account-limits';
            } else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'account-fees'){
                $scope.settingsTrackedLocation = 'account-fees';
            } else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'currency-settings'){
                $scope.settingsTrackedLocation = 'currency-settings';
            }
        };
        vm.locationTracker(vm.location);

        $scope.backToAccounts = function() {
            if(vm.accountType && vm.accountType == 'recon'){
                $location.path('/accounts/recon-accounts-list');
            } else {
                $location.path('/accounts/standalone-accounts-list');
            }
            $location.search('type', null);
        };

        $scope.goToBreadCrumbsView = function (path) {
            $location.path(path);
        };
    }
})();
