(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.list')
        .controller('AddWebhookModalCtrl', AddWebhookModalCtrl);

    /** @ngInject */
    function AddWebhookModalCtrl($scope,$uibModalInstance,toastr,webhookUrl,
                                 Rehive,secret,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingWebhook = false;

        $scope.webhooksParams = {
            event: 'User Create',
            secret: secret || '',
            url: webhookUrl || '',
            condition: ''
        };

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

        $scope.addWebhooks = function (webhooksParams) {
            $scope.addingWebhook = true;

            var event;
            event = webhooksParams.event.toUpperCase();
            event = event.replace(/ /g, '_');
            webhooksParams.event = vm.eventOptionsObj[event];

            Rehive.admin.webhooks.create(webhooksParams).then(function (res) {
                $scope.addingWebhook = false;
                toastr.success('You have successfully added the webhook');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.webhooksParams = {event: 'User Create'};
                $scope.addingWebhook = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
