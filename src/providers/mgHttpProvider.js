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

            function resolve(action,self, response) {
                forEach(action, function (value) {
                    if (isFunction(value)) {
                        (response) ? value.call(self,response) : value.call(self);
                    }
                });
            }
            function resolveMethod(name) {
                return (name === 'query') ? 'get' : name;
            }
            function resolveData(name, data) {
                return (name === 'query' || name==='jsonp' || name=='get') ? { params: data } : { data: data };
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
            function runService(config, before, success, error,transform,self) {
                resolve(before,self);
                return http(config).
                   then(function (data) {
                       if (transform) {
                           data.data = transform.fn.call(self, data.data, transform.expression);
                       }
                       resolve(success, self, data);
                       if(self.actions){
                          self.mgEval(self.actions);
                       }
                     return self.model;
                   }).catch(function (data){
                       resolve(error, self,data);
                       throw data;
                   });
            }
            function createShortMethod() {
                forEach(arguments, function (name) {
                    service[name] = function (config, before, sucess, error,transform) {
                        return function (path, self) {
                            return runService(extend({ method: name, params:self.filter, url: resolveUrl(config, path) }, resolveAdditionalConfig(config)), before, sucess, error,transform, self);
                        };
                    };
                });
            }
            function createShortMethodWithData() {
                forEach(arguments, function (name) {
                    service[name] = function (config, before, sucess, error,transform) {
                        return function (path, self, data) {
                            //SINA Hack
                            self['as'] = this.as;
                            return runService(extend(extend({ method: resolveMethod(name), url: resolveUrl(config, path) }, resolveData(name, data)), resolveAdditionalConfig(config)), before, sucess, error,transform, self);
                        };
                    };
                });
            }
            createShortMethod('delete');
            createShortMethodWithData('post', 'put', 'query', 'patch','jsonp','get');

            return service;
        }
    };

    module.provider('mgHttp', mgHttpProvider);

})(angular.module('mgCrud'));
