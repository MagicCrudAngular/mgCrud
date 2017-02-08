(function (module, undefined) {

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
