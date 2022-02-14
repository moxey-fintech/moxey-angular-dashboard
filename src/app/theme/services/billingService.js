(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('billingService', billingService);

    /** @ngInject */
    function billingService($rootScope,localStorageManagement,$http,environmentConfig,$uibModal,$ngConfirm,$state,errorHandler,toastr,$filter) {

        return {
            createStripeInstance: function() {
                var token = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    $http.get(environmentConfig.BILLING_URL + 'user/public-key/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(function(res){
                        resolve(res.data.key);
                    }).catch(function(error){
                        reject(error);
                    })
                });
            },
            createStripeCheckoutSession: function(plans) {
                var token = localStorageManagement.getValue('TOKEN');
                var payload = plans ? {items: plans} : {};
                return new Promise(function(resolve, reject){
                    $http.post(environmentConfig.BILLING_URL + 'admin/checkout-session/', payload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(function(res){
                        resolve(res.data.data.checkout_session);
                    }).catch(function(error){
                        reject(error);
                    })
                });
            },
            createPaymentUpdateSession: function(plans) {
                var token = localStorageManagement.getValue('TOKEN');
                var payload = plans ? {items: plans} : {};
                return new Promise(function(resolve, reject){
                    $http.post(environmentConfig.BILLING_URL + 'admin/update-checkout-session/', payload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(function(res){
                        resolve(res.data.data.checkout_session);
                    }).catch(function(error){
                        reject(error);
                    })
                });
            },
            retrySubscriptionPayment: function(subscriptionId) {
                var token = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    $http.post(environmentConfig.BILLING_URL + 'admin/subscriptions/' + subscriptionId + '/pay/', {}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(function(res){
                        resolve(res.data);
                    }).catch(function(error){
                        reject(error);
                    })
                });
            },
            fetchStripePaymentDetails: function(paymentMethodId) {
                var token = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    $http.get(environmentConfig.BILLING_URL + 'admin/payment-methods/'+ paymentMethodId + '/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(function(res){
                        resolve(res.data);
                    }).catch(function(error){
                        reject(error);
                    })
                });
            },
            fetchRehiveBillingPlans: function() {
                var token = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    $http.get(environmentConfig.BILLING_URL + 'admin/plans/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(function(res){
                        var rehiveBillingPlans = {};
                        var results = res.data.data.results;
                        results.forEach(function(plan){
                            rehiveBillingPlans[plan.slug] = plan;
                        });
                        resolve(rehiveBillingPlans);
                    }).catch(function(error){
                        reject(error);
                    })
                });
            },
            fetchRehiveSubscriptionAsUser: function() {
                var TOKEN = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    if(!TOKEN){
                        /* We reject the call if no token present. */
                        toastr.error('Session expired. Please login again.');
                        reject(new Error('No token present'));
                        return;
                    }
                    
                    $http.get(environmentConfig.BILLING_URL + 'user/subscription/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': TOKEN
                        }
                    }).then(function (res) {
                        resolve(res.data.data);
                    }).catch(function (error) {
                        var tempActiveSubscription = {
                            id: null,
                            name: null,
                            status: "active",
                            created: null,
                            data: null,
                            updated: null
                        };
                        resolve(tempActiveSubscription);
                        if(error && error.data){
                            error.data.subscription_check = true;
                            error.data.subscription_user = true;
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        }
                    });
                });
            },
            fetchRehiveSubscriptionAsAdmin: function() {
                var TOKEN = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    if(!TOKEN){
                        /* We reject the call if no token present. */
                        toastr.error('Session expired. Please login again.');
                        reject(new Error('No token present'));
                        return;
                    }
                    
                    $http.get(environmentConfig.BILLING_URL + 'admin/subscription/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': TOKEN
                        }
                    }).then(function (res) {
                        resolve(res.data.data);
                    }).catch(function (error) {
                        var tempActiveSubscription = {
                            id: null,
                            name: null,
                            status: "active",
                            created: null,
                            data: null,
                            updated: null
                        };
                        resolve(tempActiveSubscription);
                        if(error && error.data){
                            error.data.subscription_check = true;
                            error.data.subscription_admin = true;
                            error.data.custom_toastr_required = 'subscription_status';
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        }
                    });
                });
            },
            getDashboardUsagePermission: function(subscriptionStatus) {
                if(subscriptionStatus === 'active' || subscriptionStatus === 'trial_live' || subscriptionStatus === 'past_due'){
                    return 'allow';
                } else if(subscriptionStatus === 'unpaid' || subscriptionStatus === 'trial_expired' 
                || subscriptionStatus === 'canceled' || subscriptionStatus === 'incomplete'
                || subscriptionStatus === 'incomplete_payment'|| subscriptionStatus === 'incomplete_expired') {
                    return 'allow_restricted';
                }
                return 'block';
            },
            handleAllowedSubscriptionStatuses: function() {
                if($rootScope.$subscriptionObj.status === 'trial_live'){
                    $rootScope.showTrialbanner = true;
                    var trialEndDate = ($rootScope.$subscriptionObj.data && $rootScope.$subscriptionObj.data.trial_end) ? $rootScope.$subscriptionObj.data.trial_end : new Date(new Date().setDate(new Date().getDate() + 14));
                    $rootScope.trialbannerText = "Your 14-day free trial is ongoing and will end on " + $filter("date")(trialEndDate, 'mediumDate') ;
                } else if($rootScope.$subscriptionObj.status === 'past_due') {
                    $rootScope.displayIncompleteSubscription = true;
                    $rootScope.showTrialbanner = ($rootScope.$subscriptionObj.data && $rootScope.$subscriptionObj.data.suspension_date);
                    if($rootScope.showTrialbanner) {
                        var dueDate = $rootScope.$subscriptionObj.data.suspension_date * 1000;
                        $rootScope.trialbannerText = "Your invoice is past due date. Account will be suspended after " + $filter("date")(dueDate,'mediumDate');
                        // var daysPastDue = $rootScope.$subscriptionObj.data.suspension_days_remaining;
                        // $rootScope.trialbannerText = "Your invoice is past due date. Account will be suspended after " + daysPastDue + (daysPastDue > 1 ? " days" : " day");
                    }
                }
                return;
            },
            handleIncompleteSubscriptionStatuses: function(event, targetUrl, subscriptionStatus) {
                var vm = this;                
                if(targetUrl !== '/rehive-billing'){
                    event.preventDefault();
                    $state.go('rehiveBilling');
                    if(subscriptionStatus === 'incomplete_expired'){
                        vm.displayIncompleteWarning('Expired subscription attempt', 'Your previous subscription request failed due to expired payment process. Please choose a plan and subscribe again.');
                    }
                }
            },
            handleUnpaidSubscriptionStatuses: function(event, targetUrl, subscriptionStatus) {
                var vm = this;
                $rootScope.displayIncompleteSubscription = true;
                if(targetUrl !== '/billing-info'){
                    if(subscriptionStatus === 'incomplete_payment'){
                        event.preventDefault();
                        $state.go('settings.billingInfo');
                        vm.displayIncompleteWarning('Subscription failed', 'Your subscription could not be finalized as the initial payment did not succeed. Please retry payment or update your payment details.');
                    } else {
                        vm.displayRehiveBlockerPopup('app/pages/settings/billingInfo/billingUnpaidModal.html');
                    }
                }
            },
            handleExpiredSubscriptionStatuses: function(event, targetUrl, subscriptionStatus) {
                var vm = this;
                if(targetUrl !== '/rehive-billing'){
                    subscriptionStatus === 'trial_expired' ? vm.displayRehiveBlockerPopup('app/pages/rehiveBilling/trialExpiredModal/trialExpiredModal.html') : vm.displayRehiveBlockerPopup('app/pages/rehiveBilling/planCanceledModal.html') ;
                }
            },
            displayRehiveBlockerPopup: function(blockerTemplateUrl) {
                var trialExpiredModal = $uibModal.open({
                    animation: true,
                    templateUrl: blockerTemplateUrl,
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'trial-expired-modal-window'
                });
            },
            displayIncompleteWarning: function(incompleteTitle, incompleteContent) {
                $ngConfirm({
                    columnClass: 'medium',
                    title: incompleteTitle,
                    content: incompleteContent,
                    animationBounce: 1,
                    animationSpeed: 100,
                    scope: $rootScope,
                    // closeIcon: true,
                    buttons: {
                        close: {
                            text: "Close",
                            btnClass: 'btn-default dashboard-btn'
                        }
                    }
                });
            }
        };
    }
})();
