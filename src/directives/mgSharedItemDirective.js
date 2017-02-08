(function (module, undefined) {

	
	
	
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

})(angular.module('mgCrud'));