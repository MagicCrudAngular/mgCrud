(function (module, undefined) {

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
