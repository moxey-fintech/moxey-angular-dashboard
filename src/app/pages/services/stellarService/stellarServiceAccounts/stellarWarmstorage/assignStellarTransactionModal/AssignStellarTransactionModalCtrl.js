(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .controller('AssignStellarTransactionModalCtrl', AssignStellarTransactionModalCtrl);

    function AssignStellarTransactionModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler,typeaheadService,transaction,extensionsHelper) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = null;
        var serviceName = "stellar_service";
        $scope.unassignedTransaction = transaction;
        $scope.assigningTransaction = true;
        $scope.assignmentOptions = ['Incorrect memo', 'No memo', 'Other'];
        $scope.assignTransactionParams = {
            user: null,
            reason_for_assigning: '',
            option_selected: null
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.trackReasonForAssigning = function(){
            if($scope.assignTransactionParams.reason_for_assigning.length > 255){
                toastr.error('Reason for assignment exceeds max limit of 255 characters.');
            }
        };

        $scope.trackAssignmentReason = function(){
            if($scope.assignTransactionParams.option_selected && $scope.assignTransactionParams.option_selected !== 'Other'){
                $scope.assignTransactionParams.reason_for_assigning = $scope.assignTransactionParams.option_selected;
            }
            else {
                $scope.assignTransactionParams.reason_for_assigning = '';
            }
        };

        $scope.assignTransaction = function () {
            if(!$scope.assignTransactionParams.option_selected || $scope.assignTransactionParams.reason_for_assigning.length == 0){
                toastr.error('Please provide a reason for assigning this transaction.');
                return;
            }
            else if($scope.assignTransactionParams.reason_for_assigning.length > 255){
                toastr.error('Reason for assignment exceeds max limit of 255 characters.');
                return;
            }
            var assignmentParams = {
                user: $scope.assignTransactionParams.user,
                reason_for_assigning: $scope.assignTransactionParams.reason_for_assigning
            };

            if(vm.token){
                $scope.assigningTransaction = true;
                $http.patch(vm.serviceUrl + 'admin/transactions/' + $scope.unassignedTransaction.id + '/', assignmentParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.assigningTransaction = false;
                    toastr.success('Transaction successfully assigned.');
                    $uibModalInstance.close(res.data);
                }).catch(function (error) {
                    $scope.assigningTransaction = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
                .then(function(serviceUrl){
                    vm.serviceUrl = serviceUrl;
                    $scope.assigningTransaction = false;
                })
                .catch(function(err){
                    $scope.assigningTransaction = false;
                    toastr.error("Extension not activated for company");
                    $uibModalInstance.close(null);
                });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
