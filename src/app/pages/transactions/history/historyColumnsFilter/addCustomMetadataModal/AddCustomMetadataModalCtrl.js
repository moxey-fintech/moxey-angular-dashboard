(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('AddCustomMetadataModalCtrl', AddCustomMetadataModalCtrl);

    function AddCustomMetadataModalCtrl(Rehive,$uibModalInstance,$scope,errorHandler,toastr,_,
                                        transactionsMetadataColumns,$filter,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingCustomMetadata = false;
        vm.transactionsMetadataColumns = transactionsMetadataColumns.slice();
        $scope.metadataOptions = [];
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedTransactionTableColumns = vm.companyIdentifier + 'transactionsTable';
        $scope.headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns));
        $scope.metadataToAdd = {
            list: []
        };

        vm.initializeMetadataOptions = function () {
            var indexArray = [];
            vm.transactionsMetadataColumns.forEach(function (element,index) {
                $scope.headerColumns.forEach(function (column) {
                    if(column.fieldName == element){
                        indexArray.push(index);
                    }
                });
            });
            indexArray = indexArray.sort(function(a, b){return b-a;});
            indexArray.forEach(function (ind) {
                vm.transactionsMetadataColumns.splice(ind,1);
            });
            $scope.metadataOptions = vm.transactionsMetadataColumns.slice();
        };
        vm.initializeMetadataOptions();

        $scope.metadataInputChanges = function (query) {
            return $filter('filter')($scope.metadataOptions,query);
        };

        $scope.addMetadataColumns = function (metadataToAddArray) {
            var metadataArray = _.map(metadataToAddArray,'text');

            if(metadataArray.length > 0){
                metadataArray.forEach(function (key) {
                    var metadataExists = false;
                    $scope.headerColumns.forEach(function (element) {
                        if(element.fieldName == key){
                            metadataExists = true;
                        }
                    });
                    if(!metadataExists){
                        $scope.headerColumns.push({colName: key,fieldName: key,visible: true,from: 'metadata'});
                    }
                });

                localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
                $uibModalInstance.close(true);
            }
        };


    }
})();
