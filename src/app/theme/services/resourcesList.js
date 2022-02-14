(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('resourcesList', resourcesList);

    /** @ngInject */
    function resourcesList() {
        return {
            getResourceTypesObj: function(){
                return {
                    'accesscontrolrule': 'ACCESS_CONTROL_RULE',
                    'account': 'ACCOUNT',
                    'accountasset': 'ACCOUNT_ASSET',
                    'accountassetlimit': 'ACCOUNT_ASSET_LIMIT',
                    'accountassetfee': 'ACCOUNT_ASSET_FEE',
                    'accountconfiguration': 'ACCOUNT_CONFIGURATION',
                    'asset': 'ASSET',
                    'backgroundtask': 'BACKGROUND_TASK',
                    'bankbranchaddress': 'BANK_BRANCH_ADDRESS',
                    'company': 'COMPANY',
                    'companyaddress': 'COMPANY_ADDRESS',
                    'companybankaccount': 'COMPANY_BANK_ACCOUNT',
                    'companyservice': 'COMPANY_SERVICE',
                    'companynotification': 'COMPANY_NOTIFICATION',
                    'document': 'DOCUMENT',
                    'export': 'EXPORT',
                    'exportpage': 'EXPORT_PAGE',
                    'email': 'EMAIL',
                    'group': 'GROUP',
                    'grouptier': 'GROUP_TIER',
                    'grouptierrequirement': 'GROUP_TIER_REQUIREMENT',
                    'grouptierlimit': 'GROUP_TIER_LIMIT',
                    'grouptierfee': 'GROUP_TIER_FEE',
                    'mfa': 'MFA',
                    'mfasmsdevice': 'MFA_SMS_DEVICE',
                    'mfatotpdevice': 'MFA_TOTP_DEVICE',
                    'mfatokenverification': 'MFA_TOKEN_VERIFICATION',
                    'mobile': 'MOBILE',
                    'mobileconfirmation': 'MOBILE_CONFIRMATION',
                    'notification': 'NOTIFICATION',
                    'permission': 'PERMISSION',
                    'recoverycode': 'RECOVERY_CODE',
                    'request': 'REQUEST',
                    'service': 'SERVICE',
                    'token': 'TOKEN',
                    'transaction': 'TRANSACTION',
                    'transactionfee': 'TRANSACTION_FEE',
                    'transactionsubtype': 'TRANSACTION_SUBTYPE',
                    'transactionmessage': 'TRANSACTION_MESSAGE',
                    'transactioncollection': 'TRANSACTION_COLLECTION',
                    'user': 'USER',
                    'useraddress': 'USER_ADDRESS',
                    'userbankaccount': 'USER_BANK_ACCOUNT',
                    'usercryptoaccount': 'USER_CRYPTO_ACCOUNT',
                    'webhook': 'WEBHOOK',
                    'webhooktask': 'WEBHOOK_TASK',
                    'webhookrequest': 'WEBHOOK_REQUEST'
                };
            },
            getCorrectIndefiniteArticle: function(resource){
                if(resource.indexOf('access') === 0 ||resource.indexOf('account') === 0 || resource.indexOf('asset') === 0 || resource.indexOf('export') === 0 || resource.indexOf('email') === 0) {
                    return 'an';
                }
                return 'a';
            },
            getFormattedRequestAction: function(user, method, endpoint, status_code, resource, documentType) {
                var vm = this;
                if(!status_code){
                    return "<strong>" + user + "</strong>" + " attempted " + "<strong>" + method + "</strong> on <strong>" + endpoint + "</strong> (ongoing request)";
                }
                var request_success = (status_code === 200 || status_code === 201); 
                var request_action = "<strong>" + user + "</strong>" + (request_success ? " " : " tried to ");
                if(!resource){
                    request_action += (request_success ? "performed " : "perform ") + "<strong>" + method + "</strong> on <strong>" + endpoint + "</strong>";
                } else {
                    switch(method){
                        case 'GET':
                            request_action += (request_success ? "viewed " : "view ") + " their <strong>" + resource + "</strong>";
                            break;
                        case 'POST':
                            if(resource === 'transaction'){
                                request_action += (request_success ? "made " : "make ") + "a <strong>" + resource + "</strong>";
                            } else {
                                request_action += (request_success ? "added " : "add ") + vm.getCorrectIndefiniteArticle(resource) + " <strong>" + resource + (
                                    documentType ? "</strong> of type <strong>" + documentType + "</strong>" : "</strong>"
                                );
                            }
                            break;
                        case 'PUT':
                            // request_action += (request_success ? "changed " : "change ") + vm.getCorrectIndefiniteArticle(resource) + " <strong>" + resource + "</strong>";
                            request_action += (request_success ? "edited " : "edit ") + vm.getCorrectIndefiniteArticle(resource) + " <strong>" + resource + "</strong>";
                            break;
                        case 'PATCH':
                            request_action += (request_success ? "edited " : "edit ") + vm.getCorrectIndefiniteArticle(resource) + " <strong>" + resource + "</strong>";
                            break;
                        case 'DELETE':
                            request_action += (request_success ? "deleted " : "delete ") + vm.getCorrectIndefiniteArticle(resource) + " <strong>" + resource + "</strong>";
                            break;
                        default: 
                            request_action += "<strong>" + method + "</strong> on <strong>" + endpoint + "</strong>";
                    };
                }

                if(!request_success){
                    request_action += " but an error occurred";
                } 
                return request_action;
            },
        };
    }

})();
