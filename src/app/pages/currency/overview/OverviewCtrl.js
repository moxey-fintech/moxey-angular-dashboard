(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.overview')
        .controller('OverviewCtrl', OverviewCtrl);

    /** @ngInject */
    function OverviewCtrl($scope,$location,$stateParams,localStorageManagement,$window,Rehive,currenciesList,errorHandler,$uibModal,Upload,environmentConfig,serializeFiltersService,$timeout,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.currencyCode = $stateParams.currencyCode;
        $scope.currencyIconUrl = "";
        $scope.hasIcon = false;
        $scope.updatingIcon = false;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.loadingCurrencies = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.currencyOptions = [];
        $scope.imageFile = {
            iconFile: {}
        };

        vm.getAllCompanyCurrencies = function () {
            Rehive.admin.currencies.get({filters: {
                page:1,
                page_size: 250,
                archived: false
            }}).then(function (res) {
                if($scope.currencyOptions.length > 0){
                    $scope.currencyOptions.length = 0;
                }
                $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                $scope.currencyOptions = res.results.slice();
                $scope.currencyOptions.sort(function(a, b){
                    return a.code.localeCompare(b.code);
                });
                $scope.currencyOptions.sort(function(a, b){
                    return a.unit.localeCompare(b.unit);
                });
                $scope.currencyOptions.forEach(function (element) {
                    if(element.code == $scope.currencyCode){
                        if(element.icon !== null && element.icon !== ""){$scope.currencyIconUrl = element.icon; $scope.hasIcon = true;}
                        $scope.currencyObj = element;
                    }
                });
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getAllCompanyCurrencies();

        vm.getCurrencyOverview = function () {
            if(vm.token) {
                $scope.loadingCurrencies = true;
                Rehive.admin.currencies.overview.get($scope.currencyCode).then(function (res) {
                    $scope.currencyOverviewData = res;
                    $scope.loadingCurrencies = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCurrencyOverview();

        $scope.upload = function () {
            if (!$scope.imageFile.iconFile.name) {
                return;
            }
            $scope.updatingIcon = true;

            var uploadDataObj = {
                icon: $scope.imageFile.iconFile.name ? $scope.imageFile.iconFile: null
            };

            Upload.upload({
                url: environmentConfig.API +'admin/currencies/' + $scope.currencyCode + '/',
                data: serializeFiltersService.objectFilters(uploadDataObj),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "PATCH"
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    $timeout(function(){
                        $scope.currencyIconUrl = res.data.data.icon;
                        $scope.updatingIcon = false;
                    },10);
                    //$window.location.reload();
                }
                toastr.success('Currency icon uploaded successfully.');
            }).catch(function (error) {
                $scope.updatingIcon = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openEditDisplayCodeModal = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditDisplayCodeModalCtrl',
                scope: $scope,
                resolve: {
                    currencyObj: function () {
                        return $scope.currencyObj;
                    }
                }
            });

            vm.theModal.result.then(function(updatedCurrencyObj){
                if(updatedCurrencyObj){
                    $scope.currencyObj = updatedCurrencyObj;
                }
            }, function(){
            });
        };


        vm.getCurrencyOverviewUsersData = function () {
            if(vm.token) {
                $scope.loadingUsers = true;
                Rehive.admin.users.overview.get().then(function (res) {
                    $scope.currencyOverviewUsersData = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUsers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCurrencyOverviewUsersData();

        $scope.goToPath = function (path) {
          $location.path(path);
        };


    }
})();
