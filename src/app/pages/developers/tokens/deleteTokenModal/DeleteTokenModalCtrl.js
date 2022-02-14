(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens')
        .controller('DeleteTokenModalCtrl', DeleteTokenModalCtrl);

    function DeleteTokenModalCtrl($scope,token,Rehive,$uibModalInstance,localStorageManagement,errorHandler,toastr) {

        var vm = this;

        $scope.token = token;
        vm.token = localStorageManagement.getValue('token');
        $scope.deletingToken = false;

        $scope.deleteToken = function (tokenKey) {
            if(vm.token) {
                $scope.deletingToken = true;
                Rehive.auth.tokens.delete(tokenKey).then(function(res){
                    $scope.deletingToken = false;
                    toastr.success('You have successfully deleted the token');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                },function(error){
                    $scope.deletingToken = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
