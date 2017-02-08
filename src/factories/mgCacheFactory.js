(function (module, undefined) {

    mgCacheFactory.$inject = ['$cacheFactory'];
    function mgCacheFactory(cacheFactory) {
        var cache = cacheFactory('mgCache');
        return {
            get: cache.get,
            put: cache.put,
            remove: cache.remove,
            removeAll: cache.removeAll,
            pop: function (key) {
                var value = this.get(key);
                if (value) {
                    this.remove(key);
                }
                return value;
            }
        };
    }
    module.factory('mgCacheFactory', mgCacheFactory);

})(angular.module('mgCrud'));
