(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens')
        .controller('TokensCtrl', TokensCtrl);

    /** @ngInject */
    function TokensCtrl(Rehive,$scope,localStorageManagement,$intercom,$state,toastr,
                        errorHandler,$uibModal,$rootScope) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Api tokens | Moxey';
        $scope.loadingAPITokens = true;
        $scope.addingToken = false;      
        
        vm.customToken = $state.params && $state.params.customToken ? $state.params.customToken : null;
        vm.customTokenVerified = $state.params && $state.params.customTokenVerified ? $state.params.customTokenVerified : false;

        $scope.getCompanyAdmin = function(){
            Rehive.user.get().then(function(res){
                $scope.adminEmail = res.email;
                // $scope.adminCompany = res.company;
                $scope.$apply();
            },function(err){
                $scope.$apply();
            });
        };
        $scope.getCompanyAdmin();

        $scope.getTokensList = function () {
            if(vm.token) {
                $scope.loadingAPITokens = true;
                Rehive.auth.tokens.get().then(function(res){
                    $scope.loadingAPITokens = false;
                    $scope.tokensList = res;
                    $scope.$apply();
                },function(error){
                    $scope.loadingAPITokens = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };  

        $scope.openShowTokenModal = function (page, size,token) {
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                backdrop: 'static',
                keyboard: false,
                controller: 'ShowTokenModalCtrl',
                scope: $scope,
                resolve: {
                    token: function () {
                        return token;
                    }
                }
            });
        };      
        
        $scope.handleSuccessfulTokenAddition = function(tokenObj){
            toastr.success('Token addition successful.');
            $scope.getTokensList();
            $scope.openShowTokenModal('app/pages/developers/tokens/showTokenModal/showTokenModal.html', 'md', tokenObj);
        };

        $scope.handleFailedTokenAddition = function(tokenObj){
            if(vm.token) {
                $scope.loadingAPITokens = true;
                var token_key = tokenObj.token.substring(0, 8);
                Rehive.auth.tokens.delete(token_key).then(function(res){
                    $scope.loadingAPITokens = false;
                    toastr.error('Token addition unsuccessful due to failed MFA validation.');
                    $scope.getTokensList();
                    $scope.$apply();
                },function(error){
                    $scope.loadingAPITokens = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        if(vm.customToken){
            vm.customTokenVerified ? $scope.handleSuccessfulTokenAddition(vm.customToken) : $scope.handleFailedTokenAddition(vm.customToken);
        } else {
            $scope.getTokensList();   
        }

        $scope.openAddTokenModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddTokenModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(token){
                if(token){
                    if(!token.mfa){
                        $scope.handleSuccessfulTokenAddition(token);
                    } else {
                        $state.go('multiFactorAuthVerify', {
                            authType: token.mfa,
                            customToken: token,
                            prevState: 'developers.tokens'
                        }, {reload: true});
                    }
                }
            }, function(){
            });
        };

        $scope.openDeleteTokenModal = function (page, size, token) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteTokenModalCtrl',
                scope: $scope,
                resolve: {
                    token: function () {
                        return token;
                    }
                }
            });

            vm.theModal.result.then(function(token){
                if(token){
                    $scope.getTokensList();
                }
            }, function(){
            });
        };

        $scope.goToAddTokenView = function(){
            $scope.addingToken = true;
        };

        $scope.goBackToListTokensView = function () {
            $scope.addingToken = false;
        };
    }
})();
