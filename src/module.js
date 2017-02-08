"use strict";
!function (window, angular, undefined) {
    magicCrudAngular = window.magicCrudAngular || (window.magicCrudAngular = {}), angular && (magicCrudAngular.isEmpty = angular.isEmpty || function (obj) {
            for (var p in obj)if (obj.hasOwnProperty(p))return !1;
            return !0
        }, magicCrudAngular.version = {
        full: "1.1.0",
        major: 1,
        minor: 0,
        dot: 0,
        codeName: "magic-crud-angular"
    }, function () {
        var module;
        try {
            angular.module("ngRoute")
        } catch (ex) {
            return module = angular.module("mgCrud", []), void module.constant("$routeParams", {})
        }
        try {
            angular.module("ui.router")
        } catch (ex) {
            return module = angular.module("mgCrud", []), void module.constant("$stateParams", {})
        }
        module = angular.module("mgCrud", ["ui.router", "ngRoute"])
    }())
}(window, window.angular);