(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .controller('AddProductIntegrationModalCtrl', AddProductIntegrationModalCtrl);

    /** @ngInject */
    function AddProductIntegrationModalCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                 extensionsHelper,$timeout,toastr,$location,errorHandler,$uibModalInstance) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        var serviceName = "product_service";
        $rootScope.dashboardTitle = 'Products extension | Moxey';
        $scope.addingProductIntegration = true;
        $scope.webhookEvents = [
            {key: 'Order item purchase', value: 'order.item.purchase'}
        ];
        $scope.newIntegrationParams = {
            name: null,
            slug: null,
            description: null,
            webhooks: []
        };

        $scope.addWebhook = function(){
            $scope.newIntegrationParams.webhooks.push({
                event: $scope.webhookEvents[0],
                secret: null,
                url: null,
            });
        };

        $scope.removeWebhook = function($index){
            $scope.newIntegrationParams.webhooks.splice($index, 1);
        };

        $scope.handleModalClose = function(toastrType){
            if(toastrType === 'success'){
                toastr.success('Product integration added successfully.');
            } else {
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            }
            $scope.addingProductIntegration = false;
            $uibModalInstance.close(true);
        };

        $scope.addProductIntegration = function(){
            var webhooksPrepared = true;
            $scope.newIntegrationParams.webhooks.forEach(function(webhook){
                if((!webhook.event || webhook.event == '') ||(!webhook.url || webhook.url == '')) {
                    webhooksPrepared = false; 
                    return false;
                }
            });

            if(!webhooksPrepared){
                toastr.error("Please provide the url and secrets for all the webhooks");
                return;
            }

            if(vm.token) {
                var newIntegrationObj = {
                    name: $scope.newIntegrationParams.name,
                    slug: $scope.newIntegrationParams.slug,
                    description: $scope.newIntegrationParams.description ? $scope.newIntegrationParams.description : null
                };
                $scope.addingProductIntegration = true;
                $http.post(vm.serviceUrl + 'admin/integrations/', newIntegrationObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var integrationId = res.data.data.id;
                    $scope.newIntegrationParams.webhooks.length > 0 ? $scope.addIntegrationWebhooks(integrationId) : $scope.handleModalClose('success');
                    // $scope.newIntegrationParams.webhooks.length > 0 ? $scope.addIntegrationWebhooks("d3ba5635-ce94-45ba-b7c5-d2701bb3d5ea") : $scope.handleModalClose('success');
                }).catch(function (error) {
                    $scope.addingProductIntegration = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        $scope.addIntegrationWebhooks = function(integrationId){
            $scope.newIntegrationParams.webhooks.forEach(function(webhook, idx, arr){
                webhook.event = webhook.event.value;
                idx == (arr.length-1) ? $scope.addProductIntegrationWebhook(integrationId, webhook, 'last') : $scope.addProductIntegrationWebhook(integrationId, webhook, null);
            });
        };

        $scope.addProductIntegrationWebhook = function(integrationId, newWebhook, last){
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/integrations/' + integrationId + '/webhooks/', newWebhook, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last){
                        $scope.handleModalClose('success');
                    }
                }).catch(function (error) {
                    $scope.addingProductIntegration = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.addingProductIntegration = false;
            })
            .catch(function(err){
                $scope.handleModalClose('error');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
