(function (module, undefined) {

    mgResolveFactory.$inject = ['$injector', '$parse', 'mgResolvePathService', '$location'];
    function mgResolveFactory(injector, parse, resolvePath, location) {

        function resolveFactory(factory, path) {
            var forEach = angular.forEach, extend = angular.extend, newFactory = {};
            //Services, factories, provides,constant
            forEach(['config', 'before', 'success', 'error', 'cmd', 'auto', 'service', 'cacheService'], function (value) {
                newFactory[value] = factory[value] ? injector.get(factory[value]) : undefined;
            });
            //string
            forEach(['method', 'as', 'auto', 'ajaxCmd', 'init'], function (key) {
                if (factory.hasOwnProperty(key)) {
                    newFactory[key] = factory[key];
                }
            });           

            if (factory.cache) {
                newFactory.cache = parse(factory.cache)();
                newFactory.cacheKey = factory.cacheKey || location.path() + (factory.as || '');
            }

            if (newFactory.service && newFactory.method) {
                newFactory.service = newFactory.service[newFactory.method](newFactory.config, newFactory.before, newFactory.success, newFactory.error);
            }
           
            return extend(newFactory, resolvePath.resolve(path));
        }
        return function (options, override, path) {
            var factory = injector.has(options) ? injector.get(options) : parse(options)() || {};
            var override = parse(override)() || {};

            return resolveFactory(angular.extend(factory, override), path);
        };
    }

    module.factory('mgResolveFactory', mgResolveFactory);

})(angular.module('mgCrud'));