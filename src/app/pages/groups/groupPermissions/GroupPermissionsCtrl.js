(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupPermissions')
        .controller('GroupPermissionsCtrl', GroupPermissionsCtrl);

    /** @ngInject */
    function GroupPermissionsCtrl($scope,$stateParams,Rehive,localStorageManagement,
                                  errorHandler,toastr,$location,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupName = ($stateParams.groupName == 'service') ? 'extension' : $stateParams.groupName;
        vm.checkedLevels = [];
        $scope.loadingPermissions = true;
        $scope.totalPermissionsObj = {};
        $scope.addPermissionsArray = [];
        $scope.enabledColumns = {};
        $scope.allPermissionsEnabledOfType = {};

        $scope.typeOptionsObj = {
            ACCESS_CONTROL_RULE : 'accesscontrolrule',
            ACCOUNT : 'account',
            ADDRESS : 'address',
            CURRENCY : 'currency',
            BANK_ACCOUNT : 'bankaccount',
            COMPANY : 'company',
            CRYPTO_ACCOUNT : 'cryptoaccount',
            DOCUMENT : 'document',
            DEVICE : 'device',
            EMAIL : 'email',
            GROUP: 'group',
            MFA : 'mfa',
            MOBILE : 'mobile',
            NOTIFICATION : 'notification',
            REQUEST : 'request',
            SERVICE : 'service',
            TOKEN : 'token',
            TRANSACTION : 'transaction',
            TRANSACTION_SUBTYPES : 'transactionsubtypes',
            USER : 'user',
            WEBHOOK : 'webhook'
        };

        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.getGroup = function () {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: groupName}).then(function (res) {
                    $scope.editGroupObj = res;
                    $scope.editGroupObj.prevName = res.name;
                    if(res.name == 'service'){
                        $scope.editGroupObj.prevName = $scope.editGroupObj.name = "extension";
                    }
                    $scope.loadingGroup = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroup();

        vm.initializePermissions = function () {
            $scope.totalPermissionsObj.adminPermissionsOptions = {
                permissionsName: 'Admin permissions',
                section: 'admin',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Access control rule',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Account',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Address',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Bank account',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Currency',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Crypto account',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Device',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Document',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Email',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Group',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'MFA',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Mobile',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Notification',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Request',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Service',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Token',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction subtypes',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'User',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Webhook',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.userPermissionsOptions = {
                permissionsName: 'User permissions',
                section: 'user',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Account',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Address',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Bank account',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Currency',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Crypto account',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Device',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Document',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Email',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Group',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'MFA',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Mobile',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Token',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction subtypes',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'User',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.enabledColumns.adminPermissionsOptions = {
                view: false,
                add: false,
                change: false,
                delete: false
            };

            $scope.enabledColumns.userPermissionsOptions = {
                view: false,
                add: false,
                change: false,
                delete: false
            };

            $scope.allPermissionsEnabledOfType.adminPermissionsOptions = {
                view: 0,
                add: 0,
                change: 0,
                delete: 0
            };

            $scope.allPermissionsEnabledOfType.userPermissionsOptions = {
                view: 0,
                add: 0,
                change: 0,
                delete: 0
            }
        };
        vm.initializePermissions();

        vm.getPermissions = function () {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.groups.permissions.get(groupName,{filters: {page_size: 200}}).then(function (res) {
                    $scope.loadingPermissions = false;
                    vm.checkforAllowedPermissions(res.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getPermissions();

        vm.checkforAllowedPermissions = function (permissionsArray) {
            permissionsArray.forEach(function (permission,index) {
                Object.keys($scope.totalPermissionsObj).forEach(function(key) {
                    if($scope.totalPermissionsObj[key].section === permission.section){
                        $scope.totalPermissionsObj[key].permissions.forEach(function (element,permissionsIndex) {
                            if(permission.type.toLowerCase() === element.type.replace(/ /g, '').toLowerCase()){
                                element.levels.forEach(function (level,levelIndex) {
                                    if(permission.level === level.name){
                                        $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[levelIndex].enabled = true;
                                        $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[levelIndex].id = permissionsArray[index].id;
                                        $scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter = $scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter + 1;
                                        if($scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter === 4){
                                            var allIndex = $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels.findIndex(function (element) {
                                                return element.name === 'all';
                                            });
                                            $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[allIndex].enabled = true;
                                        }
                                        ++$scope.allPermissionsEnabledOfType[key][level.name];
                                        if($scope.allPermissionsEnabledOfType[key][level.name] === $scope.totalPermissionsObj[key].permissions.length){
                                            $scope.enabledColumns[key][level.name] = true;
                                        }
                                        $scope.totalPermissionsObj[key].permissionCounter = $scope.totalPermissionsObj[key].permissionCounter + 1;
                                        if($scope.totalPermissionsObj[key].permissionCounter === (($scope.totalPermissionsObj[key].permissions.length) * 4)){
                                            $scope.totalPermissionsObj[key].enableAll = true;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        };

        $scope.toggleAllLevelsByType = function(key, permissionGroup){
          $scope.totalPermissionsObj[permissionGroup].permissions.forEach(function(permission){
              permission.levels.forEach(function(level){
                  if(level.name === key){
                      var previousStatus = level.enabled;
                      level.enabled = $scope.enabledColumns[permissionGroup][key];
                      if(level.enabled !== previousStatus){
                          $scope.trackPermissions(permission, level, permissionGroup);
                      }
                  }
              });
          });
        };

        $scope.toggleAllPermissions = function (key,enabledAll) {
            $scope.totalPermissionsObj[key].permissions.forEach(function (permission) {
                permission.levels.forEach(function (level) {
                    if(level.name === 'all'){
                        level.enabled = enabledAll;
                        $scope.trackPermissions(permission,level,key);
                    }
                });
            });
        };

        vm.isEnabledAllOnCounter = function (permissionOptionKey,operation) {

            operation === 'Increment' ? ++$scope.totalPermissionsObj[permissionOptionKey].permissionCounter : --$scope.totalPermissionsObj[permissionOptionKey].permissionCounter;

            return $scope.totalPermissionsObj[permissionOptionKey].permissionCounter === ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4);
        };

        $scope.trackPermissions = function (permission,level,permissionOptionKey) {

            //using id as a flag to see whether they have come from the backend or not

            var findIndexOfLevel = function (permissionObj,levelObj) {
                var index;
                if(vm.checkedLevels.length == 0){
                    return -1;
                }

                index = vm.checkedLevels.findIndex(function (element) {
                    return (element.type == permissionObj.type && element.level == levelObj.name && element.section == permissionObj.section);
                });

                return index;
            };

            //if all is selected

            if(level.name == 'all'){
                if(level.enabled){
                    permission.levels.forEach(function (permissionsLevel) {
                        if(!permissionsLevel.id && !permissionsLevel.enabled){
                            permissionsLevel.enabled = true;
                            vm.checkedLevels.push({type: permission.type,level: permissionsLevel.name,section: permission.section});
                            permission.levelCounter = 4;
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = vm.isEnabledAllOnCounter(permissionOptionKey,'Increment');
                            if(permissionsLevel.name !== 'all' && $scope.allPermissionsEnabledOfType[permissionOptionKey][permissionsLevel.name] < $scope.totalPermissionsObj[permissionOptionKey].permissions.length){
                                ++$scope.allPermissionsEnabledOfType[permissionOptionKey][permissionsLevel.name];
                            }
                        } else if(permissionsLevel.id && !permissionsLevel.enabled){
                            permissionsLevel.enabled = true;
                            var index = findIndexOfLevel(permission,permissionsLevel);
                            vm.checkedLevels.splice(index,1);
                            permission.levelCounter = 4;
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = vm.isEnabledAllOnCounter(permissionOptionKey,'Increment');
                            if(permissionsLevel.name !== 'all' && $scope.allPermissionsEnabledOfType[permissionOptionKey][permissionsLevel.name] < $scope.totalPermissionsObj[permissionOptionKey].permissions.length){
                                ++$scope.allPermissionsEnabledOfType[permissionOptionKey][permissionsLevel.name];
                            }
                        }
                    });

                    for(var levelName in $scope.allPermissionsEnabledOfType[permissionOptionKey]){
                        if($scope.allPermissionsEnabledOfType[permissionOptionKey].hasOwnProperty(levelName)){
                            $scope.enabledColumns[permissionOptionKey][levelName] = $scope.allPermissionsEnabledOfType[permissionOptionKey][levelName] === $scope.totalPermissionsObj[permissionOptionKey].permissions.length;
                        }
                    }

                } else {
                    permission.levels.forEach(function (permissionsLevel) {
                        if(permissionsLevel.id  && permissionsLevel.enabled){
                            permissionsLevel.enabled = false;
                            vm.checkedLevels.push({type: permission.type,level: permissionsLevel.name,id: permissionsLevel.id,section: permission.section});
                            permission.levelCounter = 0;
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = vm.isEnabledAllOnCounter(permissionOptionKey,'Decrement');
                            if(permissionsLevel.name !== 'all' && $scope.allPermissionsEnabledOfType[permissionOptionKey][permissionsLevel.name] > 0){
                                --$scope.allPermissionsEnabledOfType[permissionOptionKey][permissionsLevel.name];
                            }
                        } else if(!permissionsLevel.id  && permissionsLevel.enabled) {
                            permissionsLevel.enabled = false;
                            var index = findIndexOfLevel(permission,permissionsLevel);
                            vm.checkedLevels.splice(index,1);
                            permission.levelCounter = 0;
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = vm.isEnabledAllOnCounter(permissionOptionKey,'Decrement');
                            if(permissionsLevel.name !== 'all' && $scope.allPermissionsEnabledOfType[permissionOptionKey][permissionsLevel.name] > 0){
                                --$scope.allPermissionsEnabledOfType[permissionOptionKey][permissionsLevel.name];
                            }
                        }
                    });

                    for(var levelName in $scope.allPermissionsEnabledOfType[permissionOptionKey]){
                        if($scope.allPermissionsEnabledOfType[permissionOptionKey].hasOwnProperty(levelName)){
                            $scope.enabledColumns[permissionOptionKey][levelName] = $scope.allPermissionsEnabledOfType[permissionOptionKey][levelName] === $scope.totalPermissionsObj[permissionOptionKey].permissions.length;
                        }
                    }
                }
            } else {

                //level.enabled && level.id means they were ticked from before
                if(level.enabled && level.id){
                    var index = findIndexOfLevel(permission,level);
                    vm.checkedLevels.splice(index,1);
                    permission.levelCounter = permission.levelCounter + 1;
                    if(permission.levelCounter === 4){
                        var allIndex = permission.levels.findIndex(function (element) {
                            return element.name == 'all';
                        });
                        permission.levels[allIndex].enabled = true;
                    }
                    ++$scope.allPermissionsEnabledOfType[permissionOptionKey][level.name];
                    if($scope.allPermissionsEnabledOfType[permissionOptionKey][level.name] === $scope.totalPermissionsObj[permissionOptionKey].permissions.length){
                        $scope.enabledColumns[permissionOptionKey][level.name] = true;
                    }
                    $scope.totalPermissionsObj[permissionOptionKey].enableAll = vm.isEnabledAllOnCounter(permissionOptionKey,'Increment');
                    return;
                } else if(!level.enabled && level.id){
                    vm.checkedLevels.push({type: permission.type,level: level.name,id: level.id,section: permission.section});
                    permission.levelCounter = permission.levelCounter - 1;
                    if(permission.levelCounter < 4){
                        var allIndex = permission.levels.findIndex(function (element) {
                            return element.name == 'all';
                        });
                        permission.levels[allIndex].enabled = false;
                    }
                    --$scope.allPermissionsEnabledOfType[permissionOptionKey][level.name];
                    if($scope.allPermissionsEnabledOfType[permissionOptionKey][level.name] < $scope.totalPermissionsObj[permissionOptionKey].permissions.length){
                        $scope.enabledColumns[permissionOptionKey][level.name] = false;
                    }
                    $scope.totalPermissionsObj[permissionOptionKey].enableAll = vm.isEnabledAllOnCounter(permissionOptionKey,'Decrement');
                    return;
                }

                //only level.enabled means they were not ticked from before

                if(level.enabled){
                    vm.checkedLevels.push({type: permission.type,level: level.name,section: permission.section});
                    permission.levelCounter = permission.levelCounter + 1;
                    if(permission.levelCounter === 4){
                        var allIndex = permission.levels.findIndex(function (element) {
                            return element.name == 'all';
                        });
                        permission.levels[allIndex].enabled = true;
                    }
                    ++$scope.allPermissionsEnabledOfType[permissionOptionKey][level.name];
                    if($scope.allPermissionsEnabledOfType[permissionOptionKey][level.name] === $scope.totalPermissionsObj[permissionOptionKey].permissions.length){
                        $scope.enabledColumns[permissionOptionKey][level.name] = true;
                    }
                    $scope.totalPermissionsObj[permissionOptionKey].enableAll = vm.isEnabledAllOnCounter(permissionOptionKey,'Increment');
                } else {
                    var index = findIndexOfLevel(permission,level);
                    vm.checkedLevels.splice(index,1);
                    permission.levelCounter = permission.levelCounter - 1;
                    if(permission.levelCounter < 4){
                        var allIndex = permission.levels.findIndex(function (element) {
                            return element.name == 'all';
                        });
                        permission.levels[allIndex].enabled = false;
                    }
                    --$scope.allPermissionsEnabledOfType[permissionOptionKey][level.name];
                    if($scope.allPermissionsEnabledOfType[permissionOptionKey][level.name] < $scope.totalPermissionsObj[permissionOptionKey].permissions.length){
                        $scope.enabledColumns[permissionOptionKey][level.name] = false;
                    }
                    $scope.totalPermissionsObj[permissionOptionKey].enableAll = vm.isEnabledAllOnCounter(permissionOptionKey,'Decrement');
                }
            }
        };

        $scope.separateCheckedLevels = function () {
            var addingPermissionArray = [];
            var deletingPermissionArray = [];

            vm.checkedLevels.forEach(function (elem) {
                if(elem.id){
                    deletingPermissionArray.push(elem);
                } else {
                    addingPermissionArray.push(elem);
                }
            });

            $scope.savePermissionsProcess(addingPermissionArray,deletingPermissionArray);

        };

        $scope.savePermissionsProcess = function(addingPermissionArray,deletingPermissionArray){
            if(addingPermissionArray.length > 0){
                addingPermissionArray.forEach(function (elem,ind,arr) {
                    var type = '';
                    if(ind === arr.length - 1){
                        type = elem.type.toUpperCase();
                        type = type.replace(/ /g, '_');
                        elem.type = $scope.typeOptionsObj[type];
                        vm.addPermissions(addingPermissionArray,deletingPermissionArray);
                        return false;
                    }

                    type = elem.type.toUpperCase();
                    type = type.replace(/ /g, '_');
                    elem.type = $scope.typeOptionsObj[type];
                });
            } else {
                vm.deletePermissionsArray(deletingPermissionArray);
            }
        };

        vm.addPermissions = function (addingPermissionArray,deletingPermissionArray) {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.groups.permissions.create(groupName,{permissions: addingPermissionArray}).then(function (res) {
                    vm.deletePermissionsArray(deletingPermissionArray);
                    $scope.$apply();
                }, function (error) {
                    vm.checkedLevels = [];
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.deletePermissionsArray = function (deletingPermissionArray) {
            if(deletingPermissionArray.length > 0){
                deletingPermissionArray.forEach(function(element,idx,array){
                    $scope.loadingPermissions = true;
                    if(idx === array.length - 1){
                        vm.deletePermission(element,'last');
                        return false;
                    }
                    vm.deletePermission(element);

                });
            } else {
                vm.finishSavingPermissionsProcess();
            }
        };

        vm.deletePermission = function (permission,last) {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.groups.permissions.delete(groupName,permission.id).then(function (res) {
                    if(last){
                        vm.finishSavingPermissionsProcess();
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.finishSavingPermissionsProcess = function () {
            vm.initializePermissions();
            $timeout(function () {
                $scope.loadingPermissions = false;
                vm.checkedLevels = [];
                toastr.success('Permissions successfully saved');
                vm.getPermissions();
            },2500);
        };


    }
})();