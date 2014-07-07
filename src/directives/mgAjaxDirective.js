(function (module, undefined) {

    controller.$inject = ['$scope', '$attrs', 'mgResolveFactory', '$routeParams', '$interpolate'];
    function controller(scope, attrs, mgFactory, params,interpolate) {
        var factory = mgFactory(attrs.options, attrs.override, attrs.path),
            self = resolveSelf(),
            forEach = angular.forEach,
            bind = angular.bind,
            isFunction = angular.isFunction,
            isEmpty = magicCrudAngular.isEmpty;

        function resolveSelf() {
            var obj;
            if (factory.as) {
                if (obj = scope[factory.as]) {
                    return obj;
                }
                else {
                    return scope[factory.as] = {};
                }
            }
            return scope;
        }
        function setPartialModel() {
            factory.partialModel = attrs.partialmodel;
        }
        function createModel() {           
            (factory.isArray)? self.model=[]: self.model = {};
        }
        function bindScopeEval() {
            self.mgEval = bind(scope, scope.$eval)
        }
        function assingSelftToFactory() {
            factory.self = self;
        }
        function resolvePath() {
            if (factory.regexPath) {
                var result = factory.regexPath.regexp.exec(attrs.path);
                if (result) {
                    factory.path = attrs.path;
                }
            }
        }

        function resolveCommandFunction(key, fn) {
            self[key] = function () {
                if (factory.ajaxCmd === key) {
                    resolvePath();
                }
                fn.call(self, factory, arguments);
            };
        }       

        function processCommand() {
            forEach(factory.cmd, function (fn, key) {
                if (isFunction(fn)) {
                    resolveCommandFunction(key, fn);
                }
            });
        }

        function processInitValues() {
            var value=factory.init && interpolate(factory.init)(scope);
            factory.init && self.mgEval(value);
        }

        function restoreCache() {
            var x = factory.cacheKey
        }

        function processRouteParams() {
            if (!isEmpty(params)) {
                self['params'] = params;
            }
        }

        function checkPath(fn) {
            if (factory.regexPath) {
                attrs.$observe('path', function (value) {
                    var result = factory.regexPath.regexp.exec(value);
                    if (result) {
                        factory.path = value;
                        fn();
                    };
                });
            } else {
                fn();
            }
        }

        function runAuto() {
            var fnauto = (factory.cmd && factory.cmd[factory.auto]) ? self[factory.auto] : undefined;
            if (isFunction(fnauto)) {
                checkPath(fnauto);
            }
        }

        assingSelftToFactory();
        createModel();
        setPartialModel();
        bindScopeEval();       
        processCommand();
        processInitValues();
        processRouteParams();
        restoreCache();
        runAuto();

    }

    function mgAjax() {

        return {
            restrict: 'EA',
            scope: true,
            dynamicScope: function (attr) {
                var value = attr.scope;
                return (value) ? (value.toLowerCase() === "true") ? true : false : true;
            },
            controller: controller
        };
    }

    module.directive('mgAjax', mgAjax);

})(angular.module('mgCrud'));