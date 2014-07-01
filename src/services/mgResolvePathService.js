(function (module, undefined) {

    resolvePath.$inject = ['$location'];
    function resolvePath(location) {
        //Inspired in angular-route
        function pathRegExp(path, opts) {
            var insensitive = opts.caseInsensitiveMatch,
                ret = {
                    originalPath: path,
                    regexp: path
                },
                keys = ret.keys = [];

            path = path
              .replace(/([().])/g, '\\$1')
              .replace(/(\/)?:(\w+)([\?\*])?/g, function (_, slash, key, option) {
                  var optional = option === '?' ? option : null;
                  var star = option === '*' ? option : null;
                  keys.push({ name: key, optional: !!optional });
                  slash = slash || '';
                  return ''
                    + (optional ? '' : slash)
                    + '(?:'
                    + (optional ? slash : '')
                    + (star && '(.+?)' || '([^/]+)')
                    + (optional || '')
                    + ')'
                    + (optional || '');
              })
              .replace(/([\/$\*])/g, '\\$1');

            ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
            return ret;
        }
        this.resolve = function (path) {
            if (!path) return { path: location.path() };

            if (path && path.indexOf('{{') === -1) return { path: path };

            return {
                path: path,
                regexPath: pathRegExp(path.replace(/\{+/g, ':').replace(/\}+/g, '').replace(/\./g, ''), { caseInsensitiveMatch: true })
            };
        }
    }

    module.service('mgResolvePathService', resolvePath)

})(angular.module('mgCrud'));
