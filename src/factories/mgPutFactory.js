(function (module, undefined) {


    module.factory('mgPut', function () {
        return {
            as: 'put',
            init: 'put.model=edit.model',
            method: 'put',
            service: 'mgHttp',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryCreate',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
