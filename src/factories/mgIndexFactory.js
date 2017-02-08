(function (module, undefined) {


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
