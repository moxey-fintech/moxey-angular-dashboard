(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens')
        .controller('ShowTokenModalCtrl', ShowTokenModalCtrl);

    function ShowTokenModalCtrl($scope,token,toastr,$uibModalInstance) {
        $scope.token = token;

        $scope.copiedSuccessfully= function () {
            toastr.success('Token copied successfully');
        };

        $scope.$dismiss = function(){
            $uibModalInstance.close('token');
        };

        // $scope.$on("modal.closing",function(){
        //     $uibModalInstance.close('token');
        // });
    }
})();
