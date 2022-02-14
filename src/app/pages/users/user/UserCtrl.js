(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserCtrl', UserCtrl);

    /** @ngInject */
    function UserCtrl($scope,Rehive,localStorageManagement,$uibModal,_,toastr,$ngConfirm,
                      $rootScope,errorHandler,$stateParams,$location,$window,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.dashboardTitle = 'User | Moxey';
        $rootScope.shouldBeBlue = 'Users';
        vm.uuid = $stateParams.uuid;
        $scope.user = {};
        $scope.loadingUser = true;
        $scope.updatingUser = false;
        $scope.userGroup = {};
        $scope.headerArray = [];
        $scope.profilePictureFile = {
            file: {}
        };
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.$on('$locationChangeStart', function (event,newUrl) {
            vm.location = $location.path();
            vm.locationArray = vm.location.split('/');
            $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
            vm.locationTracker(vm.location);
        });

        vm.locationTracker = function (location) {
            var baseLocation = '/user/' + vm.uuid;
            var remainingLocation = location.split(baseLocation).pop();
            var remainingLocationArray = remainingLocation.split('/');

            if(remainingLocationArray[1] == 'details'){
                $scope.trackedLocation = 'details';
                $scope.secondaryTrackedLocation = '';
            } else if (remainingLocationArray[1] == 'accounts'){
                $scope.trackedLocation = 'accounts';
                $scope.secondaryTrackedLocation = '';
            } else if (remainingLocationArray[1] == 'transactions'){
                $scope.trackedLocation = 'transactions';
                $scope.secondaryTrackedLocation = '';
            } else if (remainingLocationArray[1] == 'permissions'){
                $scope.trackedLocation = 'permissions';
                $scope.secondaryTrackedLocation = '';
            } else if (remainingLocationArray[1] == 'user-logs'){
                $scope.trackedLocation = 'user-logs';
                $scope.secondaryTrackedLocation = '';
            }  else if(remainingLocationArray[1] == 'account'){
                $scope.locationIndicator = 'accounts';
                $scope.trackedLocation = 'account';
                $scope.secondaryTrackedLocation = '';
                if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'limits'){
                    $scope.secondaryTrackedLocation = 'limits';
                } else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'fees'){
                    $scope.secondaryTrackedLocation = 'fees';
                }else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'settings'){
                    $scope.secondaryTrackedLocation = 'settings';
                }
            }
        };
        vm.locationTracker(vm.location);

        $rootScope.$on('userGroupChanged',function (event,groupChanged) {
            if(groupChanged){
                vm.getUser();
            }
        });

        vm.getUserGroup = function () {
            if(vm.token) {
                $scope.loadingUser = true;
                Rehive.admin.users.groups.get(vm.uuid, {filters: {page_size: 250}}).then(function (res) {
                    $scope.loadingUser = false;
                    if(res.results.length > 0){
                        $scope.userGroup = res.results[0];
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUser = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.loadingUser = false;
                    $scope.user = res;
                    vm.getUserGroup();
                    if($scope.user.groups.length > 0 && $scope.user.groups[0].name && $scope.user.groups[0].name === "service"){
                        $scope.user.groups[0].name = "extension";
                        var firstName = "", arr = $scope.user.first_name.split(' ');
                        var len = arr.length;
                        arr[len-1] = "Extension";
                        for(var i = 0; i < len; ++i){
                            firstName += arr[i];
                            if(i !== len-1){firstName += " ";}
                        }
                        $scope.user.first_name = firstName;
                    }

                    vm.calculateHowLongUserHasBeenWithCompany($scope.user.created);
                    $window.sessionStorage.userData = JSON.stringify(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUser = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        $scope.copiedSuccessfully= function () {
            toastr.success('Id copied to clipboard');
        };

        vm.calculateHowLongUserHasBeenWithCompany = function (joinedDate) {
            var text = '',
                joiningDate = moment(joinedDate),
                dateNow = moment(Date.now()),
                preciseDiff = moment.preciseDiff(dateNow, joiningDate, true);

            if(preciseDiff.years){
                text += preciseDiff.years + (preciseDiff.years === 1 ? ' year' : ' years');
            }
            if(preciseDiff.months){
                text += (text !== '' ? ' and ' : '') + preciseDiff.months + (preciseDiff.months === 1 ? ' month' : ' months');
            }

            if(preciseDiff.days){
                text += (text !== '' ? ' and ' : '') + preciseDiff.days + (preciseDiff.days === 1 ? ' day' : ' days');
            }
            
            if(preciseDiff.hours){
                text += (text !== '' ? ' and ' : '') + preciseDiff.hours + (preciseDiff.hours === 1 ? ' hour' : ' hours');
            }
            
            if(text === ''){
                text = 'less than one hour';
            }
            $scope.beenAUser = text;
        };

        $scope.getFileName = $filter('date')(Date.now(),'mediumDate') + ' ' + $filter('date')(Date.now(),'shortTime') + '-UserInfo.csv';

        $scope.getCSVArray = function () {
            var array = [],
                userData = JSON.parse($window.sessionStorage.userData),
                userEmails = JSON.parse($window.sessionStorage.userEmails),
                userMobiles = JSON.parse($window.sessionStorage.userMobiles),
                userBanks = JSON.parse($window.sessionStorage.userBanks),
                userAddresses = JSON.parse($window.sessionStorage.userAddresses);

            userData.age = ($filter('ageCalculator')(userData.birth_date)).toString();
            userData.nationality = $filter('isoCountry')(userData.nationality);
            userData.created = $filter('date')(userData.created,'MMM d y') + ' ' +$filter('date')(userData.created,'shortTime');
            userData.last_login = $filter('date')(userData.last_login,'MMM d y') + ' ' +$filter('date')(userData.last_login,'shortTime');

            var filteredUserData = _.pick(userData,['id','first_name','last_name','username','birth_date','age',
                'nationality','language','company', 'timezone','verified','created','last_login']);

            var filteredUserEmails = _.map(userEmails,'email');
            var filteredUserMobiles = _.map(userMobiles,'number');

            for(var key in filteredUserData) {
                var obj = {};
                obj[key] = [key,userData[key]];
                array.push(obj);
            }

            array.push({email: ['email addresses',filteredUserEmails]});
            array.push({number: ['mobile numbers',filteredUserMobiles]});

            userAddresses.forEach(function (element) {
                var obj = {},subArray = ['address'];
                for(var k in _.omit(element,'status','user','id')){
                    subArray.push(element[k]);
                }

                obj[element.id] = subArray;
                array.push(obj);
            });

            userBanks.forEach(function (element) {
                var obj = {},subArray = ['bank account'];
                for(var k in _.omit(element,'status','id','user','code')){
                    subArray.push(element[k]);
                }

                obj[element.id] = subArray;
                array.push(obj);
            });

            return array;

        };

        $scope.toggleActivateUser = function(activate, deletePermanently){
            if(vm.token) {
                $scope.loadingUser = true;

                var formData = new FormData();

                formData.append('deactivated', !activate);
                $scope.updatingUser = true;
                Rehive.admin.users.update(vm.uuid, formData).then(function (res) {                        
                    activate ? toastr.success('Successfully activated the user') : toastr.success('Successfully deactivated the user');
                    vm.getUser();
                    $scope.updatingUser = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingUser = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleArchivedUser = function(archived, deletePermanently){
            if(vm.token) {
                $scope.loadingUser = true;

                var formData = new FormData();

                formData.append('archived', archived);
                $scope.updatingUser = true;
                Rehive.admin.users.update(vm.uuid, formData).then(function (res) {
                    if(deletePermanently){
                        $scope.deleteUser();
                    }
                    else {
                        archived ? toastr.success('Successfully archived the user') : toastr.success('Successfully restored the user');
                        vm.getUser();
                    }
                    $scope.updatingUser = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingUser = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.showUserArchiveActionPrompt = function(archived){
            $ngConfirm({
                title: archived ? 'Archive user' : 'Restore user',
                columnClass: 'medium',
                contentUrl: archived ? 'app/pages/users/user/userUpdatePrompts/userArchivePrompt.html' : 'app/pages/users/user/userUpdatePrompts/userRestorePrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Close",
                        btnClass: 'btn-default pull-right dashboard-btn'
                    },
                    ok: {
                        text: archived ? 'Archive' : 'Restore',
                        btnClass: 'btn-primary dashboard-btn margin-right-30',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.toggleArchivedUser(archived, false);
                        }
                    }
                }
            });
        };

        $scope.showUserDeactivateActionPrompt = function(activate){
            $ngConfirm({
                title: activate ? 'Activate user' : 'Deactivate user',
                columnClass: 'medium',
                contentUrl: activate ? 'app/pages/users/user/userUpdatePrompts/userActivatePrompt.html' : 'app/pages/users/user/userUpdatePrompts/userDeactivatePrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Close",
                        btnClass: 'btn-default pull-right dashboard-btn'
                    },
                    ok: {
                        text: activate ? 'Activate' : 'Deactivate',
                        btnClass: 'btn-primary dashboard-btn margin-right-30',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.toggleActivateUser(activate);
                        }
                    }
                }
            });
        };

        $scope.openUserProfilePictureModal = function (page, size, user) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserProfilePictureModalCtrl',
                scope: $scope,
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUser();
                }
            }, function(){
            });
        };

        $scope.goToBreadCrumbsView = function (path) {
            $location.path(path);
        };

        $scope.deleteUserConfirm = function () {
            $scope.deleteText = null;
            $ngConfirm({
                title: 'Delete user',
                contentUrl: 'app/pages/users/user/userDeletePrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger delete-button',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            else {
                                // $scope.deleteUser();
                                if(!$scope.user.archived){
                                    $scope.toggleArchivedUser(true, 'deletePermanently');
                                }
                                else {
                                    $scope.deleteUser();
                                }
                            }
                        }
                    }
                }
            });
        };

        $scope.deleteUser = function () {
            $scope.loadingUser = true;
            Rehive.admin.users.delete($scope.user.id).then(function (res) {
                $scope.loadingUser = false;
                toastr.success('User successfully deleted');
                $location.path('/users');
                // $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.loadingUser = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.creditUser = function() {
            var searchObj = {
                txType: 'credit', 
                userIdentity: $scope.user.email || $scope.user.mobile || $scope.user.id, 
                accountUser: $scope.user.account,
                currencyCode: $scope.user.currency ? $scope.user.currency.code : null
            };
            if(!searchObj.currencyCode){ delete searchObj['currencyCode']; }
            $location.path('/transactions/history').search(searchObj);
        };

        $scope.debitUser = function() {
            var searchObj = {
                txType: 'debit', 
                userIdentity: $scope.user.email || $scope.user.mobile || $scope.user.id, 
                accountUser: $scope.user.account,
                currencyCode: $scope.user.currency ? $scope.user.currency.code : null
            };
            if(!searchObj.currencyCode){ delete searchObj['currencyCode']; }
            $location.path('/transactions/history').search(searchObj);
        };

        $scope.transferUser = function() {
            var searchObj = {
                txType: 'transfer', 
                userEmail: $scope.user.email || $scope.user.mobile || $scope.user.id, 
                accountUser: $scope.user.account,
                currencyCode: $scope.user.currency ? $scope.user.currency.code : null
            };
            if(!searchObj.currencyCode){ delete searchObj['currencyCode']; }
            $location.path('/transactions/history').search(searchObj);
        };

    }
})();
