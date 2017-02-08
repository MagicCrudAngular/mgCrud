(function (module, undefined) {

    mgResolveFactory.$inject = ['$injector', '$parse', 'mgResolvePathService', '$location','$interpolate'];
    function mgResolveFactory(injector, parse, resolvePath, location,interpolate) {

        function getAs(value){
            var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
            return CNTRL_REG.exec(value);
        }
        function resolveFactory(factory, path,transform) {
            var forEach = angular.forEach, extend = angular.extend, newFactory = {}, DEFAULT_TRANSFORM = 'mgDefaultTransform';
            //Services, factories, provides,values and constant
            forEach(['config', 'before', 'success', 'error', 'cmd', 'auto', 'service', 'cacheService'], function (value) {
                newFactory[value] = factory[value] ? injector.get(factory[value]) : undefined;
            });
            //primitive values
            forEach(['method', 'as', 'auto', 'ajaxCmd', 'init','isArray','cacheInvalidate'], function (key) {
                if (factory.hasOwnProperty(key)) {
                    newFactory[key] = factory[key];
                }
            });

            //interpolate in primitive values
            forEach(["init","cache"],function(key){
                if (factory.hasOwnProperty(key)) {
                    newFactory[key] = interpolate(factory[key])({as:factory.as});
                }
            });
            if (transform) {
                if (injector.has(transform)) {
                    newFactory.transform = { fn: injector.get(transform) }
                }
                else {
                    newFactory.transform = { fn: injector.get(DEFAULT_TRANSFORM), expression: transform }
                }
            }



            if (factory.cache) {
                newFactory.cache = parse(newFactory.cache)();
                newFactory.cacheKey = factory.cacheKey || location.path() + (factory.as || '');
            }

            if (newFactory.service && newFactory.method) {
                newFactory.service = newFactory.service[newFactory.method](newFactory.config, newFactory.before, newFactory.success, newFactory.error, newFactory.transform);
            }

            return extend(newFactory, resolvePath.resolve(path));
        }

        return function (options, override, path, transform) {
            var _option = getAs(options), override = parse(override)() || {};
            if (_option) {
                var factory = injector.has(_option[1]) ? injector.get(_option[1]) : parse(options)() || {};
                override.as = _option[3] || factory.as
            }
            return resolveFactory(angular.extend({},factory, override), path, transform)
        }
    }

    module.factory('mgResolveFactory', mgResolveFactory);

})(angular.module('mgCrud'));
