const app = angular.module('app', ['ngRoute', 'ngDialog', 'ngCookies']);

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
}]);

app.config(function ($routeProvider) {
    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
});

app.controller("MyCtrl", ['$cookieStore', function ($scope, $http, ngDialog, $cookies, $compile) {

}]);

app.directive('naviBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/navi-menu.html',
        controller: function ($scope, $http, ngDialog, $compile) {
            $scope.loginButtonShow = true;
            $scope.teachersStatus = false;
            $scope.classroomStatus = false;
            $scope.searchPupilStatusForm = false;
            $scope.pupilsSearchStatus = false;
            $scope.showLoginForm = false;
            $scope.showNewUserForm = false;

            $scope.teachersStart = function () {
                //     $http.get('http://localhost:8000/teachers')
                //         .then(function successCallback(response) {
                //             $scope.teachers = response.data;
                //         }, function errorCallback(response) {
                //             console.log("Error!!!" + response.err);
                //         });

                // $http.get('http://localhost:8000/checkingColumn')
                //     .then(function successCallback(response) {
                //         $scope.column = response.data;
                //     }, function errorCallback(response) {
                //         console.log("Error!!!" + response.err);
                //     });

                $scope.teachersStatus = true;
                $scope.classroomStatus = false;
                $scope.pupilsStatus = false;
                $scope.editTeachStatus = false;
                $scope.searchPupilStatusForm = false;
                $scope.pupilsSearchStatus = false;
                $scope.showLoginForm = false;
                $scope.showNewUserForm = false;
            }

            $scope.closeTeachers = function () {
                $scope.teachersStatus = false;
            };

            $scope.classroomStart = function () {
                $http.get('http://localhost:8000/classRoom')
                    .then(function successCallback(response) {
                        $scope.classroom2 = response.data;
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });


                $scope.classroomStatus = true;
                $scope.teachersStatus = false;
                $scope.pupilsStatus = false;
                $scope.editClassStatus = false;
                $scope.searchPupilStatusForm = false;
                $scope.pupilsSearchStatus = false;
                $scope.showLoginForm = false;
                $scope.showNewUserForm = false;
            }

            $scope.closeClassroom = function () {
                $scope.classroomStatus = false;
                $scope.addClassStatus = false;
                $scope.editClassStatus = false;
            }
            $scope.closePupils = function () {
                $scope.pupilsStatus = false;
                $scope.pupilsSearchStatus = false;
                $scope.searchPupilStatusForm = false;
            };

            $scope.searchPupil = function () {
                $scope.searchPupilStatusForm = true;
                $scope.teachersStatus = false;
                $scope.pupilsStatus = false;
                $scope.editClassStatus = false;
                $scope.pupilsSearchStatus = false;
                $scope.classroomStatus = false;
                $scope.showLoginForm = false;
                $scope.showNewUserForm = false;
            };

            $scope.findPupil = function () {

                $scope.pupilsName = $scope.findNamePupil;
                $scope.pupilsSurename = $scope.findSnamePupil;

                let searchObj = {
                    pupil_name: $scope.pupilsName,
                    pupil_surename: $scope.pupilsSurename

                };

                $http.get('http://localhost:8000/findPupils', {
                        params: searchObj
                    })
                    .then(function successCallback(response) {
                        $scope.pupils = response.data;

                        if ($scope.pupils.length == 0) {
                            alert('No match found');
                            return
                        };

                        $scope.searchPupilStatusForm = false;
                        $scope.pupilsSearchStatus = true;

                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };

            $scope.deleteFoundPupil = function (id) {

                let obj = {
                    id: id
                };

                $http.post('http://localhost:8000/delFoundPupil', obj)
                    .then(function successCallback(response) {

                        let searchObj = {
                            pupil_name: $scope.pupilsName,
                            pupil_surename: $scope.pupilsSurename
                        };

                        $http.get('http://localhost:8000/findPupils', {
                                params: searchObj
                            })
                            .then(function successCallback(response) {
                                $scope.pupils = response.data;
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        console.log("Success!");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };
        }
    }
});

app.directive('enter', function () {
    return {
        replace: true,
        templateUrl: 'template/Login.html',
        controller: function ($scope, $http, ngDialog, $cookieStore) {

            let loginCookie = $cookieStore.get('login');

            if (loginCookie == 'admin') {

                $scope.currentUserView = loginCookie;
                $scope.showCurrentUser = true;
                $scope.adminView = true;
                $scope.userView = false;
                $scope.loginButtonShow = false;
            } else if (angular.isDefined(loginCookie) && (loginCookie != 'admin')) {

                $scope.currentUserView = loginCookie;
                $scope.showCurrentUser = true;
                $scope.userView = true;
                $scope.adminView = false;
                $scope.loginButtonShow = false;
            };

            $scope.logIn = function () {
                $scope.showLoginForm = true;
                $scope.searchPupilStatusForm = false;
                $scope.teachersStatus = false;
                $scope.pupilsStatus = false;
                $scope.editClassStatus = false;
                $scope.pupilsSearchStatus = false;
                $scope.classroomStatus = false;
            };

            $scope.enter = function () {

                let obj = {
                    login: $scope.login,
                    pass: $scope.pass
                };

                $http.get('http://localhost:8000/checkUser', {
                        params: obj
                    })
                    .then(function successCallback(response) {
                        $scope.users = response.data;

                        if ($scope.users.length != 0 && $scope.users[0].name == 'admin') {

                            $scope.currentUserView = $scope.users[0].name;
                            $scope.showCurrentUser = true;
                            $scope.showLoginForm = false;
                            $scope.adminView = true;
                            $scope.login = '';
                            $scope.pass = '';
                            $scope.loginButtonShow = false;
                            $cookieStore.put('login', $scope.users[0].name);

                        } else if ($scope.users.length != 0) {
                            $scope.currentUserView = $scope.users[0].name;
                            $scope.showCurrentUser = true;
                            $scope.login = '';
                            $scope.pass = '';
                            $scope.showLoginForm = false;
                            $scope.userView = true;
                            $scope.loginButtonShow = false;
                            $cookieStore.put('login', $scope.users[0].name);

                        } else if ($scope.users.length == 0) {
                            alert('User is not registerd');
                            $scope.login = '';
                            $scope.pass = '';
                            $scope.currentUserView = null;
                            return;
                        }
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };

            $scope.regNewUser = function () {
                $scope.showNewUserForm = true;
                $scope.showLoginForm = false;
                $scope.searchPupilStatusForm = false;
                $scope.teachersStatus = false;
                $scope.pupilsStatus = false;
                $scope.editClassStatus = false;
                $scope.pupilsSearchStatus = false;
                $scope.classroomStatus = false;
            };

            $scope.addNewUser = function () {

                if ($scope.newUserPass == $scope.newUserPassConfirm) {

                    let newUserObj = {
                        name: $scope.newUserName,
                        password: $scope.newUserPass
                    };

                    $http.post('http://localhost:8000/addNewUser', newUserObj)
                        .then(function successCallback(response) {
                            $scope.showNewUserForm = false;
                            $scope.newUserName = '';
                            $scope.newUserPass = '';
                            console.log("Success!");
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                }
            };

            $scope.exitFunc = function () {

                $scope.showCurrentUser = false;
                $scope.adminView = false;
                $scope.userView = false;
                $scope.loginButtonShow = true;
                $cookieStore.remove('login');
                $scope.showLoginForm = false;
                $scope.searchPupilStatusForm = false;
                $scope.teachersStatus = false;
                $scope.pupilsStatus = false;
                $scope.editClassStatus = false;
                $scope.pupilsSearchStatus = false;
                $scope.classroomStatus = false;
                $scope.showNewUserForm = false;
            };
        }
    }
});

app.directive('teachersBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/teachers-dir.html',
        controller: function ($scope, $http, ngDialog, $compile, $rootScope, $timeout) {

            $scope.createTable = function createTable() {

                $http.get('http://localhost:8000/checkingColumn')
                    .then(function successCallback(response) {
                        $scope.columns = response.data;
                        $scope.editionColumn = response.data[0];
                        $scope.editionColumn.splice(0, 1);

                        $http.get('http://localhost:8000/teachers')
                            .then(function successCallback(response) {
                                $scope.teachers = response.data;

                                var tbody = angular.element(document.querySelector(".conteiner"));
                                let trCount = tbody.find('tr');

                                if (trCount.length > 0) {
                                    tbody.empty();
                                };

                                for (let i = 0; i < $scope.teachers.length; i++) {
                                    tbody.append('<tr></tr>');
                                    let allTr = tbody.find('tr');

                                    for (let j = 0; j < $scope.columns[0].length; j++) {
                                        allTr.eq(allTr.length - 1).append('<td>' + $scope.teachers[i][$scope.columns[0][j].COLUMN_NAME] + '</td>');
                                    };

                                    let editButton = '<td><input type="button" ng-click="editRowFunc($event)" value="Edit"' +
                                        'data-id=' + $scope.teachers[i].id + '></td>';

                                    let editInput = angular.element(editButton);
                                    allTr.eq(allTr.length - 1).append($compile(editInput)($scope));

                                    let deleteButton = '<td><input type="button" ng-click="deleteRowFunc($event)" value="Delete"' +
                                        'data-id=' + $scope.teachers[i].id + '></td>';

                                    let deleteInput = angular.element(deleteButton);
                                    allTr.eq(allTr.length - 1).append($compile(deleteInput)($scope));

                                };
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };

            $scope.createTable();

            $scope.deleteRowFunc = function (event) {

                let rowId = {
                    id: event.target.dataset.id
                };

                $http.post('http://localhost:8000/del-teacher', rowId)
                    .then(function successCallback(response) {

                        $scope.createTable();

                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };

            $scope.editRowFunc = function (event) {

                ngDialog.open({
                        template: '/template/editRow.html',
                        scope: $scope,
                        controller: function ($scope, $compile, $timeout) {
                            $scope.editArr = [];

                            $scope.editFunc = function () {

                                let editObj = {
                                    id: event.target.dataset.id,
                                    columnNamesArr: $scope.editionColumn,
                                    editArr: $scope.editArr
                                };

                                $http.post('http://localhost:8000/edit-teacher', editObj)
                                    .then(function successCallback(response) {

                                        $scope.createTable();
                                        ngDialog.closeAll();

                                    }, function errorCallback(response) {
                                        console.log("Error!!!" + response.err);
                                    });
                            };

                        }
                    })
                    .closePromise.then(function (res) {})

            }

            // $scope.editTeacher = function (index, name, sname) {
            //     $scope.editTeachStatus = true;
            //     $scope.indexOfTeacher = index;
            //     $scope.editNameTeacher = name;
            //     $scope.editSnameTeacher = sname;
            // };

            // $scope.editTeach = function (name, sname) {

            //     let teacherObj = {
            //         id: $scope.indexOfTeacher,
            //         name: $scope.editNameTeacher,
            //         sname: $scope.editSnameTeacher
            //     };

            //     $http.post('http://localhost:8000/edit-teacher', teacherObj)
            //         .then(function successCallback(response) {
            //             $scope.teachers = response.data;
            //             $scope.createTable();
            //             $scope.editTeachStatus = false;

            //         }, function errorCallback(response) {
            //             console.log("Error!!!" + response.err);
            //         });
            // };

            $scope.addTeachers = function () {
                ngDialog.open({
                        template: '/template/addTeachers.html',
                        scope: $scope,
                        controller: function ($scope, $compile, $timeout) {
                            $scope.nameTeacher = '';
                            $scope.snameTeacher = '';

                            $scope.addteach = function () {
                                let teacherObj = {
                                    name: $scope.nameTeacher,
                                    sname: $scope.snameTeacher
                                };

                                $http.post('http://localhost:8000/add-teach', teacherObj)
                                    .then(function successCallback(response) {

                                        $scope.addTeachersStatus = false;
                                        ngDialog.closeAll();

                                        $scope.nameTeacher = '';
                                        $scope.snameTeacher = '';

                                        $scope.createTable();

                                    }, function errorCallback(response) {
                                        console.log("Error!!!" + response.err);
                                    });
                            }
                        }
                    })
                    .closePromise.then(function (res) {})
            };


            $scope.addNewColumn = function () {

                let newColumnObj = {
                    newName: $scope.newColumnName
                };

                $http.post('http://localhost:8000/createNewColumn', newColumnObj)
                    .then(function successCallback(response) {

                        $scope.createTable();

                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            }
        }
    }
});


app.directive('classroomBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/classroom.html',
        controller: function ($scope, $http, ngDialog) {
            $scope.deleteClassroom = function (id, name) {

                let classRoomsObj = {
                    id: id,
                    name: name
                }
                $http.post('http://localhost:8000/del_classRoom', classRoomsObj)
                    .then(function successCallback(response) {
                        $http.get('http://localhost:8000/classRoom')
                            .then(function successCallback(response) {
                                $scope.classroom2 = response.data;
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        console.log("Success!");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });

            };

            $scope.editClassroom = function (id, name) {

                $scope.editClassStatus = true;
                $scope.indexOfClass = id;
                $scope.editClassName = name;
                $scope.renameClassTable = name;
            };


            $scope.editClassFunc = function () {

                let classRoomsObj = {
                    id: $scope.indexOfClass,
                    oldName: $scope.renameClassTable,
                    className: $scope.editClassName
                };

                $http.post('http://localhost:8000/edit_class', classRoomsObj)
                    .then(function successCallback(response) {
                        $http.get('http://localhost:8000/classRoom')
                            .then(function successCallback(response) {
                                $scope.classroom2 = response.data;
                                $scope.editClassStatus = false;
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        console.log("Success!");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };

            $scope.addNewClass = function () {
                $scope.addClassStatus = true;
            };

            $scope.addClass = function () {

                let obj = {
                    name: $scope.nameNewClass,
                    teachers_id: $scope.teachers_id_in_classroom
                };

                $http.get('http://localhost:8000/checkingClass', {
                        params: obj
                    })
                    .then(function successCallback(response) {
                        if (response.data == true) {
                            $http.post('http://localhost:8000/addClass', obj)
                                .then(function successCallback(response) {
                                    $http.get('http://localhost:8000/classroom')
                                        .then(function successCallback(response) {
                                            $scope.classroom2 = response.data;
                                            $scope.addClassStatus = false;
                                        }, function errorCallback(response) {
                                            console.log("Error!!!" + response.err);
                                        });
                                    console.log("Success!");
                                }, function errorCallback(response) {
                                    console.log("Error!!!" + response.err);
                                });
                        } else {
                            alert('Classroom have been already existing or you typed wrong order number');
                        }
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };
        }
    }

});


app.directive('pupilsBlock', function () {
    return {
        replace: true,
        templateUrl: 'template/pupils.html',
        controller: function ($scope, $http, ngDialog) {

            $scope.gotoClassroom = function (className, classId) {
                $scope.pupilsStatus = true;
                $scope.classroomStatus = false;

                $scope.currentClass = classId;

                let obj = {
                    className: className,
                    classId: classId
                }

                $http.get('http://localhost:8000/pupils', {
                        params: obj
                    })
                    .then(function successCallback(response) {
                        $scope.pupils = response.data;
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };

            $scope.addPupil = function () {

                $scope.addPupilsStatus = true;
                $scope.editPupilStatus = false;
            };

            $scope.sendPupil = function () {

                let obj = {
                    name: $scope.namePupil,
                    surename: $scope.snamePupil,
                    className: $scope.currentClass
                };

                $http.post('http://localhost:8000/addPupil', obj)
                    .then(function successCallback(response) {

                        $http.get('http://localhost:8000/getPupils', {
                                params: obj
                            })
                            .then(function successCallback(response) {
                                $scope.pupils = response.data;
                                $scope.addPupilsStatus = false;

                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        console.log("Success!");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };


            $scope.deletePupil = function (id) {

                let obj = {
                    id: id
                }
                $http.post('http://localhost:8000/del_pupil', obj)
                    .then(function successCallback(response) {

                        let classObj = {
                            className: $scope.currentClass

                        }

                        $http.get('http://localhost:8000/getPupils', {
                                params: classObj
                            })
                            .then(function successCallback(response) {
                                $scope.pupils = response.data;


                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        console.log("Success!");
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };



            $scope.editPupil = function (id, name, surename) {

                $scope.editPupilStatus = true;
                $scope.addPupilsStatus = false;
                $scope.indexOfPupil = id;
                $scope.editNamePupil = name;
                $scope.editSnamePupil = surename;

            };

            $scope.changePupil = function () {

                let obj = {
                    id: $scope.indexOfPupil,
                    name: $scope.editNamePupil,
                    sname: $scope.editSnamePupil
                };

                $http.post('http://localhost:8000/edit_pupil', obj)
                    .then(function successCallback(response) {

                        let classObj = {
                            className: $scope.currentClass
                        };

                        $http.get('http://localhost:8000/getPupils', {
                                params: classObj
                            })
                            .then(function successCallback(response) {
                                $scope.pupils = response.data;
                                $scope.editPupilStatus = false;

                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };
        }
    }
});


app.directive('pupilsSearch', function () {
    return {
        replace: true,
        templateUrl: 'template/lookForPupil.html',
        controller: function ($scope, $http, ngDialog) {

            $scope.deletePupil = function (id) {

                let obj = {
                    id: id
                }
                $http.post('http://localhost:8000/del_pupil', obj)
                    .then(function successCallback(response) {

                        let classObj = {
                            className: $scope.currentClass
                        }

                        $http.get('http://localhost:8000/getPupils', {
                                params: classObj
                            })
                            .then(function successCallback(response) {
                                $scope.pupils = response.data;
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };

            $scope.editPupil = function (id, name, surename) {

                $scope.editPupilStatus = true;
                $scope.addPupilsStatus = false;
                $scope.indexOfPupil = id;
                $scope.editNamePupil = name;
                $scope.editSnamePupil = surename;
            };

            $scope.changePupil = function () {

                let obj = {
                    id: $scope.indexOfPupil,
                    name: $scope.editNamePupil,
                    sname: $scope.editSnamePupil
                };

                $http.post('http://localhost:8000/edit_pupil', obj)
                    .then(function successCallback(response) {

                        let classObj = {
                            className: $scope.currentClass
                        };

                        $http.get('http://localhost:8000/getPupils', {
                                params: classObj
                            })
                            .then(function successCallback(response) {
                                $scope.pupils = response.data;
                                $scope.editPupilStatus = false;

                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
            };
        }

    }
});