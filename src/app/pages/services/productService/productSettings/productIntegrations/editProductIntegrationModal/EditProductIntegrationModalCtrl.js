(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .controller('EditProductIntegrationModalCtrl', EditProductIntegrationModalCtrl);

    /** @ngInject */
    function EditProductIntegrationModalCtrl($rootScope,$scope,localStorageManagement,$http,editIntegrationId,
                                 extensionsHelper,toastr,$location,errorHandler,$uibModalInstance) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = null;
        vm.editIntegrationId = editIntegrationId;
        var serviceName = "product_service";
        $rootScope.dashboardTitle = 'Products extension | Moxey';
        $scope.editingProductIntegration = true;
        $scope.webhookEvents = [
            {key: 'Order item purchase', value: 'order.item.purchase'}
        ];
        $scope.webhooksToDelete = [];
        $scope.editIntegrationParams = {};
        vm.editIntegrationParams = {};

        $scope.addWebhook = function(){
            $scope.editIntegrationParams.webhooks.push({
                event: $scope.webhookEvents[0],
                secret: null,
                url: null,
                on_submit: 'add'
            });
        };

        $scope.removeWebhook = function($index){
            if($scope.editIntegrationParams.webhooks[$index].id){
                $scope.webhooksToDelete.push($scope.editIntegrationParams.webhooks[$index]);
            }
            $scope.editIntegrationParams.webhooks.splice($index, 1);
        };

        $scope.handleModalClose = function(toastrType){
            if(!toastrType){
                $scope.editingProductIntegration = false;
                $uibModalInstance.close(null);
                return false;                
            }


            if(toastrType === 'success'){
                toastr.success('Product integration updated successfully.');
            } else if(toastrType === 'error') {
                toastr.error("Extension not activated for company");
                $location.path('/extensions');
            }
            $scope.editingProductIntegration = false;
            $uibModalInstance.close(true);
        };

        $scope.handleWebhookChanges = function(){
            if($scope.webhooksToDelete.length == 0 && $scope.editIntegrationParams.webhooks.length == 0){
                $scope.handleModalClose('success');
            } else {
                var isLast = false;
                if($scope.webhooksToDelete.length > 0){
                    $scope.webhooksToDelete.forEach(function(webhook, idx, arr){
                        if(idx == arr.length-1 && $scope.editIntegrationParams.webhooks.length == 0){ isLast = true; }
                        $scope.deleteProductIntegrationWebhook(webhook.id, isLast);
                    });
                }
                $scope.editIntegrationParams.webhooks.forEach(function(webhook, idx, arr){
                    webhook.event = webhook.event.value;
                    if(webhook.on_submit === 'add' || webhook.on_submit === 'update'){
                        if(idx == arr.length-1){ isLast = true; }
                        (webhook.on_submit === 'add') ? $scope.addProductIntegrationWebhook(webhook, isLast) : 
                        $scope.updateProductIntegrationWebhook(webhook.id, {
                            event: webhook.event,
                            url: webhook.url,
                            secret: webhook.secret
                        }, isLast);
                    }
                });

                if(!isLast){
                    $scope.handleModalClose(null);                    
                }
            }
        };

        $scope.addProductIntegrationWebhook = function(newWebhook, isLast){
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/integrations/' + vm.editIntegrationId + '/webhooks/', newWebhook, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(isLast){
                        $scope.handleModalClose('success');
                    }
                }).catch(function (error) {
                    $scope.editingProductIntegration = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        $scope.updateProductIntegrationWebhook = function(webhookId, updatedWebhook, isLast){
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/integrations/' + vm.editIntegrationId + '/webhooks/' + webhookId + '/', updatedWebhook, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(isLast){
                        $scope.handleModalClose('success');
                    }
                }).catch(function (error) {
                    $scope.editingProductIntegration = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        $scope.deleteProductIntegrationWebhook = function(webhookId, isLast){
            if(vm.token) {
                $http.delete(vm.serviceUrl + 'admin/integrations/' + vm.editIntegrationId + '/webhooks/' + webhookId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(isLast){
                        $scope.handleModalClose('success');
                    }
                }).catch(function (error) {
                    $scope.editingProductIntegration = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        $scope.trackWebhookChange = function(idx){
            if($scope.editIntegrationParams.webhookss[idx].id){
                $scope.editIntegrationParams.webhookss[idx].on_submit = 'update';
            }
        };

        $scope.updateProductIntegration = function(){
            var webhooksPrepared = true;
            $scope.editIntegrationParams.webhooks.forEach(function(webhook){
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
                $scope.editingProductIntegration = true;
                var updatedIntegrationParams = {
                    name: $scope.editIntegrationParams.name,
                    slug: $scope.editIntegrationParams.slug,
                    description: $scope.editIntegrationParams.description ? $scope.editIntegrationParams.description : null
                };
                $http.patch(vm.serviceUrl + 'admin/integrations/' + vm.editIntegrationId + '/', updatedIntegrationParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.handleWebhookChanges();
                }).catch(function (error) {
                    $scope.editingProductIntegration = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        $scope.getIntegrationWebhooks = function(){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/integrations/' + vm.editIntegrationId + '/webhooks/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editIntegrationParams.webhooks = res.data.data.results;
                    $scope.editIntegrationParams.webhooks.forEach(function(webhook){
                        webhook.on_submit = 'ignore';
                        webhook.event = $scope.webhookEvents.find(function(event){
                            return event.value === webhook.event;
                        });
                    });
                    $scope.editingProductIntegration = false;
                }).catch(function (error) {
                    $scope.editingProductIntegration = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }            
        };

        $scope.getProductIntegration = function(){
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/integrations/' + vm.editIntegrationId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editIntegrationParams = res.data.data;
                    $scope.editIntegrationParams.webhooks = [];
                    $scope.getIntegrationWebhooks();
                }).catch(function (error) {
                    $scope.editingProductIntegration = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);                   
                });
            }
        };

        vm.fetchServiceUrl = function(serviceName){
            extensionsHelper.getActiveServiceUrl(serviceName)
            .then(function(serviceUrl){
                vm.serviceUrl = serviceUrl;
                $scope.getProductIntegration();
            })
            .catch(function(err){
                $scope.handleModalClose('error');
            });
        };
        vm.fetchServiceUrl(serviceName);
    }
})();
