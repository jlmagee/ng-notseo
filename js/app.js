/**
 * Copyright John L Magee on 2015
 */
'use strict';
var pagemenu = {
    'Section_One': {
        'Section1_Page1': {
            'description': 'Section1_Page1 Description',
            'keywords': 'Section1_Page1 Keywords'
        },
        'Section1_Page2': {
            'description': 'Section1_Page2 Description',
            'keywords': 'Section1_Page2 Keywords'
        },
        'Section1_Page3': {
            'description': 'Section1_Page3 Description',
            'keywords': 'Section1_Page3 Keywords'
        }
    },
    'Section_Two': {
        'Section2_Page1': {
            'description': 'Section2_Page1 Description',
            'keywords': 'Section2_Page1 Keywords'
        },
        'Section2_Page2': {
            'description': 'Section2_Page2 Description',
            'keywords': 'Section2_Page2 Keywords'
        },
        'Section2_Page3': {
            'description': 'Section2_Page3 Description',
            'keywords': 'Section2_Page3 Keywords'
        },
        'Section2_Page4': {
            'description': 'Section2_Page4 Description',
            'keywords': 'Section2_Page4 Keywords'
        },
        'Section2_Page5': {
            'description': 'Section2_Page5 Description',
            'keywords': 'Section2_Page5 Keywords'
        }
    }
};
// Declare app level module which depends on filters, and services
var myApp = angular.module('ngApp', ['ui.router',
    'ngMaterial',
    'ngApp.filters',
    'ngApp.controllers']);
myApp.config(['$locationProvider', function ($location) {
    $location.html5Mode(true);
    $location.hashPrefix('!');
}]);
myApp.config(function ($mdThemingProvider) {
    var specBlueMap = $mdThemingProvider.extendPalette('indigo', {
        '500': '#7796c5'
    });
    $mdThemingProvider.definePalette('specBluePalette', specBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('specBluePalette')
        .accentPalette('teal', {'default': '700'})
});
myApp.config(['$urlMatcherFactoryProvider', function ($urlMatcherFactoryProvider) {
    $urlMatcherFactoryProvider.strictMode(false);
}]);
myApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/Section1_Page1");
    $stateProvider
        .state('home', {
            'url': '/',
            'templateUrl': function (stateParams) {
                return 'partials/Section1_Page1.html';
            }
        })
        .state('static', {
            'url': '/{thepage}',
            'templateUrl': function (stateParams) {
                return 'partials/' + stateParams.thepage + '.html';
            }
        });
});
myApp.run(['$rootScope', '$state', '$stateParams', '$http', '$filter', '$location',
    function ($rootScope, $state, $stateParams, $http, $filter, $location, element) {
        $rootScope.theCurrentPage = '';
        $rootScope.theCurrentSection = '';
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                if (toParams.thepage === 'nopage') {
                    event.preventDefault();
                }
                else {
                    if (typeof toParams.thepage === 'undefined') {
                        $rootScope.theCurrentPage = 'Section1_Page1'; //otherwise doesn't work in html5mode
                    } else {
                        $rootScope.theCurrentPage = toParams.thepage;
                    }
                    angular.forEach(pagemenu, function (item, key) {
                        if (typeof item[$rootScope.theCurrentPage] !== 'undefined') {
                            $rootScope.theCurrentSection = key;
                        }
                    });
                    $rootScope.page_title = $rootScope.theCurrentPage.replace(/_/g, ' ');
                    if (typeof pagemenu[$rootScope.theCurrentSection][$rootScope.theCurrentPage] === 'undefined') {
                        $rootScope.thedesc = pagemenu[0][0].description;
                        $rootScope.thekeyw = pagemenu[0][0].keywords;
                    } else {
                        $rootScope.thedesc = pagemenu[$rootScope.theCurrentSection][$rootScope.theCurrentPage].description;
                        $rootScope.thekeyw = pagemenu[$rootScope.theCurrentSection][$rootScope.theCurrentPage].keywords;
                    }
                }
            });
        /* */
    }]);
var ctrls = angular.module('ngApp.controllers', []);
function appCtrl($scope, $rootScope, $timeout, $document, $location, $state, $mdSidenav, $mdMedia) {
    var app = this;
    app.pagemenu = window.pagemenu;
    var mainContentArea = document.querySelector("[role='main']");

    function openPage() {
        if (!!!app.screenGtm()) {
            app.closeMenu();
        }
        mainContentArea.focus();
        app.theMenuSectionExpanded = $rootScope.theCurrentSection;
    }

    app.isLoaded = false;
    $rootScope.$on('$viewContentLoaded',
        function (event) {
            app.isLoaded = true;
            if ($location.path() === '/') {
                $location.path('Section1_Page1');
            }
        });
    $rootScope.$on('$locationChangeSuccess', openPage);
    app.setSnLocked = true;
    app.snSetLocked = function () {
        return app.setSnLocked;
    };
    app.showNavBar = false;
    app.homeToggleNavBar = function () {
        app.showNavBar = !app.showNavBar;
        if (app.showNavBar === true) {
            app.setSnLocked = true;
        }
    };
    app.closeMenu = function () {
        app.setSnLocked = false;
        $mdSidenav('left').close();
    };
    app.openMenu = function () {
        app.setSnLocked = true;
        $mdSidenav('left').open()
            .then(
            function () {
            }
        );
    };
    app.snOpen = function () {
        return $mdSidenav('left').isOpen() || $mdSidenav('left').isLockedOpen();
    };
    app.snLocked = function () {
        return $mdSidenav('left').isLockedOpen();
    };
    app.screenGtm = function () {
        return $mdMedia('gt-md');
    };
    app.path = function () {
        return $location.path();
    };
    app.goHome = function ($event) {
//        menu.selectPage(null, null);
        $location.path('/');
    };
    app.theMenuSectionExpanded = '';
    app.lastMenuSectionExpanded = '';
    app.menuSectionExpanded = function (section) {
        return app.theMenuSectionExpanded === section;
    };
    var loopdone = false;
    app.toggleMenuSectionExpanded = function (section) {
        app.theMenuSectionExpanded = section;
        loopdone = false;
        if (app.theMenuSectionExpanded !== app.lastMenuSectionExpanded) {
            app.lastMenuSectionExpanded = app.theMenuSectionExpanded;
            angular.forEach(app.pagemenu[app.theMenuSectionExpanded], function (item, key) {
                if (!loopdone) {
                    $state.go('static', {'thepage': key});
                    loopdone = true;
                }
            });
        }
    };
    /* */
}
appCtrl.$inject = ['$scope', '$rootScope', '$timeout', '$document', '$location', '$state', '$mdSidenav', '$mdMedia'];
ctrls.controller('appCtrl', appCtrl);
angular.module('ngApp.filters', [])
    .filter('nolodash', function () {
        return function (value) {
            return (!value) ? '' : value.replace(/_/g, ' ');
        }
    });
