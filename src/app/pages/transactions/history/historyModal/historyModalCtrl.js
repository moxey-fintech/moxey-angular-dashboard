(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('historyModalCtrl', historyModalCtrl);

    function historyModalCtrl($rootScope,Rehive,$uibModalInstance,$scope,errorHandler,toastr,$timeout,$anchorScroll,$http,$state,extensionsHelper,$ngConfirm,$filter,
                              environmentConfig,transaction,metadataTextService,$location,localStorageManagement,$window,currencyModifiers) {

        var vm = this;
        vm.rewardServiceUrl = null;
        vm.productServiceUrl = null;
        vm.token = localStorageManagement.getValue('token');
        $scope.updateTransactionObj = {};
        $scope.formatted = {};
        $scope.formatted.metadata = {};
        $scope.formatted.note = "";
        $scope.editingTransaction = false;
        $scope.updatingTransaction = true;
        $scope.untouchedTransaction = false;
        $scope.transactionHasBeenUpdated = false;
        $scope.editTransactionStatusOptions = ['Pending','Complete','Failed'];
        $scope.retrievedUserObj = {};
        $scope.mfaEnabled = "Disabled";
        $scope.mfaOBj = {};   
        $scope.retrievedAccountTransactions = []; 
        $scope.displayingMetadata = true;
        $scope.txn_withdraw = false;
        $scope.txn_purchase = false;
        $scope.rewardDetails = {};
        $scope.orderObj = {};
        $scope.isOfTypeCrypto = false;
        $scope.isOfTypeFiat = false;
        $scope.cryptoUrl = null;
        $scope.cryptoTxnId = null;
        $scope.stellar_explorer_link = null;
        $scope.stellar_sender_link = null;
        $scope.stellar_recipient_link = null;
        $scope.blockchain_cypher_link = null;
        $scope.blockchain_sender_link = null;
        $scope.blockchain_recipient_link = null;
        $scope.txn_unfunded = false;
        $scope.hasTempUser = false;
        $scope.hasTempPartner = false;
        $scope.partnerAccountReference = false;

        $scope.$on("modal.closing",function(){
            $rootScope.$broadcast("modalClosing",$scope.transactionHasBeenUpdated);
        });

        $scope.copiedMetadataSuccessfully= function () {
            toastr.success('Metadata copied to clipboard');
        };
        $scope.bankObj = {};
        $scope.checkTransactionPurity = function () {
            $scope.untouchedTransaction = true;
        };

        $scope.goToPurchaseOrder = function(orderId){
            $state.go('productService.ordersList', {openPurchaseOrder: orderId});
            $uibModalInstance.close();
        };

        $scope.getExtensionUrl = function(serviceName, errorMessage){
            return new Promise(function(resolve, reject){
                extensionsHelper.getActiveServiceUrl(serviceName)
                    .then(function(serviceUrl){
                        resolve(serviceUrl);
                    })
                    .catch(function(err){
                        $scope.updatingTransaction = false;
                        toastr.error(errorMessage);
                        reject(err);
                    });
            });
        };

        $scope.getTransaction = function(){
            if(vm.token) {
                $scope.updatingTransaction = true;
                Rehive.admin.transactions.get({id: transaction.id}).then(function (res) {
                    $scope.transaction = res;
                    $scope.updateTransactionObj.status = $scope.transaction.status;
                    $scope.updateTransactionObj.note = $scope.transaction.note;
                    $scope.transaction.recipient = "";
                    $scope.transaction.userInfo = $scope.transaction.user ? (
                        $scope.transaction.user.email || $scope.transaction.user.mobile || $scope.transaction.user.id || '(new user)'
                    ) : $scope.transaction.account;
                    $scope.hasTempUser = ($scope.transaction.user && $scope.transaction.user.temporary);
                    
                    if ($scope.transaction.partner) {
                        $scope.hasTempPartner = ($scope.transaction.partner.user && $scope.transaction.partner.user.identifier && $scope.transaction.partner.user.temporary);
                        $scope.partnerAccountReference = $scope.transaction.partner.account;
                        $scope.transaction.recipient = $scope.transaction.partner.user && $scope.transaction.partner.user.identifier ? (
                            $scope.transaction.partner.user.email || $scope.transaction.partner.user.mobile || $scope.transaction.partner.user.id || '(new user)'    
                        ) : $scope.transaction.partner.account;
                    }

                    if($scope.transaction.metadata){
                        $scope.formatted.metadata = metadataTextService.convertToText($scope.transaction.metadata);
                        if($scope.transaction.metadata.type && ($scope.transaction.metadata.type == 'bitcoin' || $scope.transaction.metadata.type == 'stellar')){
                            if($scope.transaction.metadata.service_stellar){
                                $scope.stellar_explorer_link = $scope.transaction.metadata.service_stellar.network === "testnet" ? "https://stellar.expert/explorer/testnet/tx/" : "https://stellar.expert/explorer/public/tx/";
                                $scope.stellar_explorer_link += $scope.transaction.metadata.service_stellar.tx_hash;
                                
                                $scope.stellar_sender_link = $scope.transaction.metadata.service_stellar.network === "testnet" ? "https://stellar.expert/explorer/testnet/account/" : "https://stellar.expert/explorer/public/account/";
                                $scope.stellar_sender_link += $scope.transaction.metadata.service_stellar.sender_public_address;
                                
                                $scope.stellar_recipient_link = $scope.transaction.metadata.service_stellar.network === "testnet" ? "https://stellar.expert/explorer/testnet/account/" : "https://stellar.expert/explorer/public/account/";
                                $scope.stellar_recipient_link += $scope.transaction.metadata.service_stellar.recipient_public_address;
                            } 
                            else if($scope.transaction.metadata.service_bitcoin){
                                $scope.blockchain_cypher_link = $scope.transaction.metadata.service_bitcoin.network === "testnet" ? "https://live.blockcypher.com/btc-testnet/tx/" : "https://live.blockcypher.com/btc/tx/";
                                $scope.blockchain_cypher_link += $scope.transaction.metadata.service_bitcoin.tx_hash;
                                
                                $scope.blockchain_sender_link = $scope.transaction.metadata.service_bitcoin.network === "testnet" ? "https://live.blockcypher.com/btc-testnet/address/" : "https://live.blockcypher.com/btc/address/";
                                $scope.blockchain_sender_link += $scope.transaction.metadata.service_bitcoin.sender_public_address;
                                
                                $scope.blockchain_recipient_link = $scope.transaction.metadata.service_bitcoin.network === "testnet" ? "https://live.blockcypher.com/btc-testnet/address/" : "https://live.blockcypher.com/btc/address/";
                                $scope.blockchain_recipient_link += $scope.transaction.metadata.service_bitcoin.recipient_public_address;

                                if($scope.transaction.metadata.service_bitcoin.onchain_status && $scope.transaction.metadata.service_bitcoin.onchain_status == 'Unfunded'){
                                    $scope.txn_unfunded = true;
                                    $scope.cryptoUrl = null;
                                    var serviceName = $scope.transaction.metadata.service_bitcoin.network == 'testnet' ? 'bitcoin_testnet_service' : 'bitcoin_service';
                                    var errorMessage = $scope.transaction.metadata.service_bitcoin.network == 'testnet' ? "Bitcoin testnet extension not activated for company" : "Bitcoin extension not activated for company";
                                    $scope.updatingTransaction = true;
                                    $scope.getExtensionUrl(serviceName, errorMessage)
                                        .then(function(serviceUrl){
                                            $scope.cryptoUrl = serviceUrl;
                                            vm.getCryptoTxnId($scope.cryptoUrl, $scope.transaction.id);
                                        })
                                        .catch(function(err){
                                            $location.path('/transactions');
                                            $uibModalInstance.close(true);
                                        });
                                }
                            }                          
                        }
                        if($scope.transaction.metadata.service_reward){
                            $scope.txn_withdraw = true;
                            $scope.displayingMetadata = false;
                            vm.getRewardDetails($scope.transaction.metadata.service_reward);
                        }
                        else if($scope.transaction.subtype === "withdraw_crypto" || $scope.transaction.subtype === "withdraw_manual"){
                            $scope.txn_withdraw = true;
                            $scope.displayingMetadata = false;
                            if($scope.transaction.subtype === "withdraw_manual"){
                                $scope.bankObj = (
                                    $scope.transaction.metadata.rehive_context && $scope.transaction.metadata.rehive_context.account
                                    ) ? $scope.transaction.metadata.rehive_context.account : null;
                                $scope.isOfTypeCrypto = false;
                                $scope.isOfTypeFiat = true;
                            } else if($scope.transaction.subtype === "withdraw_crypto"){
                                $scope.isOfTypeFiat = false;
                                $scope.isOfTypeCrypto = $scope.transaction.metadata.rehive_context 
                                && $scope.transaction.metadata.rehive_context.account 
                                && $scope.transaction.status === 'Pending';
                                
                                if($scope.isOfTypeCrypto){
                                    $scope.cryptoUrl = null;
                                    if(!$scope.transaction.metadata.rehive_context 
                                        || !$scope.transaction.metadata.rehive_context.account
                                        || !$scope.transaction.metadata.rehive_context.account.crypto_type){
                                            toastr.error('No rehive context on metdata');
                                    } else {
                                        var serviceName = null;
                                        var errorMessage = null;
                                        if($scope.transaction.metadata.rehive_context.account.crypto_type == 'bitcoin'){
                                            serviceName = $scope.transaction.metadata.rehive_context.account.network == 'testnet' ? 'bitcoin_testnet_service' : 'bitcoin_service';
                                            errorMessage = $scope.transaction.metadata.rehive_context.account.network == 'testnet' ? "Bitcoin testnet extension not activated for company" : "Bitcoin extension not activated for company";
                                        }
                                        else if($scope.transaction.metadata.rehive_context.account.crypto_type == 'stellar'){
                                            serviceName = $scope.transaction.metadata.rehive_context.account.network == 'testnet' ? 'stellar_testnet_service' : 'stellar_service';
                                            errorMessage = $scope.transaction.metadata.rehive_context.account.network == 'testnet' ? "Stellar testnet extension not activated for company" : "Stellar extension not activated for company";
                                        }

                                        if(serviceName && errorMessage){
                                            $scope.updatingTransaction = true;
                                            $scope.getExtensionUrl(serviceName, errorMessage)
                                            .then(function(serviceUrl){
                                                $scope.cryptoUrl = serviceUrl;
                                                vm.getCryptoTxnId($scope.cryptoUrl, $scope.transaction.id);
                                            })
                                            .catch(function(err){
                                                $location.path('/transactions');
                                                $uibModalInstance.close(true);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        else if($scope.transaction.subtype === "purchase_app" && $scope.transaction.metadata.service_product){
                            $scope.txn_purchase = true;
                            $scope.displayingMetadata = false;
                            $scope.orderObj = $scope.transaction.metadata.service_product.order ? $scope.transaction.metadata.service_product.order : null;
                            // vm.getOrderDetails($scope.transaction.metadata.service_product);
                        }
                    }
                    if($scope.transaction.user){
                        vm.getUserDetails($scope.transaction.user);
                    }
                    vm.getTransactionsFromSameCollection();
                    vm.getTransactionAccount();
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingTransaction = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getTransaction();

        vm.getCryptoTxnId = function(cryptoUrl, rehive_code){
            if(vm.token){
                var url = cryptoUrl + 'admin/transactions?rehive_code=' + rehive_code;
                $http.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    $scope.cryptoTxnId = res.data.data.results.length > 0 ? res.data.data.results[0].id : null;
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getOrderDetails = function(orderMetadata){
            if(orderMetadata && orderMetadata.order){
                $scope.getExtensionUrl("product_service", "Product extension not activated for company")
                .then(function(serviceUrl){
                    vm.productServiceUrl = serviceUrl;
                    $http.get(vm.productServiceUrl  + 'admin/orders/' + orderMetadata.order.id + '/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $scope.orderObj = res.data.data;;
                        }
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                })
                .catch(function(err){
                    $location.path('/transactions');
                    $uibModalInstance.close(true);
                });
            }
        };

        vm.getRewardDetails = function(rewardMetadata) {
            if(rewardMetadata && rewardMetadata.reward_id){
                $scope.getExtensionUrl("rewards_service", "Rewards extension not activated for company")
                .then(function(serviceUrl){
                    vm.rewardServiceUrl = serviceUrl;
                    $http.get(vm.rewardServiceUrl  + 'admin/rewards/?page=1&page_size=1&id=' + rewardMetadata.reward_id, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                            $scope.updatingTransaction = false;
                            $scope.rewardDetails = res.data.data.results[0];
                        }
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                })
                .catch(function(err){
                    $location.path('/transactions');
                    $uibModalInstance.close(true);
                });
            }
        };

        vm.getUserDetails = function (user) {
            if(user){
                Rehive.admin.users.get({filters: {user: user.id}}).then(function (res) {
                    if(res.results.length == 1){
                        $scope.retrievedUserObj = res.results[0];
                        $scope.retrievedUserObj.metadata = metadataTextService.convertToText($scope.retrievedUserObj.metadata);
                        vm.checkUserMFAStatus($scope.retrievedUserObj.id);
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.checkUserMFAStatus = function (uuid) {
            if(vm.token) {
                Rehive.admin.users.mfa.get(uuid).then(function (res) {
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                $scope.mfaEnabled = "Enabled";
                                if(key == 'sms'){
                                    vm.getUserSmsMFADetails(uuid)
                                } else if(key == 'token'){
                                    vm.getUserTokenMFADetails(uuid);
                                }
                                $scope.$apply();
                            }
                        }
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getUserSmsMFADetails = function(uuid) {
            if(vm.token){
                $http.get(environmentConfig.API + 'admin/users/' + uuid + '/mfa/sms/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.mfaOBj = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getUserTokenMFADetails = function(uuid) {
            if(vm.token){
                $http.get(environmentConfig.API + 'admin/users/' + uuid + '/mfa/token/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.mfaOBj = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getTransactionsFromSameCollection = function(){
            if(vm.token){
                $scope.transaction.transactionsFromCollection = [];
                var filterObj = {
                    page: 1,
                    page_size: 25,
                    id: $scope.transaction.collection
                };
                Rehive.admin.transaction_collections.get({filters: filterObj}).then(function (res) {
                    $scope.transaction.transactionsFromCollection = res.results[0].transactions;
                    var idx = -1;
                    $scope.transaction.transactionsFromCollection.forEach(function(transaction, index, arr){
                        transaction.formattedId = transaction.id.substring(0, 12) + "....";
                        transaction.user = transaction.user ? (transaction.user.email ? transaction.user.email : (
                            transaction.user.mobile ? transaction.user.mobile : (
                                transaction.user.id ? transaction.user.id : "--"
                            )
                        )) : null;
                        if(transaction.id == $scope.transaction.id){
                            idx = index;
                        }
                    });
                    if(idx !== -1){
                        $scope.transaction.transactionsFromCollection.splice(idx , 1);
                    }
                    $scope.updatingTransaction = false;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getRecentTransactionsFromAccount = function () {
            if(vm.token){
                $scope.retrievedAccountTransactions = [];
                var filterObj = {
                    page: 1,
                    page_size: 10,
                    account: $scope.transaction.account.reference
                };
                Rehive.admin.transactions.get({filters: filterObj}).then(function (res) {
                    $scope.retrievedAccountTransactions = res.results;
                    $scope.duplicatesExist = false;
                    $scope.retrievedAccountTransactions.forEach(function(transaction){
                        if($scope.txn_withdraw && transaction.amount === $scope.transaction.amount && transaction.subtype === $scope.transaction.subtype){
                            transaction.possibleDuplicate = true;
                            if(!$scope.duplicatesExist){
                                $scope.duplicatesExist = true;
                            }
                        }
                    });
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getTransactionAccount = function(){
            if(vm.token){
                $scope.retrievedAccountTransactions = [];
                var filterObj = {
                    reference: $scope.transaction.account
                };
                Rehive.admin.accounts.get({filters: filterObj}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.transaction.account = res.results[0];
                        vm.getRecentTransactionsFromAccount();
                    }                    
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccounts = false;
                    $scope.accountsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleEditingTransaction = function () {
            if(!$scope.editingTransaction){
                if($scope.formatted.metadata){
                    $scope.updateTransactionObj.metadata = JSON.stringify($scope.transaction.metadata);
                } else {
                    $scope.updateTransactionObj.metadata = '';
                }

                $scope.updateTransactionObj.status = $scope.transaction.status;
                //scrolling to the bottom
                var old = $location.hash();
                $location.hash('transaction-modal-mid');
                $anchorScroll();
                $location.hash(old);
                $timeout(function () {
                    $location.hash('transaction-modal-save-button');
                    $anchorScroll();
                },30);
                $timeout(function () {
                    $location.hash(old);
                },50);

            } else {
                delete $scope.updateTransactionObj.metadata;
            }

            $scope.untouchedTransaction = false;
            $scope.editingTransaction = !$scope.editingTransaction;
        };

        $scope.updateTransactionStatus = function(){
            $scope.updatingTransaction = true;
            var metaData;
            if($scope.updateTransactionObj.metadata){
                if(vm.isJson($scope.updateTransactionObj.metadata)){
                    metaData =  JSON.parse($scope.updateTransactionObj.metadata);
                } else {
                    toastr.error('Incorrect metadata format');
                    $scope.updatingTransaction = false;
                    return false;
                }
            } else {
                metaData = {};
            }

            Rehive.admin.transactions.update($scope.transaction.id, {
                status: $scope.updateTransactionObj.status,
                note: $scope.updateTransactionObj.note,
                metadata: metaData
            }).then(function (res) {
                if(metaData == {}){
                    delete $scope.formatted.metadata;
                    delete $scope.transaction.metadata;
                } else {
                    $scope.transaction = res;
                    $scope.transaction.metadata = metaData;
                    $scope.formatted.metadata = metadataTextService.convertToText(metaData);
                }

                $timeout(function () {
                    $scope.transactionHasBeenUpdated = true;
                    if($scope.editingTransaction){
                        $scope.toggleEditingTransaction();
                        vm.getRecentTransactionsFromAccount();
                    }
                    $scope.updatingTransaction = false;
                    toastr.success('Transaction successfully updated');
                },800);
            }, function (error) {
                $scope.updatingTransaction = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.approveTransaction = function(){
            $scope.updateTransactionObj.status = "Complete";
            $scope.updateTransactionObj.metadata = JSON.stringify($scope.transaction.metadata);
            $scope.updateTransactionObj.note = $scope.transaction.note;
            $scope.updateTransactionStatus();
        };

        $scope.declineTransaction = function(){
            $scope.updateTransactionObj.status = "Failed";
            $scope.updateTransactionObj.metadata = JSON.stringify($scope.transaction.metadata);
            $scope.updateTransactionObj.note = $scope.transaction.note;
            $scope.updateTransactionStatus();
        };

        $scope.confirmCryptoTxnDecline = function(){
            var cryptoNetworkType = $filter('capitalizeWord')($scope.transaction.metadata.rehive_context.account.crypto_type);
            cryptoNetworkType += $scope.transaction.metadata.rehive_context.account.network == 'testnet' ? ' Testnet' : '';
            $ngConfirm({
                title: 'Decline ' + cryptoNetworkType + ' withdrawal',
                content: "Are you sure you want to decline this withdrawal of " + $filter('currencyModifiersFilter')($scope.transaction.total_amount, $scope.transaction.currency.divisibility) + " " + 
                 $scope.transaction.currency.code + " to " + $scope.transaction.metadata.recipient_public_address + "?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Decline",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.completeCryptoTxn(null);
                        }
                    }
                }
            });
        };

        $scope.confirmCryptoTxnApproval = function(){
            var cryptoNetworkType = $filter('capitalizeWord')($scope.transaction.metadata.rehive_context.account.crypto_type);
            cryptoNetworkType += $scope.transaction.metadata.rehive_context.account.network == 'testnet' ? ' Testnet' : '';
            $ngConfirm({
                title: 'Approve ' + cryptoNetworkType + ' withdrawal',
                content: "Approving this withdrawal will send " + $filter('currencyModifiersFilter')($scope.transaction.total_amount, $scope.transaction.currency.divisibility) + " " + 
                 $scope.transaction.currency.code + " to " + $scope.transaction.metadata.rehive_context.account.address + ". Do you want to proceed?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Approve",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.completeCryptoTxn('approved');
                        }
                    }
                }
            });
        };

        $scope.completeCryptoTxn = function(approved){
            var withdrawalStatus = approved ? 'approved_withdrawal' : 'failed_withdrawal';

            if(vm.token){
                $http.patch($scope.cryptoUrl + 'admin/transactions/' + $scope.cryptoTxnId + '/', {withdrawal_status: withdrawalStatus} , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    approved ? $scope.approveTransaction() : $scope.declineTransaction();
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.confirmReprocessBitcoinUnfundedTransaction = function(){
            var cryptoNetworkType = 'Bitcoin ' + ($scope.transaction.metadata.service_bitcoin.network == 'testnet' ? ' Testnet' : '');
            $ngConfirm({
                title: 'Approve unfunded ' + cryptoNetworkType + ' transaction',
                content: "Do you want to reprocess this transaction of amount " + $filter('currencyModifiersFilter')($scope.transaction.total_amount, $scope.transaction.currency.divisibility) + " " +
                    $scope.transaction.currency.code + "?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Approve",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.completeUnfundedBitcoinTransactionStatus('reprocess');
                        }
                    }
                }
            });
        };

        $scope.confirmCancelUnfundedBitcoinTransaction = function(){
            var cryptoNetworkType = 'Bitcoin ' + ($scope.transaction.metadata.service_bitcoin.network == 'testnet' ? ' Testnet' : '');
            $ngConfirm({
                title: 'Decline unfunded ' + cryptoNetworkType + ' transaction',
                content: "Do you want to cancel this transaction of amount " + $filter('currencyModifiersFilter')($scope.transaction.total_amount, $scope.transaction.currency.divisibility) + " " +
                    $scope.transaction.currency.code + "?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Decline",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.completeUnfundedBitcoinTransactionStatus(null);
                        }
                    }
                }
            });
        };

        $scope.completeUnfundedBitcoinTransactionStatus = function(reprocess){
            var unfundedStatus = reprocess ? 'Reprocess' : 'Cancelled';

            if(vm.token){
                $http.patch($scope.cryptoUrl + 'admin/transactions/' + $scope.cryptoTxnId + '/', {status: unfundedStatus} , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + vm.token
                    }
                }).then(function (res) {
                    reprocess ? $scope.approveTransaction() : $scope.declineTransaction();
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToCollectionTransaction = function(txn_id){
            $uibModalInstance.close();
            $state.go('transactions.history', {transactionId: txn_id}, {reload: true, inherit: false});
        };

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $window.open('/#/user/' + $scope.transaction.user.id + '/details','_blank');
        };
        
        $scope.goToPartnerAccount = function (accountRef) {
            $window.open('/#/users/list?account=' + accountRef, '_blank');
        };
        
        $scope.goToTransactionAccount = function (transaction) {
            if(transaction.user){
                $window.open('/#/user/' + transaction.user.id + '/accounts?searchAccount=' + transaction.account.reference,'_blank');
            } else {
                $window.open($state.href('accounts.standaloneList', {accountRef: transaction.account.reference}),'_blank');
            }
        };

        $scope.updateReward = function(status) {
            $scope.getExtensionUrl("rewards_service", "Rewards extension not activated for company")
            .then(function(serviceUrl){
                vm.rewardServiceUrl = serviceUrl;
                $scope.updatingTransaction = true;
                $http.patch(vm.rewardServiceUrl + 'admin/rewards/' + $scope.rewardDetails.id + '/',
                    {
                        status: status
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Token ' + vm.token
                        }
                    }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        $scope.updatingTransaction = false;
                        toastr.success('Reward has been updated successfully');
                        $scope.getTransaction();
                    }
                }).catch(function (error) {
                    $scope.updatingTransaction = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            })
            .catch(function(err){
                $location.path('/transactions');
                $uibModalInstance.close(true);
            });
        };

    }
})();
