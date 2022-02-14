(function () {
    'use strict';

    angular.module('BlurAdmin.pages.verifyAdminEmail')
        .controller('VerifyAdminEmailCtrl', VerifyAdminEmailCtrl);

    /** @ngInject */
    function VerifyAdminEmailCtrl($scope,Rehive,$stateParams,toastr,$location,errorHandler) {

        $scope.verifyAdminEmail = function(){
            Rehive.auth.email.verify({
                key: $stateParams.key
            }).then(function (res) {
                toastr.success("Email has been verified successfully");
                // $location.path('/verification');
                $location.path('/template');
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $location.path('/currencies/currencies-list');
                $scope.$apply();
            });
        };
        $scope.verifyAdminEmail();

    }
})();
