(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRewards')
        .controller('RewardUserModalCtrl', RewardUserModalCtrl);

    function RewardUserModalCtrl($scope,environmentConfig,$uibModalInstance,typeaheadService,currencyModifiers,
                                 toastr,$http,localStorageManagement,serializeFiltersService,errorHandler,$location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "rewards_service";
        // vm.serviceUrl = "https://reward.services.rehive.io/api/";
        $scope.campaignsListOptions = [];
        $scope.rewardUserObj = {
            campaign: {},
            status: 'Accepted',
            amount: null,
            currency: {}
        };
        $scope.rewardingUser = true;
        $scope.statusOptions = ['Accepted','Rejected','Pending'];
        $scope.typeOptions = ['Request', 'Manual' , 'External'];

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.getCampaignList = function () {
            if(vm.token) {
                $scope.rewardingUser =  true;

                $http.get(vm.serviceUrl + 'admin/campaigns/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(res.data.data.results.length > 0){
                            res.data.data.results.unshift({name: 'No campaign selected'});
                            $scope.rewardUserObj.campaign = res.data.data.results[0];
                            $scope.campaignsListOptions = res.data.data.results;
                        }

                        vm.getCompanyCurrencies();
                    }
                }).catch(function (error) {
                    $scope.rewardingUser =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };       

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + 'admin/currencies/?archived=false&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(res.data.data.results.length > 0){
                            $scope.currencyOptions = res.data.data.results;
                        }

                        $scope.rewardingUser =  false;
                    }
                }).catch(function (error) {
                    $scope.rewardingUser =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.findUserObj = function (user) {
            $scope.rewardingUser = true;
            $http.get(environmentConfig.API + 'admin/users/?user=' + encodeURIComponent(user), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    if(res.data.data.results.length == 1){
                        vm.rewardUserFunc(res.data.data.results[0]);
                    }
                }
            }).catch(function (error) {
                $scope.rewardingUser = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.rewardUserFunc = function (user) {
            var rewardObj = {
                campaign: $scope.rewardUserObj.campaign ? ($scope.rewardUserObj.campaign.id ? $scope.rewardUserObj.campaign.id : null) : null,
                user: user.id,
                amount: $scope.rewardUserObj.amount || null,
                currency: $scope.rewardUserObj.currency ? ($scope.rewardUserObj.currency.code ? $scope.rewardUserObj.currency.code : null) : null,
                status: $scope.rewardUserObj.status ? $scope.rewardUserObj.status.toLowerCase() : null
            };

            if($scope.rewardUserObj.campaign && $scope.rewardUserObj.campaign.id && $scope.rewardUserObj.amount){
                rewardObj.amount = currencyModifiers.convertToCents($scope.rewardUserObj.amount,$scope.rewardUserObj.campaign.currency.divisibility);
            } else {
                rewardObj.amount = currencyModifiers.convertToCents($scope.rewardUserObj.amount,$scope.rewardUserObj.currency.divisibility);
            }

            rewardObj = serializeFiltersService.objectFilters(rewardObj);

            $http.post(vm.serviceUrl + 'admin/rewards/',rewardObj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.rewardingUser = false;
                if (res.status === 201 || res.status === 200) {
                    toastr.success('User has been rewarded successfully');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.rewardingUser = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getCampaignList();
            })
            .catch(function(err){
                $scope.rewardingUser = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);


    }
})();