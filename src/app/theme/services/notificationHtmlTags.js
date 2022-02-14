(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('notificationHtmlTags', notificationHtmlTags);

    /** @ngInject */
    function notificationHtmlTags() {

        return {
            getNotificationHtmlTags : function (event) {
                var array = [];

                switch(event) {
                    case 'User Create':
                        array = [
                            '{{ id }}','{{ first_name }}','{{ last_name }}','{{ email }}','{{ username }}','{{ id_number }}',
                            '{{ birth_date }}','{{ profile }}','{{ currency.description }}','{{ currency.code }}',
                            '{{ currency.symbol }}','{{ currency.unit }}','{{ currency.divisibility }}','{{ company }}',
                            '{{ language }}','{{ nationality }}','{{ metadata }}','{{ mobile }}','{{ timezone }}',
                            '{{ verified }}','{{ verification.email }}','{{ verification.mobile }}','{{ kyc.updated }}',
                            '{{ kyc.status }}','{{ status }}','{{ groups }}','{{ permissions }}','{{ created }}','{{ updated }}',
                            '{{ settings.allow_transactions }}','{{ settings.allow_debit_transactions }}',
                            '{{ settings.allow_credit_transactions }}','{{ last_login }}','{{ archived }}'
                        ];
                        break;
                    case 'User Update':
                        array = [
                            '{{ id }}','{{ first_name }}','{{ last_name }}','{{ email }}','{{ username }}','{{ id_number }}',
                            '{{ birth_date }}','{{ profile }}','{{ currency.description }}','{{ currency.code }}',
                            '{{ currency.symbol }}','{{ currency.unit }}','{{ currency.divisibility }}','{{ company }}',
                            '{{ language }}','{{ nationality }}','{{ metadata }}','{{ mobile }}','{{ timezone }}',
                            '{{ verified }}','{{ verification.email }}','{{ verification.mobile }}','{{ kyc.updated }}',
                            '{{ kyc.status }}','{{ status }}','{{ groups }}','{{ permissions }}','{{ created }}','{{ updated }}',
                            '{{ settings.allow_transactions }}','{{ settings.allow_debit_transactions }}',
                            '{{ settings.allow_credit_transactions }}','{{ last_login }}','{{ archived }}',
                            '{{ original_user.id }}','{{ original_user.first_name }}','{{ original_user.last_name }}',
                            '{{ original_user.email }}','{{ original_user.username }}','{{ original_user.id_number }}',
                            '{{ original_user.birth_date }}','{{ original_user.profile }}','{{ original_user.currency.description }}',
                            '{{ original_user.currency.code }}', '{{ original_user.currency.symbol }}',
                            '{{ original_user.currency.unit }}','{{ original_user.currency.divisibility }}',
                            '{{ original_user.company }}', '{{ original_user.language }}','{{ original_user.nationality }}',
                            '{{ original_user.metadata }}','{{ original_user.mobile }}','{{ original_user.timezone }}',
                            '{{ original_user.verified }}','{{ original_user.verification.email }}','{{ original_user.verification.mobile }}',
                            '{{ original_user.kyc.updated }}', '{{ original_user.kyc.status }}','{{ original_user.status }}',
                            '{{ original_user.groups }}','{{ original_user.permissions }}','{{ original_user.created }}',
                            '{{ original_user.updated }}', '{{ original_user.settings.allow_transactions }}',
                            '{{ original_user.settings.allow_debit_transactions }}', '{{ original_user.settings.allow_credit_transactions }}',
                            '{{ original_user.last_login }}','{{ original_user.archived }}'
                        ];
                        break;
                    case 'User Password Reset':
                        array = ['{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ uid }}','{{ token }}','{{ url }}'];
                        break;
                    case 'User Password Set':
                        array = ['{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ uid }}','{{ token }}','{{ url }}'];
                        break;
                    case 'User Email Verify':
                        array = ['{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ key }}','{{ email }}','{{ url }}'];
                        break;
                    case 'User Mobile Verify':
                        array = ['{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ key }}','{{ mobile }}','{{ url }}'];
                        break;
                    case 'Address Create':
                        array = ['{{ id }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ line_1 }}','{{ line_2 }}',
                            '{{ city }}','{{ state_province }}','{{ country }}','{{ postal_code }}','{{ status }}',
                            '{{ archived }}','{{ created }}','{{ updated }}'];
                        break;
                    case 'Address Update':
                        array = ['{{ id }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ line_1 }}','{{ line_2 }}',
                            '{{ city }}','{{ state_province }}','{{ country }}','{{ postal_code }}','{{ status }}',
                            '{{ archived }}','{{ created }}','{{ updated }}',
                            '{{ original_address.id }}','{{ original_address.user.id }}','{{ original_address.user.first_name }}',
                            '{{ original_address.user.last_name }}','{{ original_address.user.email }}',
                            '{{ original_address.user.username }}','{{ original_address.user.mobile }}','{{ original_address.user.profile }}',
                            '{{ original_address.line_1 }}','{{ original_address.line_2 }}',
                            '{{ original_address.city }}','{{ original_address.state_province }}','{{ original_address.country }}',
                            '{{ original_address.postal_code }}','{{ original_address.status }}',
                            '{{ original_address.archived }}','{{ original_address.created }}','{{ original_address.updated }}'];
                        break;
                    case 'Document Create':
                        array = ['{{ id }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ file }}','{{ document_category }}',
                            '{{ document_type }}','{{ metadata }}','{{ status }}','{{ note }}',
                            '{{ archived }}','{{ created }}','{{ updated }}'];
                        break;
                    case 'Document Update':
                        array = ['{{ id }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ file }}','{{ document_category }}',
                            '{{ document_type }}','{{ metadata }}','{{ status }}','{{ note }}',
                            '{{ archived }}','{{ created }}','{{ updated }}',
                            '{{ original_document.id }}','{{ original_document.user.id }}','{{ original_document.user.first_name }}',
                            '{{ original_document.user.last_name }}','{{ original_document.user.email }}',
                            '{{ original_document.user.username }}','{{ original_document.user.mobile }}','{{ original_document.user.profile }}',
                            '{{ original_document.file }}','{{ original_document.document_category }}','{{ original_document.document_type }}',
                            '{{ original_document.metadata }}','{{ original_document.status }}','{{ original_document.note }}',
                            '{{ original_document.archived }}','{{ original_document.created }}','{{ original_document.updated }}'
                        ];
                        break;
                    case 'Bank Account Create':
                        array = ['{{ id }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ name }}','{{ number }}','{{ type }}',
                            '{{ bank_name }}','{{ bank_code }}','{{ branch_code }}','{{ swift }}','{{ iban }}','{{ bic }}',
                            '{{ code }}','{{ status }}','{{ archived }}','{{ created }}','{{ updated }}'];
                        break;
                    case 'Bank Account Update':
                        array = ['{{ id }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ name }}','{{ number }}','{{ type }}',
                            '{{ bank_name }}','{{ bank_code }}','{{ branch_code }}','{{ swift }}','{{ iban }}','{{ bic }}',
                            '{{ code }}','{{ status }}','{{ archived }}','{{ created }}','{{ updated }}',
                            '{{ original_bank_account.id }}','{{ original_bank_account.user.id }}','{{ original_bank_account.user.first_name }}',
                            '{{ original_bank_account.user.last_name }}','{{ original_bank_account.user.email }}',
                            '{{ original_bank_account.user.username }}','{{ original_bank_account.user.mobile }}',
                            '{{ original_bank_account.user.profile }}','{{ original_bank_account.name }}','{{ original_bank_account.number }}',
                            '{{ original_bank_account.type }}','{{ original_bank_account.bank_name }}','{{ original_bank_account.bank_code }}',
                            '{{ original_bank_account.branch_code }}','{{ original_bank_account.swift }}','{{ original_bank_account.iban }}',
                            '{{ original_bank_account.bic }}','{{ original_bank_account.code }}','{{ original_bank_account.status }}',
                            '{{ original_bank_account.archived }}','{{ original_bank_account.created }}','{{ original_bank_account.updated }}'
                        ];
                        break;
                    case 'Crypto Account Create':
                        array = ['{{ id }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ address }}','{{ code }}','{{ crypto_type }}',
                            '{{ metadata }}','{{ status }}','{{ archived }}','{{ created }}','{{ updated }}'];
                        break;
                    case 'Crypto Account Update':
                        array = ['{{ id }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ address }}','{{ code }}','{{ crypto_type }}',
                            '{{ metadata }}','{{ status }}','{{ archived }}','{{ created }}','{{ updated }}',
                            '{{ original_crypto_account.id }}','{{ original_crypto_account.user.id }}',
                            '{{ original_crypto_account.user.first_name }}','{{ original_crypto_account.user.last_name }}',
                            '{{ original_crypto_account.user.email }}','{{ original_crypto_account.user.username }}',
                            '{{ original_crypto_account.user.mobile }}','{{ original_crypto_account.user.profile }}',
                            '{{ original_crypto_account.address }}','{{ original_crypto_account.code }}','{{ original_crypto_account.crypto_type }}',
                            '{{ original_crypto_account.metadata }}','{{ original_crypto_account.status }}','{{ original_crypto_account.archived }}',
                            '{{ original_crypto_account.created }}','{{ original_crypto_account.updated }}'
                        ];
                        break;
                    case 'Transaction Create':
                        array = ['{{ id }}','{{ tx_type }}','{{ subtype }}','{{ note }}','{{ metadata }}','{{ status }}','{{ reference }}',
                            '{{ amount }}','{{ fee }}','{{ total_amount }}','{{ balance }}','{{ account }}','{{ label }}','{{ company }}',
                            '{{ currency.description }}','{{ currency.code }}', '{{ currency.symbol }}','{{ currency.unit }}',
                            '{{ currency.divisibility }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ source_transaction }}',
                            '{{ destination_transaction }}','{{ messages }}','{{ fees }}','{{ archived }}','{{ created }}','{{ updated }}'];
                        break;
                    case 'Transaction Update':
                        array = ['{{ id }}','{{ tx_type }}','{{ subtype }}','{{ note }}','{{ metadata }}','{{ status }}','{{ reference }}',
                            '{{ amount }}','{{ fee }}','{{ total_amount }}','{{ balance }}','{{ account }}','{{ label }}','{{ company }}',
                            '{{ currency.description }}','{{ currency.code }}', '{{ currency.symbol }}','{{ currency.unit }}',
                            '{{ currency.divisibility }}','{{ user.id }}','{{ user.first_name }}','{{ user.last_name }}','{{ user.email }}',
                            '{{ user.username }}','{{ user.mobile }}','{{ user.profile }}','{{ source_transaction }}',
                            '{{ destination_transaction }}','{{ messages }}','{{ fees }}','{{ archived }}','{{ created }}','{{ updated }}',

                            '{{ original_transaction.id }}','{{ original_transaction.tx_type }}','{{ original_transaction.subtype }}',
                            '{{ original_transaction.note }}','{{ original_transaction.metadata }}','{{ original_transaction.status }}',
                            '{{ original_transaction.reference }}','{{ original_transaction.amount }}','{{ original_transaction.fee }}',
                            '{{ original_transaction.total_amount }}','{{ original_transaction.balance }}','{{ original_transaction.account }}',
                            '{{ original_transaction.label }}','{{ original_transaction.company }}','{{ original_transaction.currency.description }}',
                            '{{ original_transaction.currency.code }}','{{ original_transaction.currency.symbol }}',
                            '{{ original_transaction.currency.unit }}','{{ original_transaction.currency.divisibility }}',
                            '{{ original_transaction.user.id }}','{{ original_transaction.user.first_name }}',
                            '{{ original_transaction.user.last_name }}','{{ original_transaction.user.email }}',
                            '{{ original_transaction.user.username }}','{{ original_transaction.user.mobile }}','{{ original_transaction.user.profile }}',
                            '{{ original_transaction.source_transaction }}','{{ original_transaction.destination_transaction }}',
                            '{{ original_transaction.messages }}','{{ original_transaction.fees }}','{{ original_transaction.archived }}',
                            '{{ original_transaction.created }}','{{ original_transaction.updated }}'
                        ];
                        break;
                    default:
                        array = [];
                }

                return array;
            }
        };
    }

})();
