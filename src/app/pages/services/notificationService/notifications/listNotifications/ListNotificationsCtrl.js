(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications')
        .controller('ListNotificationsCtrl', ListNotificationsCtrl);

    /** @ngInject */
    function ListNotificationsCtrl($rootScope, $scope,$http,localStorageManagement,$uibModal,errorHandler,
                                   $ngConfirm,$location,_,toastr,$filter,$timeout,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        vm.notificationIdArray = [];
        // $rootScope.dashboardTitle = 'Notification service | Moxey';
        $rootScope.dashboardTitle = 'Notification extension | Moxey';
        $scope.allNotifications = {
            allActions: false
        };
        $scope.pushEnabled = false;
        $scope.loadingNotifications = true;
        $scope.showingActionsBox = false;
        $scope.filtersCount = 0;
        vm.listParams = $location.search();
        $scope.showingFilters = false;
        $scope.selectedAction = 'Enable';
        $scope.actionOptions = ['Enable', 'Disable', 'Delete'];
        $scope.eventOptions = ['','User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Email Create','User Email Update',
            'User Mobile Verify','User Mobile Create','User Mobile Update',  'User MFA SMS Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];

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

        $scope.pagination = {
            itemsPerPage: 30,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            nameFilter: false,
            eventFilter: false
        };
        $scope.applyFiltersObj = {
            nameFilter: {
                selectedName: ''
            },
            eventFilter: {
                selectedEvent: ''
            }
        };
        if(vm.listParams.type == 'email'){
            $scope.listNotificationType = 'email';
            $location.search({type: null});
        } else if(vm.listParams.type == 'sms'){
            $scope.listNotificationType = 'sms';
            $location.search({type: null});
            $location.search();
        } else if(vm.listParams.type == 'push'){
            $scope.listNotificationType = 'push';
            $location.search({type: null});
            $location.search();
        } else {
            $scope.listNotificationType = 'email';
        }

        $scope.showActionsBox = function () {
            $scope.showingFilters = false;
            $scope.showingActionsBox = true;
        };

        $scope.closeActionsBox = function () {
            $scope.showingActionsBox = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                nameFilter: false,
                eventFilter: false
            };
            $scope.showFilters();
            $scope.getNotificationsList('applyfilter');
        };

        $scope.showFilters = function () {
            $scope.showingFilters = false;
            $scope.showingFilters = !$scope.showingFilters;
        };

        vm.getCompanyDetails = function () {
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    // $scope.company = res.data.data;
                    $scope.pushEnabled = res.data.data.push_enabled !== undefined ? res.data.data.push_enabled : false;
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToListNotificationType = function (path) {
            $scope.listNotificationType = path;
            vm.notificationIdArray = [];
            $scope.allNotifications = { allActions: false };
            $scope.showingFilters = false;
            $scope.showingActionsBox = false;
            $scope.clearFilters();
            $scope.getNotificationsList();
        };

        vm.getNotificationListUrl = function(){
            var event = '';
            if($scope.filtersObj.eventFilter){
                event = $scope.applyFiltersObj.eventFilter.selectedEvent.toUpperCase();
                event = event.replace(/ /g, '_');
                event = vm.eventOptionsObj[event];
            }

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage +
                '&type=' + $scope.listNotificationType +
                ($scope.filtersObj.nameFilter ? '&name=' + $scope.applyFiltersObj.nameFilter.selectedName : '') +
                ($scope.filtersObj.eventFilter ? '&event=' + event : ''); // all the params of the filtering

            return vm.baseUrl + 'admin/notifications/' + vm.filterParams;
        };

        $scope.getNotificationsList = function (applyFilter) {            
            $scope.showingFilters = false;
            $scope.notificationsList = [];

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.notificationsList.length > 0) {
                $scope.notificationsList.length = 0;
            }

            var notificationListUrl = vm.getNotificationListUrl();

            if(vm.token) {
                $scope.loadingNotifications = true;
                $http.get(notificationListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.notificationsListData = res.data.data;
                        $scope.notificationsList = res.data.data.results;
                        $scope.notificationsList.forEach(function (notification) {
                            notification.action = false;
                            if(notification.event === 'mfa.sms.verify'){
                                 notification.event = 'user.mfa.sms.verify';
                            }
                            notification.event = $filter('capitalizeUnderscoredSentence')($filter('capitalizeDottedSentence')(notification.event));
                            if(notification.event && notification.event.indexOf('Mfa') > -1){
                                notification.event = notification.event.replace(/Mfa/g, 'MFA');
                                notification.event = notification.event.replace(/Sms/g, 'SMS');
                            }
                        });
                    }
                    $scope.loadingNotifications =  false;
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.filterNotifications = function (keywords) {
            return function(notif) {
                var event = '';
                if(notif.event){
                    event = $filter('capitalizeDottedSentence')(notif.event);
                    event = $filter('capitalizeUnderscoredSentence')(event);
                } else {
                    event = 'Misc';
                }

                return event.indexOf(keywords) > -1;
                // if(event.indexOf(keywords) > -1) {
                //     return true;
                // } else {
                //     return false;
                // }
            };
        };

        $scope.toggleAllNotificationsActions = function () {
            $scope.notificationsList.forEach(function (notification) {
                notification.action = $scope.allNotifications.allActions;
                $scope.toggleNotificationAction(notification);
            });
        };

        vm.findIndexOfNotification = function(element){
            return this.id == element.id;
        };

        $scope.toggleNotificationAction = function (notification) {
            if(notification.action){
                var index = vm.notificationIdArray.findIndex(vm.findIndexOfNotification,notification);
                if(index == -1){
                    vm.notificationIdArray.push(notification);
                }

                if(vm.notificationIdArray.length == $scope.notificationsList.length){
                    $scope.allNotifications.allActions = true;
                }
            } else {

                var delIndex = vm.notificationIdArray.findIndex(vm.findIndexOfNotification,notification);
                vm.notificationIdArray.splice(delIndex,1);
                if(vm.notificationIdArray.length < $scope.notificationsList.length){
                    $scope.allNotifications.allActions = false;
                }
            }
        };

        $scope.notificationActionConfirm = function (actionType) {
            $ngConfirm({
                title: 'Confirm action',
                content: 'Are you sure you want to ' + actionType.toLowerCase() + ' the selected notifications?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            vm.executeAction();
                        }
                    }
                }
            });
        };

        vm.executeAction = function () {
            $scope.showingActionsBox = false;
            $scope.allNotifications = {
                allActions: false
            };

            if($scope.selectedAction.toLowerCase() == 'enable'){
                vm.notificationIdArray.forEach(function (element,index,array) {
                    element.enabled = true;
                    element.action = false;
                    if(index == (array.length -1)){
                        $scope.toggleNotificationStatus(element,'last');
                        return false;
                    }
                    $scope.toggleNotificationStatus(element);

                });
            } else if($scope.selectedAction.toLowerCase() == 'disable'){
                vm.notificationIdArray.forEach(function (element,index,array) {
                    element.enabled = false;
                    element.action = false;
                    if(index == (array.length -1)){
                        $scope.toggleNotificationStatus(element,'last');
                        return false;
                    }
                    $scope.toggleNotificationStatus(element);

                });
            } else if($scope.selectedAction.toLowerCase() == 'delete'){
                vm.notificationIdArray.forEach(function (element,index,array) {
                    element.action = false;
                    if(index == (array.length -1)){
                        $scope.deleteNotificationFromAction(element,'last');
                        return false;
                    }
                    $scope.deleteNotificationFromAction(element);

                });
            }
        };

        $scope.toggleNotificationStatus = function (notification,last) {
            if(vm.token) {
                $scope.loadingNotifications = true;
                $http.patch(vm.baseUrl + 'admin/notifications/' + notification.id + '/',{enabled: notification.enabled,type: notification.type}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last) {
                        $timeout(function () {
                            vm.notificationIdArray = [];
                            toastr.success('Notification updated successfully');
                            $scope.getNotificationsList();
                        },600);
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.deleteNotificationFromAction = function (notification,last) {
            $scope.loadingNotifications = true;
            $http.delete(vm.baseUrl + 'admin/notifications/' + notification.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if(last){
                    $timeout(function () {
                        vm.notificationIdArray = [];
                        toastr.success('Notifications successfully deleted');
                        $scope.getNotificationsList();
                    },600);
                }
            }).catch(function (error) {
                $scope.loadingNotifications = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openNotificationModal = function (page, size,notification) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NotificationModalCtrl',
                scope: $scope,
                resolve: {
                    notification: function () {
                        return notification;
                    }
                }
            });

            vm.theModal.result.then(function(notification){
                if(notification){
                    $scope.getNotificationsList();
                }
            }, function(){
            });
        };

        $scope.goToCreateNotification = function () {
            // $location.path('/services/notifications/create/' + $scope.listNotificationType);
            $location.path('/extensions/notifications/create/' + $scope.listNotificationType);
        };

        $scope.goToBulkAdd = function () {
            // $location.path('/services/notifications/bulk/add');
            $location.path('/extensions/notifications/bulk/add');
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.getNotificationsList();
                vm.getCompanyDetails();
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
