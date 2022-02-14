(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.details')
        .controller('UserDetailsCtrl', UserDetailsCtrl);

    /** @ngInject */
    function UserDetailsCtrl($scope,$rootScope,$stateParams,$location,localStorageManagement,$http,errorHandler,environmentConfig) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.shouldBeBlue = 'Users';
        vm.uuid = $stateParams.uuid;

        $scope.goToPermissionSettings = function () {
            $location.path('user/' + vm.uuid + '/permissions-settings');
        };
        
        $scope.hasStellarEnabled = false;
        $scope.hasStellarTestnetEnabled = false;
        $scope.hasBitcoinEnabled = false;
        $scope.hasBitcoinTestnetEnabled = false;

        vm.getServices = function(){
            if(vm.token){
                $scope.loadingUserBitcoinInfo = true;
                $http.get(environmentConfig.API + 'admin/services/?active=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var servicesList =  res.data.data.results;
                    if(servicesList.length > 0){
                        for(var i = 0; i < servicesList.length; ++i){
                            if(servicesList[i].slug === 'bitcoin_service'){
                                $scope.hasBitcoinEnabled = true;
                            }                                
                            if(servicesList[i].slug === 'bitcoin_testnet_service'){
                                $scope.hasBitcoinTestnetEnabled = true;
                            }
                            if(servicesList[i].slug === 'stellar_service'){
                                $scope.hasStellarEnabled = true;
                            }
                            if(servicesList[i].slug === 'stellar_testnet_service'){
                                $scope.hasStellarTestnetEnabled = true;
                            }
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserBitcoinInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getServices();
    }
})();