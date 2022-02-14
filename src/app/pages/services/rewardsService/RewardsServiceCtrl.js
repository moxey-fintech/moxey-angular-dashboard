(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService')
        .controller('RewardsServiceCtrl', RewardsServiceCtrl);

    /** @ngInject */
    function RewardsServiceCtrl($scope,$rootScope,$http,localStorageManagement,$location,$uibModal,errorHandler,toastr,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "rewards_service";
        // $rootScope.dashboardTitle = 'Rewards service | Moxey';
        $rootScope.dashboardTitle = 'Rewards extension | Moxey';
        $scope.loadingCampaigns =  true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.$on('$locationChangeStart', function (event,newUrl) {
            vm.location = $location.path();
            if(vm.location.indexOf('campaigns') > 0){
                $scope.locationIndicator = 'campaigns';
            } else if(vm.location.indexOf('requests') > 0){
                $scope.locationIndicator = 'requests';
            }
            vm.locationTracker(vm.location);
        });

        vm.locationTracker = function (location) {
            // var baseLocation = '/services/rewards/';
            var baseLocation = '/extensions/rewards/';
            var remainingLocation = location.split(baseLocation).pop();
            var remainingLocationArray = remainingLocation.split('/');

            if(remainingLocationArray[0] == 'campaigns'){
                $scope.trackedLocation = 'campaigns';
                if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'create'){
                    $scope.secondaryTrackedLocation = 'create';
                } else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'edit'){
                    $scope.secondaryTrackedLocation = 'edit';
                } else {
                    $scope.secondaryTrackedLocation = '';
                }
            } else if (remainingLocationArray[0] == 'list'){
                $scope.trackedLocation = 'list';
                $scope.secondaryTrackedLocation = '';
            } else if (remainingLocationArray[0] == 'settings'){
                $scope.trackedLocation = 'settings';
                $scope.secondaryTrackedLocation = '';
            }

            // else if (remainingLocationArray[1] == 'accounts'){
            //     $scope.trackedLocation = 'accounts';
            //     $scope.secondaryTrackedLocation = '';
            // } else if (remainingLocationArray[1] == 'transactions'){
            //     $scope.trackedLocation = 'transactions';
            //     $scope.secondaryTrackedLocation = '';
            // } else if (remainingLocationArray[1] == 'permissions'){
            //     $scope.trackedLocation = 'permissions';
            //     $scope.secondaryTrackedLocation = '';
            // } else if(remainingLocationArray[1] == 'account'){
            //     $scope.locationIndicator = 'accounts';
            //     $scope.trackedLocation = 'account';
            //     $scope.secondaryTrackedLocation = '';
            //     if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'limits'){
            //         $scope.secondaryTrackedLocation = 'limits';
            //     } else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'fees'){
            //         $scope.secondaryTrackedLocation = 'fees';
            //     }else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'settings'){
            //         $scope.secondaryTrackedLocation = 'settings';
            //     }
            // }
        };
        
        $scope.goToRewardsBreadCrumbsView = function (path) {
            $location.path(path);
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.locationTracker(vm.location);
                $scope.loadingCampaigns = false;
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
