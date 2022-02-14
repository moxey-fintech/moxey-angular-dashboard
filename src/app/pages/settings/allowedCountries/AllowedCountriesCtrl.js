(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.allowedCountries')
        .controller('AllowedCountriesCtrl', AllowedCountriesCtrl);

    /** @ngInject */
    function AllowedCountriesCtrl($scope,Rehive,localStorageManagement,errorHandler,toastr,$window,countriesList) {
        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingAllowedCountries = false;
        $scope.trackedCountries = [];

        $scope.countries = countriesList;

        $scope.getAllowedCountries = function () {
            if(vm.token) {
                $scope.loadingAllowedCountries = true;
                Rehive.admin.company.settings.get().then(function (res) {
                    vm.checkForAllowedCountries(res.nationalities);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAllowedCountries = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getAllowedCountries();

        vm.checkForAllowedCountries = function (nationalities) {
            nationalities.forEach(function (element) {
                $scope.countries.forEach(function (country,index) {
                    if(country.code == element){
                        $scope.countries[index].enabled = true;
                        $scope.trackedCountries.push($scope.countries[index].code);
                    }
                });
            });
            $scope.loadingAllowedCountries = false;
        };

        $scope.trackAllowedCountries = function (country) {
            var index = $scope.trackedCountries.indexOf(country.code);
            if(index > -1){
                $scope.trackedCountries.splice(index,1);
            } else {
                $scope.trackedCountries.push(country.code);
            }
        };

        $scope.saveAllowedCountries = function () {
            if(vm.token) {
                $scope.loadingAllowedCountries = true;
                Rehive.admin.company.settings.update({nationalities: $scope.trackedCountries}).then(function (res) {
                    $scope.trackedCountries = [];
                    toastr.success('List of allowed countries have been saved');
                    $window.scroll(0,0);
                    $scope.getAllowedCountries();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAllowedCountries = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
