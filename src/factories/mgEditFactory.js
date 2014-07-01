(function (module, undefined) {


    mgSuccessFactoryEdit.$inject = ['mgSpinnerFactory', 'mgStatusFactory', 'mgCreateModelFactory']
    function mgSuccessFactoryEdit(spinner, status, createModel) {
        return {
            hide: spinner.hide,
            status: status.setStatus,
            assingModel: createModel.assingModel
        }

    }

    module.factory('mgSuccessFactoryEdit', mgSuccessFactoryEdit);


    module.factory('mgEdit', function () {
        return {
            as: 'edit',
            method: 'get',
            service: 'mgHttp',
            cacheService: 'mgCacheFactory',
            cache: '["model"]',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryIndex',
            error: 'mgErrorHttpFactory',
            cmd: 'mgAcceptFactory',
            auto: 'accept'
        };
    });


})(angular.module('mgCrud'));
