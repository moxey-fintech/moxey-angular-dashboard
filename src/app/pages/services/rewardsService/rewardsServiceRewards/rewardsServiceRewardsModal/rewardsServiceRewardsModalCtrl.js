(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRewards')
        .controller('RewardsServiceRewardsModalCtrl', RewardsServiceRewardsModalCtrl);

    function RewardsServiceRewardsModalCtrl($scope,reward,environmentConfig,$uibModalInstance,$ngConfirm,$location,extensionsHelper,
                                            $state,toastr,$http,localStorageManagement,errorHandler,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "rewards_service";
        // vm.serviceUrl = "https://reward.services.rehive.io/api/";
        $scope.reward = reward;
        $scope.loadingReward = true;
        $scope.editingRequest = false;
        $scope.userObj = {};
        $scope.updateRequestObj = {status: $filter('capitalizeWord')(reward.status)};
        $scope.rewardStatusOptions = ['Pending','Accepted','Rejected'];

        $scope.toggleEditingRequest = function () {
            $scope.editingRequest = !$scope.editingRequest;
        };

        $scope.goToTransactions = function (transactionId) {
            $state.go('transactions.history',{transactionId: transactionId});
            $uibModalInstance.close();
        };

        $scope.findUserObj = function () {
            $scope.loadingReward = true;
            $http.get(environmentConfig.API + 'admin/users/?user=' + $scope.reward.user, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $scope.loadingReward = false;
                    if(res.data.data.results.length == 1){
                        $scope.userObj = res.data.data.results[0];
                    }
                }
            }).catch(function (error) {
                $scope.loadingReward = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };       

        $scope.updateRequestPrompt = function (status) {
            $ngConfirm({
                title: 'Update reward',
                content: 'Are you sure you want to update this reward?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            vm.updateRequest(status);
                        }
                    }
                }
            });
        };

        vm.updateRequest = function () {
            if(vm.token) {
                $scope.loadingReward = true;
                $http.patch(vm.serviceUrl + 'admin/rewards/' + reward.id + '/',
                    {
                        status: $scope.updateRequestObj.status.toLowerCase()
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.loadingReward = false;
                        toastr.success('Request has been updated successfully');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.loadingReward = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        //single reward reward does not send campaign name but list api does
        // $scope.getRewardsRequests = function () {
        //     if(vm.token) {
        //         $scope.loadingReward = true;
        //         $http.get(vm.serviceUrl + 'admin/rewards/' + reward.id + '/', {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function (res) {
        //             if (res.status === 200) {
        //                 $scope.loadingReward = false;
        //                 vm.reward = res.data.data;
        //             }
        //         }).catch(function (error) {
        //             $scope.loadingReward = false;
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
        //         });
        //     }
        // };
        // $scope.getRewardsRequests();

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.loadingReward = false;
                $scope.findUserObj();
            })
            .catch(function(err){
                $scope.loadingReward = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close();
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();