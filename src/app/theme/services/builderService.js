(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('builderService', builderService);

    /** @ngInject */
    function builderService($rootScope, toastr, $http, localStorageManagement, environmentConfig, serializeFiltersService, _, currencyModifiers) {

        return {
            getBuilderTemplates: function(filtersObj) {
                var templatesUrl = environmentConfig.BUILDER_URL + 'public/templates/';
                if(filtersObj){
                    templatesUrl += '?' + serializeFiltersService.serializeFilters(filtersObj);
                }
                return new Promise(function(resolve, reject){
                    $http.get(templatesUrl, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function(res){
                        resolve(res.data.data.results);
                    })
                    .catch(function(err){
                        reject(err);
                    });
                });
            },
            getBuilderTemplate: function(templateId) {
                return new Promise(function(resolve, reject){
                    $http.get(environmentConfig.BUILDER_URL + 'public/templates/' + templateId + '/', {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function(res){
                        resolve(res.data.data);
                    })
                    .catch(function(err){
                        reject(err);
                    });
                });
            },
            getBuilderTasks: function() {
                var TOKEN = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    if(!TOKEN){
                        toastr.error('Session expired. Please login again.');
                        reject(new Error('No token present'));
                        return;
                    }

                    $http.get(environmentConfig.BUILDER_URL + 'admin/build-tasks/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': TOKEN
                        }
                    })
                    .then(function(res){
                        resolve(res.data.data.results);
                    })
                    .catch(function(err){
                        reject(err);
                    });
                });
            },
            getBuildTask: function(taskId){
                var TOKEN = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    if(!TOKEN){
                        toastr.error('Session expired. Please login again.');
                        reject(new Error('No token present'));
                        return;
                    }

                    $http.get(environmentConfig.BUILDER_URL + 'admin/build-tasks/' + taskId + '/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': TOKEN
                        }
                    })
                    .then(function(res){
                        resolve(res.data.data);
                    })
                    .catch(function(err){
                        reject(err);
                    });
                });
            },
            createBuildTask: function (templateConfig) {
                var TOKEN = localStorageManagement.getValue('TOKEN');
                return new Promise(function(resolve, reject){
                    if(!TOKEN){
                        toastr.error('Session expired. Please login again.');
                        reject(new Error('No token present'));
                        return;
                    }

                    $http.post(environmentConfig.BUILDER_URL + 'admin/build-tasks/', {config: templateConfig}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': TOKEN
                        }
                    })
                    .then(function(res){
                        resolve(res.data.data);
                    })
                    .catch(function(err){
                        reject(err);
                    });
                });
            },
            getConversionFundTransactions: function(currenciesList, conversionAccountRef, transactionsList){
                if(transactionsList === undefined){
                    transactionsList = [];
                }
                currenciesList.forEach(function(currency){
                    transactionsList.push({
                        tx_type: "credit",
                        account: conversionAccountRef,
                        currency: currency.code,
                        amount:  currencyModifiers.convertToCents(1000, currency.divisibility),
                        status: "complete",
                        note: currency.code + " currency amount added for conversions",
                        reference: "conversions_" + currency.code.toLowerCase(),
                        subtype: "fund"
                    });
                });

                return transactionsList;
            },
            getConversionPairsForCurrencies: function(currenciesList, conversionAccountRef){
                var conversionPairsList = [];
                currenciesList.forEach(function(currency){
                    currenciesList.forEach(function(otherCurrency){
                        if(otherCurrency.code !== currency.code){
                            conversionPairsList.push({
                                "key": currency.code + ':' + otherCurrency.code,
                                "operational_account": conversionAccountRef
                            });
                        }
                    });
                });

                return conversionPairsList;
            },
            addBitcoinTestnetService: function(templateConfig){  
                if(!templateConfig.services) { templateConfig.services = {}; }
                templateConfig.services.bitcoin_testnet_service =  {
                    "subtypes": {
                      "transaction_credit_subtype": "deposit_crypto",
                      "transaction_debit_subtype": "send_crypto",
                      "transaction_withdraw_subtype": "withdraw_crypto",
                      "transaction_fee_subtype": "fee_hotwallet",
                      "transaction_fund_subtype": "hotwallet_deposit",
                      "transaction_issue_subtype": "hotwallet_deposit",
                      "transaction_credit_warmstorage_subtype": "warmstorage_deposit",
                      "transaction_debit_warmstorage_subtype": "warmstorage_withdraw",
                      "transaction_credit_hotwallet_subtype": "hotwallet_deposit",
                      "transaction_debit_hotwallet_subtype": "hotwallet_withdraw",
                      "transaction_credit_coldstorage_subtype": "coldstorage_deposit",
                      "transaction_debit_coldstorage_subtype": "coldstorage_withdraw"
                    }
                };
                
                return templateConfig;
            },
            addStellarTestnetService: function(templateConfig){  
                if(!templateConfig.services) { templateConfig.services = {}; }
                templateConfig.services.stellar_testnet_service =  {
                    "subtypes": {
                        "transaction_credit_subtype": "deposit_crypto",
                        "transaction_debit_subtype": "send_crypto",
                        "transaction_withdraw_subtype": "withdraw_crypto",
                        "transaction_fee_subtype": "fee_hotwallet",
                        "transaction_fund_subtype": "hotwallet_deposit",
                        "transaction_issue_subtype": "hotwallet_deposit",
                        "transaction_credit_warmstorage_subtype": "warmstorage_deposit",
                        "transaction_debit_warmstorage_subtype": "warmstorage_withdraw",
                        "transaction_credit_hotwallet_subtype": "hotwallet_deposit",
                        "transaction_debit_hotwallet_subtype": "hotwallet_withdraw",
                        "transaction_credit_coldstorage_subtype": "coldstorage_deposit",
                        "transaction_debit_coldstorage_subtype": "coldstorage_withdraw"
                    }
                };
                
                return templateConfig;
            },
            getFormattedSolutionTemplateConfig: function(templateConfig, solutionSelected, accountRefObj, customCurrency, uuid, companyModel, rewardsConfig, depositMethods, companyCurrencies) {
                var vm = this;
                var txbtIdx = companyCurrencies.findIndex(function(currency){return currency.code === 'TXBT'});
                var txlmIdx = companyCurrencies.findIndex(function(currency){return currency.code === 'TXLM'});
                if(txbtIdx > -1){
                    templateConfig = vm.addBitcoinTestnetService(templateConfig);
                }
                if(txlmIdx > -1){
                    templateConfig = vm.addStellarTestnetService(templateConfig);
                }
                
                // var conversionPairsList = vm.getConversionPairsForCurrencies(companyCurrencies, accountRefObj.conversionStandalone);
                var conversionPairsList = [];
                var oldConfig = JSON.stringify(templateConfig);
                oldConfig = oldConfig
                            .replace(/companyName/g, companyModel.name)
                            .replace(/companyDescription/g, companyModel.description)
                            .replace(/#companyPrimaryColor/g, companyModel.colors.primary)
                            .replace(/#companySecondaryColor/g, companyModel.colors.secondary)
                            .replace(/#companyPrimaryContrastColor/g, companyModel.colors.primaryContrast)
                            .replace(/adminId/g, uuid)
                            .replace(/adminSalesAccountRef/g, accountRefObj.salesAccount)
                            .replace(/adminOperationalAccountRef/g, accountRefObj.adminAccount)
                            .replace(/rewardsStandaloneAccountRef/g, accountRefObj.rewardStandalone)
                            .replace(/conversionsStandaloneAccountRef/g, accountRefObj.conversionStandalone)
                            .replace(/feesStandaloneAccountRef/g, accountRefObj.feeStandalone)
                            .replace(/operationalStandaloneAccountRef/g, accountRefObj.operationalStandalone)
                            .replace(/salesStandaloneAccountRef/g, accountRefObj.salesStandalone)
                            .replace(/customCurrencyObj.code/g, customCurrency.code)
                            .replace(/customCurrencyObj.unit/g, customCurrency.unit)
                            .replace(/customCurrencyObj.symbol/g, customCurrency.symbol)
                            .replace(/customCurrencyObj.description/g, customCurrency.description)
                            .replace(/customCurrencyObj.divisibility/g, customCurrency.divisibility)
                            .replace(/customCurrencyObj.display_code/g, customCurrency.code)
                            .replace(/rewardCampaignStartDate/g, rewardsConfig.rewardStartDate)
                            .replace(/rewardCampaignEndDate/g, rewardsConfig.rewardEndDate)
                            .replace(/"conversionPairsList"/g, JSON.stringify(conversionPairsList))
                            .replace(/"companyCurrencies"/g, JSON.stringify(companyCurrencies))
                            .replace(/"accountCurrencies"/g, JSON.stringify(_.map(companyCurrencies, 'code')));
                
                var formattedConfig = JSON.parse(oldConfig);
                
                // if(solutionSelected === 'rewards' && formattedConfig.services && formattedConfig.services.rewards_service && formattedConfig.services.rewards_service.campaigns){
                //     formattedConfig.services.rewards_service.campaigns = (rewardsConfig.selectRewards === 'custom') ? [] : formattedConfig.services.rewards_service.campaigns;
                // }

                if(solutionSelected === 'prepaid'){
                    formattedConfig.company_bank_accounts = [];
                    if(depositMethods.bank_selected) {
                        formattedConfig.company_bank_accounts[0] = depositMethods.companyBank;
                    }

                    if(depositMethods.stripe_selected) {
                        formattedConfig.services.stripe_service = depositMethods.stripeDetails;
                    }
                }
                // formattedConfig.transactions = vm.getConversionFundTransactions(companyCurrencies, accountRefObj.conversionStandalone, formattedConfig.transactions);
                return formattedConfig;
            }
        }
    }

})();