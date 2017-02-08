(function (module, undefined) {

	
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

})(angular.module('mgCrud'));