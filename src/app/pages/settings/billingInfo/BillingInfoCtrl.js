(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.billingInfo')
        .controller('BillingInfoCtrl', BillingInfoCtrl);
        
        /** @ngInject */
        function BillingInfoCtrl($scope,Rehive,$rootScope,environmentConfig,serializeFiltersService,billingService,
                             $timeout,toastr,localStorageManagement,errorHandler, $location, $uibModal,$ngConfirm) {
                                 
        if($rootScope.$subscriptionObj && $rootScope.$subscriptionObj.status && $rootScope.$subscriptionObj.status === 'active'){
            $location.path('/settings');
        }
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.stripeObj = null;
        $scope.loadingBillingInfo = false;
        vm.queryParams = $location.search();
        $scope.companyPlan = {
            // plan: 'Standard',
            plan: 'none',
            payment: null,
            billing: null
        };

        $scope.fetchPaymentMethod = function(paymentMethodId){
            if(vm.token){
                billingService.fetchStripePaymentDetails(paymentMethodId).then(function (payment_details) {
                    $scope.companyPlan.payment = payment_details.card;
                    $scope.companyPlan.billing = payment_details.billing_details;
                    $scope.loadingBillingInfo = false;
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.loadingBillingInfo = false;
                    if(error.status == 404){
                        $scope.companyPlan.payment = null;
                        $scope.companyPlan.billing = null;
                    } else {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error.data);
                    }
                    $scope.$apply();
                });
            }
        };

        $scope.handleSubscription = function(subscription) {
            $scope.companyPlan.plan = subscription.name ? subscription.name : 'none';
            if(vm.queryParams.succeeded){
                vm.queryParams.succeeded == "true" ? toastr.success('You have subscribed to ' + $scope.companyPlan.plan + ' plan') : toastr.error('Session checkout failed');
            }
            if(subscription.data && subscription.data.default_payment_method){
                $scope.fetchPaymentMethod(subscription.data.default_payment_method);
            } 
            else {
                $scope.companyPlan.payment = null;
                $scope.companyPlan.billing = null;
                $scope.loadingBillingInfo = false;
            }
        };

        $scope.fetchCompanySubscription = function(){
            if(vm.token){
                $scope.loadingBillingInfo = true;
                /* We check if the subscripton obj exists in the $rootScope. If not we fetch and save it. */
                if($rootScope.$subscriptionObj !== undefined){
                    $scope.handleSubscription($rootScope.$subscriptionObj);
                } else {
                    billingService.fetchRehiveSubscriptionAsAdmin().then(function (res) {
                        $rootScope.$subscriptionObj = res;
                        $scope.handleSubscription($rootScope.$subscriptionObj);
                        $scope.$apply();
                    }).catch(function (error) {
                        $scope.loadingBillingInfo = false;
                        $location.path('/login');
                        $scope.$apply();
                    });
                }   
            }
        };

        vm.createStripInstance = function(){
            if(vm.token){
                $scope.loadingBillingInfo = true;
                billingService.createStripeInstance().then(function (stripeKey) {
                    $scope.stripeObj = Stripe(stripeKey);
                    $scope.fetchCompanySubscription();
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.loadingBillingInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error.data);
                    $scope.$apply();
                });
            }
        };
        vm.createStripInstance();

        $scope.goToStripe = function(){
            if(vm.token){
                $scope.loadingBillingInfo = true;
                billingService.createPaymentUpdateSession().then(function (checkoutSession) {
                    $scope.stripeObj.redirectToCheckout({sessionId: checkoutSession}).then(function (result) {
                        $scope.loadingBillingInfo = false;
                        if(result.error){
                            errorHandler.evaluateErrors(result.error);
                            errorHandler.handleErrors(result.error);
                        }
                    });
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.loadingBillingInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error.data);
                    $scope.$apply();
                });
            }
        };

        $scope.retryPayment = function(){
            if($rootScope.$subscriptionObj && $rootScope.$subscriptionObj.id){
                var warningText = "Your provided credit card will be charged for the due amount";
                if($rootScope.$subscriptionObj.data.amount_due){
                    warningText += " of <strong>$" +  ($rootScope.$subscriptionObj.data.amount_due/ 100) + "</strong>"; 
                }
                warningText += ". Proceed?";
                $ngConfirm({
                    columnClass: 'small',
                    title: "Retry payment",
                    content: warningText,
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: $scope,
                    closeIcon: true,
                    buttons: {
                        close: {
                            text: "Cancel",
                            btnClass: 'btn-default dashboard-btn'
                        },
                        ok: {
                            text: "Retry payment",
                            btnClass: 'btn-primary delete-button-lifted',
                            keys: ['enter'], 
                            action: function(scope){
                                scope.retryFailedSubscriptionPayment();
                            }
                        }
                    }
                });                
            }
        };

        $scope.retryFailedSubscriptionPayment = function() {
            if(vm.token){
                $scope.loadingBillingInfo = true;
                billingService.retrySubscriptionPayment($rootScope.$subscriptionObj.id).then(function(res){
                    $scope.loadingBillingInfo = false;
                    $scope.fetchCompanySubscription();
                    $scope.$apply();
                })
                .catch(function(error){
                    $scope.loadingBillingInfo = false;
                    if(error.data){
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error.data);
                        if(error.data.data && Array.isArray(error.data.data) && error.data.data.length){
                            toastr.error(error.data.data[0]);
                        }
                    }
                    $scope.$apply();
                });
            }
        };

        $scope.selectPlan = function(){
            $location.path('/rehive-billing');
        };

        $scope.upgradePlan = function(){
            toastr.success('Please contact support to upgrade your plan.');
            //$location.path('/rehive-billing');
        };

        $scope.openCancelPlanModal = function(){
            toastr.success('Please contact support to cancel your plan.')
            // vm.theCancellationModal = $uibModal.open({
            //     animation: true,
            //     templateUrl: 'app/pages/settings/billingInfo/billingCancellationModal/billingCancellationModal.html',
            //     size: 'md',
            //     controller: 'BillingCancellationModalCtrl',
            //     resolve: {
            //         currentPlan: function(){
            //             return $scope.companyPlan.plan
            //         }
            //     }
            // });
            // vm.theCancellationModal.result.then(function(planChanged){
            //     if(planChanged){
            //         $scope.fetchCompanySubscription();
            //     }
            // });
        };

    }
})();