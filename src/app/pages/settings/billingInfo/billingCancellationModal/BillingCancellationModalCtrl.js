(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.billingInfo')
        .controller('BillingCancellationModalCtrl', BillingCancellationModalCtrl);

    /** @ngInject */
    function BillingCancellationModalCtrl($rootScope,$scope,$location,localStorageManagement,$uibModalInstance,environmentConfig,
                                  $window, errorHandler,$state,serializeFiltersService,$http,Rehive,$intercom, currentPlan) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.currentPlan = currentPlan;
        $scope.updatingPlan = false;
        $scope.rehiveBillingPlans = {};
        $scope.rehivePlans = [
            {name: "Starter", plan: '', cost: 100},
            {name: "Standard", plan: '', cost: 500}
        ];

        vm.fetchRehiveBillingPlans = function() {
            if(vm.token){
                $scope.updatingPlan = true;
                $http.get(environmentConfig.BILLING_URL + 'admin/plans/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    res.data.data.results.forEach(function(plan){
                        $scope.rehiveBillingPlans[plan.slug] = plan;
                        if(plan.slug === 'starter_monthly_us'){
                            $scope.rehivePlans[0].plan = $scope.rehiveBillingPlans.starter_monthly_us.id;
                        } else if(plan.slug === 'standard_monthly_us'){
                            $scope.rehivePlans[1].plan = $scope.rehiveBillingPlans.standard_monthly_us.id;
                        }
                    });
                    $scope.updatingPlan = false;
                }).catch(function (error) {
                    $scope.updatingPlan = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error.data);
                });
            }
        };
        vm.fetchRehiveBillingPlans();

        $scope.$dismiss = function(){
            $uibModalInstance.close();
        };

        $scope.planCancellation = {
            option: 'downgrade',
            plan_to_downgrade: $scope.rehivePlans[0]
        };

        $scope.updatePlan = function(){
            // perform Downgrade/Pause/Cancellation actions depending on planCancellation.option chosen
        };
    }
})();