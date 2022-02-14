(function () {
    'use strict';

    angular.module('BlurAdmin.pages.multiFactorAuth')
        .controller('MultiFactorAuthCtrl', MultiFactorAuthCtrl);

    /** @ngInject */
    function MultiFactorAuthCtrl($scope,Rehive,localStorageManagement,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');

        $scope.getMfa = function(){
            if(vm.token) {
                $scope.loadingMfa = true;
                Rehive.auth.mfa.status.get().then(function (res) {
                    $scope.multiFactorAuthOptions = res;
                    $scope.loadingMfa = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingMfa = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getMfa();

        $scope.goToMultiAuthMethod = function (path) {
            if(path == 'sms'){
                $location.path('/authentication/multi-factor/' + path);
            } else {
                $location.path('/authentication/multi-factor/verify/' + path);
            }
        };


    }
})();
