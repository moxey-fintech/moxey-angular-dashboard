(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.ordersList')
        .controller('DisplayOrderModalCtrl', DisplayOrderModalCtrl);

    function DisplayOrderModalCtrl(environmentConfig, $uibModalInstance,$state, $scope,$http,order,
                                   localStorageManagement,errorHandler,toastr, $location,extensionsHelper) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.orderStatus = "";
        vm.serviceUrl = null;
        var serviceName = "product_service";
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        $scope.loadingOrder = true;
        $scope.editingOrder = false;
        $scope.orderChanged = false;
        $scope.itemStatusChanged = false;
        $scope.itemStatusChangeCount = 0;
        $scope.disablePending = false;
        $scope.completedPayment = false;
        $scope.orderObj = {};
        $scope.orderStatusOptions = ["pending","placed","failed","complete"];
        $scope.billingAddressRequired = false;
        $scope.shippingAddressRequired = false;
        $scope.contactEmailRequired = false;
        $scope.contactMobileRequired = false;
        $scope.billingAddressProvided = false;
        $scope.shippingAddressProvided = false;
        $scope.contactMobileProvided = false;
        $scope.contactEmailProvided = false;
        $scope.changedPaymentStatusObj = {};
        $scope.changedPaymentStatus = false;

        vm.isEmpty = function(obj){
            for(var key in obj){
                if(obj.hasOwnProperty(key)){
                    return false;
                }
            }
            return true;
        };

        vm.listRequiredInfo = function(){
            if($scope.orderObj.requires_billing_address){
                $scope.billingAddressRequired = true; 
                if(!vm.isEmpty($scope.orderObj.billing_address)){
                    $scope.requiredBilling = $scope.orderObj.billing_address;
                    $scope.billingAddressProvided = true;
                } 
                else{
                    $scope.billingAddressProvided = false;
                }                
            }
            if($scope.orderObj.requires_shipping_address){ 
                $scope.shippingAddressRequired = true; 
                if(!vm.isEmpty($scope.orderObj.shipping_address)){
                    $scope.billingAddressProvided = $scope.orderObj.shipping_address;
                    $scope.shippingAddressProvided = true;
                }
                else{
                    $scope.shippingAddressProvided = false;
                }
            }
            if($scope.orderObj.requires_contact_mobile){ 
                $scope.contactMobileRequired = true; 
                if($scope.orderObj.contact_mobile){
                    $scope.billingAddressProvided = $scope.orderObj.requires_contact_mobile;
                    $scope.contactMobileProvided = true;
                }
                else{
                    $scope.contactMobileProvided = false;
                }
            }
            if($scope.orderObj.requires_contact_email){ 
                $scope.contactEmailRequired = true; 
                if($scope.orderObj.contact_email){
                    $scope.requiredEmail = $scope.orderObj.contact_email;
                    $scope.contactEmailProvided = true;
                }
                else{
                    $scope.contactEmailProvided = false;
                }
            }
        };        

        vm.getOrder = function(){
            if(vm.token) {
                $scope.loadingOrder = true;
                $http.get(vm.serviceUrl + 'admin/orders/' + order.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.loadingOrder =  false;
                        $scope.orderObj = res.data.data;
                        console.log($scope.orderObj);
                        vm.orderStatus = $scope.orderObj.status;
                        if($scope.orderObj.status == "failed" || $scope.orderObj.status == "complete"){
                            $scope.disablePending = true;
                        }
                        $scope.orderObj.items.forEach(function(item){
                            item.defaultStatus = item.status;
                            item.defaultStatusChanged = false;
                        });
                        $scope.orderObj.payments.forEach(function(payment){
                            if(payment.status === 'complete'){
                                $scope.completedPayment = true;
                                return false;
                            }
                        });
                        $scope.loadingOrder =  false;
                        $scope.getUserObjEmail($scope.orderObj.user);
                        vm.listRequiredInfo();                        
                    }
                }).catch(function (error) {
                    $scope.loadingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };        

        $scope.toggleEditingOrder = function(){
            $scope.editingOrder = !$scope.editingOrder;
        };

        $scope.orderStatusChanged = function(){
          if(vm.orderStatus !== $scope.orderObj.status){
              $scope.orderChanged = true;
          } else {
              $scope.orderChanged = false;
          }
        };

        $scope.orderItemStatusChanged = function(item){
            var idx = $scope.orderObj.items.indexOf(item);
            if($scope.orderObj.items[idx].defaultStatus != $scope.orderObj.items[idx].status){
                $scope.orderObj.items[idx].defaultStatusChanged = true;
                ++$scope.itemStatusChangeCount;
            }
            else{
                $scope.orderObj.items[idx].defaultStatusChanged = false;
                --$scope.itemStatusChangeCount;
            }
            $scope.itemStatusChanged = ($scope.itemStatusChangeCount > 0);
        };

        $scope.orderPaymentStatusChanged = function(payment){
            $scope.changedPaymentStatusObj = payment;
            $scope.changedPaymentStatus = true;
            $scope.orderChanged = true;
        };

        $scope.updateOrderPaymentStatus = function(payment){
            if(vm.token){
                $http.patch(vm.serviceUrl + 'admin/orders/' + order.id + '/payments/' + payment.id + '/', {status: payment.status}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingOrder =  false; 
                    $scope.loadingOrder =  false;                           
                    toastr.success('Order status updated successfully');
                    // $scope.closeModal();
                }).catch(function (error) {
                    $scope.loadingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });       
            }
        }

        $scope.completePayment = function(){
            if(vm.token){
                $scope.loadingOrder =  true;
                $http.post(vm.serviceUrl + 'admin/orders/' + order.id + '/payments/',
                    {type: "rehive"}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        $scope.editingOrder =  false;
                        $scope.loadingOrder =  false;
                        toastr.success('Order payment created successfully');
                        // $scope.closeModal();
                }).catch(function (error) {
                    $scope.editingOrder =  false;
                    $scope.loadingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateOrderStatus = function(){
            if(vm.token){
                if($scope.orderChanged){
                    $scope.loadingOrder =  true;
                    $http.patch(vm.serviceUrl + 'admin/orders/' + order.id + '/', {status: $scope.orderObj.status}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201 || res.status === 200) {
                            if($scope.itemStatusChanged || $scope.changedPaymentStatus){
                                if($scope.itemStatusChanged) {
                                    $scope.trackOrderItemStatus();
                                } else {
                                    $scope.updateOrderPaymentStatus($scope.changedPaymentStatusObj);
                                }
                            }
                            else{
                                $scope.editingOrder =  false;     
                                $scope.loadingOrder =  false;                       
                                toastr.success('Order status updated successfully');
                                // $scope.closeModal();
                            }                            
                        }
                    }).catch(function (error) {
                        $scope.editingOrder =  false;
                        $scope.loadingOrder =  false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                } 
                else if($scope.itemStatusChanged){
                    $scope.trackOrderItemStatus();
                }         
            }
        };

        $scope.trackOrderItemStatus = function(){
            $scope.orderObj.items.forEach(function(item){
                if(item.defaultStatusChanged){
                    if($scope.itemStatusChangeCount === 1){
                        $scope.updateOrderItems(item, 'last');                        
                    }
                    else{
                        $scope.updateOrderItems(item, null);
                    }
                    --$scope.itemStatusChangeCount;
                }
                if(!$scope.itemStatusChangeCount){
                    return false;
                }
            });
        };

        $scope.updateOrderItems = function(itemObj, last){
            if(vm.token){
                $http.patch(vm.serviceUrl + 'admin/orders/' + order.id + '/items/' + itemObj.id , {status: itemObj.status}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if(last){
                        if($scope.changedPaymentStatus){
                            $scope.updateOrderPaymentStatus($scope.changedPaymentStatusObj);
                        } else {
                            $scope.editingOrder =  false;    
                            $scope.loadingOrder =  false;                        
                            toastr.success('Order status updated successfully');
                            // $scope.closeModal();
                        }
                    }
                }).catch(function (error) {
                    $scope.editingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.getUserObjEmail = function (id) {
            $scope.orderUserObj = {};
            $scope.loadingOrder =  true;
            $http.get(environmentConfig.API + 'admin/users/?user=' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    if(res.data.data.results.length == 1){
                        $scope.orderUserObj = res.data.data.results[0];
                    }
                }
                $scope.loadingOrder =  false;
            }).catch(function (error) {
                $scope.loadingOrder =  false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.closeModal = function () {
            $uibModalInstance.close(true);
            $location.path('/extensions/product/orders');
        };

        $scope.goToTransactions = function (transactionId) {
            $state.go('transactions.history',{transactionId: transactionId});
            $uibModalInstance.close();
        };

        extensionsHelper.getActiveServiceUrl(serviceName)
        .then(function(serviceUrl){
            $scope.loadingOrder = false;
            vm.serviceUrl = serviceUrl;
            vm.getOrder();
        })
        .catch(function(err){
            $scope.loadingOrder = false;
            toastr.error("Extension not activated for company");
            $location.path('/extensions');
        });
    
    }
})();
