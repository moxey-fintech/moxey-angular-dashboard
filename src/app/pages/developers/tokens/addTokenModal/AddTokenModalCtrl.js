(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens')
    .controller('AddTokenModalCtrl', AddTokenModalCtrl);

    /** @ngInject */
    function AddTokenModalCtrl($scope,$uibModalInstance,toastr,$uibModal,Rehive,localStorageManagement,errorHandler) {
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.createTokenData = {};
        $scope.createTokenData.tokenPassword = '';
        $scope.createTokenData.tokenDuration = null;
        $scope.selectedTokenOption = 'permanent';

        $scope.addToken = function(){
            var newAPIToken = {
                password: $scope.createTokenData.tokenPassword,
                duration: $scope.selectedTokenOption === 'permanent' ? 0 : $scope.createTokenData.tokenDuration ? $scope.createTokenData.tokenDuration: 0
            };
            if(vm.token) {
                $scope.loadingAPITokens = true;
                Rehive.auth.tokens.create(newAPIToken).then(function(res)
                {
                    $scope.createTokenData.tokenDuration = '';
                    $scope.createTokenData.tokenPassword = '';
                    $scope.addingToken = false;
                    $uibModalInstance.close(res);
                    // $scope.openShowTokenModal('app/pages/developers/tokens/showTokenModal/showTokenModal.html', 'md', res);
                    $scope.$apply();
                },function(error){
                    $scope.loadingAPITokens = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };
    }
})();
