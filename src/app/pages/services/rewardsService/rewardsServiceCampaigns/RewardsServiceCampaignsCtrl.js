(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceCampaigns')
        .controller('RewardsServiceCampaignsCtrl', RewardsServiceCampaignsCtrl);

    /** @ngInject */
    function RewardsServiceCampaignsCtrl($scope,$http,localStorageManagement,$location,$timeout,extensionsHelper,
                                         serializeFiltersService,$ngConfirm,toastr,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "rewards_service";
        // vm.serviceUrl = "https://reward.services.rehive.io/api/";
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT') ? localStorageManagement.getValue('DATE_FORMAT').toUpperCase() : "MM/dd/yyyy";
        $scope.loadingCampaigns =  true;
        $scope.campaignList = [];
        $scope.filtersCount = 0;
        $scope.campaignsId = '';
        $scope.showingFilters = false;

        $scope.closeCampaignOptionsBox = function () {
            $scope.campaignsId = '';
        };

        $scope.showCampaignOptionsBox = function (campaign) {
            $scope.campaignsId = campaign.id;
        };

        $scope.goToCreateCampaignView = function () {
            // $location.path('/services/rewards/campaigns/create');
            $location.path('/extensions/rewards/campaigns/create');
        };

        $scope.campaignPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };
        $scope.filtersObj = {
            nameFilter: false,
            idFilter: false
        };
        $scope.applyFiltersObj = {
            nameFilter: {
                selectedName: ''
            },
            idFilter: {
                selectedId: ''
            }
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                nameFilter: false,
                idFilter: false
            };
            $scope.showFilters();
            $scope.getCampaignList('applyfilter');
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        vm.getRewardsCampaignsListsUrl = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.campaignPagination.pageNo,
                page_size: $scope.campaignPagination.itemsPerPage || 25,
                name: $scope.filtersObj.nameFilter ? $scope.applyFiltersObj.nameFilter.selectedName : null,
                id: $scope.filtersObj.idFilter ? $scope.applyFiltersObj.idFilter.selectedId : null
            };

            return vm.serviceUrl + 'admin/campaigns/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getCampaignList = function (applyFilter) {
            if(vm.token) {
                $scope.loadingCampaigns =  true;
                $scope.showingFilters = false;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.campaignPagination.pageNo = 1;
                }

                if ($scope.campaignList.length > 0) {
                    $scope.campaignList.length = 0;
                }

                var rewardsCampaignsListsUrl = vm.getRewardsCampaignsListsUrl();

                $http.get(rewardsCampaignsListsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.loadingCampaigns =  false;
                        if(res.data.data.results.length > 0){
                            $scope.campaignListData = res.data.data;
                            $scope.campaignList = res.data.data.results;
                            $scope.campaignList.forEach(function (campaign) {
                                var validity = moment(campaign.end_date) > moment();
                                campaign.status = (validity && campaign.active) ? "Active" : (!campaign.active ? "Inactive" : "Expired");    
                                campaign.start_date = moment(campaign.start_date).format($scope.companyDateFormatString);
                                campaign.end_date = moment(campaign.end_date).format($scope.companyDateFormatString);
                            });
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingCampaigns =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.toggleCampaignStatuses = function (campaign,last) {
            if(vm.token) {
                $scope.loadingCampaigns = true;
                $http.patch(vm.serviceUrl + 'admin/campaigns/' + campaign.id + '/',{ active: campaign.active, visible: campaign.visible }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last) {
                        $timeout(function () {
                            toastr.success('Campaign updated successfully');
                            $scope.getCampaignList();
                        },600);
                    }
                }).catch(function (error) {
                    $scope.loadingCampaigns = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.deleteCampaignPrompt = function(campaign) {
            $ngConfirm({
                title: 'Delete campaign',
                contentUrl: 'app/pages/services/rewardsService/rewardsServiceCampaigns/deleteCampaignPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Delete",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText === 'DELETE'){
                                scope.deleteCampaign(campaign.id);
                            } else {
                                toastr.error('DELETE text did not match.');
                            }
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deleteCampaign = function (campaignId) {
            if(vm.token) {
                $scope.loadingCampaigns = true;
                $http.delete(vm.serviceUrl + 'admin/campaigns/' + campaignId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Reward campaign has been successfully deleted');
                        $scope.getCampaignList();
                    }
                }).catch(function (error) {
                    $scope.loadingCampaigns =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditCampaignView = function (campaign) {
            // $location.path('/services/rewards/campaigns/' + campaign.id + '/edit');
            $location.path('/extensions/rewards/campaigns/' + campaign.id + '/edit');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getCampaignList();
            })
            .catch(function(err){
                $scope.loadingCampaigns = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
