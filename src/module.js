'use strict';

(function (window,angular, undefined) {
    var module; magicCrudAngular = window.magicCrudAngular || (window.magicCrudAngular = {});
    if (!angular) return;
   
    magicCrudAngular.isEmpty = angular.isEmpty || (function (obj) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p))  return false; 
        }
        return true;
    });
    magicCrudAngular.version = { full: "1.0.0", major: 1, minor: 0, dot: 0, codeName: "magic-crud-angular" };

   
    (function resolveNgRoute() {
        var module;
        try {
            angular.module('ngRoute');
        }
        catch (ex) {
            module = angular.module('mgCrud', []);
            module.constant('$routeParams', {});
            return;
        }
        module = angular.module('mgCrud', ['ngRoute']);
    })();
}
)(window,window.angular);