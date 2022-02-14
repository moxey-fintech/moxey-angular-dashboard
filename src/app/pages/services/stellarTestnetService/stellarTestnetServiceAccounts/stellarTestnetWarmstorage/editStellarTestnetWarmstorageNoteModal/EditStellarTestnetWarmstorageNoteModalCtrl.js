(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('EditStellarTestnetWarmstorageNoteModalCtrl', EditStellarTestnetWarmstorageNoteModalCtrl);

    function EditStellarTestnetWarmstorageNoteModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler, primaryAccount,$location,extensionsHelper) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = null;
        var serviceName = "stellar_testnet_service";
        $scope.primaryWarmstorageAccount = primaryAccount;
        $scope.updatingNote = true;

        $scope.trackNoteLength = function(){
            if($scope.primaryWarmstorageAccount.note.length > 100){
                toastr.error("Maximum length of 100 characters exceeded.");
            }
        };

        $scope.updateWarmstorageAccountNote = function () {
            $scope.updatingNote = true;
            $http.patch(vm.serviceUrl + 'admin/warmstorage/accounts/' + $scope.primaryWarmstorageAccount.id + '/', {note: $scope.primaryWarmstorageAccount.note}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.updatingNote = false;
                toastr.success('Warmstorage note successfully updated.');
                $uibModalInstance.close("note_updated");
            }).catch(function (error) {
                $scope.updatingNote = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.updatingNote = false;
            })
            .catch(function(err){
                $scope.updatingNote = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
                $uibModalInstance.close(true);
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();