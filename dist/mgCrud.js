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
}(window, window.angular);;(function (module, undefined) {

	controller.$inject = ['$scope', '$attrs', 'mgResolveFactory', '$routeParams', '$stateParams', '$interpolate', '$element'];

	function controller(scope, attrs, mgFactory, params, stateParams, interpolate, element) {
		var factory = mgFactory(attrs.options, attrs.override, attrs.path, attrs.transform),
			self = resolveSelf(),
			forEach = angular.forEach,
			bind = angular.bind,
			isFunction = angular.isFunction,
			_callBack,
			_cacheInvalidate = false,
			isEmpty = magicCrudAngular.isEmpty;

		self.actions = attrs.actions;	
		this.getCache = getCache;
		this.setFilter = function (filter) {
			if (filter) {
				if (self.filter) {
					self.filter;
				}
				else {
					self.filter = {};
				}
				self.filter.scope = filter;
			}
		}
		this.setActions = function (actions) {
			self.oldActions = self.actions;
			self.actions = actions;
		}
		self.restoreCache = restoreCache;

		function getCache() {
			return factory.cache;
		}



		function getCacheCallback() {
			var cache = element.data('$fnxCacheRestoreController');
			if (cache) {
				_callBack = cache.getCacheCallBack();
			}
		}

		function restoreCache() {
			if (angular.isFunction(_callBack)) {
				_cacheInvalidate = _callBack(getCache());
			}
		}

		function resolveSelf() {
			var obj;
			if (factory.as) {
				if (obj = scope[factory.as]) {
					return obj;
				} else {
					return scope[factory.as] = {};
				}
			}
			return scope;
		}

		function setPartialModel() {
			factory.partialModel = attrs.partialmodel;
		}

		function createModel() {
			(factory.isArray) ? self.model = [] : self.model = {};
		}

		function bindScopeEval() {
			self.mgEval = bind(scope, scope.$eval)
		}

		function assingSelftToFactory() {
			factory.self = self;
		}

		function resolvePath() {
			//HACK SERGIO esto no funciona para objetos de tipo x["x"].x o x["x"];
			//if (factory.regexPath) {
			//	var result = factory.regexPath.regexp.exec(attrs.path);
			//	if (result) {
			factory.path = attrs.path;
			//	}
			//}
		}

		function resolveCommandFunction(key, fn) {
			self[key] = function () {
				if (factory.ajaxCmd === key) {
					resolvePath();
				}
				return fn.call(self, factory, arguments);
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
			var value = factory.init && interpolate(factory.init)(scope);
			factory.init && self.mgEval(value);
		}



		function processRouteParams() {
			//var _params = scope.ngDialogData || angular.extend(params, stateParams);
			var originalParams = stateParams?stateParams:params;
			var _params = scope.ngDialogData || originalParams;
			if (!isEmpty(_params)) {
				self['params'] = _params;
			}
		}

		function checkPath(fn) {
			if (factory.regexPath) {
				attrs.$observe('path', function (value) {
					var result = factory.regexPath.regexp.exec(value);
					//if (result) {
						factory.path = value;
						fn();
					//};
				});
			} else {
				fn();
			}
		}

		function runAuto() {
			var fnauto = (factory.cmd && factory.cmd[factory.auto]) ? self[factory.auto] : undefined;
			var invalidate = (factory.cacheInvalidate && _cacheInvalidate);
			if (isFunction(fnauto) && !invalidate) {
				checkPath(fnauto);
			} else {
				checkPath(function(){});
			}
		}

		assingSelftToFactory();
		createModel();
		setPartialModel();
		bindScopeEval();
		processCommand();
		processInitValues();
		processRouteParams();
		getCacheCallback();
		restoreCache();
		runAuto();

	}

	function mgAjax() {

		return {
			restrict: 'EA',
			priority: 9000,
			controller: controller
		};
	}

	module.directive('mgAjax', mgAjax);

})(angular.module('mgCrud'));
;(function (module, undefined) {

	
    function link(scope,element,attrs,controller){
		controller.setFilter(attrs.mgFilter);
	}
	function mgFilter() {

		return {
			restrict: 'A',
			require:'mgAjax',			
			link: link
		};
	}

	module.directive('mgFilter', mgFilter);

})(angular.module('mgCrud'));;(function (module, undefined) {

	
	controller.$inject = ['$injector'];
    function controller($injector){
		var expressions = [],_factory;
		this.addExpression  = function(expression){
			expressions.push(expression);
		};
		this.setFactory = function(factory){
			_factory = factory;
		};
		this.getModel = function(){
			var model = {};
			angular.forEach(expressions,function(value){
				if(angular.isFunction(value)){
					angular.extend(model,value());	
				}				
			})
			return angular.extend({factory:_factory},model);
		};
	}
	function link(scope,element,attrs,controller){
		controller.setFactory(attrs.factory);
	}	
	function directive() {

		return {
			restrict: 'E',					
			controller: controller,
			link:link
		};
	}

	module.directive('mgShared', directive);

})(angular.module('mgCrud'));;(function (module, undefined) {

	
	
	
	directive.$inject = ['mgSearchShared']
	function directive(search) {

		return {
			restrict: 'E',				
			link:function(scope,element,attrs){
				var controller = search(),expression = attrs.expression;
				if(controller && expression){
					controller.addExpression(function(){
						return scope.$eval(expression)
					});
				}
			}
		};
	}

	module.directive('mgSharedItem', directive);

})(angular.module('mgCrud'));;(function (module, undefined) {

    mgCacheFactory.$inject = ['$cacheFactory'];
    function mgCacheFactory(cacheFactory) {
        var cache = cacheFactory('mgCache');
        return {
            get: cache.get,
            put: cache.put,
            remove: cache.remove,
            removeAll: cache.removeAll,
            pop: function (key) {
                var value = this.get(key);
                if (value) {
                    this.remove(key);
                }
                return value;
            }
        };
    }
    module.factory('mgCacheFactory', mgCacheFactory);

})(angular.module('mgCrud'));
;(function (module, undefined) {



    mgSuccessFactoryCreate.$inject = ['mgHistoryFactory', 'mgSpinnerFactory', 'mgStatusFactory', 'mgCreateModelFactory'];
    function mgSuccessFactoryCreate(history, spinner, status, createModel) {

        return {
            hide: spinner.hide,
            status: status.setStatus,
            assignModel: createModel.assignModel,
            back: history.back
        };
    }

    mgCommandCreate.$inject = ['mgAcceptFactory', 'mgHistoryFactory']
    function mgCommandCreate(mgAcceptFactory, history) {
        return {
            accept: mgAcceptFactory.accept,
            close: history.back
        }
    }

    module.factory('mgSuccessFactoryCreate', mgSuccessFactoryCreate);
    module.factory('mgCommandCreate', mgCommandCreate);


    module.factory('mgCreate', function () {
        return {
            as: 'create',
            method: 'post',
            service: 'mgHttp',
            cacheService: 'mgCacheFactory',
            cache: '["{{as}}.model"]',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryCreate',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
;(function (module, undefined) {

    mgSuccessFactoryDelete.$inject = ['mgHistoryFactory', 'mgSpinnerFactory'];
    function mgSuccessFactoryDelete(history, spinner) {
        return {
            hide: spinner.hide,
            back: history.back
            /*
            back: function () {
                history.back();
            }*/
        };
    }


    module.factory('mgSuccessFactoryDelete', mgSuccessFactoryDelete)

    module.factory('mgDelete', function () {
        return {
            as: 'delete',
            method: 'delete',
            service: 'mgHttp',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryDelete',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
;(function (module, undefined) {


     module.factory('mgEdit', function () {
        return {
            as: 'edit',
            method: 'get',
            service: 'mgHttp',
            cacheService: 'mgCacheFactory',
            cache: '["{{as}}.model"]',
            cacheInvalidate:true,
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryIndex',
            error: 'mgErrorHttpFactory',
            cmd: 'mgAcceptFactory',
            auto: 'accept'
        };
    });


})(angular.module('mgCrud'));
;(function (module, undefined) {

    //History
    mgHistoryFactory.$inject = ['$window']
    function mgHistoryFactory(window) {
        return {
            back: function () {
                window.history.back();
            }
        }
    }

    //Show and Hide Spinner
    spinnerFactory.$inject = [];
    function spinnerFactory() {
        function hide() {
            this.show = false;
        }
        function show() {
            this.show = true;
        }
        return {
            hide: hide,
            show: show
        };
    }

    //Set http status
    statusFactory.$inject = [];
    function statusFactory() {
        function setStatus(response) {
            this.status = response.status;
        }
        return {
            setStatus: setStatus
        };
    }

    //Set response http(data) to model
    createModelFactory.$inject = [];
    function createModelFactory() {
        function assignModel(response) {
            if (angular.isArray(response.data) && angular.isArray(this.model)) {
                this.model = response.data;
            }
            else {
                angular.extend(this.model, response.data || {});
            }
        }
        return {
            assignModel: assignModel
        };
    }
    //call service http
    acceptFactory.$inject = [];
    function acceptFactory() {
        function accept(factory) {
            var model = (factory.partialModel && this.mgEval(factory.partialModel)) || this.filter || this.model || {};
            return factory.service(factory.path,factory.self,model);
        }
        return {
            accept: accept
        };
    }
    //run before call http
    beforeHttpFactory.$inject = ['mgSpinnerFactory'];
    function beforeHttpFactory(spinner) {
        return {
            show: spinner.show
        };
    }
    //run error http
    errorHttpFactory.$inject = ['mgSpinnerFactory', 'mgStatusFactory'];
    function errorHttpFactory(spinner, status) {
        return {
            hide: spinner.hide,
            setStatus: status.setStatus,
            setError: function (response) {
                this.errorText = response.data;
            }
        };
    }

    //default transform
    function defaultTrasform() {
        return function (data, expression) {
            var isArray = angular.isArray, forEach = angular.forEach, newArray = [];
            if (data && expression) {
                if (isArray(data)) {
                    forEach(data, function (value) {
                        newArray.push(this.mgEval(expression, value));
                    },this);
                    return newArray;
                }
                return this.mgEval(expression, data);
            }
            return data;
        }
    }

    module.factory('mgSpinnerFactory', spinnerFactory);
    module.factory('mgStatusFactory', statusFactory);
    module.factory('mgCreateModelFactory', createModelFactory);
    module.factory('mgAcceptFactory', acceptFactory);
    module.factory('mgBeforeHttpFactory', beforeHttpFactory);
    module.factory('mgErrorHttpFactory', errorHttpFactory);
    module.factory('mgHistoryFactory', mgHistoryFactory);
    module.factory('mgDefaultTransform', defaultTrasform);
    module.constant('accept', 'accept');

})(angular.module('mgCrud'));
;(function (module, undefined) {


    mgSuccessFactoryIndex.$inject = ['mgSpinnerFactory', 'mgStatusFactory', 'mgCreateModelFactory']
    function mgSuccessFactoryIndex(spinner, status, createModel) {
        return {
            hide: spinner.hide,
            status: status.setStatus,
            assignModel: createModel.assignModel
        }

    }

    mgCommandIndex.$inject = ['mgAcceptFactory'];
    function mgCommandIndex(accept) {

        function nextPage(factory) {
            this.filter.page++;
            this.accept(factory);
        }
        function previousPage(factory) {
            if (this.filter.page === 0) return;
            this.filter.page--;
            this.accept(factory);
        }
        return {
            accept: accept.accept,
            nextPage: nextPage,
            previousPage: previousPage
        };

    }

    module.factory('mgSuccessFactoryIndex', mgSuccessFactoryIndex);
    module.factory('mgCommandIndex', mgCommandIndex);


    module.factory('mgIndex', function () {
        return {
            as: 'index',
            init: '{{as}}.filter={page:1,size:20}',
            isArray:true,
            method: 'query',
            service: 'mgHttp',
            cacheService: 'mgCacheFactory',
            cache: '["{{as}}.filter"]',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryIndex',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandIndex',
            auto: 'accept'
        };
    });


})(angular.module('mgCrud'));
;(function (module, undefined) {


    module.factory('mgPatch', function () {
        return {
            as: 'patch',
            init: 'patch.model=edit.model',
            method: 'patch',
            service: 'mgHttp',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryCreate',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
;(function (module, undefined) {


    module.factory('mgPut', function () {
        return {
            as: 'put',
            init: 'put.model=edit.model',
            method: 'put',
            service: 'mgHttp',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryCreate',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
;(function (module, undefined) {

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
;(function (module, undefined) {

    function mgStorage(session) {

        mgStorageFactory.$inject = ['$window'];
        function mgStorageFactory($window) {
            var storage = (session) ? $window.sessionStorage : $window.localStorage,isObject=angular.isObject;

            function get(key) {
                var value = storage.getItem(key);
                return (value!==undefined) ? JSON.parse(value) : undefined;
            }
            function put(key, value) {
                if (key && value!==undefined) {
                    storage.setItem(key, JSON.stringify(value))
                }
            }
            function remove(key) {
                storage.removeItem(key);
            }
            function removeAll() {
                storage.clear();
            }
            function pop(key){
                var value = get(key);
                if (value!==undefined) {
                    remove(key);
                }
                return value;
            }
            return {
                get: get,
                put: put,
                remove: remove,
                removeAll: removeAll,
                pop:pop
            };

        }
        return mgStorageFactory;
    }

    module.factory('mgSessionStorageFactory', mgStorage(true)); // SessionStorage
    module.factory('mgLocalStorageFactory', mgStorage()); // LocalStorage

})(angular.module('mgCrud'));
;(function (module, undefined) {

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
;(function (module, undefined) {

    resolvePath.$inject = ['$location'];
    function resolvePath(location) {
        //Inspired in angular-route
        function pathRegExp(path, opts) {
            var insensitive = opts.caseInsensitiveMatch,
                ret = {
                    originalPath: path,
                    regexp: path
                },
                keys = ret.keys = [];

            path = path
              .replace(/([().])/g, '\\$1')
              .replace(/(\/)?:(\w+)([\?\*])?/g, function (_, slash, key, option) {
                  var optional = option === '?' ? option : null;
                  var star = option === '*' ? option : null;
                  keys.push({ name: key, optional: !!optional });
                  slash = slash || '';
                  return ''
                    + (optional ? '' : slash)
                    + '(?:'
                    + (optional ? slash : '')
                    + (star && '(.+?)' || '([^/]+)')
                    + (optional || '')
                    + ')'
                    + (optional || '');
              })
              .replace(/([\/$\*])/g, '\\$1');

            ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
            return ret;
        }
        this.resolve = function (path) {
            if (!path) return { path: location.path() };

            if (path && path.indexOf('{{') === -1) return { path: path };

            return {
                path: path,
                regexPath: pathRegExp(path.replace(/\{+/g, ':').replace(/\}+/g, '').replace(/\./g, ''), { caseInsensitiveMatch: true })
            };
        }
    }

    module.service('mgResolvePathService', resolvePath)

})(angular.module('mgCrud'));
;(function (angular,module, undefined) {

	var SELECTOR = 'mg-shared';
	var CONTROLLER = '$mgSharedController'
	
	function value() {
		return angular.element(document.querySelector(SELECTOR)).data(CONTROLLER)
	}

	module.value('mgSearchShared', value);

})(angular,angular.module('mgCrud'));