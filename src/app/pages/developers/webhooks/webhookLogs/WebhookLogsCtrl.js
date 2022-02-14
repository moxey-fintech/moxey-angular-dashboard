(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.webhooks.logs')
        .controller('WebhookLogsCtrl', WebhookLogsCtrl);

    /** @ngInject */
    function WebhookLogsCtrl($scope,Rehive,localStorageManagement,serializeFiltersService,errorHandler,$window,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingWebhooks = true;

        $scope.pagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWebhookTasksFiltersObj = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 1
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getWebhookTasks = function () {
            if(vm.token) {
                $scope.loadingWebhooks = true;

                var webhookTasksFiltersObj = vm.getWebhookTasksFiltersObj();

                Rehive.admin.webhookTasks.get({filters: webhookTasksFiltersObj}).then(function (res) {
                    $scope.loadingWebhooks = false;
                    $scope.webhookTasksData = res;
                    $scope.webhookTasks = res.results;
                    $window.scrollTo(0, 0);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingWebhooks = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getWebhookTasks();

        $scope.goToLog = function (log) {
            $location.path('/developers/webhooks/logs/' + log.id);
        };




    }
})();
