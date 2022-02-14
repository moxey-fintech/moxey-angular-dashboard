(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.log')
        .controller('WebhookLogCtrl', WebhookLogCtrl);

    /** @ngInject */
    function WebhookLogCtrl($scope,Rehive,localStorageManagement,errorHandler,
                            $window,$stateParams,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.logId = $stateParams.id;
        $scope.loadingWebhooks = true;
        $scope.loadingRequests = false;

        $scope.pagination = {
            itemsPerPage: 16,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWebhookTask = function () {
            if(vm.token) {
                $scope.loadingWebhooks = true;
                Rehive.admin.webhookTasks.get({id: vm.logId}).then(function (res) {
                    $scope.loadingWebhooks = false;
                    $scope.webhookTask = res;
                    $scope.mainData = JSON.stringify($scope.webhookTask.data,null,4);
                    $window.scrollTo(0,0);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingWebhooks = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getWebhookTask();

        vm.getWebhookRequestsFiltersObj = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 1
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getWebhookRequests = function () {
            if(vm.token) {
                $scope.loadingRequests = true;

                var webhookRequestsFiltersObj = vm.getWebhookRequestsFiltersObj();

                Rehive.admin.webhookTasks.requests.get(vm.logId,{filters: webhookRequestsFiltersObj}).then(function (res) {
                    $scope.loadingRequests = false;
                    $scope.webhookRequestsData = res;
                    $scope.webhookRequests = res.results;
                    $window.scrollTo(0, 0);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingRequests = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getWebhookRequests();


    }
})();
