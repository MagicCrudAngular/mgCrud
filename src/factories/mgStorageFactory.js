(function (module, undefined) {

    function mgStorage(session) {

        mgStorageFactory.$inject = ['$window'];
        function mgStorageFactory($window) {
            var storage = (session) ? $window.sessionStorage : $window.localStorage,isObject=angular.isObject;
           
            function get(key) {
                var value = storage.getItem(key);
                return (value!==undefined) ? JSON.parse(value) : undefined;
            }
            function put(key, value) {
                if (key && value!==undefined) {
                    storage.setItem(key, JSON.stringify(value))
                }            
            }
            function remove(key) {
                storage.removeItem(key);
            }
            function removeAll() {
                storage.clear();
            }
            function pop(key){
                var value = get(key);
                if (value!==undefined) {
                    remove(key);
                }
                return value;
            }
            return {
                get: get,
                put: put,
                remove: remove,
                removeAll: removeAll,
                pop:pop
            };

        }
        return mgStorageFactory;
    }
    
    module.factory('mgSessionStorageFactory', mgStorage(true)); // SessionStorage
    module.factory('mgLocalStorageFactory', mgStorage()); // LocalStorage 

})(angular.module('mgCrud'));