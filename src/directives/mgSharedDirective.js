(function (module, undefined) {

	
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

})(angular.module('mgCrud'));