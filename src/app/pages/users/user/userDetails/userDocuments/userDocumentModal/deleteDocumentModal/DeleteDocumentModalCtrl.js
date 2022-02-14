(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('DeleteDocumentModalCtrl', DeleteDocumentModalCtrl);

    function DeleteDocumentModalCtrl($scope,Rehive,$uibModalInstance,toastr,
                                     document,$ngConfirm,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.document = document;
        vm.token = localStorageManagement.getValue('token');
        $scope.deletingDocument = false;

        $scope.archiveDocument = function (deleteDocument) {
            $scope.deletingDocument = true;

            var formData = new FormData();

            formData.append('archived', true);

            Rehive.admin.users.documents.update($scope.document.id, formData).then(function (res) {
                if(deleteDocument){
                    $scope.deleteDocument();
                    $scope.$apply();
                } else {
                    $scope.deletingDocument = false;
                    toastr.success('Document successfully archived');
                    $uibModalInstance.close({success: true, dontReload: true});
                    $scope.$apply();
                }
            }, function (error) {
                $scope.deletingDocument = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteDocumentPrompt = function () {
            $ngConfirm({
                title: 'Delete document',
                contentUrl: 'app/pages/users/user/userDetails/userDocuments/userDocumentModal/deleteDocumentModal/deleteDocumentModalPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger delete-button',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            if(!$scope.document.archived){
                                $scope.archiveDocument('deleteDocument');
                            } else {
                                scope.deleteDocument();
                            }
                        }
                    }
                }
            });
        };

        $scope.deleteDocument = function () {
            $scope.deletingDocument = true;
            Rehive.admin.users.documents.delete($scope.document.id).then(function (res) {
                $scope.deletingDocument = false;
                toastr.success('Document successfully deleted');
                $uibModalInstance.close({success: true, dontReload: true});
                $scope.$apply();
            }, function (error) {
                $scope.deletingDocument = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
