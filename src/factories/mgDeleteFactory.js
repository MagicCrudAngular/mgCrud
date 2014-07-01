(function (module, undefined) {

    mgSucessFactoryDelete.$inject = ['$window', 'mgSpinnerFactory'];
    function mgSucessFactoryDelete(window, spinner) {
        return {
            hide: spinner.hide,
            back: function () {
                window.history.back();
            }
        };
    }


    module.factory('mgSucessFactoryDelete', mgSucessFactoryDelete)

    module.factory('mgDelete', function () {
        return {
            as: 'delete',
            method: 'delete',
            service: 'mgHttp',
            before: 'mgBeforeHttpFactory',
            success: 'mgSucessFactoryDelete',
            error: 'mgErrorHttpFactory',
            cmd: 'mgCommandCreate',
            ajaxCmd: 'accept'
        };
    });

})(angular.module('mgCrud'));
