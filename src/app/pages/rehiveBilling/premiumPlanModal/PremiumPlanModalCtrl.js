(function () {
    'use strict';

    angular.module('BlurAdmin.pages.rehiveBilling')
        .controller('PremiumPlanModalCtrl', PremiumPlanModalCtrl);

    /** @ngInject */
    function PremiumPlanModalCtrl($rootScope,$scope,$location,localStorageManagement,$uibModalInstance,environmentConfig,whiteLabelPlans,
                            errorHandler,Rehive,$intercom,billingService,stripeObj) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.stripeObj = null;
        $scope.total_price = 2500;
        $scope.whiteLabelOptions = {
            android_hosting: false,
            ios_hosting: false,
            web_hosting: false,
            dashboard_hosting: false,
            merchant_doc: false,
            merchant_sdk: false
        };

        $scope.whiteLabelPlans = whiteLabelPlans;
        $scope.stripeObj = stripeObj;

        $scope.onOptionSelected = function (field) {
            if($scope.whiteLabelOptions[field]){
                $scope.total_price += (($scope.total_price + 250) <= 4000) ? 250 : 0;
            }
            else {
                $scope.total_price -= (($scope.total_price - 250) >= 4000) ? 250 : 0;
            }
        };

        $scope.confirmPremiumSubscription = function(){
            $scope.premiumPlan = [{"plan": $scope.whiteLabelPlans.premium}];
            for(var option in $scope.whiteLabelOptions){
                if($scope.whiteLabelOptions.hasOwnProperty(option) && $scope.whiteLabelOptions[option]){
                    $scope.premiumPlan.push({
                        "plan": $scope.whiteLabelPlans[option]
                    })
                }
            }
            $scope.checkoutSession($scope.premiumPlan);
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
    }
})();