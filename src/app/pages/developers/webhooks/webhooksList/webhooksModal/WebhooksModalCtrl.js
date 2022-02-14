(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.list')
        .controller('WebhooksModalCtrl', WebhooksModalCtrl);

    function WebhooksModalCtrl($scope,Rehive,$uibModalInstance,webhook,toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.webhook = webhook;
        $scope.deletingWebhook = false;
        vm.token = localStorageManagement.getValue('token');

        $scope.deleteWebhook = function () {
            $scope.deletingWebhook = true;
            Rehive.admin.webhooks.delete($scope.webhook.id).then(function (res) {
                $scope.deletingWebhook = false;
                toastr.success('Webhook successfully deleted');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.deletingWebhook = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
