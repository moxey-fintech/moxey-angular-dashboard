/**
 * @author m.talukder
 * created on 18.03.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('demoSetupService', demoSetupService);

    /** @ngInject */
    function demoSetupService($rootScope, $http, localStorageManagement, environmentConfig, errorHandler, Rehive,
                              currencyModifiers, serializeFiltersService, $filter, toastr, $location, $intercom) {

        return {
            token: null,
            companyName: "",
            userGroupTiers: [],
            merchantGroupTiers: [],
            currencyOptions: [],
            demoCurrency: {},
            txlmCurrency: {},
            emailTemplates: [],
            smsTemplates: [],
            tierRequirementsAdded: 0,
            extensionsList: {},
            setupCurrencies: function () {
                var vm = this;
                vm.currencyOptions.forEach(function (currency) {
                    if (currency.code === "DEMO") {
                        vm.demoCurrency = currency;
                    } else if (currency.code === "TXLM") {
                        vm.txlmCurrency = currency;
                    }
                });
                vm.trackTasks('apply');
            },
            isJson: function (str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            },
            trackTasks: function (apply) {
                $rootScope.tasksCompleted++;
            },
            configureCompanyDetails: function () {
                var vm = this;
                var demoCompany = {
                    name: vm.companyName,
                    description: vm.companyName + " is a multi cryptocurrencies app for spending online.",
                    website: "",
                    email: "",
                    logo: null,
                    icon: null,
                    address: null,
                    settings: {
                        password_set_url: "https://moxey.ai/password/reset/confirm",
                        password_reset_url: "https://moxey.ai/password/reset/confirm",
                        email_verification_url: "https://moxey.ai/email/verify",
                    },
                    public: false,
                    config: {  
                        pin:{  
                           withdraw: true,
                           send: true,
                           appLoad: true
                        },
                        auth:{  
                           username: false,
                           pin: "optional",
                           mfa: "",
                           first_name: false,
                           confirm_password: false,
                           last_name: false,
                           identifier: "email",
                           email: "optional"
                        },
                        cards:{  
                           home:{  
                              general:{  
                                 welcome: true,
                                 verify: true
                              },
                              custom:[  
                                 {  
                                    title: "Welcome to " + vm.companyName,
                                    image: "blocks-card",
                                    dismiss: true,
                                    id: 0,
                                    description: "Multi-currency app for online payments and rewards."
                                 }
                              ]
                           }
                        }
                     }
                };
                demoCompany.config = JSON.stringify(demoCompany.config);

                if (vm.isJson(demoCompany.config)) {
                    demoCompany.config = JSON.parse(demoCompany.config);
                }

                demoCompany = serializeFiltersService.objectFilters(demoCompany);
                if (vm.token) {
                    Rehive.admin.company.update(demoCompany).then(function (res) {
                        $rootScope.pageTopObj.companyObj = res;
                        Rehive.admin.company.settings.update(demoCompany.settings).then(function (res) {
                            vm.trackTasks('apply');
                            vm.getCompanyNotifications();
                            $rootScope.$apply();
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $rootScope.$apply();
                        });
                        $rootScope.$apply();
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            getCompanyNotifications: function () {
                var notifications = [], vm = this;
                if (vm.token) {
                    Rehive.admin.notifications.get().then(function (res) {
                        vm.trackTasks('apply');
                        res.forEach(function (notification) {
                            if (notification.description == "Account password reset notifications" || notification.description == "Account verification notifications") {
                                notification.enabled = false;
                                notifications.push(notification);
                            }
                        });
                        if (notifications.length > 0) {
                            vm.updateCompanyNotifications(notifications[0], null);
                            vm.updateCompanyNotifications(notifications[1], 'last');
                        } else {
                            vm.setupUserGroups();
                        }
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            updateCompanyNotifications: function (notification, last) {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.notifications.update(notification.id, {enabled: notification.enabled}).then(function (res) {
                        if (last) {
                            vm.trackTasks('apply');
                            vm.setupUserGroups();
                        }
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            setupUserGroups: function () {
                var vm = this,
                    userGroup = {
                        name: "user",
                        label: "User",
                        public: true,
                        default: true,
                        description: "Users are limited to their own accounts."
                    },
                    managerGroup = {
                        name: "manager",
                        label: "Manager",
                        public: false,
                        default: false,
                        description: "Managers are able to make transactions from their own operational account, " +
                            "and view and verify user data. Managers do not have access to system configurations."
                    },
                    supportGroup = {
                        name: "support",
                        label: "Support",
                        public: false,
                        default: false,
                        description: "Support have limited access to make transactions from their own operational account, " +
                            "view and verify user data. Support do not have access to system configurations."
                    },
                    merchantGroup = {
                        name: "merchant",
                        label: "Merchant",
                        public: false,
                        default: false,
                        description: "Merchants are limited to their own accounts."
                    };
                vm.addGroup(managerGroup, null);
                vm.addGroup(supportGroup, null);
                vm.addGroup(userGroup, null);
                vm.addGroup(merchantGroup, 'last');
                vm.trackTasks('apply');
                //vm.addGroup(serviceGroup, null);
                //vm.addGroup(adminGroup, 'last');
            },
            addGroup: function (groupObj, last) {
                var vm = this;
                if (vm.token) {
                    if (groupObj.name === 'admin') {
                        Rehive.admin.groups.update(groupObj.name, {description: "Admin users have full access to all aspects of the company."})
                            .then(function (res) {
                                $rootScope.$apply();
                            }, function (error) {
                                errorHandler.evaluateErrors(error);
                                errorHandler.handleErrors(error);
                                $rootScope.$apply();
                            });
                    } else if (groupObj.name === 'service') {
                        Rehive.admin.groups.update(groupObj.name, {description: "Services have access to specific permissions that’s needed for each service."})
                            .then(function (res) {
                                $rootScope.$apply();
                            }, function (error) {
                                errorHandler.evaluateErrors(error);
                                errorHandler.handleErrors(error);
                                $rootScope.$apply();
                            });
                    } else {
                        Rehive.admin.groups.create(groupObj).then(function (res) {
                            if (last) {
                                vm.trackTasks('apply');
                                vm.setupGroupPermissions();
                            }
                            $rootScope.$apply();
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $rootScope.$apply();
                        });
                    }
                }
            },
            setupGroupPermissions: function () {
                var vm = this;
                var userPermissions = [
                    {type: 'account', level: "view", section: 'user'},
                    {type: 'address', level: "view", section: 'user'},
                    {type: 'bankaccount', level: "view", section: 'user'},
                    {type: 'currency', level: "view", section: 'user'},
                    {type: 'company', level: "view", section: 'user'},
                    {type: 'cryptoaccount', level: "view", section: 'user'},
                    {type: 'document', level: "view", section: 'user'},
                    {type: 'email', level: "view", section: 'user'},
                    {type: 'group', level: "view", section: 'user'},
                    {type: 'mfa', level: "view", section: 'user'},
                    {type: 'mobile', level: "view", section: 'user'},
                    {type: 'token', level: "view", section: 'user'},
                    {type: 'transaction', level: "view", section: 'user'},
                    {type: 'transactionsubtypes', level: "view", section: 'user'},
                    {type: 'user', level: "view", section: 'user'}
                ];
                var len = userPermissions.length;
                for (var i = 0; i < len; ++i) {
                    userPermissions.push({type: userPermissions[i].type, level: "add", section: 'user'});
                    userPermissions.push({type: userPermissions[i].type, level: "change", section: 'user'});
                    userPermissions.push({type: userPermissions[i].type, level: "delete", section: 'user'});
                }
                var managerAdminPermissions = [
                    {type: 'accesscontrolrule', level: "view", section: 'admin'},
                    {type: 'account', level: "view", section: 'admin'},
                    {type: 'address', level: "view", section: 'admin'},
                    {type: 'bankaccount', level: "view", section: 'admin'},
                    {type: 'currency', level: "view", section: 'admin'},
                    {type: 'company', level: "view", section: 'admin'},
                    {type: 'cryptoaccount', level: "view", section: 'admin'},
                    {type: 'document', level: "view", section: 'admin'},
                    {type: 'email', level: "view", section: 'admin'},
                    {type: 'group', level: "view", section: 'admin'},
                    {type: 'mfa', level: "view", section: 'admin'},
                    {type: 'mobile', level: "view", section: 'admin'},
                    {type: 'notification', level: "view", section: 'admin'},
                    {type: 'request', level: "view", section: 'admin'},
                    {type: 'service', level: "view", section: 'admin'},
                    {type: 'token', level: "view", section: 'admin'},
                    {type: 'transaction', level: "view", section: 'admin'},
                    {type: 'transactionsubtypes', level: "view", section: 'admin'},
                    {type: 'user', level: "view", section: 'admin'},
                    {type: 'webhook', level: "view", section: 'admin'}
                ];
                len = managerAdminPermissions.length;
                for (var i = 0; i < len; ++i) {
                    if (managerAdminPermissions[i].type === 'address' || managerAdminPermissions[i].type === 'bankaccount'
                        || managerAdminPermissions[i].type === 'cryptoaccount' || managerAdminPermissions[i].type === 'document'
                        || managerAdminPermissions[i].type === 'email' || managerAdminPermissions[i].type === 'mobile' || managerAdminPermissions[i].type === 'user') {
                        managerAdminPermissions.push({
                            type: managerAdminPermissions[i].type,
                            level: "add",
                            section: "admin"
                        });
                        managerAdminPermissions.push({
                            type: managerAdminPermissions[i].type,
                            level: "change",
                            section: "admin"
                        });
                        managerAdminPermissions.push({
                            type: managerAdminPermissions[i].type,
                            level: "delete",
                            section: "admin"
                        });
                    }
                }
                var supportAdminPermissions = [
                    {type: 'account', level: "view", section: 'admin'},
                    {type: 'address', level: "view", section: 'admin'},
                    {type: 'address', level: "add", section: 'admin'},
                    {type: 'address', level: "change", section: 'admin'},
                    {type: 'address', level: "delete", section: 'admin'},
                    {type: 'bankaccount', level: "view", section: 'admin'},
                    {type: 'bankaccount', level: "add", section: 'admin'},
                    {type: 'bankaccount', level: "change", section: 'admin'},
                    {type: 'bankaccount', level: "delete", section: 'admin'},
                    {type: 'currency', level: "view", section: 'admin'},
                    {type: 'cryptoaccount', level: "view", section: 'admin'},
                    {type: 'cryptoaccount', level: "add", section: 'admin'},
                    {type: 'cryptoaccount', level: "change", section: 'admin'},
                    {type: 'cryptoaccount', level: "delete", section: 'admin'},
                    {type: 'document', level: "view", section: 'admin'},
                    {type: 'document', level: "add", section: 'admin'},
                    {type: 'document', level: "change", section: 'admin'},
                    {type: 'document', level: "delete", section: 'admin'},
                    {type: 'email', level: "view", section: 'admin'},
                    {type: 'email', level: "add", section: 'admin'},
                    {type: 'email', level: "change", section: 'admin'},
                    {type: 'email', level: "delete", section: 'admin'},
                    {type: 'group', level: "view", section: 'admin'},
                    {type: 'mobile', level: "view", section: 'admin'},
                    {type: 'mobile', level: "add", section: 'admin'},
                    {type: 'mobile', level: "change", section: 'admin'},
                    {type: 'mobile', level: "delete", section: 'admin'},
                    {type: 'transaction', level: "view", section: 'admin'},
                    {type: 'transaction', level: "add", section: 'admin'},
                    {type: 'transactionsubtypes', level: "view", section: 'admin'},
                    {type: 'user', level: "view", section: 'admin'},
                    {type: 'user', level: "add", section: 'admin'},
                    {type: 'user', level: "change", section: 'admin'},
                    {type: 'user', level: "delete", section: 'admin'},
                ];
                vm.addGroupPermissions('manager', userPermissions, null);
                vm.addGroupPermissions('manager', managerAdminPermissions, null);
                vm.addGroupPermissions('support', userPermissions, null);
                vm.addGroupPermissions('support', supportAdminPermissions, null);
                vm.addGroupPermissions('user', userPermissions, null);
                vm.addGroupPermissions('merchant', userPermissions, 'last');
                vm.trackTasks('apply');
            },
            addGroupPermissions: function (groupName, permissionsArray, last) {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.groups.permissions.create(groupName, {permissions: permissionsArray}).then(function (res) {
                        if (last) {
                            vm.trackTasks('apply');
                            vm.setupGroupTiers();
                        }
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            setupGroupTiers: function () {
                var vm = this,
                    tier1 = {
                        level: 1,
                        name: "1",
                        description: "Basic"
                    },
                    tier2 = {
                        level: 2,
                        name: "2",
                        description: "Intermediary"
                    },
                    tier3 = {
                        level: 3,
                        name: "1",
                        description: "Advanced"
                    };
                vm.addGroupTiers("user", tier1, null);
                vm.addGroupTiers("user", tier2, null);
                vm.addGroupTiers("user", tier3, null);
                vm.addGroupTiers("merchant", tier1, null);
                vm.addGroupTiers("merchant", tier2, null);
                vm.addGroupTiers("merchant", tier3, "last");
                vm.trackTasks('apply');
            },
            addGroupTiers: function (groupName, tierObj, last) {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.groups.tiers.create(groupName, tierObj).then(function (res) {
                        if (last) {
                            vm.trackTasks('apply');
                            vm.getAllTiers();
                        }
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            getAllTiers: function () {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.groups.tiers.get("user").then(function (res) {
                        vm.userGroupTiers = res;
                        for (var i = 0; i < vm.userGroupTiers.length; ++i) {
                            if (vm.userGroupTiers[i].level === 2 || vm.userGroupTiers[i].level === 3) {
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "first_name");
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "last_name");
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "email_address");
                            }
                            if (vm.userGroupTiers[i].level === 3) {
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "nationality");
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "birth_date");
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "id_number");
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "mobile_number");
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "proof_of_identity");
                                vm.updateTierRequirements("user", vm.userGroupTiers[i], "proof_of_address");
                            }
                        }
                        Rehive.admin.groups.tiers.get("merchant").then(function (res) {
                            vm.trackTasks('apply');
                            vm.merchantGroupTiers = res;
                            for (var i = 0; i < vm.merchantGroupTiers.length; ++i) {
                                if (vm.merchantGroupTiers[i].level === 2 || vm.merchantGroupTiers[i].level === 3) {
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "first_name");
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "last_name");
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "email_address");
                                }
                                if (vm.merchantGroupTiers[i].level === 3) {
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "nationality");
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "birth_date");
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "id_number");
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "mobile_number");
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "proof_of_identity");
                                    vm.updateTierRequirements("merchant", vm.merchantGroupTiers[i], "proof_of_address");
                                }
                            }
                            $rootScope.$apply();
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $rootScope.$apply();
                        });
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            updateTierRequirements: function (groupName, tierObj, requirementName) {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.groups.tiers.requirements.create(groupName, tierObj.id, {
                        "requirement": requirementName
                    }).then(function (res) {
                        ++vm.tierRequirementsAdded;
                        if (vm.tierRequirementsAdded === 24) {
                            vm.trackTasks('apply');
                            vm.setupTransactionSubtypes();
                            $rootScope.$apply();
                        }
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            setupTransactionSubtypes: function () {
                var vm = this,
                    subtypes = [
                    {
                        name: "issue",
                        label: "Issue",
                        tx_type: "credit",
                        description: "Subtype is used to issue funds to the destination address when issuing crypto assets."
                    },
                    {
                        name: "fund",
                        label: "Fund",
                        tx_type: "credit",
                        description: "Subtype is used to funds operational accounts."
                    },
                    {
                        name: "fee",
                        label: "Fee",
                        tx_type: "debit",
                        description: "Subtype is used to record fees on transactions."
                    },
                    {
                        name: "deposit",
                        label: "Deposit",
                        tx_type: "credit",
                        description: "Subtype is used to credit the destination account balance for a deposit transaction."
                    },
                    {
                        name: "deposit",
                        label: "Deposit",
                        tx_type: "debit",
                        description: "Subtype is used to debit the source account balance for a deposit transaction."
                    },
                    {
                        name: "withdraw",
                        label: "Withdraw",
                        tx_type: "debit",
                        description: "Subtype is used to debit the source account balance for a withdraw transaction."
                    },
                    {
                        name: "send",
                        label: "Send",
                        tx_type: "debit",
                        description: "Subtype is used to debit the source account balance for a transfer transaction."
                    },
                    {
                        name: "receive",
                        label: "Receive",
                        tx_type: "credit",
                        description: "Subtype is used to credit the destination account balance for a transfer transaction."
                    },
                    {
                        name: "reward",
                        label: "Reward",
                        tx_type: "credit",
                        description: "Subtype is used to credit the destination account balance for a rewards transaction."
                    },
                    {
                        name: "reward",
                        label: "Reward",
                        tx_type: "debit",
                        description: "Subtype is used to debit the source account balance for a rewards transaction."
                    },
                    {
                        name: "sale",
                        label: "Sale",
                        tx_type: "credit",
                        description: "Subtype is used to credit the destination account balance for a purchase transaction in the marketplace or in store."
                    },
                    {
                        name: "purchase",
                        label: "Purchase",
                        tx_type: "debit",
                        description: "Subtype is used to debit the source account balance for a purchase transaction in the marketplace or in store."
                    },
                    {
                        name: "mass_send",
                        label: "Mass send",
                        tx_type: "debit",
                        description: "Subtype is used to debit the source account balance for bulk transfer transactions."
                    },
                    {
                        name: "mass_send",
                        label: "Mass send",
                        tx_type: "credit",
                        description: "Subtype is used to credit the destination account balance for bulk transfer transactions."
                    }
                ];

                for (var i = 0; i < subtypes.length; ++i) {
                    if (i === (subtypes.length - 1)) {
                        vm.trackTasks('apply');
                        vm.addTransactionSubtype(subtypes[i], 'last');
                    } else {
                        vm.addTransactionSubtype(subtypes[i], null);
                    }
                }

            },
            addTransactionSubtype: function (subtypeObj, last) {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.subtypes.create(subtypeObj).then(function (res) {
                        if (last) {
                            vm.trackTasks('apply');
                            vm.fetchExtensionsList();
                        }
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            fetchExtensionsList: function(){
                var vm = this;
                if(vm.token){
                    $http.get(environmentConfig.API + 'admin/services/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        var servicesList =  res.data.data.results;
                        var list = {};
                        for(var i = 0; i < servicesList.length; ++i){
                            list[servicesList[i].slug] = {id: servicesList[i].id, url: servicesList[i].url};
                        }
                        vm.extensions = list;
                        vm.configureExtensionsList();
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                        vm.configureExtensionsList();
                    });
                }
            },
            configureExtensionsList: function(){
                var vm = this;
                if(!vm.extensionsList["batch_send_service"]){ vm.extensionsList["batch_send_service"] = { id: 80, url: 'https://csv-to-rehive.services.rehive.io/'}; }
                if(!vm.extensionsList["bitcoin_testnet_service"]){ vm.extensionsList["bitcoin_testnet_service"] = { id: 12, url: 'https://bitcoin-testnet.services.rehive.io/api/1/'};}
                if(!vm.extensionsList["notifications_service"]){ vm.extensionsList["notifications_service"] = { id: 4, url: 'https://notification.services.rehive.io/api/'}; }
                if(!vm.extensionsList["stellar_testnet_service"]){ vm.extensionsList["stellar_testnet_service"] = { id: 78, url: 'https://stellar-testnet.services.rehive.io/api/1/'}; }
                if(!vm.extensionsList["rewards_service"]){ vm.extensionsList["rewards_service"] = { id: 45, url: 'https://reward.services.rehive.io/api/'}; }
                if(!vm.extensionsList["product_service"]){ vm.extensionsList["product_service"] = { id: 79, url: 'https://product.services.rehive.io/api/'}; }
                vm.setupBatchSendService();              
            },
            setupBatchSendService: function () {
                var vm = this;
                if (vm.token) {
                    $http.put(environmentConfig.API + 'admin/services/' + vm.extensionsList["batch_send_service"].id + '/', {
                        terms_and_conditions: true,
                        active: true
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        vm.trackTasks(null);
                        vm.setupStellarTestnetService();
                        //this.setupBitcoinTestnetService();
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            setupBitcoinTestnetService: function () {
                var vm = this,
                    bitCoinSubtypes = {
                    transaction_credit_subtype: "deposit",
                    transaction_debit_subtype: "withdraw",
                    transaction_fee_subtype: "fee",
                    transaction_fund_subtype: "fund",
                };

                bitCoinSubtypes = serializeFiltersService.objectFilters(bitCoinSubtypes);

                if (vm.token) {
                    $http.put(environmentConfig.API + 'admin/services/' + vm.extensionsList["bitcoin_testnet_service"].id + '/', {
                        terms_and_conditions: true,
                        active: true
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        $http.patch(vm.extensionsList["bitcoin_testnet_service"].url + 'admin/company/configuration/', bitCoinSubtypes, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function (res) {
                            vm.trackTasks(null);
                            vm.setupStellarTestnetService();
                        }).catch(function (error) {
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            setupStellarTestnetService: function () {
                var vm = this,
                    stellarSubtypes = {
                    transaction_credit_subtype: "deposit",
                    transaction_debit_subtype: "withdraw",
                    transaction_fee_subtype: "fee",
                    transaction_fund_subtype: "fund",
                    transaction_issue_subtype: "issue",
                };

                stellarSubtypes = serializeFiltersService.objectFilters(stellarSubtypes);

                if (vm.token) {
                    $http.put(environmentConfig.API + 'admin/services/' + vm.extensionsList["stellar_testnet_service"].id + '/', {
                        terms_and_conditions: true,
                        active: true
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        $http.patch(vm.extensionsList["stellar_testnet_service"].url + 'admin/company/', {has_completed_setup: true}, {
                            headers: {
                                'Content-type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function (res) {
                            $http.patch(vm.extensionsList["stellar_testnet_service"].url + 'admin/company/configuration/', stellarSubtypes, {
                                headers: {
                                    'Content-type': 'application/json',
                                    'Authorization': vm.token
                                }
                            }).then(function (res) {
                                vm.trackTasks(null);
                                vm.fundStellarTestnetHotwallet();
                            }).catch(function (error) {
                                errorHandler.evaluateErrors(error.data);
                                errorHandler.handleErrors(error);
                            });
                        }).catch(function (error) {
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            fundStellarTestnetHotwallet: function (recall) {
                var vm = this;
                if (vm.token) {
                    $http.get(vm.extensionsList["stellar_testnet_service"].url + 'admin/hotwallet/fund', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        var hotwalletFundObj = res.data.data;
                        var url = "https://stellar-friendbot.extensions.rehive.io/fund?addr=" + hotwalletFundObj.account_address + "&network=TESTNET";
                        $http.get(url, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(function (res) {
                            vm.trackTasks(null);
                            vm.addDemoAsset(hotwalletFundObj.account_address);
                        }).catch(function (error) {
                            if (error.status === 400) {
                                vm.trackTasks(null);
                                vm.addDemoAsset(hotwalletFundObj.account_address);
                            } else {
                                errorHandler.evaluateErrors(error.data);
                                errorHandler.handleErrors(error);
                            }
                        });
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });

                }
            },
            addDemoAsset: function (issuerAddress) {
                var vm = this,
                    demoAssetParams = {
                    currency_code: "DEMO",
                    address: issuerAddress,
                    description: "Demo token",
                    symbol: 'd',
                    unit: "demo"
                };
                demoAssetParams = serializeFiltersService.objectFilters(demoAssetParams);

                $http.post(vm.extensionsList["stellar_testnet_service"].url + 'admin/asset/', demoAssetParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    vm.trackTasks(null);
                    vm.setupNotificationService();
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            },
            setupNotificationService: function () {
                var vm = this;
                if(vm.token){
                    $http.put(environmentConfig.API + 'admin/services/' + vm.extensionsList["notifications_service"].id + '/', {terms_and_conditions: true, active: true}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        vm.trackTasks(null);
                        vm.getEmailNotificationTemplates();
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            getEmailNotificationTemplates: function () {
                var vm = this;
                if (vm.token) {
                    $http.get(vm.extensionsList["notifications_service"].url + 'admin/templates/?type=email&page_size=250', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        vm.emailTemplates = res.data.data.results;
                        vm.trackTasks(null);
                        vm.getSmsNotificationTemplates();
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            getSmsNotificationTemplates: function () {
                var vm = this;
                if (vm.token) {
                    $http.get(vm.extensionsList["notifications_service"].url + 'admin/templates/?type=sms&page_size=250', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        vm.smsTemplates = res.data.data.results;
                        vm.trackTasks(null);
                        vm.enableBulkNotifications();
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            enableBulkNotifications: function () {
                var vm = this;
                vm.emailTemplates.forEach(function (emailNotification) {
                    vm.addNotification(emailNotification, null, 'email');
                });
                vm.smsTemplates.forEach(function (smsNotification, index, arr) {
                    if (index === (arr.length - 1)) {
                        vm.trackTasks(null);
                        vm.addNotification(smsNotification, 'last', 'sms');
                    } else {
                        vm.addNotification(smsNotification, null, 'sms');
                    }
                });
            },
            addNotification: function (notification, last, type) {
                var vm = this, notificationObj = {};
                if (type == 'email') {
                    notificationObj = {
                        name: notification.name,
                        description: notification.description,
                        subject: notification.subject,
                        event: notification.event,
                        html_message: notification.html_message,
                        text_message: notification.text_message,
                        to_email: notification.to_email,
                        expression: notification.expression,
                        enabled: notification.enabled,
                        preference_enabled: false,
                        type: 'email'
                    };
                } else {
                    notificationObj = {
                        name: notification.name,
                        description: notification.description,
                        subject: notification.subject,
                        event: notification.event,
                        sms_message: notification.sms_message,
                        to_mobile: notification.to_mobile,
                        expression: notification.expression,
                        enabled: notification.enabled,
                        preference_enabled: false,
                        type: 'sms'
                    };
                }

                if (vm.token) {
                    $http.post(vm.extensionsList["notifications_service"].url + 'admin/notifications/', notificationObj, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (last) {
                            vm.trackTasks(null);
                            vm.getCompanyCurrencies();
                        }
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            getCompanyCurrencies: function () {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.currencies.get({
                        filters: {
                            page: 1,
                            page_size: 250,
                            archived: false
                        }
                    }).then(function (res) {
                        if (vm.currencyOptions.length > 0) {
                            vm.currencyOptions.length = 0;
                        }
                        vm.currencyOptions = res.results.slice();

                        vm.currencyOptions.sort(function (a, b) {
                            return a.code.localeCompare(b.code);
                        });
                        vm.currencyOptions.sort(function (a, b) {
                            return a.unit.localeCompare(b.unit);
                        });
                        vm.trackTasks('apply');
                        vm.setupCurrencies();
                        vm.setupAccountConfigurations();
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            setupAccountConfigurations: function () {
                var vm = this,
                    operationalAccountConfig = {
                        name: "operational",
                        label: "Operational",
                        default: true,
                        primary: true,
                        list: []
                    },
                    userAccountConfig = {
                        name: "default",
                        label: "Default",
                        default: true,
                        primary: true,
                        list: []
                    };

                operationalAccountConfig = serializeFiltersService.objectFilters(operationalAccountConfig);
                userAccountConfig = serializeFiltersService.objectFilters(userAccountConfig);

                vm.addGroupAccountConfigurations("user", userAccountConfig, null);
                vm.addGroupAccountConfigurations("manager", operationalAccountConfig, null);
                vm.addGroupAccountConfigurations("support", operationalAccountConfig, null);
                vm.addGroupAccountConfigurations("merchant", operationalAccountConfig, null);
                vm.addGroupAccountConfigurations("admin", operationalAccountConfig, 'last');
                vm.trackTasks('apply');
            },
            addGroupAccountConfigurations: function (groupName, groupAccountConfigurationParams, last) {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.groups.accountConfigurations.create(groupName, groupAccountConfigurationParams).then(function (res) {
                        if (last) {
                            vm.trackTasks('apply');
                            vm.addGroupAccountConfigurationCurrency(groupName, res, last);
                        } else {
                            vm.addGroupAccountConfigurationCurrency(groupName, res, null);
                        }
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            addGroupAccountConfigurationCurrency: function (groupName, account, last) {
                var vm = this;
                vm.currencyOptions.forEach(function (element, index, array) {
                    Rehive.admin.groups.accountConfigurations.currencies.create(groupName, account.name, {currency: element.code}).then(function (res) {
                        if (last && index === (array.length - 1)) {
                            vm.trackTasks('apply');
                            vm.setupProductService();
                        }
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                });
            },
            setupProductService: function () {
                var vm = this,
                    newProduct1 = {
                        name: "Steam voucher",
                        description: "$10 Steam voucher",
                        quantity: 100,
                        type: "virtual",
                        code: "STEA10",
                        enabled: true,
                        prices: [
                            {currency: vm.demoCurrency, amount: 50000000},
                            {currency: vm.txlmCurrency, amount: 20000}
                        ]
                    },
                    newProduct2 = {
                        name: "Amazon voucher",
                        description: "$50 Amazon voucher",
                        quantity: 100,
                        type: "virtual",
                        code: "AMAZ50",
                        enabled: true,
                        prices: [
                            {currency: vm.demoCurrency, amount: 100000000},
                            {currency: vm.txlmCurrency, amount: 50000}
                        ]
                    };

                newProduct1 = serializeFiltersService.objectFilters(newProduct1);
                newProduct2 = serializeFiltersService.objectFilters(newProduct2);

                if (vm.token) {
                    $http.put(environmentConfig.API + 'admin/services/' + vm.extensionsList["product_service"].id + '/', {
                        terms_and_conditions: true,
                        active: true
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        $http.post(vm.extensionsList["product_service"].url +  'admin/products/', newProduct1, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function (res) {
                            if (res.status === 201 || res.status === 200) {
                                vm.formatPricesOfProducts(res.data.data.id, newProduct1);
                                $http.post(vm.extensionsList["product_service"].url + 'admin/products/', newProduct2, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': vm.token
                                    }
                                }).then(function (res) {
                                    if (res.status === 201 || res.status === 200) {
                                        vm.trackTasks(null);
                                        vm.formatPricesOfProducts(res.data.data.id, newProduct2);
                                    }
                                }).catch(function (error) {
                                    errorHandler.evaluateErrors(error.data);
                                    errorHandler.handleErrors(error);
                                });
                            }
                        }).catch(function (error) {
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            formatPricesOfProducts: function (id, product) {
                var vm = this;
                product.prices.forEach(function (price, idx, array) {
                    if (idx === (array.length - 1) && product.code === "AMAZ50") {
                        vm.trackTasks('apply');
                        vm.addPriceToProducts(id, {currency: price.currency.code, amount: price.amount}, 'last');
                        return false;
                    }
                    vm.addPriceToProducts(id, {currency: price.currency.code, amount: price.amount}, null);
                });
            },
            addPriceToProducts: function (productId, priceObj, last) {
                var vm = this;
                if (vm.token) {
                    $http.post(vm.extensionsList["product_service"].url + 'admin/products/' + productId + '/prices/', priceObj, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201 || res.status === 200) {
                            if (last) {
                                vm.trackTasks(null);
                                vm.getAllUsers();
                            }
                        }
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            getAllUsers: function () {
                var vm = this;
                if (vm.token) {
                    Rehive.admin.users.get().then(function (res) {
                        vm.trackTasks('apply');
                        vm.configureAdminAccount(res.results);
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            getAdminUser: function (usersArray) {
                var vm = this, adminUser = {};
                usersArray.forEach(function (userObj) {
                    if (userObj.email) {
                        adminUser = {
                            id: userObj.id,
                            first_name: userObj.first_name,
                            last_name: userObj.last_name,
                            email: userObj.email,
                            mobile: userObj.mobile,
                            groupName: userObj.groups.length > 0 ? userObj.groups[0].name : null,
                            created: userObj.created ? $filter("date")(userObj.created, 'mediumDate') + ' ' + $filter("date")(userObj.created, 'shortTime') : null,
                            updated: userObj.updated ? $filter("date")(userObj.updated, 'mediumDate') + ' ' + $filter("date")(userObj.updated, 'shortTime') : null,
                            archived: $filter("capitalizeWord")(userObj.archived),
                            status: $filter("capitalizeWord")(userObj.status),
                            kycStatus: userObj.kyc ? $filter("capitalizeWord")(userObj.kyc.status) : null,
                            last_login: userObj.last_login ? $filter("date")(userObj.last_login, 'mediumDate') + ' ' + $filter("date")(userObj.last_login, 'shortTime') : null,
                            verified: userObj.verified ? 'Yes' : 'No',
                            id_number: userObj.id_number,
                            nationality: userObj.nationality ? $filter("isoCountry")(userObj.nationality) : null,
                            language: userObj.language,
                            timezone: userObj.timezone,
                            birth_date: userObj.birth_date,
                            username: userObj.username,
                            createdJSTime: userObj.created
                        };
                    }
                });
                vm.trackTasks('apply');
                return (adminUser === {}) ? null : adminUser;
            },
            configureAdminAccount: function (usersArray) {
                var vm = this;
                var adminUser = this.getAdminUser(usersArray);
                var adminAccountParams = {
                    name: "operational",
                    primary: true,
                    user: adminUser.email
                };

                if (vm.token) {
                    Rehive.admin.accounts.create(adminAccountParams).then(function (res) {
                        vm.trackTasks('apply');
                        vm.addAdminAccountCurrencies(res);
                        $rootScope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $rootScope.$apply();
                    });
                }
            },
            addAdminAccountCurrencies: function (adminAccount) {
                var vm = this;
                vm.currencyOptions.forEach(function (element, index, array) {
                    if (vm.token) {
                        Rehive.admin.accounts.currencies.create(adminAccount.reference, {currency: element.code}).then(function (res) {
                            if (index == (array.length - 1)) {
                                vm.trackTasks('apply');
                                vm.fundAdminAccountWithDemo(adminAccount);
                                $rootScope.$apply();
                            }
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $rootScope.$apply();
                        });
                    }
                });
            },
            fundAdminAccountWithDemo: function (adminAccount) {
                var vm = this;
                var creditTransactionData = {
                    account: adminAccount.reference,
                    amount: currencyModifiers.convertToCents(7500, vm.demoCurrency.divisibility),
                    currency: "DEMO",
                    metadata: {},
                    note: "Demo currency amount added for Rewards",
                    reference: "rewards_demo",
                    status: "Complete",
                    subtype: "fund",
                    user: adminAccount.user.email,
                };

                creditTransactionData = serializeFiltersService.objectFilters(creditTransactionData);

                Rehive.admin.transactions.createCredit(creditTransactionData).then(function (res) {
                    vm.trackTasks('apply');
                    vm.fundAdminHotwalletWithDemo(adminAccount.reference);
                    $rootScope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $rootScope.$apply();
                });
            },
            fundAdminHotwalletWithDemo: function (adminAccountRef) {
                var vm = this;
                if(vm.token){
                    $http.get(vm.extensionsList["stellar_testnet_service"].url + 'admin/hotwallet/active/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        var creditTransactionData = {
                            account: res.data.data.rehive_account_reference,
                            amount: currencyModifiers.convertToCents(10000, vm.demoCurrency.divisibility),
                            currency: "DEMO",
                            metadata: {},
                            note: "Demo currency amount credited for Stellar Testnet activation",
                            reference: "Stellar activation fund",
                            status: "Complete",
                            subtype: 'issue',
                            user: res.data.data.user_account_identifier,
                        };
                        creditTransactionData = serializeFiltersService.objectFilters(creditTransactionData);
                        Rehive.admin.transactions.createCredit(creditTransactionData).then(function (res) {
                            vm.trackTasks('apply');
                            vm.setupRewardsService(adminAccountRef);
                            $rootScope.$apply();
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $rootScope.$apply();
                        });
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            setupRewardsService: function (adminAccountRef) {
                var vm = this, date1 = new Date(), date2 = new Date(new Date().setMonth(new Date().getMonth() + 1));

                var rewardsCampaign1 = {
                        name: "Just for joining",
                        description: "You have received 20 Demo tokens for registering!",
                        currency: vm.demoCurrency.code,
                        company: $rootScope.pageTopObj.companyObj.id,
                        start_date: moment(date1).format('YYYY-MM-DD') + 'T00:00:00Z',
                        end_date: moment(date2).format('YYYY-MM-DD') + 'T00:00:00Z',
                        total: currencyModifiers.convertToCents(5000, vm.demoCurrency.divisibility),
                        fixed_amount: currencyModifiers.convertToCents(20.00, vm.demoCurrency.divisibility),
                        account: adminAccountRef,
                        percentage: null,
                        type: "fixed",
                        active: true,
                        max_per_user: 1,
                        visible: true,
                        claim: false,
                        event: 'user.create',
                        event_user: '{{ id }}',
                        default_status: 'accepted'
                    },
                    rewardsCampaign2 = {
                        name: "First 250 users",
                        description: "The first 250 users to claim this reward get an additional 10 DEMO tokens.",
                        currency: vm.demoCurrency.code,
                        company: $rootScope.pageTopObj.companyObj.id,
                        start_date: moment(date1).format('YYYY-MM-DD') + 'T00:00:00Z',
                        end_date: moment(date2).format('YYYY-MM-DD') + 'T00:00:00Z',
                        total: currencyModifiers.convertToCents(2500, vm.demoCurrency.divisibility),
                        fixed_amount: currencyModifiers.convertToCents(10.00, vm.demoCurrency.divisibility),
                        account: adminAccountRef,
                        percentage: null,
                        type: "fixed",
                        active: true,
                        max_per_user: 1,
                        visible: true,
                        claim: true,
                        event: '',
                        default_status: 'accepted'
                    };
                rewardsCampaign1 = serializeFiltersService.objectFilters(rewardsCampaign1);
                rewardsCampaign2 = serializeFiltersService.objectFilters(rewardsCampaign2);

                if (vm.token) {
                    $http.put(environmentConfig.API + 'admin/services/' + vm.extensionsList["rewards_service"].id + '/', {
                        terms_and_conditions: true,
                        active: true
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        $http.post(vm.extensionsList["rewards_service"].url + 'admin/campaigns/', rewardsCampaign1, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function (res) {
                            $http.post(vm.extensionsList["rewards_service"].url + 'admin/campaigns/', rewardsCampaign2, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': vm.token
                                }
                            }).then(function (res) {
                                vm.trackTasks(null);
                                vm.finishDemoSetup();
                            }).catch(function (error) {
                                errorHandler.evaluateErrors(error.data);
                                errorHandler.handleErrors(error);
                            });
                        }).catch(function (error) {
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            },
            initializeDemoSetup: function (companyName) {
                var vm = this;
                $rootScope.tasksCompleted = 0;
                vm.token = localStorageManagement.getValue('TOKEN');
                vm.companyName = companyName;
                vm.configureCompanyDetails();
            },
            finishDemoSetup: function () {
                var vm = this;
                vm.trackTasks('apply');
                $intercom.trackEvent('completed-template-successfully', {page: "select_template"});
                setTimeout(function(){
                     vm.cleanUpSetupEnv();
                }, 2000);
            },
            cleanUpSetupEnv: function(){                
                $rootScope.settingUpDemo = false;
                $rootScope.securityConfigured = true;
                $rootScope.settingUpDemo = false;
                $rootScope.inVerification = false;
                toastr.success('All demo config has been successfully setup.');
                $location.path('/get-started');
                $rootScope.$apply();
            }
        };
    }
})();
