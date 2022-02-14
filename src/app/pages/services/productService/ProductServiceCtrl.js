(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService')
        .controller('ProductServiceCtrl', ProductServiceCtrl);

    /** @ngInject */
        function ProductServiceCtrl($scope,$rootScope,localStorageManagement,$location,toastr,extensionsHelper,serializeFiltersService,$http,errorHandler,
                                    categoriesHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null; 
        var serviceName = "product_service";
        // vm.baseUrl = "https://product.services.rehive.io/api/";
        // $rootScope.dashboardTitle = 'Products service | Moxey';
        $rootScope.dashboardTitle = 'Products extension | Moxey';
        $scope.loadingCampaigns =  true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.productCategories = [];        

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
            // var baseLocation = '/services/product/';
            var baseLocation = '/extensions/product/';
            var remainingLocation = location.split(baseLocation).pop();

            if(remainingLocation.indexOf('settings') != -1){
                $scope.trackedLocation = 'settings';
            } else if (remainingLocation.indexOf('orders') != -1){
                $scope.trackedLocation = 'orders';
            } else if (remainingLocation.indexOf('order/create') != -1){
                $scope.trackedLocation = 'orders';
            }else if (remainingLocation.indexOf('order/edit') != -1){
                $scope.trackedLocation = 'orders';
            }else if (remainingLocation.indexOf('vouchers') != -1){
                $scope.trackedLocation = 'vouchers';
            } else if (remainingLocation.indexOf('vouchers/create') != -1){
                $scope.trackedLocation = 'vouchers';
            } else if(remainingLocation.indexOf('list') != -1){
                $scope.trackedLocation = 'list';
            } else if (remainingLocation.indexOf('create') != -1){
                $scope.trackedLocation = 'list';
            } else if (remainingLocation.indexOf('edit') != -1){
                $scope.trackedLocation = 'list';
            } else if (remainingLocation.indexOf('categories') != -1){
                $scope.trackedLocation = 'categories';
            } else if (remainingLocation.indexOf('categories/create') != -1){
                $scope.trackedLocation = 'categories';
            } else if (remainingLocation.indexOf('categories/edit') != -1){
                $scope.trackedLocation = 'categories';
            } else if (remainingLocation.indexOf('sellers') != -1){
                $scope.trackedLocation = 'sellers';
            }
        };        

        $scope.goToRewardsBreadCrumbsView = function (path) {
            $location.path(path);
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;                
                categoriesHelper.getProductCategoryList('productCategories', vm.serviceUrl)
                .then(function(res){
                    $scope.productCategories = res;
                    $scope.loadingCampaigns =  false;
                    vm.locationTracker(vm.location);
                })
                .catch(function(err){
                    $scope.loadingCampaigns =  false;
                    toastr.error("Extension not activated for company");
                    $location.path('/extensions');
                })
            })
            .catch(function(err){
                $scope.loadingCampaigns =  false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);

    }
})();
