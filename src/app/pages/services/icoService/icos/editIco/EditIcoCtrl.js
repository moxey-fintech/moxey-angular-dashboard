(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.editIco')
        .controller('EditIcoCtrl', EditIcoCtrl);

    /** @ngInject */
    function EditIcoCtrl($scope,$http,localStorageManagement,errorHandler,$location,toastr,$stateParams,$filter,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.editIcoObj = {};
        $scope.editingIco = false;
        $scope.icoStatusOptions = ['Hidden','Open','Closed'];

        vm.getIco =  function () {
            $scope.editingIco = true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/icos/' + $stateParams.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingIco =  false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.editIcoObj = res.data.data;
                        $scope.editIcoObj.min_purchase_amount = $filter('currencyModifiersFilter')($scope.editIcoObj.min_purchase_amount,$scope.editIcoObj.currency.divisibility);
                        $scope.editIcoObj.max_purchase_amount = $filter('currencyModifiersFilter')($scope.editIcoObj.max_purchase_amount,$scope.editIcoObj.currency.divisibility);
                        $scope.editIcoObj.status = $filter('capitalizeWord')(res.data.data.status);
                    }
                }).catch(function (error) {
                    $scope.editingIco =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getIco();

        $scope.editIco = function () {
            $scope.editingIco = true;
            var editIcoObj = {
                exchange_provider: $scope.editIcoObj.exchange_provider,
                min_purchase_amount: 0,
                max_purchase_amount: 0,
                max_purchases: $scope.editIcoObj.max_purchases || 10,
                status: $scope.editIcoObj.status.toLowerCase(),
                public: $scope.editIcoObj.public
            };

            if($scope.editIcoObj.min_purchase_amount){
                if(currencyModifiers.validateCurrency($scope.editIcoObj.min_purchase_amount,$scope.editIcoObj.currency.divisibility)){
                    editIcoObj.min_purchase_amount = currencyModifiers.convertToCents($scope.editIcoObj.min_purchase_amount,$scope.editIcoObj.currency.divisibility);
                } else {
                    toastr.error('Please input min purchase amount to ' + $scope.editIcoObj.currency.divisibility + ' decimal places');
                    return;
                }
            }

            if($scope.editIcoObj.max_purchase_amount){
                if(currencyModifiers.validateCurrency($scope.editIcoObj.max_purchase_amount,$scope.editIcoObj.currency.divisibility)){
                    editIcoObj.max_purchase_amount = currencyModifiers.convertToCents($scope.editIcoObj.max_purchase_amount,$scope.editIcoObj.currency.divisibility);
                } else {
                    toastr.error('Please input max purchase amount to ' + $scope.editIcoObj.currency.divisibility + ' decimal places');
                    return;
                }
            }

            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/icos/' + $scope.editIcoObj.id + '/',editIcoObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Ico updated successfully');
                        $scope.editingIco =  false;
                        // $location.path('/services/ico/list');
                        $location.path('/extensions/ico/list');
                    }
                }).catch(function (error) {
                    $scope.editingIco =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToIcoListView = function () {
            $location.path('services/ico/list');
        }


    }
})();
