"use strict";
!function (window, angular, undefined) {
    magicCrudAngular = window.magicCrudAngular || (window.magicCrudAngular = {}), angular && (magicCrudAngular.isEmpty = angular.isEmpty || function (obj) {
            for (var p in obj)if (obj.hasOwnProperty(p))return !1;
            return !0
        }, magicCrudAngular.version = {
        full: "1.1.2",
        major: 1,
        minor: 0,
        dot: 0,
        codeName: "magic-crud-angular"
    }, function () {
        var module;
        var deps = [];
        var mokConstants = {};

        try {
            angular.module("ngRoute");
            deps.push("ngRoute");
        } catch (ex) {
            mokConstants["$routeParams"] = {};
        }

        try {
            angular.module("ui.router");
            deps.push("ui.router");
        } catch (ex) {
            mokConstants["$stateParams"] = {};
        }

        module = angular.module("mgCrud", deps);
        for(var key in mokConstants) {
            module.constant(key, mokConstants[key]);
        }
    }())
}(window, window.angular);