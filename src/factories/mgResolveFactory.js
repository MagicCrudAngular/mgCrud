(function (module, undefined) {

    mgResolveFactory.$inject = ['$injector', '$parse', 'mgResolvePathService', '$location'];
    function mgResolveFactory(injector, parse, resolvePath, location) {

        function resolveFactory(factory, path,transform) {
            var forEach = angular.forEach, extend = angular.extend, newFactory = {}, DEFAULT_TRANSFORM = 'mgDefaultTransform';
            //Services, factories, provides,values and constant
            forEach(['config', 'before', 'success', 'error', 'cmd', 'auto', 'service', 'cacheService'], function (value) {
                newFactory[value] = factory[value] ? injector.get(factory[value]) : undefined;
            });
            //primitive values
            forEach(['method', 'as', 'auto', 'ajaxCmd', 'init','isArray'], function (key) {
                if (factory.hasOwnProperty(key)) {
                    newFactory[key] = factory[key];
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
                newFactory.cache = parse(factory.cache)();
                newFactory.cacheKey = factory.cacheKey || location.path() + (factory.as || '');
            }

            if (newFactory.service && newFactory.method) {
                newFactory.service = newFactory.service[newFactory.method](newFactory.config, newFactory.before, newFactory.success, newFactory.error, newFactory.transform);
            }
           
            return extend(newFactory, resolvePath.resolve(path));
        }
        return function (options, override, path,transform) {
            var factory = injector.has(options) ? injector.get(options) : parse(options)() || {};
            var override = parse(override)() || {};

            return resolveFactory(angular.extend(factory, override), path, transform);
        };
    }

    module.factory('mgResolveFactory', mgResolveFactory);

})(angular.module('mgCrud'));