(function (angular,module, undefined) {

	var SELECTOR = 'mg-shared';
	var CONTROLLER = '$mgSharedController'
	
	function value() {
		return angular.element(document.querySelector(SELECTOR)).data(CONTROLLER)
	}

	module.value('mgSearchShared', value);

})(angular,angular.module('mgCrud'));