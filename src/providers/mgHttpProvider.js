(function (module, undefined) {
    
    function mgHttpProvider() {
        var defaultConfig;
        this.setDefaultConfig = function (config) {
            defaultConfig = config;
        }
        this.$get = ['$http', function (http) {                               
            return mgHttp(http);
        }]

        function mgHttp(http) {
            var forEach = angular.forEach, service = {}, extend = angular.extend, isFunction = angular.isFunction;
            
            function resolve(action, response) {
                forEach(action, function (value) {
                    if (isFunction(value)) {
                        (response) ? value(response) : value();
                    }
                });
            }
            function resolveMethod(name) {
                return (name === 'query') ? 'get' : name;
            }
            function resolveData(name, data) {
                return (name === 'query') ? { params: data } : { data: data };
            }
            function resolveUrl(config, path) {
                var url = resolveConfig(config).url;
                return (url) ? url + path || '' : path || '';
            }
            function resolveConfig(config) {
                return config || defaultConfig || {};
            }
            function resolveAdditionalConfig(config) {
                return resolveConfig(config).additionalConfig || {};
            }
            function createResponse(data, status, headers, config,statusText) {
                return { data: data, status: status, headers: headers, config: config,statusText:statusText };
            }
            function runService(config, before, success, error) {
                resolve(before);
                http(config).
                   success(function (data, status, headers, config,statusText) {
                       resolve(success, createResponse(data, status, headers, config, statusText));
                   }).
                   error(function (data, status, headers, config, statusText) {
                       resolve(error, createResponse(data, status, headers, config, statusText));
                   });
            }
            function createShortMethod() {
                forEach(arguments, function (name) {
                    service[name] = function (config, before, sucess, error) {
                        return function (path) {
                            runService(extend({ method: name, url: resolveUrl(config, path) }, resolveAdditionalConfig(config)), before, sucess, error);
                        };
                    };
                });
            }
            function createShortMethodWithData() {
                forEach(arguments, function (name) {
                    service[name] = function (config, before, sucess, error) {
                        return function (path, data) {
                            runService(extend(extend({ method: resolveMethod(name), url: resolveUrl(config, path) }, resolveData(name, data)), resolveAdditionalConfig(config)), before, sucess, error);
                        };
                    };
                });
            }
            createShortMethod('get', 'delete');
            createShortMethodWithData('post', 'put', 'query', 'patch');

            return service;
        }
    };

    module.provider('mgHttp', mgHttpProvider);

})(angular.module('mgCrud'));
