(function (module, undefined) {


    module.factory('mgPut', function () {
        return {
            as: 'patch',
            init: 'patch.model=edit.model',
            method: 'patch',
            service: 'mgHttp',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryCreate',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
