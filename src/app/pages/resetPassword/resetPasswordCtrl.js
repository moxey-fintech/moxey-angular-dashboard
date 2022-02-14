(function () {
    'use strict';

    angular.module('BlurAdmin.pages.resetPassword')
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    /** @ngInject */
    function ResetPasswordCtrl($scope,Rehive,toastr,$location,errorHandler) {
        $scope.companyOptions = ['moxey_test','moxey'];
        $scope.resetPasswordFunction = function(user,company){
            Rehive.auth.password.reset({
                user: user,
                company: company
            }).then(function(res){
                toastr.success('Password reset message has been sent');
                $location.path('/login');
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
