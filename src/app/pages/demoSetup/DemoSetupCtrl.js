(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup')
        .controller("DemoSetupCtrl", DemoSetupCtrl);

    function DemoSetupCtrl($intercom,$rootScope,$scope,Rehive,errorHandler,demoSetupService,$http,extensionsHelper,$location,identifySearchInput,localStorageManagement,toastr) {

        var vm = this;
        $scope.companyName = "";
        $rootScope.dashboardTitle = 'Demo setup | Moxey';
        $rootScope.securityConfigured = false;
        $rootScope.settingUpDemo = false;
        $scope.registerData = {
            email: '',
            company: '',
            password1: '',
            mode: 'test',
            terms_and_conditions: true,
            privacy_policy: true,
            onboarding_emails: false
        };
        $scope.invalidCompanyIdData = false;
        $scope.invalidEmailData = false;
        $scope.invalidAdminEmail = false;

        $scope.togglePasswordVisibility1 = function () {
            $scope.showPassword1 = !$scope.showPassword1;
        };

        $scope.validateAdminEmail = function() {
            $scope.invalidAdminEmail =  !identifySearchInput.isEmail($scope.invitedEmail);
        };

        $scope.validateCompanyEmail = function(){
            $scope.invalidEmailData =  !identifySearchInput.isEmail($scope.registerData.email);
        };

        $scope.validateCompanyId = function(){
            $scope.invalidCompanyIdData =  !identifySearchInput.isCompanyId($scope.registerData.company);
        };

        $scope.fixformat = function(){
            if(!$scope.registerData.company){
                return false;
            }
            $scope.registerData.company = $scope.registerData.company.toLowerCase();
            $scope.registerData.company = $scope.registerData.company.replace(/ /g, '_');
            $scope.registerData.company = $scope.registerData.company.trim();
        };        

        $scope.openRehiveWebsite = function(rehiveUrl) {
            $window.open(rehiveUrl, '_blank');
        };

        $scope.initializeDemoSetup = function(){
            $rootScope.settingUpDemo = true;
            demoSetupService.initializeDemoSetup($scope.companyName);
        };
        
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

        $scope.registerUser = function() {
            $scope.registerData.password2 = $scope.registerData.password1;
            $scope.registerData.privacy_policy = $scope.registerData.terms_and_conditions;
            $rootScope.settingUpDemo = true;
            $rootScope.$pageFinishedLoading = false;
            Rehive.auth.registerCompany($scope.registerData).then(function (res) {
                $rootScope.pageTopObj.userInfoObj = {};
                $rootScope.pageTopObj.userInfoObj = res;
                var token = localStorageManagement.getValue('token');
                localStorageManagement.setValue('TOKEN','Token ' + token);
                vm.token = localStorageManagement.getValue('TOKEN');

                $rootScope.showTrialbanner = true;
                $rootScope.trialExpired = false;
                $http.get('https://functions.rehive.io/intercom-identity-verification', {
                    headers: {
                        'Content': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    var intercomUser = {
                        email: res.email,
                        name: res.first_name + ' ' + res.last_name,
                        user_id: res.id,
                        created_at: parseInt(res.created)/1000,
                        company_id: res.company,
                        user_hash: res.data.data.user_hash,
                        onboarding_emails: $scope.registerData.onboarding_emails
                    };
                    $intercom.boot(intercomUser);
                }, function(error){
                    $rootScope.$pageFinishedLoading = true;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
                toastr.success('Registered company successfully');
                vm.getAllServices();
                $scope.$apply();
                $scope.$apply();

            }, function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
    }
})();
