(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('walletConfigService', walletConfigService);

    /** @ngInject */
    function walletConfigService() {
        return {
            getDefaultWalletAccountsConfig: function(){
                return {
                    "layout": "",
                    "actionVariant": "",
                    "identifier": "name"
                };
            },
            getUpdatedtWalletAccountsConfig: function(oldConfig, newConfig){
                var updatedAccountsConfig = {};
                if(!oldConfig || oldConfig['accounts'] == undefined){
                    updatedAccountsConfig = newConfig['accounts'];
                }
                else{
                    oldConfig = oldConfig.accounts;
                    newConfig = newConfig.accounts;

                    for(var key in newConfig){
                        updatedAccountsConfig[key] = (oldConfig[key] == undefined || oldConfig[key] == newConfig[key]) ? newConfig[key] : oldConfig[key];
                    }
                }
                if(updatedAccountsConfig.identifier === ""){
                    updatedAccountsConfig.identifier = 'none';
                }
                return updatedAccountsConfig;
            },
            getDefaultWalletActionsConfig: function(){
                return {
                    "send": {
                        "condition": {
                            "hide": false,
                            "hideCurrency": []
                        },
                        "config": {
                            "confirmMessage": "",
                            "recipient": []
                        }
                    },
                    "receive": {
                        "condition": {
                            "hide": false,
                            "hideCurrency": []
                        }
                    },
                    "card": {
                        "config": {},
                        "condition": {
                            "hide": false,
                            "hideCurrency": []
                        }
                    },
                    "deposit": {
                        "condition": {
                            "hide": false,
                            "hideCurrency": []
                        }
                    },
                    "deposit_voucher": {
                        "condition": {
                          "hide": false,
                          "hideCurrency": []
                        },
                        "config": {
                          "users": []
                        }
                    },
                    "donate": {
                        "condition": {
                          "hide": false,
                          "hideCurrency": []
                        },
                        "config": {
                          "users": []
                        }
                    },
                    "withdraw": {
                        "condition": {
                            "hide": false,
                            "hideCurrency": []
                        },
                        "config": {
                            "pairs": [],
                            "message": "",
                            "confirmMessage": ""
                        }
                    },
                    "withdraw_voucher": {
                        "condition": {
                          "hide": false,
                          "hideCurrency": []
                        },
                        "config": {
                          "users": []
                        }
                    },
                    "pay": {
                        "condition": {
                            "hide": true,
                            "hideCurrency": []
                        },
                        "config": {
                            "showTip": false,
                            "showRating": false,
                            "tipType": "",
                            "tipValues": ["5", "10", "25"]
                        }
                    },
                    "prepaid": {
                        "condition": {
                            "hide": false,
                            "hideCurrency": []
                        },
                        "config": {
                            "prepaidCurrencies": []
                        }
                    },
                    "exchange": {
                        "condition": {
                            "hide": true,
                            "hideCurrency": []
                        }
                    },
                    "transfer": {
                        "condition": {
                            "hide": true,
                            "hideCurrency": []
                        }
                    },
                    "redeem_voucher": {
                        "config": {},
                        "condition": {
                          "hide": false,
                          "hideCurrency": []
                        }
                    }
                };
            },
            getHideCurrenciesList: function(arr, currenciesList){
                var resultArr = [];
                arr.forEach(function(item){
                    currenciesList.forEach(function(currency){
                        if(currency.code == item){
                            resultArr.push(currency);
                            return false;
                        }
                    });
                });
                return resultArr;
            },
            getFormattedWalletActionsConfig: function(walletActionsConfig){
                var vm = this, companyConfig = {}, lodash = window._;

                /*Updated send config*/
                companyConfig.send = {
                    condition: {},
                    config:{}
                };
                companyConfig.send.condition.hide = walletActionsConfig.send.condition.optionSelected == 'hide';
                companyConfig.send.condition.hideCurrency = walletActionsConfig.send.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.send.condition.currenciesSelected, 'code')
                ) : [];
                companyConfig.send.config = walletActionsConfig.send.config;

                /*Updated withdraw config*/
                companyConfig.withdraw = {
                    condition: {},
                    config:{}
                };
                companyConfig.withdraw.condition.hide = walletActionsConfig.withdraw.condition.optionSelected == 'hide';
                companyConfig.withdraw.condition.hideCurrency = walletActionsConfig.withdraw.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.withdraw.condition.currenciesSelected, 'code')
                ) : [];
                companyConfig.withdraw.config = {
                    message: walletActionsConfig.withdraw.config.message,
                    confirmMessage: walletActionsConfig.withdraw.config.confirmMessage
                };
                companyConfig.withdraw.config.pairs = [];
                var invalidWithdrawPairs = false;
                walletActionsConfig.withdraw.config.selectedPairs.forEach(function(pair){
                    if(!pair.fromCurrency || pair.fromCurrency.code == undefined || !pair.toCurrency || pair.toCurrency.code == undefined){
                        invalidWithdrawPairs = true;
                        return false;
                    }   
                    var pairStr = pair.fromCurrency.code + ":" + pair.toCurrency.code;
                    companyConfig.withdraw.config.pairs.push(pairStr);                
                });
                if(invalidWithdrawPairs){
                    return "invalidWithdrawPairs";
                }

                /*Updated withdraw_voucher config*/
                companyConfig.withdraw_voucher = {
                    condition: {}
                };
                companyConfig.withdraw_voucher.condition.hide = walletActionsConfig.withdraw_voucher.condition.optionSelected == 'hide';
                companyConfig.withdraw_voucher.condition.hideCurrency = walletActionsConfig.withdraw_voucher.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.withdraw_voucher.condition.currenciesSelected, 'code')
                ) : [];

                /*Updated receive config*/
                companyConfig.receive = {
                    condition: {}
                };
                companyConfig.receive.condition.hide = walletActionsConfig.receive.condition.optionSelected == 'hide';
                companyConfig.receive.condition.hideCurrency = walletActionsConfig.receive.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.receive.condition.currenciesSelected, 'code')
                ) : [];

                /*Updated deposit config*/
                companyConfig.deposit = {
                    condition: {}
                };
                companyConfig.deposit.condition.hide = walletActionsConfig.deposit.condition.optionSelected == 'hide';
                companyConfig.deposit.condition.hideCurrency = walletActionsConfig.deposit.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.deposit.condition.currenciesSelected, 'code')
                ) : [];

                /*Updated deposit_voucher config*/
                companyConfig.deposit_voucher = {
                    condition: {}
                };
                companyConfig.deposit_voucher.condition.hide = walletActionsConfig.deposit_voucher.condition.optionSelected == 'hide';
                companyConfig.deposit_voucher.condition.hideCurrency = walletActionsConfig.deposit_voucher.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.deposit_voucher.condition.currenciesSelected, 'code')
                ) : [];

                /*Updated donate config*/
                companyConfig.donate = {
                    condition: {},
                    config:{}
                };
                companyConfig.donate.condition.hide = walletActionsConfig.donate.condition.optionSelected === 'hide';
                companyConfig.donate.condition.hideCurrency = walletActionsConfig.donate.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.donate.condition.currenciesSelected, 'code')
                ) : [];
                companyConfig.donate.config = walletActionsConfig.donate.config;

                /*Updated exchange config*/
                companyConfig.exchange = {
                    condition: {}
                };
                companyConfig.exchange.condition.hide = walletActionsConfig.exchange.condition.optionSelected == 'hide';
                companyConfig.exchange.condition.hideCurrency = walletActionsConfig.exchange.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.exchange.condition.currenciesSelected, 'code')
                ) : [];

                /*Updated pay config*/
                companyConfig.pay = {
                    condition: {}
                };
                companyConfig.pay.condition.hide = walletActionsConfig.pay.condition.optionSelected == 'hide';
                companyConfig.pay.condition.hideCurrency = walletActionsConfig.pay.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.pay.condition.currenciesSelected, 'code')
                ) : [];
                companyConfig.pay.config = walletActionsConfig.pay.config;

                /*Updated transfer config*/
                companyConfig.transfer = {
                    condition: {}
                };
                companyConfig.transfer.condition.hide = walletActionsConfig.transfer.condition.optionSelected == 'hide';
                companyConfig.transfer.condition.hideCurrency = walletActionsConfig.transfer.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.transfer.condition.currenciesSelected, 'code')
                ) : [];

                /*Updated card config*/
                companyConfig.card = {
                    condition: {},
                    config:{}
                };
                companyConfig.card.condition.hide = walletActionsConfig.card.condition.optionSelected === 'hide';
                companyConfig.card.condition.hideCurrency = walletActionsConfig.card.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.card.condition.currenciesSelected, 'code')
                ) : [];
                companyConfig.card.config = walletActionsConfig.card.config;

                /*Updated redeem_voucher config*/
                companyConfig.redeem_voucher = {
                    condition: {},
                    config:{}
                };
                companyConfig.redeem_voucher.condition.hide = walletActionsConfig.redeem_voucher.condition.optionSelected === 'hide';
                companyConfig.redeem_voucher.condition.hideCurrency = walletActionsConfig.redeem_voucher.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.redeem_voucher.condition.currenciesSelected, 'code')
                ) : [];
                companyConfig.redeem_voucher.config = walletActionsConfig.redeem_voucher.config;

                /*Updated prepaid config*/
                companyConfig.prepaid = {
                    condition: {},
                    config:{}
                };
                companyConfig.prepaid.condition.hide = walletActionsConfig.prepaid.condition.optionSelected === 'hide';
                companyConfig.prepaid.condition.hideCurrency = walletActionsConfig.prepaid.condition.optionSelected == 'currency' ? (
                    lodash.map(walletActionsConfig.prepaid.condition.currenciesSelected, 'code')
                ) : [];
                companyConfig.prepaid.config = {}; 
                walletActionsConfig.prepaid.config.prepaidCurrencies.forEach(function(prepaidCurrencyObj){
                    prepaidCurrencyObj.currency = prepaidCurrencyObj.currency ? prepaidCurrencyObj.currency.code : null;
                    prepaidCurrencyObj.providers.forEach(function(provider){
                        provider = provider.toLowerCase().replace(/ /g, '_');
                    });
                    companyConfig.prepaid.config[prepaidCurrencyObj.currency] = prepaidCurrencyObj;
                });

                return companyConfig;
            },
            getUpdatedWalletActionsConfig: function(oldConfig, newConfig, currenciesList, $filter){
                var updatedActionsConfig = {}, vm = this;
                if(!oldConfig || oldConfig['actions'] == undefined) {
                    updatedActionsConfig = newConfig['actions'];
                } else {
                    oldConfig = oldConfig['actions'];
                    newConfig = newConfig['actions'];

                    if(!oldConfig.send){
                        updatedActionsConfig.send = newConfig.send;
                    }
                    else {
                        updatedActionsConfig.send = {};
                        if(!oldConfig.send.condition){
                            updatedActionsConfig.send.condition = newConfig.send.condition;
                        } else {
                            updatedActionsConfig.send.condition = {
                                hide: oldConfig.send.condition.hide == undefined ? newConfig.send.condition.hide : oldConfig.send.condition.hide,
                                hideCurrency: oldConfig.send.condition.hideCurrency == undefined ? newConfig.send.condition.hideCurrency : oldConfig.send.condition.hideCurrency
                            };
                        }

                        if(!oldConfig.send.config){
                            updatedActionsConfig.send.config = newConfig.send.config;
                        } else {
                            updatedActionsConfig.send.config = {
                                confirmMessage: oldConfig.send.config.confirmMessage == undefined ? newConfig.send.config.confirmMessage : oldConfig.send.config.confirmMessage,
                                recipient: oldConfig.send.config.recipient == undefined ? newConfig.send.config.recipient : oldConfig.send.config.recipient
                            };
                        }
                    }

                    if(!oldConfig.receive){
                        updatedActionsConfig.receive = newConfig.receive;
                    }
                    else {
                        updatedActionsConfig.receive = {};
                        if(!oldConfig.receive.condition){
                            updatedActionsConfig.receive.condition = newConfig.receive.condition;
                        } else {
                            updatedActionsConfig.receive.condition = {
                                hide: oldConfig.receive.condition.hide == undefined ? newConfig.receive.condition.hide : oldConfig.receive.condition.hide,
                                hideCurrency: oldConfig.receive.condition.hideCurrency == undefined ? newConfig.receive.condition.hideCurrency : oldConfig.receive.condition.hideCurrency
                            };
                        }
                    }

                    if(!oldConfig.deposit){
                        updatedActionsConfig.deposit = newConfig.deposit;
                    }
                    else {
                        updatedActionsConfig.deposit = {};
                        if(!oldConfig.deposit.condition){
                            updatedActionsConfig.deposit.condition = newConfig.deposit.condition;
                        } else {
                            updatedActionsConfig.deposit.condition = {
                                hide: oldConfig.deposit.condition.hide == undefined ? newConfig.deposit.condition.hide : oldConfig.deposit.condition.hide,
                                hideCurrency: oldConfig.deposit.condition.hideCurrency == undefined ? newConfig.deposit.condition.hideCurrency : oldConfig.deposit.condition.hideCurrency
                            };
                        }
                    }

                    if(!oldConfig.deposit_voucher){
                        updatedActionsConfig.deposit_voucher = newConfig.deposit_voucher;
                    }
                    else {
                        updatedActionsConfig.deposit_voucher = {};
                        if(!oldConfig.deposit_voucher.condition){
                            updatedActionsConfig.deposit_voucher.condition = newConfig.deposit_voucher.condition;
                        } else {
                            updatedActionsConfig.deposit_voucher.condition = {
                                hide: oldConfig.deposit_voucher.condition.hide == undefined ? newConfig.deposit_voucher.condition.hide : oldConfig.deposit_voucher.condition.hide,
                                hideCurrency: oldConfig.deposit_voucher.condition.hideCurrency == undefined ? newConfig.deposit_voucher.condition.hideCurrency : oldConfig.deposit_voucher.condition.hideCurrency
                            };
                        }
                    }

                    if(!oldConfig.donate){
                        updatedActionsConfig.donate = newConfig.donate;
                    }
                    else {
                        updatedActionsConfig.donate = {};
                        if(!oldConfig.donate.condition){
                            updatedActionsConfig.donate.condition = newConfig.donate.condition;
                        } else {
                            updatedActionsConfig.donate.condition = {
                                hide: oldConfig.donate.condition.hide === undefined ? newConfig.donate.condition.hide : oldConfig.donate.condition.hide,
                                hideCurrency: oldConfig.donate.condition.hideCurrency === undefined ? newConfig.donate.condition.hideCurrency : oldConfig.donate.condition.hideCurrency
                            };
                        }

                        if(!oldConfig.donate.config){
                            updatedActionsConfig.donate.config = newConfig.donate.config;
                        } else {
                            updatedActionsConfig.donate.config = {
                                users: []
                            };
                            if(oldConfig.donate.config.users !== undefined && Array.isArray(oldConfig.donate.config.users)){
                                oldConfig.donate.config.users.forEach(function(userConfig){
                                    updatedActionsConfig.donate.config.users.push({
                                        name: userConfig.name ? userConfig.name : "",
                                        profile: userConfig.profile ? userConfig.profile : "",
                                        email: userConfig.email ? userConfig.email : ""
                                    });
                                });
                            }
                        }
                    }

                    if(!oldConfig.withdraw){
                        updatedActionsConfig.withdraw = newConfig.withdraw;
                    }
                    else {
                        updatedActionsConfig.withdraw = {};
                        if(!oldConfig.withdraw.condition){
                            updatedActionsConfig.withdraw.condition = newConfig.withdraw.condition;
                        } else {
                            updatedActionsConfig.withdraw.condition = {
                                hide: oldConfig.withdraw.condition.hide == undefined ? newConfig.withdraw.condition.hide : oldConfig.withdraw.condition.hide,
                                hideCurrency: oldConfig.withdraw.condition.hideCurrency == undefined ? newConfig.withdraw.condition.hideCurrency : oldConfig.withdraw.condition.hideCurrency
                            };
                        }

                        if(!oldConfig.withdraw_voucher){
                            updatedActionsConfig.withdraw_voucher = newConfig.withdraw_voucher;
                        }
                        else {
                            updatedActionsConfig.withdraw_voucher = {};
                            if(!oldConfig.withdraw_voucher.condition){
                                updatedActionsConfig.withdraw_voucher.condition = newConfig.withdraw_voucher.condition;
                            } else {
                                updatedActionsConfig.withdraw_voucher.condition = {
                                    hide: oldConfig.withdraw_voucher.condition.hide == undefined ? newConfig.withdraw_voucher.condition.hide : oldConfig.withdraw_voucher.condition.hide,
                                    hideCurrency: oldConfig.withdraw_voucher.condition.hideCurrency == undefined ? newConfig.withdraw_voucher.condition.hideCurrency : oldConfig.withdraw_voucher.condition.hideCurrency
                                };
                            }
                        }

                        if(!oldConfig.withdraw.config){
                            updatedActionsConfig.withdraw.config = newConfig.withdraw.config;
                        } else {
                            updatedActionsConfig.withdraw.config = {
                                pairs: oldConfig.withdraw.config.pairs == undefined ? newConfig.withdraw.config.pairs : oldConfig.withdraw.config.pairs,
                                confirmMessage: oldConfig.withdraw.config.confirmMessage == undefined ? newConfig.withdraw.config.confirmMessage : oldConfig.withdraw.config.confirmMessage,
                                message: oldConfig.withdraw.config.message == undefined ? newConfig.withdraw.config.message : oldConfig.withdraw.config.message
                            };
                        }
                    }

                    if(!oldConfig.pay){
                        updatedActionsConfig.pay = newConfig.pay;
                    }
                    else {
                        updatedActionsConfig.pay = {config: {}};
                        if(!oldConfig.pay.condition){
                            updatedActionsConfig.pay.condition = newConfig.pay.condition;
                        } else {
                            updatedActionsConfig.pay.condition = {
                                hide: oldConfig.pay.condition.hide == undefined ? newConfig.pay.condition.hide : oldConfig.pay.condition.hide,
                                hideCurrency: oldConfig.pay.condition.hideCurrency == undefined ? newConfig.pay.condition.hideCurrency : oldConfig.pay.condition.hideCurrency
                            };
                        }

                        if(!oldConfig.pay.config){
                            updatedActionsConfig.pay.config = newConfig.pay.config;
                        } else {
                            for(var key in newConfig.pay.config){
                                updatedActionsConfig.pay.config[key] = (
                                    oldConfig.pay.config[key] === undefined || oldConfig.pay.config[key] === newConfig.pay.config[key]
                                    ) ? newConfig.pay.config[key] : oldConfig.pay.config[key];
                            }
                        }
                    }

                    if(!oldConfig.exchange){
                        updatedActionsConfig.exchange = newConfig.exchange;
                    }
                    else {
                        updatedActionsConfig.exchange = {};
                        if(!oldConfig.exchange.condition){
                            updatedActionsConfig.exchange.condition = newConfig.exchange.condition;
                        } else {
                            updatedActionsConfig.exchange.condition = {
                                hide: oldConfig.exchange.condition.hide == undefined ? newConfig.exchange.condition.hide : oldConfig.exchange.condition.hide,
                                hideCurrency: oldConfig.exchange.condition.hideCurrency == undefined ? newConfig.exchange.condition.hideCurrency : oldConfig.exchange.condition.hideCurrency
                            };
                        }
                    }

                    if(!oldConfig.transfer){
                        updatedActionsConfig.transfer = newConfig.transfer;
                    }
                    else {
                        updatedActionsConfig.transfer = {};
                        if(!oldConfig.transfer.condition){
                            updatedActionsConfig.transfer.condition = newConfig.transfer.condition;
                        } else {
                            updatedActionsConfig.transfer.condition = {
                                hide: oldConfig.transfer.condition.hide == undefined ? newConfig.transfer.condition.hide : oldConfig.transfer.condition.hide,
                                hideCurrency: oldConfig.transfer.condition.hideCurrency == undefined ? newConfig.transfer.condition.hideCurrency : oldConfig.transfer.condition.hideCurrency
                            };
                        }
                    }

                    if(!oldConfig.card){
                        updatedActionsConfig.card = newConfig.card;
                    }
                    else {
                        updatedActionsConfig.card = {};
                        if(!oldConfig.card.condition){
                            updatedActionsConfig.card.condition = newConfig.card.condition;
                        } else {
                            updatedActionsConfig.card.condition = {
                                hide: oldConfig.card.condition.hide === undefined ? newConfig.card.condition.hide : oldConfig.card.condition.hide,
                                hideCurrency: oldConfig.card.condition.hideCurrency === undefined ? newConfig.card.condition.hideCurrency : oldConfig.card.condition.hideCurrency
                            };
                        }

                        if(!oldConfig.card.config){
                            updatedActionsConfig.card.config = newConfig.card.config;
                        } else {
                            updatedActionsConfig.card.config = oldConfig.card.config;
                        }
                    }

                    if(!oldConfig.redeem_voucher){
                        updatedActionsConfig.redeem_voucher = newConfig.redeem_voucher;
                    }
                    else {
                        updatedActionsConfig.redeem_voucher = {};
                        if(!oldConfig.redeem_voucher.condition){
                            updatedActionsConfig.redeem_voucher.condition = newConfig.redeem_voucher.condition;
                        } else {
                            updatedActionsConfig.redeem_voucher.condition = {
                                hide: oldConfig.redeem_voucher.condition.hide === undefined ? newConfig.redeem_voucher.condition.hide : oldConfig.redeem_voucher.condition.hide,
                                hideCurrency: oldConfig.redeem_voucher.condition.hideCurrency === undefined ? newConfig.redeem_voucher.condition.hideCurrency : oldConfig.redeem_voucher.condition.hideCurrency
                            };
                        }

                        if(!oldConfig.redeem_voucher.config){
                            updatedActionsConfig.redeem_voucher.config = newConfig.redeem_voucher.config;
                        } else {
                            updatedActionsConfig.redeem_voucher.config = oldConfig.redeem_voucher.config;
                        }
                    }

                    if(!oldConfig.prepaid){
                        updatedActionsConfig.prepaid = newConfig.prepaid;
                    }
                    else {
                        updatedActionsConfig.prepaid = {};
                        if(!oldConfig.prepaid.condition){
                            updatedActionsConfig.prepaid.condition = newConfig.prepaid.condition;
                        } else {
                            updatedActionsConfig.prepaid.condition = {
                                hide: oldConfig.prepaid.condition.hide === undefined ? newConfig.prepaid.condition.hide : oldConfig.prepaid.condition.hide,
                                hideCurrency: oldConfig.prepaid.condition.hideCurrency === undefined ? newConfig.prepaid.condition.hideCurrency : oldConfig.prepaid.condition.hideCurrency
                            };
                        }

                        if(!oldConfig.prepaid.config){
                            updatedActionsConfig.prepaid.config = newConfig.prepaid.config;
                        } else {
                            updatedActionsConfig.prepaid.config = {prepaidCurrencies: []};
                            for(var prop in oldConfig.prepaid.config){
                                var configObj = {
                                    providers: oldConfig.prepaid.config[prop].providers !== undefined ? oldConfig.prepaid.config[prop].providers : [],
                                    currency: oldConfig.prepaid.config[prop].currency !== undefined ? oldConfig.prepaid.config[prop].currency : prop
                                };
                                configObj.providers.forEach(function(provider, idx, arr){
                                    arr[idx] = $filter('capitalizeWord')(provider.replace(/_/g, ' '));
                                });
                                currenciesList.forEach(function(currency){
                                    if(currency.code == configObj.currency){
                                        configObj.currency = Object.assign({}, currency);
                                        return false;
                                    }
                                });
                                if(oldConfig.prepaid.config[prop].fixed){
                                    configObj.fixed = {
                                        default: oldConfig.prepaid.config[prop].fixed.default !== undefined ? oldConfig.prepaid.config[prop].fixed.default : null,
                                        options: oldConfig.prepaid.config[prop].fixed.options !== undefined ? oldConfig.prepaid.config[prop].fixed.options : {}
                                    };
                                }
                                updatedActionsConfig.prepaid.config.prepaidCurrencies.push(configObj);
                            }
                        }
                    }
                }

                /* Adding the extra option selected to map on the radio options */
                updatedActionsConfig.send.condition.optionSelected = (updatedActionsConfig.send.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.send.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.receive.condition.optionSelected = (updatedActionsConfig.receive.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.receive.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.deposit.condition.optionSelected = (updatedActionsConfig.deposit.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.deposit.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.deposit_voucher.condition.optionSelected = (updatedActionsConfig.deposit_voucher.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.deposit_voucher.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.donate.condition.optionSelected = (updatedActionsConfig.donate.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.donate.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.withdraw.condition.optionSelected = (updatedActionsConfig.withdraw.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.withdraw.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.withdraw_voucher.condition.optionSelected = (updatedActionsConfig.withdraw_voucher.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.withdraw_voucher.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.pay.condition.optionSelected = (updatedActionsConfig.pay.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.pay.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.exchange.condition.optionSelected = (updatedActionsConfig.exchange.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.exchange.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.transfer.condition.optionSelected = (updatedActionsConfig.transfer.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.transfer.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.card.condition.optionSelected = (updatedActionsConfig.card.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.card.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.redeem_voucher.condition.optionSelected = (updatedActionsConfig.redeem_voucher.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.redeem_voucher.condition.hide == false ? 'show' : 'hide'
                );
                updatedActionsConfig.prepaid.condition.optionSelected = (updatedActionsConfig.prepaid.condition.hideCurrency.length > 0) ? 'currency' : (
                    updatedActionsConfig.prepaid.condition.hide == false ? 'show' : 'hide'
                );

                /* Adding all the currencies for the multiselect */
                updatedActionsConfig.send.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.send.condition.hideCurrency, currenciesList);
                updatedActionsConfig.receive.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.receive.condition.hideCurrency, currenciesList);
                updatedActionsConfig.deposit.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.deposit.condition.hideCurrency, currenciesList);
                updatedActionsConfig.deposit_voucher.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.deposit_voucher.condition.hideCurrency, currenciesList);
                updatedActionsConfig.donate.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.donate.condition.hideCurrency, currenciesList);
                updatedActionsConfig.withdraw.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.withdraw.condition.hideCurrency, currenciesList);
                updatedActionsConfig.withdraw_voucher.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.withdraw_voucher.condition.hideCurrency, currenciesList);
                updatedActionsConfig.pay.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.pay.condition.hideCurrency, currenciesList);
                updatedActionsConfig.exchange.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.exchange.condition.hideCurrency, currenciesList);
                updatedActionsConfig.transfer.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.transfer.condition.hideCurrency, currenciesList);
                updatedActionsConfig.card.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.card.condition.hideCurrency, currenciesList);
                updatedActionsConfig.redeem_voucher.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.redeem_voucher.condition.hideCurrency, currenciesList);
                updatedActionsConfig.prepaid.condition.currenciesSelected = vm.getHideCurrenciesList(updatedActionsConfig.prepaid.condition.hideCurrency, currenciesList);

                updatedActionsConfig.withdraw.config.selectedPairs = [];
                if(updatedActionsConfig.withdraw.config.pairs.length > 0){
                    updatedActionsConfig.withdraw.config.pairs.forEach(function(pair){
                        var currencyPair = pair.split(':');
                        var pairObj = {
                            fromCurrency: null,
                            toCurrency: null
                        };
                        currenciesList.forEach(function(currency){
                            if(currency.code == currencyPair[0]){ pairObj.fromCurrency = currency; }
                            if(currency.code == currencyPair[1]){ pairObj.toCurrency = currency; }
                        });
                        updatedActionsConfig.withdraw.config.selectedPairs.push(pairObj);
                    });
                }
                
                return updatedActionsConfig;
            },
            getDefaultWalletAuthConfig: function(){
                return {
                    "identifier": "email",
                    "email": "",
                    "mobile": "",
                    "first_name": false,
                    "last_name": false,
                    "username": false,
                    "nationality": false,
                    "defaultNationality": "",
                    "disableRegister": false,
                    "confirm_password": false,
                    "localAuth": "",
                    "mfa": "",
                    "group": true,
                    "pin": "",
                    "sessions": true,
                    "session_duration": "",
                    "tier": 0,
                };
            },
            getUpdateWalletAuthConfig: function(oldConfig, newConfig, countriesList){
                var updatedAuthConfig = {};
                if(!oldConfig || oldConfig['auth'] == undefined){
                    updatedAuthConfig = newConfig['auth'];
                } else {
                    for(var key in newConfig.auth){
                        updatedAuthConfig[key] = (oldConfig.auth[key] === undefined || oldConfig.auth[key] == newConfig.auth[key]) ? newConfig.auth[key] : oldConfig.auth[key];
                    }
                }

                updatedAuthConfig.pin = {
                    "appLoad": oldConfig && oldConfig.pin && oldConfig.pin.appLoad !== undefined ? oldConfig.pin.appLoad : true,
                    "send": oldConfig && oldConfig.pin && oldConfig.pin.send !== undefined? oldConfig.pin.send : true,
                    "withdraw": oldConfig && oldConfig.pin && oldConfig.pin.withdraw !== undefined? oldConfig.pin.withdraw : true
                };

                if(updatedAuthConfig.defaultNationality !== ""){
                    updatedAuthConfig.selectedNationality = countriesList.find(function(country){
                        return country.code == updatedAuthConfig.defaultNationality;
                    });
                } else {
                    updatedAuthConfig.selectedNationality = null;
                }

                updatedAuthConfig.tierCheckOn = true;
                if(updatedAuthConfig.tier == 0){
                    updatedAuthConfig.tierCheckOn = false;
                    updatedAuthConfig.tier = null;
                }
                
                return updatedAuthConfig;
            },
            getDefaultOnboardingSectionsList: function(){
                return [
                    "business_information", 
                    "business_location", 
                    "business_legal", 
                    "business_incorporation_documents", 
                    "business_tax_certificate", 
                    "business_finances",
                    "business_trade_certificate",
                    "business_shareholder_information",
                    "business_banking",
                    "business_branding",
                  ];
            },
            getDefaultWalletOnboardingConfig: function(){
                return {
                    "locales": {
                      "en": {
                        "get_started_title": "Onboarding progress",
                        "get_started_subtitle": "Continue onboarding",
                        "business_information_title": "Tell us about your business",
                        "business_information_subtitle": "Welcome to the business onboarding process. Please share the basics of your business with us.",
                        "business_location_title": "Business location",
                        "business_location_subtitle": "This is the physical location of your business. Please note that a Post Office Box is not sufficient.",
                        "business_legal_title": "Legal information",
                        "business_legal_subtitle": "We require your business' legal information to ensure your business is accurately represented and everything is in order.",
                        "business_incorporation_documents_title": "Incorporation documents",
                        "business_incorporation_documents_subtitle": "Please upload any incorporation documents which would help us validate the legitimacy of your business.",
                        "business_tax_certificate_title": "Tax certificate",
                        "business_tax_certificate_subtitle": "",
                        "business_finances_title": "Financial statement",
                        "business_finances_subtitle": "",
                        "business_trade_certificate_title": "Trade certificate",
                        "business_trade_certificate_subtitle": "",
                        "business_shareholder_information_title": "Shareholder information",
                        "business_shareholder_information_subtitle": "",
                        "business_banking_title": "Banking information",
                        "business_banking_subtitle": "This is the bank account into which we'll settle all the transactions, less our transaction fee. We tally all transactions daily and settle on the following business day. Interbank payment delays may apply if you have an account with a different bank.",
                        "business_branding_title": "Business branding",
                        "business_branding_subtitle": "Configure the look and feel of your invoices and other documents with the brand settings below."
                      }
                    },
                    "business_onboarding": {
                      "hideSections": [
                        "business_information", 
                        "business_location", 
                        "business_legal", 
                        "business_incorporation_documents", 
                        "business_tax_certificate", 
                        "business_finances",
                        "business_trade_certificate",
                        "business_shareholder_information",
                        "business_banking",
                        "business_branding",
                      ]
                    },
                    "hideRegister": [],
                    "hideApp": []
                  };
            },
            getFormattedWalletOnboardingConfig: function(onboardingConfig){
                var vm = this;
                var defaultConfig = vm.getDefaultWalletOnboardingConfig();
                var sectionsList = vm.getDefaultOnboardingSectionsList();
                for(var i = 0; i < sectionsList.length; ++i){
                    if(onboardingConfig.business_onboarding.hideSections.indexOf(sectionsList[i]) > -1){
                        defaultConfig.locales.en[sectionsList[i] + '_title'] = onboardingConfig.locales.en[sectionsList[i] + '_title'];
                        defaultConfig.locales.en[sectionsList[i] + '_subtitle'] = onboardingConfig.locales.en[sectionsList[i] + '_subtitle'];
                        sectionsList.splice(i, 1);
                        --i;
                    }
                }
                onboardingConfig.locales.en = defaultConfig.locales.en;
                onboardingConfig.business_onboarding.hideSections = sectionsList;
                return onboardingConfig;
            },
            getUpdatedWalletOnboardingConfig: function(oldConfig, newConfig){
                var vm = this;
                var updatedOnboardingConfig = {};
                if(!oldConfig || oldConfig['onboarding'] == undefined){
                    updatedOnboardingConfig = newConfig['onboarding'];
                } else {
                    for(var key in newConfig.onboarding){
                        updatedOnboardingConfig[key] = (oldConfig.onboarding[key] === undefined || oldConfig.onboarding[key] == newConfig.onboarding[key]) ? newConfig.onboarding[key] : oldConfig.onboarding[key];
                    }
                }
                var sectionsList = vm.getDefaultOnboardingSectionsList();
                updatedOnboardingConfig.business_onboarding.hideSections.forEach(function(section){
                    var idx = sectionsList.indexOf(section);
                    if(idx > -1){ sectionsList.splice(idx, 1); }
                });
                updatedOnboardingConfig.business_onboarding.hideSections = sectionsList;
                return updatedOnboardingConfig;
            },
            getDefaultWalletCardsConfig: function(){
                return {
                    "home": {
                        "custom": []
                    }
                };
            },
            getUpdatedWalletCardsConfig: function(oldConfig, newConfig){
                var updatedCardsConfig = {};
                if(!oldConfig || oldConfig["cards"] == undefined || oldConfig["cards"]["home"] == undefined || oldConfig["cards"]["home"]["custom"] == undefined){
                    updatedCardsConfig = newConfig["cards"];
                }
                else {
                    oldConfig = oldConfig["cards"]["home"]["custom"];
                    if(!Array.isArray(oldConfig)){
                        updatedCardsConfig = newConfig["cards"];
                    } else {
                        updatedCardsConfig = {
                            home: {
                                custom: []
                            }
                        };
                        for(var i = 0; i < oldConfig.length; ++i){
                            var card = {
                                id: oldConfig[i].id !== undefined ? oldConfig[i].id : i,
                                image: oldConfig[i].image !== undefined ? oldConfig[i].image : "",
                                title: oldConfig[i].title !== undefined ? oldConfig[i].title : "",
                                dismiss: oldConfig[i].dismiss !== undefined ? oldConfig[i].dismiss : true,
                                description: oldConfig[i].description !== undefined ? oldConfig[i].description : ""
                            };

                            if(card.image == "blocks-card" || card.image == "circles-card" || card.image == "info"
                                || card.image == "alert" || card.image == "reward"|| card.image == "product"){
                                card.optionSelected = card.image;
                            } else {
                                card.optionSelected = "custom";
                            }

                            updatedCardsConfig.home.custom.push(card);
                        }
                    }
                }

                return updatedCardsConfig;
            },
            getDefaultWalletSlidersConfig: function(){
                return {
                    "preAuth": [],
                    "auth": [],
                    "postAuth": [],
                  }
            },
            getUpdatedSlidersList: function(oldConfig, field){
                var sliderList = [];
                if(oldConfig[field] !== undefined && Array.isArray(oldConfig[field])){
                    oldConfig[field].forEach(function(item, idx, arr){
                        sliderList.push({
                            id: item.id !== undefined ? item.id : idx,
                            image: item.image !== undefined ? item.image : "",
                            title: item.title !== undefined ? item.title : "",
                            description: item.description !== undefined ? item.description : ""
                        });
                    });
                }
                return sliderList;
            },
            getUpdatedWalletSlidersConfig: function(oldConfig, newConfig){
                var updateSlidersConfig = {};
                if(!oldConfig || oldConfig["sliders"] === undefined){
                    updateSlidersConfig = newConfig["sliders"];
                }
                else {
                    oldConfig = oldConfig["sliders"];
                    var vm = this;
                    updateSlidersConfig.preAuth = vm.getUpdatedSlidersList(oldConfig, 'preAuth');
                    updateSlidersConfig.auth = vm.getUpdatedSlidersList(oldConfig, 'auth');
                    updateSlidersConfig.postAuth = vm.getUpdatedSlidersList(oldConfig, 'postAuth');
                }

                return updateSlidersConfig;
            },
            getDefaultWalletColorsConfig: function(){
                return {
                    "primary": "#007a46",
                    "secondary": "#00b868",
                    "tertiary": "#FBFB8B",
                    "focus": "#FC4F96",
                    "primaryContrast": "#f6f6f6",
                    "secondaryContrast": "#303030",
                    "tertiaryContrast": "#000000",
                    "focusContrast": "#ffffff",
                    "warning": "#FC8755",
                    "error": "#f44336",
                    "success": "#4CAF50",
                    "positive": "#4CAF50",
                    "negative": "#f44336"
                };
            },
            getUpdatedWalletColorsConfig: function(oldConfig, newConfig){
                var updatedColorConfig = {};
                if(!oldConfig || oldConfig['colors'] === undefined) {
                    updatedColorConfig = newConfig['colors'];
                } else {
                    oldConfig = oldConfig['colors'];
                    newConfig = newConfig['colors'];

                    for(var key in newConfig){
                        updatedColorConfig[key] = (oldConfig[key] == undefined || oldConfig[key] == newConfig[key]) ? newConfig[key] : oldConfig[key];
                    }
                }
                return updatedColorConfig;
            },
            getDefaultWalletProductConfig: function(){
                return {
                    "currencies": [],
                    "defaultCurrency": "",
                    "sales": {
                        "userGroups": [],
                        "invoiceConfig": { "showDiscount": false, "showTax": false }
                    }
                };
            },
            getFormattedWalletProductConfig: function(walletProductConfig){   
                var lodash = window._;             
                walletProductConfig.defaultCurrency = walletProductConfig.defaultCurrency ? walletProductConfig.defaultCurrency.code : "";
                if(walletProductConfig.currencies.length > 0){
                    walletProductConfig.currencies = lodash.map(walletProductConfig.currencies, 'code');
                }
                if(walletProductConfig.sales.userGroups.length > 0){
                    walletProductConfig.sales.userGroups = lodash.map(walletProductConfig.sales.userGroups, 'text');
                }
                
                return walletProductConfig;
            },
            getUpdatedWalletProductConfig: function(oldConfig, newConfig, currenciesList, groupsList){
                var updatedProductConfig = {}, vm = this;

                if(!oldConfig || oldConfig['product'] === undefined) {
                    updatedProductConfig = newConfig['product'];
                } else {
                    oldConfig = oldConfig['product'];
                    newConfig = newConfig['product'];

                    for(var key in newConfig){
                        updatedProductConfig[key] = (oldConfig[key] == undefined || oldConfig[key] == newConfig[key]) ? newConfig[key] : oldConfig[key];
                    }
                }
                updatedProductConfig.defaultCurrency = currenciesList.find(function(currency){
                    return currency.code == updatedProductConfig.defaultCurrency;
                });
                if(updatedProductConfig.currencies.length > 0){
                    updatedProductConfig.currencies = vm.getHideCurrenciesList(updatedProductConfig.currencies, currenciesList);
                }
                
                if(updatedProductConfig.sales.userGroups.length > 0){
                    var groups = [];
                    updatedProductConfig.sales.userGroups.forEach(function(groupName){
                        var element = groupsList.find(function(group){
                            return group.name === groupName;
                        });
                        if(element){
                            groups.push(element);
                        }
                    });
                    updatedProductConfig.sales.userGroups = groups;
                }
                
                return updatedProductConfig;
            },
            getDefaultWalletProfileConfig: function(){
                return {
                    "hideID": false,
                    "labelID": "",
                    "addressTypes": []
                };
            },
            getUpdatedWalletProfileConfig: function(oldConfig, newConfig){
                var updatedProfileConfig = {};
                if(!oldConfig || oldConfig['profile'] == undefined){
                    updatedProfileConfig = newConfig['profile'];
                }
                else{
                    oldConfig = oldConfig.profile;
                    newConfig = newConfig.profile;

                    for(var key in newConfig){
                        updatedProfileConfig[key] = (oldConfig[key] == undefined || oldConfig[key] == newConfig[key]) ? newConfig[key] : oldConfig[key];
                    }
                }
                updatedProfileConfig.showLabelEditor = updatedProfileConfig.labelID.length > 0;
                return updatedProfileConfig;
            },
            getDefaultWalletSettingsConfig: function(){
                return {
                    "hideCryptoAccounts": false,
                    "hideBankAccounts": false,
                    "hidePrimaryCurrency": false,
                    "hideNotifications": false,
                    "hideSmsMfa": false,
                    "loopCurrencies": false
                };
            },
            getUpdatedtWalletSettingsConfig: function(oldConfig, newConfig){
                var updatedSettingsConfig = {};
                if(!oldConfig || oldConfig['settings'] == undefined){
                    updatedSettingsConfig = newConfig['settings'];
                }
                else{
                    oldConfig = oldConfig.settings;
                    newConfig = newConfig.settings;

                    for(var key in newConfig){
                        updatedSettingsConfig[key] = (oldConfig[key] == undefined || oldConfig[key] == newConfig[key]) ? newConfig[key] : oldConfig[key];
                    }
                }
                
                return updatedSettingsConfig;
            }
        };
    }

})();
