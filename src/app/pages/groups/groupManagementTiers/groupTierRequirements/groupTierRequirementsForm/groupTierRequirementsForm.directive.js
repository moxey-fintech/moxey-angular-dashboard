(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierRequirements')
        .directive('groupTierRequirementsForm', groupTierRequirementsForm);

    /** @ngInject */
    function groupTierRequirementsForm() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/groups/groupManagementTiers/groupTierRequirements/groupTierRequirementsForm/groupTierRequirementsForm.html'
        };
    }
})();
