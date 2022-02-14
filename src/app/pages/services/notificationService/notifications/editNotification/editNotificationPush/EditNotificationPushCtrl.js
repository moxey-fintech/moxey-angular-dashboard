(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotification.push')
        .controller('EditNotificationPushCtrl', EditNotificationPushCtrl);

    /** @ngInject */
    function EditNotificationPushCtrl($scope,$http,localStorageManagement,notificationHtmlTags,$state,
                                     extensionsHelper,$filter,errorHandler,$location,$stateParams,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        vm.updatedNotification = {};
        $scope.loadingNotifications = true;
        $scope.editNotificationPush = {
            enabled: false,
            preference_enabled: false
        };
        $scope.pushTags = {
            tags: []
        };
        $scope.editorEnabled= false;

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

        $scope.eventOptions = ['','User Create','User Update','User Password Reset','User Password Set',
            'User Email Verify','User Email Create','User Email Update', 'User MFA SMS Verify',
            'User Mobile Verify','User Mobile Create','User Mobile Update', 
            'Address Create','Address Update','Document Create',
            'Document Update', 'Bank Account Create','Bank Account Update','Crypto Account Create',
            'Crypto Account Update', 'Transaction Create','Transaction Update','Transaction Delete',
            'Transaction Initiate','Transaction Execute'];
        $scope.eventOptions.sort();


        $scope.editNotificationPushEditorOptions = {
            lineWrapping : true,
            lineNumbers: true,
            theme: 'monokai',
            autoCloseTags: true,
            smartIndent: false,
            extraKeys: {
                "Ctrl-Space": "autocomplete"
            },
            mode: 'xml'
        };

        $scope.enableEditor = function() {
            //used to refresh the codemirror element to display latest ng-model
            $scope.editorEnabled = true;
        };

        vm.getSingleNotification = function () {
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/notifications/' + $stateParams.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingNotifications =  false;
                    if (res.status === 200 || res.status === 201) {
                        var notificationObj = res.data.data;
                        if(notificationObj.event){
                            notificationObj.event = $filter('capitalizeDottedSentence')(notificationObj.event);
                            notificationObj.event = $filter('capitalizeUnderscoredSentence')(notificationObj.event);
                        }

                        $scope.editNotificationPush = {
                            id: notificationObj.id,
                            name: notificationObj.name,
                            description: notificationObj.description,
                            subject: notificationObj.subject,
                            event: notificationObj.event === 'MFA SMS Verify' ? 'User MFA SMS Verify' : notificationObj.event,
                            push_message: notificationObj.push_message,
                            to_user: notificationObj.to_user,
                            expression: notificationObj.expression,
                            enabled: notificationObj.enabled,
                            preference_enabled: notificationObj.preference_enabled
                        };
                        $scope.enableEditor();
                        $scope.pushEditEventOptionChanged(notificationObj.event);
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.pushEditEventOptionChanged = function (event) {
            var newTagsArray = notificationHtmlTags.getNotificationHtmlTags(event);
            $scope.pushTags.tags.splice(0,$scope.pushTags.tags.length);
            newTagsArray.forEach(function (element) {
                $scope.pushTags.tags.push(element);
            });
        };

        $scope.goToNotificationListView = function () {
            // $location.path('/services/notifications/list').search({type: 'push'});
            $location.path('/extensions/notifications/list').search({type: 'push'});
        };

        $scope.notificationChanged = function (field) {
            if($scope.editNotificationPush.expression && $scope.editNotificationPush.expression.length > 250){
                toastr.error('Expression cannot exceed 250 characters');
            }

            // if(field == 'name'){
            //     $scope.editNotificationPush.name = $scope.editNotificationPush.name.toLowerCase();
            // }
            if(field == 'event'){
                $scope.pushEditEventOptionChanged($scope.editNotificationPush.event);
            }

            vm.updatedNotification[field] = $scope.editNotificationPush[field];
        };

        $scope.updateNotification = function (option) {
            $scope.loadingNotifications =  true;
            if(vm.updatedNotification.event){
                var event = vm.updatedNotification.event.toUpperCase();
                event = event.replace(/ /g, '_');
                vm.updatedNotification.event = vm.eventOptionsObj[event];
            }

            vm.updatedNotification.type = 'push';

            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/notifications/' + $scope.editNotificationPush.id + '/',vm.updatedNotification, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        toastr.success('Notification updated successfully');
                        if(option){
                            $scope.loadingNotifications =  false;
                            if(option == 'add'){ $state.go('notificationService.createNotification.push', {}, {reload: true}) ;}
                        }
                        else {
                            // $location.path('/services/notifications/list').search({type: 'push'});
                            $location.path('/extensions/notifications/list').search({type: 'push'});
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                vm.getSingleNotification();
            })
            .catch(function(err){
                $scope.loadingNotifications = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
