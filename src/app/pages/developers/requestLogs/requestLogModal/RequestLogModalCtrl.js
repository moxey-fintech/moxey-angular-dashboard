(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.requestLogs')
        .controller('RequestLogModalCtrl', RequestLogModalCtrl);

    /** @ngInject */
    function RequestLogModalCtrl($scope,Rehive,log,localStorageManagement,errorHandler,metadataTextService) {
        var vm = this;
        vm.log = log;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingRequestLog = true;

        $scope.getRequestLog = function () {
            $scope.loadingRequestLog = true;

            if(vm.token) {
                Rehive.admin.requests.get({id: vm.log.id}).then(function (res) {
                    $scope.loadingRequestLog = false;
                    $scope.requestLog = res;
                    $scope.params = metadataTextService.convertToText(res.params);
                    $scope.headers = metadataTextService.convertToText(res.headers);
                    $scope.response = metadataTextService.convertToText(res.response.data);
                    $scope.body = metadataTextService.convertToText(res.body);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingRequestLog = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getRequestLog();
    }
})();
