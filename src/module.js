'use strict';

(function (window,angular, undefined) {
    var module; magicCrudAngular = window.magicCrudAngular || (window.magicCrudAngular = {});
    if (!angular) return;
    module=angular.module('mgCrud', ['ngRoute']);
    magicCrudAngular.isEmpty = angular.isEmpty || (function (obj) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p))  return false; 
        }
        return true;
    });
    magicCrudAngular.version = { full: "1.0.0", major: 1, minor: 0, dot: 0, codeName: "magic-crud-angular" };
}
)(window,window.angular);