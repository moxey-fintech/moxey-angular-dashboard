(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('MakeTransactionModalCtrl', MakeTransactionModalCtrl);

    function MakeTransactionModalCtrl($rootScope, Rehive,$scope,errorHandler,toastr,$uibModalInstance,
                                      newTransactionParams,localStorageManagement,currencyModifiers,$location,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.txnHelperSettings = localStorageManagement.getValue(vm.companyIdentifier + "TxnHelper") ? JSON.parse(localStorageManagement.getValue(vm.companyIdentifier + "TxnHelper")) : {};       
        $scope.newTransactionParams = newTransactionParams || {};
        $scope.panelTitle = 'Create transaction';
        vm.completedTransaction = {};
        $scope.confirmTransaction = false;
        $scope.completeTransaction = false;
        $scope.creditDepositSelected = false;
        $scope.transferDepositSelected = false;
        $scope.loadingTransactionSettings = false;
        $scope.transactionType = {};
        
        if($scope.newTransactionParams.txType){
            $scope.transactionType.tx_type = $scope.newTransactionParams.txType;
        }

        $scope.transactionHelperOptions = ["Credit deposit","Transfer deposit","Credit","Debit","Transfer"];
        $scope.transactionOption = vm.txnHelperSettings.optionSelected ? vm.txnHelperSettings.optionSelected : $scope.transactionHelperOptions[2];
        $scope.displayTransactionHelper = vm.txnHelperSettings.turnedOn ? vm.txnHelperSettings.turnedOn : false;
        $scope.transactionType = {
            tx_type: vm.txnHelperSettings.tx_type ? vm.txnHelperSettings.tx_type : 'credit'
        };
        
        vm.setTxnHelperSettings = function(){
            localStorageManagement.setValue(vm.companyIdentifier + "TxnHelper", JSON.stringify({
                optionSelected: $scope.transactionOption, 
                turnedOn: $scope.displayTransactionHelper,
                tx_type: $scope.transactionType.tx_type
            }));           
        };
        
        $scope.toggleTransactionHelper = function(){
            $scope.displayTransactionHelper = !$scope.displayTransactionHelper;
            if(!$scope.displayTransactionHelper){
                $scope.creditDepositSelected = $scope.transferDepositSelected = false;
                $scope.transactionOption = $scope.transactionHelperOptions[2];
                $scope.transactionType.tx_type = 'credit';
            }
            vm.setTxnHelperSettings();
        }

        $scope.trackTransactionChange = function(){
            $scope.creditDepositSelected = false;
            $scope.transferDepositSelected = false;
            vm.setTxnHelperSettings();
            switch($scope.transactionOption){
                case "Credit deposit": 
                    $scope.transactionOption = "Credit deposit";
                    $scope.creditDepositSelected = true;
                    $scope.transactionType.tx_type = "credit";
                    break;
                case "Transfer deposit": 
                    $scope.transactionOption = "Transfer deposit";
                    $scope.transferDepositSelected = true;
                    $scope.transactionType.tx_type = "transfer";
                    break;
                case "Credit": 
                    $scope.transactionOption = "Credit";
                    $scope.transactionType.tx_type = "credit";
                    break;
                case "Debit": 
                    $scope.transactionOption = "Debit";
                    $scope.transactionType.tx_type = "debit";
                    break;
                case "Transfer": 
                    $scope.transactionOption = "Transfer";
                    $scope.transactionType.tx_type = "transfer";
                    break;
                default:
                    $scope.transactionOption = "Credit";
                    $scope.transactionType.tx_type = "credit";    
            }
        };
        $scope.trackTransactionChange();

        $scope.switchTransactionView = function(tx_type){
            $scope.creditDepositSelected = false;
            $scope.transferDepositSelected = false;
            vm.setTxnHelperSettings();

            switch(tx_type){
                case "credit": 
                    $scope.transactionOption = "Credit";
                    $scope.transactionType.tx_type = "credit";
                    break;
                case "debit": 
                    $scope.transactionOption = "Debit";
                    $scope.transactionType.tx_type = "debit";
                    break;
                case "transfer": 
                    $scope.transactionOption = "Transfer";
                    $scope.transactionType.tx_type = "transfer";
                    break;
                default:
                    $scope.transactionOption = "Credit";
                    $scope.transactionType.tx_type = "credit";    
            }
        };
                
        $scope.toggleConfirmTransaction = function () {
            if($scope.confirmTransaction){
                $scope.confirmTransaction = false;
                $scope.panelTitle = 'New transaction';
            } else {
                $scope.confirmTransaction = true;
                $scope.panelTitle = 'Confirm ' + $scope.transactionType.tx_type;
                if($scope.creditDepositSelected || $scope.transferDepositSelected){
                    $scope.panelTitle += " deposit";
                }
            }
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.createTransaction = function () {

            var sendTransactionData,creditMetadata,debitMetadata,transferCreditMetadata,transferDebitMetadata;

            if($scope.transactionType.tx_type == 'credit'){
                if($scope.creditDepositSelected){
                    if($scope.creditDepositTransactionData.metadata){
                        if(vm.isJson($scope.creditDepositTransactionData.metadata)){
                            creditMetadata =  JSON.parse($scope.creditDepositTransactionData.metadata);
                        } else {
                            toastr.error('Incorrect metadata format');
                            $scope.toggleConfirmTransaction();
                            return false;
                        }
                    } else {
                        creditMetadata = {};
                    }
    
                    sendTransactionData = {
                        user: $scope.creditDepositTransactionData.user,
                        amount: currencyModifiers.convertToCents($scope.creditDepositTransactionData.amount,$scope.creditDepositTransactionData.currency.divisibility),
                        reference: $scope.creditDepositTransactionData.reference,
                        status: $scope.creditDepositTransactionData.status,
                        metadata: creditMetadata,
                        currency: $scope.creditDepositTransactionData.currency.code,
                        subtype: $scope.creditDepositTransactionData.subtype ? $scope.creditDepositTransactionData.subtype.name ? $scope.creditDepositTransactionData.subtype.name : null : null,
                        note: $scope.creditDepositTransactionData.note,
                        account: $scope.creditDepositTransactionData.account.reference
                    };
    
                    if(!sendTransactionData.user || !sendTransactionData.amount || !sendTransactionData.currency
                        || !sendTransactionData.account){
                        toastr.error('Please fill in the required fields');
                        return;
                    }
    
                    $scope.onGoingTransaction = true;
                    Rehive.admin.transactions.createCredit(sendTransactionData).then(function (res) {
                        $scope.onGoingTransaction = false;
                        vm.completedTransaction = res;
                        $scope.completeTransaction = true;
                        $scope.confirmTransaction = false;
                        $scope.panelTitle = 'Credit deposit successful';
                        toastr.success('Your transaction has been completed successfully.');
                        $scope.$apply();
                    }, function (error) {
                        $scope.onGoingTransaction = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                } else {
                    if($scope.creditTransactionData.metadata){
                        if(vm.isJson($scope.creditTransactionData.metadata)){
                            creditMetadata =  JSON.parse($scope.creditTransactionData.metadata);
                        } else {
                            toastr.error('Incorrect metadata format');
                            $scope.toggleConfirmTransaction();
                            return false;
                        }
                    } else {
                        creditMetadata = {};
                    }
    
                    sendTransactionData = {                        
                        amount: currencyModifiers.convertToCents($scope.creditTransactionData.amount,$scope.creditTransactionData.currency.divisibility),
                        reference: $scope.creditTransactionData.reference,
                        status: $scope.creditTransactionData.status,
                        metadata: creditMetadata,
                        currency: $scope.creditTransactionData.currency.code,
                        subtype: $scope.creditTransactionData.subtype ? $scope.creditTransactionData.subtype.name ? $scope.creditTransactionData.subtype.name : null : null,
                        note: $scope.creditTransactionData.note,
                        account: $scope.creditTransactionData.account.reference
                    };

                    if($scope.creditTransactionData.user){
                        sendTransactionData.user = $scope.creditTransactionData.user;
                    }
    
                    if(!sendTransactionData.amount || !sendTransactionData.currency
                        || !sendTransactionData.account){
                        toastr.error('Please fill in the required fields');
                        return;
                    }
    
                    $scope.onGoingTransaction = true;
                    Rehive.admin.transactions.createCredit(sendTransactionData).then(function (res) {
                        $scope.onGoingTransaction = false;
                        vm.completedTransaction = res;
                        $scope.completeTransaction = true;
                        $scope.confirmTransaction = false;
                        $scope.panelTitle = 'Credit successful';
                        toastr.success('Your transaction has been completed successfully.');
                        $scope.$apply();
                    }, function (error) {
                        $scope.onGoingTransaction = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
                
            } else if($scope.transactionType.tx_type == 'debit'){

                if($scope.debitTransactionData.metadata){
                    if(vm.isJson($scope.debitTransactionData.metadata)){
                        debitMetadata =  JSON.parse($scope.debitTransactionData.metadata);
                    } else {
                        toastr.error('Incorrect metadata format');
                        $scope.toggleConfirmTransaction();
                        return false;
                    }
                } else {
                    debitMetadata = {};
                }

                sendTransactionData = {
                    amount: currencyModifiers.convertToCents($scope.debitTransactionData.amount,$scope.debitTransactionData.currency.divisibility),
                    reference: $scope.debitTransactionData.reference,
                    status: $scope.debitTransactionData.status,
                    metadata: debitMetadata,
                    currency: $scope.debitTransactionData.currency.code,
                    subtype: $scope.debitTransactionData.subtype ? $scope.debitTransactionData.subtype.name ? $scope.debitTransactionData.subtype.name : null : null,
                    note: $scope.debitTransactionData.note,
                    account: $scope.debitTransactionData.account.reference
                };

                if($scope.debitTransactionData.user){
                    sendTransactionData.user = $scope.debitTransactionData.user;
                }

                if(!sendTransactionData.amount || !sendTransactionData.currency
                    || !sendTransactionData.account){
                    toastr.error('Please fill in the required fields');
                    return;
                }

                $scope.onGoingTransaction = true;
                Rehive.admin.transactions.createDebit(sendTransactionData).then(function (res) {
                    $scope.onGoingTransaction = false;
                    vm.completedTransaction = res;
                    $scope.completeTransaction = true;
                    $scope.confirmTransaction = false;
                    $scope.panelTitle = 'Debit successful';
                    toastr.success('Your transaction has been completed successfully.');
                    $scope.$apply();
                }, function (error) {
                    $scope.onGoingTransaction = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });

            } else if($scope.transactionType.tx_type == 'transfer'){                
                if($scope.transferDepositSelected){
                    if($scope.transferDepositTransactionData.credit_metadata){
                        if(vm.isJson($scope.transferDepositTransactionData.credit_metadata)){
                            transferCreditMetadata =  JSON.parse($scope.transferDepositTransactionData.credit_metadata);
                        } else {
                            toastr.error('Incorrect sender metadata format');
                            $scope.toggleConfirmTransaction();
                            return false;
                        }
                    } else {
                        transferCreditMetadata = {};
                    }
    
                    if($scope.transferDepositTransactionData.debit_metadata){
                        if(vm.isJson($scope.transferDepositTransactionData.debit_metadata)){
                            transferDebitMetadata =  JSON.parse($scope.transferDepositTransactionData.debit_metadata);
                        } else {
                            toastr.error('Incorrect recipient metadata format');
                            $scope.toggleConfirmTransaction();
                            return false;
                        }
                    } else {
                        transferDebitMetadata = {};
                    }
    
                    sendTransactionData = {
                        user: $scope.transferDepositTransactionData.user,
                        recipient: $scope.transferDepositTransactionData.recipient,
                        amount: currencyModifiers.convertToCents($scope.transferDepositTransactionData.amount,$scope.transferDepositTransactionData.currency.divisibility),
                        currency: $scope.transferDepositTransactionData.currency.code,
                        debit_account: $scope.transferDepositTransactionData.account.reference,
                        credit_account: $scope.transferDepositTransactionData.credit_account.reference,
                        debit_reference: $scope.transferDepositTransactionData.debit_reference,
                        credit_reference: $scope.transferDepositTransactionData.credit_reference,
                        // debit_note: $scope.transferDepositTransactionData.debit_note ? $scope.transferDepositTransactionData.debit_note : null,
                        // credit_note: $scope.transferDepositTransactionData.credit_note ? $scope.transferDepositTransactionData.debit_note : null,
                        debit_metadata: transferDebitMetadata,
                        credit_metadata: transferCreditMetadata,
                        debit_subtype: $scope.transferDepositTransactionData.debit_subtype ? $scope.transferDepositTransactionData.debit_subtype.name : null,
                        credit_subtype: $scope.transferDepositTransactionData.credit_subtype ? $scope.transferDepositTransactionData.credit_subtype.name : null
                    };
    
                    if(!sendTransactionData.user || !sendTransactionData.recipient || !sendTransactionData.amount || !sendTransactionData.currency){
                        toastr.error('Please fill in the required fields');
                        return;
                    }
                    sendTransactionData = serializeFiltersService.objectFilters(sendTransactionData);
                    $scope.onGoingTransaction = true;
                    Rehive.admin.transactions.createTransfer(sendTransactionData).then(function (res) {
                        $scope.onGoingTransaction = false;
                        vm.completedTransaction = res;
                        $scope.completeTransaction = true;
                        $scope.confirmTransaction = false;
                        $scope.panelTitle = 'Transfer successful';
                        toastr.success('Your transaction has been completed successfully.');
                        $scope.$apply();
                    }, function (error) {
                        $scope.onGoingTransaction = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
                else{
                    if($scope.transferTransactionData.credit_metadata){
                        if(vm.isJson($scope.transferTransactionData.credit_metadata)){
                            transferCreditMetadata =  JSON.parse($scope.transferTransactionData.credit_metadata);
                        } else {
                            toastr.error('Incorrect sender metadata format');
                            $scope.toggleConfirmTransaction();
                            return false;
                        }
                    } else {
                        transferCreditMetadata = {};
                    }
    
                    if($scope.transferTransactionData.debit_metadata){
                        if(vm.isJson($scope.transferTransactionData.debit_metadata)){
                            transferDebitMetadata =  JSON.parse($scope.transferTransactionData.debit_metadata);
                        } else {
                            toastr.error('Incorrect recipient metadata format');
                            $scope.toggleConfirmTransaction();
                            return false;
                        }
                    } else {
                        transferDebitMetadata = {};
                    }
    
                    sendTransactionData = {
                        amount: currencyModifiers.convertToCents($scope.transferTransactionData.amount,$scope.transferTransactionData.currency.divisibility),
                        currency: $scope.transferTransactionData.currency.code,
                        debit_account: $scope.transferTransactionData.account.reference,
                        credit_account: $scope.transferTransactionData.credit_account.reference,
                        debit_reference: $scope.transferTransactionData.debit_reference,
                        credit_reference: $scope.transferTransactionData.credit_reference,
                        debit_note: $scope.transferTransactionData.debit_note,
                        credit_note: $scope.transferTransactionData.credit_note,
                        debit_metadata: transferDebitMetadata,
                        credit_metadata: transferCreditMetadata,
                        debit_subtype: $scope.transferTransactionData.debit_subtype ? $scope.transferTransactionData.debit_subtype.name : null,
                        credit_subtype: $scope.transferTransactionData.credit_subtype ? $scope.transferTransactionData.credit_subtype.name : null
                    };

                    if($scope.transferTransactionData.user){
                        sendTransactionData.user = $scope.transferTransactionData.user;
                    }
                    
                    if($scope.transferTransactionData.recipient){
                        sendTransactionData.recipient = $scope.transferTransactionData.recipient;
                    }
    
                    if(!sendTransactionData.amount || !sendTransactionData.currency){
                        toastr.error('Please fill in the required fields');
                        return;
                    }
                    sendTransactionData = serializeFiltersService.objectFilters(sendTransactionData);
    
                    $scope.onGoingTransaction = true;
                    Rehive.admin.transactions.createTransfer(sendTransactionData).then(function (res) {
                        $scope.onGoingTransaction = false;
                        vm.completedTransaction = res;
                        $scope.completeTransaction = true;
                        $scope.confirmTransaction = false;
                        $scope.panelTitle = 'Transfer successful';
                        toastr.success('Your transaction has been completed successfully.');
                        $scope.$apply();
                    }, function (error) {
                        $scope.onGoingTransaction = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }                
            }
        };

        $scope.closeModal = function () {
            $uibModalInstance.close(true);
        };

        $scope.takeToUser = function (id) {
            $location.path('/user/' + id + '/details');
            $scope.$dismiss();
        };

        $scope.showTransactionModal = function () {
            $uibModalInstance.close(vm.completedTransaction);
        };

    }
})();
