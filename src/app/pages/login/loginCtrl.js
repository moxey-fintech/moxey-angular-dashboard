(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login')
        .controller('LoginCtrl', LoginCtrl);

    /** @ngInject */
    function LoginCtrl($rootScope,Rehive,$scope,localStorageManagement,$location,errorHandler,$intercom,environmentConfig,extensionsHelper,$http) {

        var vm = this;
        $rootScope.dashboardTitle = 'Moxey';
        $scope.gotCompanyName = false;
        $scope.isCheckingCompany = false;
        $scope.showLoginPassword = false;
        $scope.companyStatus = 'active';
        $scope.companyOptions = ['moxey_test','moxey'];
        $scope.suspendedService = false;
        $scope.resetCompany = function(){
            $intercom.shutdown();
            localStorageManagement.deleteValue('TOKEN');
            localStorageManagement.deleteValue('token');
            if(localStorageManagement.getValue('templateObj')){ localStorageManagement.deleteValue('templateObj'); }
            if(localStorageManagement.getValue('intercomUser')){ localStorageManagement.deleteValue('intercomUser'); }
            Rehive.removeToken();
            $scope.path = $location.path();
        };
        $scope.resetCompany();

        $scope.login = {
            company: null,
            user: null,
            password: null
        };

        $scope.toggleLoginPassword = function () {
            $scope.showLoginPassword = !$scope.showLoginPassword;
        };

        $scope.checkCompany = function(){
            $scope.gotCompanyName = true;
            $scope.isCheckingCompany = true;
            Rehive.public.companies.get($scope.login.company).then(function(res){
                // $rootScope.isRestricted = (res.status && res.status === 'restricted');
                $scope.companyStatus = res.status ? res.status : 'active';
                $scope.isCheckingCompany = false;
                $scope.$apply();
            }, function(error){
                $scope.gotCompanyName = false;
                $scope.isCheckingCompany = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };   
        
        vm.handleIntercomBoot = function(token, user){ 
            if(user && environmentConfig.API !== "https://api.staging.rehive.com/3/"){
                $http.get('https://functions.rehive.io/intercom-identity-verification', {
                    headers: {
                        'Content': 'application/json',
                        'Authorization': 'Token ' + token
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
                }, function(error){
                    $scope.login.password = null;
                    $rootScope.$pageFinishedLoading = true; 
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }  else {
            }       
        };

        $scope.login = function(user, company, password) {
            $rootScope.$pageFinishedLoading = false;
            $rootScope.gotToken = false;
            Rehive.auth.login({
                user: user,
                company: company,
                password: password
            }).then(function(res){
                if(localStorageManagement.getValue('token')){
                    localStorageManagement.deleteValue('token');
                }
                res.user.appId = company;
                var token = res.token;
                localStorageManagement.setValue('token', token);
                localStorageManagement.setValue('TOKEN','Token ' + token);
                if(!res.mfa){
                    $rootScope.gotToken = true;
                    vm.handleIntercomBoot(token, res.user);
                    vm.getAllServices();
                } else {
                    localStorageManagement.setValue('mfaUnverified', true);
                    localStorageManagement.setValue('intercomUser', JSON.stringify(res.user));
                    $rootScope.$pageFinishedLoading = true;
                    var mfaUrl = '/authentication/multi-factor/verify/' + res.mfa;
                    $location.path(mfaUrl).search({prevUrl: 'login'});
                }
                $rootScope.$apply();
                // vm.checkMultiFactorAuthEnabled(token, res.user);
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
                        localStorageManagement.setValue('intercomUser', JSON.stringify(user));
                        $location.path('/authentication/multi-factor/verify/' + enabledObj.key).search({prevUrl: 'login'});
                    } else {       
                        vm.handleMFAInactiveLogin(res.user);                  
                    }
                    $rootScope.$apply();
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
                $location.path('/currencies/currencies-list');
            })
            .catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
