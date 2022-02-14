(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRewards')
        .controller('RewardsServiceRewardsCtrl', RewardsServiceRewardsCtrl);

    /** @ngInject */
    function RewardsServiceRewardsCtrl(environmentConfig,$scope,$http,localStorageManagement,$location,extensionsHelper,
                                        $uibModal,serializeFiltersService,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "rewards_service";
        // vm.serviceUrl = "https://reward.services.rehive.io/api/";
        $scope.loadingRewardsRequests =  true;
        $scope.showingRewardsRequestsFilters = false;
        $scope.rewardsList = [];
        $scope.statusOptions = ['Pending','Accepted','Rejected'];
        $scope.typeOptions = ['Request', 'Manual' , 'External'];

        $scope.filtersObj = {
            campaignFilter: false,
            rewardIdFilter: false,
            rewardTypeFilter: false,
            statusFilter: false
        };
        $scope.applyFiltersObj = {
            campaignFilter: {
                selectedCampaign: null
            },
            rewardIdFilter: {
                selectedRewardId: null
            },
            rewardTypeFilter: {
                selectedRewardType: 'Request'
            },
            statusFilter: {
                selectedStatus: 'Pending'
            }
        };

        $scope.showRewardsRequestsFilters = function () {
            $scope.showingRewardsRequestsFilters = !$scope.showingRewardsRequestsFilters;
        };

        vm.getCampaignList = function () {
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/campaigns/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(res.data.data.results.length > 0){
                            $scope.campaignListOptions = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingCampaigns =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.getUserObjEmail = function (id) {
            $scope.userEmailObj = '';
            $http.get(environmentConfig.API + 'admin/users/?user=' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    if(res.data.data.results.length == 1){
                        $scope.userEmailObj = res.data.data.results[0];
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getRewardsUrl = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 25,
                campaign: $scope.filtersObj.campaignFilter ? ($scope.applyFiltersObj.campaignFilter.selectedCampaign ? $scope.applyFiltersObj.campaignFilter.selectedCampaign.id : null): null,
                id: $scope.filtersObj.rewardIdFilter ? $scope.applyFiltersObj.rewardIdFilter.selectedRewardId : null,
                reward_type: $scope.filtersObj.rewardTypeFilter ? ($scope.applyFiltersObj.rewardTypeFilter.selectedRewardType ? $scope.applyFiltersObj.rewardTypeFilter.selectedRewardType.toLowerCase() : null): null,
                status: $scope.filtersObj.statusFilter ? ($scope.applyFiltersObj.statusFilter.selectedStatus ? $scope.applyFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null
            };

            return vm.serviceUrl + 'admin/rewards/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getRewardsLists = function (applyFilter,fromRequestStatusChange) {
            if(!fromRequestStatusChange){
                $scope.loadingRewardsRequests = true;
            }

            $scope.showingRewardsRequestsFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.rewardsList.length > 0 && !fromRequestStatusChange) {
                $scope.rewardsList.length = 0;
            }

            var rewardsUrl = vm.getRewardsUrl();

            if(vm.token) {
                $http.get(rewardsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.loadingRewardsRequests = false;
                        if(res.data.data.results.length > 0){
                            $scope.rewardsData = res.data.data;
                            $scope.rewardsList = $scope.rewardsData.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingRewardsRequests = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.clearFilters = function () {
            $scope.filtersObj = {
                campaignFilter: false,
                statusFilter: false
            };
            $scope.showRewardsRequestsFilters();
            $scope.getRewardsLists('applyfilter', null);
        };

        $scope.rewardStatusChange = function (request,status) {
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/rewards/' + request.id + '/',
                    {
                        status: status.toLowerCase()
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.getRewardsLists(null,'fromRequestStatusChange');
                        toastr.success('Reward has been updated successfully');
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openRewardRequestModal = function (page, size,reward) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'RewardsServiceRewardsModalCtrl',
                resolve: {
                    reward: function () {
                        return reward;
                    }
                }
            });

            vm.theModal.result.then(function(request){
                if(request){
                    $scope.getRewardsLists();
                }
            }, function(){
            });
        };

        $scope.openRewardUserModal = function (page, size) {
            vm.theRewardModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'RewardUserModalCtrl'
                // resolve: {
                //     campaign: function () {
                //         return campaign;
                //     }
                // }
            });

            vm.theRewardModal.result.then(function(request){
                if(request){
                    $scope.getRewardsLists();
                }
            }, function(){
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.loadingRewardsRequests = false;
                vm.getCampaignList();
                $scope.getRewardsLists();
            })
            .catch(function(err){
                $scope.loadingRewardsRequests = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
