(function (module, undefined) {

  

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
            cache: '["model"]',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryCreate',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
