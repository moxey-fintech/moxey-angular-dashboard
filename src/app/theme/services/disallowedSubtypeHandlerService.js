/**
 * @author m.talukder
 * created on 11.27.2020
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.theme')
        .service('disallowedSubtypeHandlerService', disallowedSubtypeHandlerService);
  
    /** @ngInject */
    function disallowedSubtypeHandlerService() {
        return {
            mapAndFormatSubtypeObjects: function(disallowedSubtypesArr, subtypesList){ 
                var disallowedSubtypesObj = {};
                var formattedSubtypesArr = [];
                disallowedSubtypesArr.forEach(function(item){
                    var idKey = item.subtype.id;
                    if(disallowedSubtypesObj[idKey] === undefined){
                        disallowedSubtypesObj[idKey] = {
                            subtype: item.subtype,
                            setting: 'disallow',
                            custom_settings: {
                                currencies: [],
                                accounts: [],
                                combo: []
                            }
                        };
                    }
                    if(item.currency || item.account_definition){
                        disallowedSubtypesObj[idKey].setting = 'custom';
                        if(item.currency && item.account_definition){
                            var comboIdx = disallowedSubtypesObj[idKey].custom_settings.combo.findIndex(function(element){
                                return element.account_definition.name === item.account_definition.name;
                            });

                            if(comboIdx > -1){
                                disallowedSubtypesObj[idKey].custom_settings.combo[comboIdx].currencies.push(item.currencies);
                            } else {
                                disallowedSubtypesObj[idKey].custom_settings.combo.push({
                                    account_definition: item.account_definition,
                                    currencies: [item.currency]
                                });
                            }
                        } else {
                            (item.currency) ? disallowedSubtypesObj[idKey].custom_settings.currencies.push(item.currency)
                            : disallowedSubtypesObj[idKey].custom_settings.accounts.push(item.account_definition);
                             
                        }
                    }
                });
                for(var key in disallowedSubtypesObj){
                    if(disallowedSubtypesObj.hasOwnProperty(key)){
                        if(disallowedSubtypesObj[key].setting == 'custom'){
                            var formattedCustomSettings = [];
                            if(disallowedSubtypesObj[key].custom_settings.currencies.length > 0){
                                formattedCustomSettings.push({
                                    setting: 'currency',
                                    currencies: disallowedSubtypesObj[key].custom_settings.currencies
                                });
                            }
                            if(disallowedSubtypesObj[key].custom_settings.accounts.length > 0){
                                formattedCustomSettings.push({
                                    setting: 'account',
                                    accounts: disallowedSubtypesObj[key].custom_settings.accounts
                                });
                            }
                            if(disallowedSubtypesObj[key].custom_settings.combo.length > 0){
                                disallowedSubtypesObj[key].custom_settings.combo.forEach(function(comboConfig){
                                    formattedCustomSettings.push({
                                        setting: 'combo',
                                        account: comboConfig.account_definition,
                                        currencies: comboConfig.currencies
                                    });
                                });
                            }
                            disallowedSubtypesObj[key].custom_settings = formattedCustomSettings;
                        }
                        formattedSubtypesArr.push(disallowedSubtypesObj[key]);
                    }
                }
                disallowedSubtypesArr = formattedSubtypesArr;
                disallowedSubtypesArr.forEach(function(disallowedSubtype){
                    var idx = subtypesList.findIndex(function(subtype){
                        return subtype.id === disallowedSubtype.subtype.id;
                    });
    
                    if(idx > -1){
                        if(disallowedSubtype.setting === 'custom'){
                            subtypesList[idx].setting = 'custom';
                            subtypesList[idx].prev_setting = 'custom';
                            subtypesList[idx].custom_settings = disallowedSubtype.custom_settings;
                        } else {
                            subtypesList[idx].setting = 'disallow';
                            subtypesList[idx].prev_setting = 'disallow';
                        }
                    }
                });

                return subtypesList;
            },
            getFormattedDisallowedSubtypes: function(disallowedSubtypesList){
                var formattedDisallowedSubtypesList = [];
                disallowedSubtypesList.forEach(function(disallowedSubtype){
                    var gotCustomRule = false;
                    if(disallowedSubtype.setting === 'custom' && disallowedSubtype.custom_settings.length > 0){
                        disallowedSubtype.custom_settings.forEach(function(settingObj){
                            if(settingObj.setting == 'currency' && settingObj.currencies && settingObj.currencies.length > 0){
                                settingObj.currencies.forEach(function(currencyObj){
                                    formattedDisallowedSubtypesList.push({
                                        subtype: disallowedSubtype.id,
                                        currency: currencyObj.code,
                                        account_definition: null
                                    });
                                });
                                gotCustomRule = true;
                            } else if(settingObj.setting == 'account' && settingObj.accounts && settingObj.accounts.length > 0){
                                settingObj.accounts.forEach(function(accountDefObj){
                                    formattedDisallowedSubtypesList.push({
                                        subtype: disallowedSubtype.id,
                                        currency: null,
                                        account_definition: accountDefObj.name
                                    });
                                });
                                gotCustomRule = true;
                            } else if(settingObj.account && settingObj.currencies && settingObj.currencies.length > 0){
                                settingObj.currencies.forEach(function(currencyObj){
                                    formattedDisallowedSubtypesList.push({
                                        subtype: disallowedSubtype.id,
                                        currency: currencyObj.code,
                                        account_definition: settingObj.account.name
                                    });
                                });
                                gotCustomRule = true;                                
                            }
                        });
                    } 
                    if(!gotCustomRule) {
                        formattedDisallowedSubtypesList.push({
                            subtype: disallowedSubtype.id,
                            currency: null,
                            account_definition: null
                        });
                    }
                });
                return formattedDisallowedSubtypesList;
            }
        };
    }
  })();
  