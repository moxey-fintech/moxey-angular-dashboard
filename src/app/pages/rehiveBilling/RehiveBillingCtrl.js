(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rehiveBilling')
        .controller('RehiveBillingCtrl', RehiveBillingCtrl);

    /** @ngInject */
    function RehiveBillingCtrl($rootScope,$scope,$location,localStorageManagement, environmentConfig,billingService,
                            $window, errorHandler,$state,serializeFiltersService,$uibModal,Rehive,$intercom) {

        if($rootScope.$subscriptionObj && $rootScope.$subscriptionObj.status && $rootScope.$subscriptionObj.status === 'active'){
            $location.path('/currencies');
        }
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Rehive plans | Moxey';
        $scope.loadingPlans = false;
        $scope.stripeObj = null;
        $scope.rehivePlans = [
            {name: 'Starter', price: '$25', activation: 'Activating will not end your trial period.'},
            {name: 'Standard', price: '$250', activation: 'Activating will not end your trial period.'},
            {name: 'Premium', price: '$2,500', activation: '$2,500 activation fee'},
            {name: 'Enterprise', price: 'Custom', activation: 'Activating will not end your trial period.'}
        ];

        $scope.rehiveBillingPlans = {};

        vm.createStripInstance = function(){
            if(vm.token){
                billingService.createStripeInstance().then(function (stripeKey) {
                    $scope.stripeObj = Stripe(stripeKey);
                    $intercom.trackEvent('rehive-plans', {page: "rehive_billing"});
                    $scope.loadingPlans = false;
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.loadingPlans = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error.data);
                    $scope.$apply();
                });
            }
        };

        vm.fetchRehiveBillingPlans = function() {
            if(vm.token){
                $scope.loadingPlans = true;
                billingService.fetchRehiveBillingPlans().then(function (billingPlans) {
                    $scope.rehiveBillingPlans = billingPlans;
                    vm.createStripInstance();
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.loadingPlans = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error.data);
                    $scope.$apply();
                });
            }
        };
        vm.fetchRehiveBillingPlans();

        $scope.goBackToGetStarted = function(){
            $state.go('getStarted', {}, {reload: true});
        };

        $scope.subscribePremium = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'PremiumPlanModalCtrl',
                resolve: {
                    whiteLabelPlans: function() {
                        return {
                            premium: $scope.rehiveBillingPlans.premium_monthly_us.id,
                            android_hosting: $scope.rehiveBillingPlans.android_app_hosting_monthly_us.id,
                            ios_hosting: $scope.rehiveBillingPlans.ios_app_hosting_monthly_us.id,
                            web_hosting: $scope.rehiveBillingPlans.web_app_hosting_monthly_us.id,
                            dashboard_hosting: $scope.rehiveBillingPlans.admin_dashboard_hosting_monthly_us.id,
                            merchant_doc: $scope.rehiveBillingPlans.documentation_hosting_monthly_us.id,
                            merchant_sdk: $scope.rehiveBillingPlans.sdk_hosting_monthly_us.id
                        };
                    },
                    stripeObj: function() {
                        return $scope.stripeObj;
                    }
                }
            });
        };

        $scope.subscribeStandard = function(page, size){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'StandardPlansModalCtrl',
                resolve: {
                    whiteLabelPlans: function() {
                        return {
                            standard: $scope.rehiveBillingPlans.standard_monthly_us.id,
                            android_hosting: $scope.rehiveBillingPlans.android_app_hosting_monthly_us.id,
                            ios_hosting: $scope.rehiveBillingPlans.ios_app_hosting_monthly_us.id,
                            web_hosting: $scope.rehiveBillingPlans.web_app_hosting_monthly_us.id,
                            // dashboard_hosting: $scope.rehiveBillingPlans.admin_dashboard_hosting_monthly_us.id,
                            merchant_doc: $scope.rehiveBillingPlans.documentation_hosting_monthly_us.id,
                            merchant_sdk: $scope.rehiveBillingPlans.sdk_hosting_monthly_us.id
                        };
                    },
                    stripeObj: function() {
                        return $scope.stripeObj;
                    }
                }
            });
        };

        $scope.checkoutSession = function(plans){
            if(vm.token){
                $scope.loadingPlans = true;
                billingService.createStripeCheckoutSession(plans).then(function (checkoutSession) {
                    // var checkout_session = res.data.data.checkout_session;
                    $scope.stripeObj.redirectToCheckout({sessionId: checkoutSession}).then(function (result) {
                        $scope.loadingPlans = false;
                        if(result.error){
                            errorHandler.evaluateErrors(result.error);
                            errorHandler.handleErrors(result.error);
                        }
                    });
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.loadingPlans = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error.data);
                    $scope.$apply();
                });
            }
        };

        $scope.startTrial = function(planName){
            $scope.trialPlan = [];
            switch(planName){
                case "Starter": $scope.trialPlan.push({"plan": $scope.rehiveBillingPlans.starter_monthly_us.id}); break;
                case "Standard": $scope.trialPlan.push({"plan": $scope.rehiveBillingPlans.standard_monthly_us.id}); break;
                case "Premium": $scope.trialPlan.push({"plan": $scope.rehiveBillingPlans.premium_monthly_us.id}); break;
                default: $scope.trialPlan.push({"plan": $scope.rehiveBillingPlans.starter_monthly_us.id});
            }
            // planName == 'Starter' ? $scope.trialPlan.push({"plan": $scope.rehiveBillingPlans.starter_monthly_us.id}) : $scope.trialPlan.push({"plan": $scope.rehiveBillingPlans.standard_monthly_us.id});
            $scope.checkoutSession($scope.trialPlan);
        };

        $scope.openRehivePrices = function(){
            window.open('https://rehive.com/pricing/', '_blank');
        };

        $scope.contactRehiveSales = function(){
            window.open('https://rehive.com/contact-sales/', '_blank');
        };
    }
})();