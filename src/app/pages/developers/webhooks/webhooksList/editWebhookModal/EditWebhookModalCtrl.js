(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.list')
        .controller('EditWebhookModalCtrl', EditWebhookModalCtrl);

    /** @ngInject */
    function EditWebhookModalCtrl($scope,$uibModalInstance,toastr,$filter,webhook,
                                  Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.editWebhook = {};
        vm.updatedWebhook = {};
        $scope.editingWebhook = false;

        vm.eventOptionsObj = {
            USER_CREATE: 'user.create',
            USER_UPDATE: 'user.update',
            USER_PASSWORD_RESET: 'user.password.reset',
            USER_PASSWORD_SET: 'user.password.set',
            USER_EMAIL_VERIFY: 'user.email.verify',
            USER_EMAIL_CREATE: 'email.create',
            USER_EMAIL_UPDATE: 'email.update',
            USER_MOBILE_VERIFY: 'user.mobile.verify',
            USER_MOBILE_CREATE: 'mobile.create',
            USER_MOBILE_UPDATE: 'mobile.update',
            USER_MFA_SMS_VERIFY: 'mfa.sms.verify',
            ADDRESS_CREATE: 'address.create',
            ADDRESS_UPDATE: 'address.update',
            DOCUMENT_CREATE: 'document.create',
            DOCUMENT_UPDATE: 'document.update',
            BANK_ACCOUNT_CREATE: 'bank_account.create',
            BANK_ACCOUNT_UPDATE: 'bank_account.update',
            CRYPTO_ACCOUNT_CREATE: 'crypto_account.create',
            CRYPTO_ACCOUNT_UPDATE: 'crypto_account.update',
            TRANSACTION_CREATE: 'transaction.create',
            TRANSACTION_UPDATE: 'transaction.update',
            TRANSACTION_DELETE: 'transaction.delete',
            TRANSACTION_INITIATE: 'transaction.initiate',
            TRANSACTION_EXECUTE: 'transaction.execute'
        };

        $scope.eventOptions = ['User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Email Create','User Email Update',
            'User Mobile Verify','User Mobile Create','User Mobile Update', 'User Mfa Sms Verify',
            'Address Create','Address Update','Document Create','Document Update', 'Bank Account Create','Bank Account Update',
            'Crypto Account Create','Crypto Account Update','Transaction Create','Transaction Update','Transaction Delete',
            'Transaction Initiate','Transaction Execute'];

        vm.getCorrectedWebhookEvent = function(event){
            var correctedEvent = "";
            switch(event){
                case 'email.create': 
                    correctedEvent = 'User Email Create';
                    break; 
                case 'email.update':
                    correctedEvent = 'User Email Update';
                    break;
                case 'mobile.create':
                    correctedEvent = 'User Mobile Create';
                    break;
                case 'mobile.update':
                    correctedEvent = 'User Mobile Update';
                    break;
                case 'mfa.sms.verify':
                    correctedEvent = 'User Mfa Sms Verify';
                    break;
                default: 
                    correctedEvent = $filter('capitalizeUnderscoredSentence')($filter('capitalizeDottedSentence')(event));
            };
            return correctedEvent;
        };

        vm.getWebhook = function () {
            $scope.editingWebhook = true;
            Rehive.admin.webhooks.get({id: webhook.id}).then(function (res) {
                $scope.editWebhook = res;
                $scope.editWebhook.event = vm.getCorrectedWebhookEvent(res.event);
                $scope.editingWebhook = false;
                $scope.$apply();
            }, function (error) {
                $scope.editingWebhook = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);

            });
        };
        vm.getWebhook();

        $scope.webhookChanged = function(field){
            vm.updatedWebhook[field] = $scope.editWebhook[field];
        };

        $scope.updateWebhook = function () {
            $scope.editingWebhook = true;
            if(vm.updatedWebhook.event){
                var event = vm.updatedWebhook.event.toUpperCase();
                event = event.replace(/ /g, '_');
                vm.updatedWebhook.event = vm.eventOptionsObj[event];
            }
            Rehive.admin.webhooks.update($scope.editWebhook.id, vm.updatedWebhook).then(function (res) {
                $scope.editingWebhook = false;
                vm.updatedWebhook = {};
                toastr.success('You have successfully updated the webhook');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.editingWebhook = false;
                vm.updatedWebhook = {};
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };


    }
})();
