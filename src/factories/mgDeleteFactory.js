(function (module, undefined) {

    mgSuccessFactoryDelete.$inject = ['mgHistoryFactory', 'mgSpinnerFactory'];
    function mgSuccessFactoryDelete(history, spinner) {
        return {
            hide: spinner.hide,
            back: history.back
            /*
            back: function () {
                history.back();
            }*/
        };
    }


    module.factory('mgSuccessFactoryDelete', mgSuccessFactoryDelete)

    module.factory('mgDelete', function () {
        return {
            as: 'delete',
            method: 'delete',
            service: 'mgHttp',
            before: 'mgBeforeHttpFactory',
            success: 'mgSuccessFactoryDelete',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
