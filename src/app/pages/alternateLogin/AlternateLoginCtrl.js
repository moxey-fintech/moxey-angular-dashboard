(function () {
    'use strict';

    angular.module('BlurAdmin.pages.alternateLogin')
        .controller('AlternateLoginCtrl', AlternateLoginCtrl);

    /** @ngInject */
    function AlternateLoginCtrl($rootScope,Rehive,$scope,localStorageManagement,$location,errorHandler,environmentConfig,extensionsHelper,$http,$intercom) {

        var vm = this;
        localStorageManagement.deleteValue('TOKEN');
        localStorageManagement.deleteValue('token');
        Rehive.removeToken();
        $rootScope.dashboardTitle = 'Moxey';
        $scope.path = $location.path();
        $scope.showLoginPassword = false;
        $scope.suspendedService = false;

        $scope.login = {
            company: null,
            user: null,
            password: null
        };

        $scope.toggleLoginPassword = function () {
            $scope.showLoginPassword = !$scope.showLoginPassword;
        };

        $scope.login = function(user, company, password) {
            $rootScope.$pageFinishedLoading = false;
            Rehive.auth.login({
                user: user,
                company: company,
                password: password
            }).then(function(res){
                var token = localStorageManagement.getValue('token');
                localStorageManagement.setValue('TOKEN','Token ' + token);
                vm.token = localStorageManagement.getValue('TOKEN');
                vm.checkMultiFactorAuthEnabled(token, res.user);
            },function(error){
                $scope.login.password = null;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };        

        vm.checkMultiFactorAuthEnabled = function (token, user) {
            if(token) {
                Rehive.auth.mfa.status.get().then(function (res) {
                    var enabledObj = vm.checkMultiFactorAuthEnabledFromData(res);
                    if(enabledObj.enabled){
                        $rootScope.$pageFinishedLoading = true;
                        $location.path('/authentication/multi-factor/verify/' + enabledObj.key).search({prevUrl: 'login', loginUser: user});
                        $rootScope.$apply();
                    } else { 
                        if(user && environmentConfig.API !== "https://api.staging.moxey.ai/3/"){
                            $http.get('https://functions.rehive.io/intercom-identity-verification', {
                                headers: {
                                    'Content': 'application/json',
                                    'Authorization': vm.token
                                }
                            }).then(function(res){
                                var intercomUser = {
                                    email: user.email,
                                    name: user.first_name + ' ' + user.last_name,
                                    user_id: user.id,
                                    user_hash: res.data.data.user_hash,
                                    company_id: user.company,
                                    phone: user.mobile
                                };
                                $intercom.boot(intercomUser);
                                vm.getAllServices();  
                            }, function(error){
                                $scope.login.password = null;
                                $rootScope.$pageFinishedLoading = true; 
                                errorHandler.evaluateErrors(error.data);
                                errorHandler.handleErrors(error);
                            });
                        }  else {
                            vm.getAllServices();                        
                            $rootScope.$apply();
                        }                                
                    }
                }, function (error) {
                    $rootScope.$pageFinishedLoading = true;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $rootScope.$apply();
                });
            }
        };

        vm.checkMultiFactorAuthEnabledFromData = function(multiFactorAuthObj){
            var enabledObj = {enabled: false,key: ''};
            for (var key in multiFactorAuthObj) {
                if (multiFactorAuthObj.hasOwnProperty(key)) {
                    if(multiFactorAuthObj[key] == true){
                        enabledObj.enabled = true;
                        enabledObj.key = key;
                        break;
                    }
                }
            }
            return enabledObj;
        };

        //loading all services at the start
        vm.getAllServices = function(){
            extensionsHelper.fetchAdminServices()
            .then(function(res){
                extensionsHelper.storeServicesListToLocalstorage(res);                
                $rootScope.$pageFinishedLoading = true;
                $location.path('/currencies');
            })
            .catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();