(function (module, undefined) {


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
