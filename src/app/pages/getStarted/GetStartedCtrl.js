(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .controller('GetStartedCtrl', GetStartedCtrl);

    /** @ngInject */
    function GetStartedCtrl($rootScope,$scope,$location,localStorageManagement, environmentConfig,$http,extensionsHelper,
                            $window, errorHandler,$state,serializeFiltersService,$uibModal,Rehive,$intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Get started | Moxey';
        $scope.inTestingSandboxTutorial = false;
        $scope.loadingPlans = false;
        $scope.adminEmail = "";
        $scope.adminCompany = "";
        $scope.stellarTestnetUrl = null;
        $scope.bitcoinTestnetUrl = null;

        $scope.openRehiveUrl = function(videoUrl){
            $window.open(videoUrl, '_blank');
        };
        
        $scope.openRehiveDemoSessions = function(){
            $window.open('https://rehive.com/sessions/', '_blank');
        };

        $scope.openStandardConfigDocumentation = function(){
            $intercom.trackEvent('standard-config', {page: "get_started"});
            $window.open('https://docs.google.com/document/d/1LdWBY2Oim2EPWv2-ZNKIPXDbnULbSf-DiUfuCw7_zQg/edit', '_blank');
        };

        $scope.goBackToGetStarted = function(){
            $scope.inTestingSandboxTutorial = false;
        };

        $scope.goToTestingSandboxVideos = function(){
            $scope.inTestingSandboxTutorial = true;
            $window.scrollTo(0, 0);
            // $intercom.trackEvent('try-wallet', {page: "get_started"});
            $intercom.trackEvent('testing-sandbox', {page: "get_started"});
        };

        $scope.openIntercomm = function(){
            $intercom.show();
            $intercom.trackEvent('chat', {page: "get_started"});
        };

        $scope.openRehiveConfigDocs = function() {
            $intercom.trackEvent('standard-config', {page: "get_started"});
            $window.open('https://docs.google.com/document/d/1LdWBY2Oim2EPWv2-ZNKIPXDbnULbSf-DiUfuCw7_zQg', '_blank');
        };

        $scope.openRehiveContactForm = function(){
            $intercom.trackEvent('contact', {page: "get_started"});
            $window.open('https://rehive.com/contact-sales/', '_blank');
        };

        $scope.openWebWallet = function(){
            $intercom.trackEvent('open-wallet', {page: "try_wallet"});
            $window.open('https://app.rehive.com/register?company=' + $scope.adminCompany, '_blank');
        };

        $scope.openBusinessCases = function(){
            $intercom.trackEvent('learn-more', {page: "get_started"});
            $window.open('https://docsend.com/view/yx2vhzm', '_blank');
        };

        $scope.walletLearnMore = function(){
            $intercom.trackEvent('learn-more', {page: "try_wallet"});
            $window.open('https://docsend.com/view/yx2vhzm', '_blank');
        };

        $scope.openWalletContact = function(){
            $intercom.trackEvent('contact', {page: "try_wallet"});
            $window.open('https://rehive.typeform.com/to/hBcRmF', '_blank');
        };

        vm.getCompanyAdmin = function(){
            Rehive.user.get().then(function(res){
                $scope.adminEmail = res.email;
                $scope.adminCompany = res.company;
                $scope.$apply();
            },function(err){
                $scope.$apply();
            });
        };
        vm.getCompanyAdmin();

        vm.fetchServiceUrl = function(serviceName){
            var urlFieldname = serviceName === 'stellar_testnet_service' ? 'stellarTestnetUrl' : 'bitcoinTestnetUrl';
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                $scope[urlFieldname] = serviceUrl;
            })
            .catch(function(err){
                $scope[urlFieldname] = null;
            });
        };
        vm.fetchServiceUrl("stellar_testnet_service");
        vm.fetchServiceUrl("bitcoin_testnet_service");
    }
})();
