(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserActivityCtrl', UserActivityCtrl);

    /** @ngInject */
    function UserActivityCtrl($scope,Rehive,$stateParams,localStorageManagement,errorHandler,$state) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserActivity = true;

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserActivity = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.loadingUserActivity = false;
                    $scope.user = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserActivity = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        $scope.goToTransactions = function(id){
            $state.go('transactions.history',{"id": id});
        };
    }
})();
