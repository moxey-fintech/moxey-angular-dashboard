(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceLogs')
        .controller('NotificationServiceLogsCtrl', NotificationServiceLogsCtrl);

    /** @ngInject */
    function NotificationServiceLogsCtrl($rootScope, $scope,$http,localStorageManagement,$uibModal,errorHandler,$location,toastr,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = null; 
        var serviceName = "notifications_service";
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        // $rootScope.dashboardTitle = 'Notification service | Moxey';
        $rootScope.dashboardTitle = 'Notification extension | Moxey';
        $scope.loadingLogs = true;
        $scope.notificationLogs = [];

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getNotificationLogsUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering

            return vm.baseUrl + 'admin/logs/' + vm.filterParams;
        };

        $scope.getNotificationLogs = function () {
            var notificationLogsUrl = vm.getNotificationLogsUrl();

            if(vm.token) {
                $http.get(notificationLogsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingLogs =  false;
                    if (res.status === 200 || res.status === 201) {
                        $scope.notificationLogsData = res.data.data;
                        $scope.notificationLogs = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingLogs =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        
        $scope.openNotificationServiceLogsResendModal = function (page, size,log) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NotificationServiceLogsResendModalCtrl',
                resolve: {
                    log: function () {
                        return log;
                    }
                }
            });
            
            vm.theModal.result.then(function(log){
                if(log){
                    $scope.getNotificationLogs();
                }
            }, function(){
            });
        };

        $scope.openNotificationServiceLogsModal = function (page, size,log) {
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NotificationServiceLogsModalCtrl',
                resolve: {
                    log: function () {
                        return log;
                    }
                }
            });
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.baseUrl = serviceUrl;
                $scope.getNotificationLogs();
            })
            .catch(function(err){
                $scope.loadingLogs = false;
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
