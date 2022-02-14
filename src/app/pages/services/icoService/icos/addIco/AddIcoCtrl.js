(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.addIco')
        .controller('AddIcoCtrl', AddIcoCtrl);

    /** @ngInject */
    function AddIcoCtrl($scope,$http,localStorageManagement,errorHandler,$location,toastr,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.creatingIco = false;
        $scope.icoParams = {
            currency: {},
            amount: '',
            exchange_provider: '',
            base_currency: '',
            base_goal_amount: '',
            min_purchase_amount: '',
            max_purchase_amount: '',
            max_purchases: '',
            public: false,
            status: 'Hidden'
        };
        $scope.icoStatusOptions = ['Hidden','Open','Closed'];

        $scope.getCurrenciesList = function () {
            $scope.creatingIco =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.creatingIco =  false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.currenciesList = res.data.data.results;
                        $scope.icoParams.currency = res.data.data.results[0];
                        $scope.icoParams.base_currency = res.data.data.results[1];
                    }
                }).catch(function (error) {
                    $scope.creatingIco =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getCurrenciesList();

        $scope.addIco = function () {

            var addIcoObj = {
                currency: $scope.icoParams.currency.code,
                amount: '',
                exchange_provider: $scope.icoParams.exchange_provider,
                base_currency: $scope.icoParams.base_currency.code,
                base_goal_amount: '',
                min_purchase_amount: 0,
                max_purchase_amount: 0,
                max_purchases: $scope.icoParams.max_purchases || 10,
                public: $scope.icoParams.public,
                status: $scope.icoParams.status.toLowerCase()
            };


            if($scope.icoParams.amount){
                if(currencyModifiers.validateCurrency($scope.icoParams.amount,$scope.icoParams.currency.divisibility)){
                    addIcoObj.amount = currencyModifiers.convertToCents($scope.icoParams.amount,$scope.icoParams.currency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.icoParams.currency.divisibility + ' decimal places');
                    return;
                }
            }

            if($scope.icoParams.min_purchase_amount){
                if(currencyModifiers.validateCurrency($scope.icoParams.min_purchase_amount,$scope.icoParams.currency.divisibility)){
                    addIcoObj.min_purchase_amount = currencyModifiers.convertToCents($scope.icoParams.min_purchase_amount,$scope.icoParams.currency.divisibility);
                } else {
                    toastr.error('Please input min purchase amount to ' + $scope.icoParams.currency.divisibility + ' decimal places');
                    return;
                }
            }

            if($scope.icoParams.max_purchase_amount){
                if(currencyModifiers.validateCurrency($scope.icoParams.max_purchase_amount,$scope.icoParams.currency.divisibility)){
                    addIcoObj.max_purchase_amount = currencyModifiers.convertToCents($scope.icoParams.max_purchase_amount,$scope.icoParams.currency.divisibility);
                } else {
                    toastr.error('Please input max purchase amount to ' + $scope.icoParams.currency.divisibility + ' decimal places');
                    return;
                }
            }

            if($scope.icoParams.base_goal_amount){
                if(currencyModifiers.validateCurrency($scope.icoParams.base_goal_amount,$scope.icoParams.base_currency.divisibility)){
                    addIcoObj.base_goal_amount = currencyModifiers.convertToCents($scope.icoParams.base_goal_amount,$scope.icoParams.base_currency.divisibility);
                } else {
                    toastr.error('Please input base goal amount to ' + $scope.icoParams.base_currency.divisibility + ' decimal places');
                    return;
                }
            }

            $scope.creatingIco = true;
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/icos/',addIcoObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.creatingIco =  false;
                    if (res.status === 201 || res.status === 200) {
                        toastr.success('Ico added successfully');
                        // $location.path('/services/ico/list');
                        $location.path('/extensions/ico/list');
                    }
                }).catch(function (error) {
                    $scope.creatingIco =  false;
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
