# Magic Crud Angular (mgCrud)

The main goal of this module is to show how to made all calls to RESTful services we need in a declarative way with 7Kb and less than 600 lines of JavaScript thanks to the power of Angularjs. This allow you to develop 98% of your app without write any controller or service, in other words without javascript code.
We like [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource) and [restangular](https://github.com/mgonto/restangular) modules, but our goal is simply for convincing you that with Angular Magic you can avoid to write JavaScript in a very high percentage of your application.

## Directive mg-ajax

**mg-ajax** is the only directive and it has only 4 optional attributes.

### Attribute path

This attribute allows to bind part of the path to our model data or params.
* /invoices/{{model.id}}
* /invoices/{{params.id}}

The default value of this attribute is the [location.path()](https://docs.angularjs.org/api/ng/service/$location#path) like the action Html Forms.

### Attribute options

This module defines how and what is sent to the server layer and how the response data is synchronized with existing ones.
The most important thing is to define which http verb to use like GET, POST, PUT, PATCH or DELETE. So we've written a wrapper over [$http](https://docs.angularjs.org/api/ng/service/$http) that inserts calls to JavaScript functions within the life cycle of a request to server. These functions can be inserted **before** or after the [$http](https://docs.angularjs.org/api/ng/service/$http) promise **success** or **error**. You can also declare other commands that can be binded to angular directives like [ngClick](https://docs.angularjs.org/api/ngTouch/directive/ngClick).
To configure requests you have the following predefined options: **mgQuery**, **mgPost**, **mgPut**, **mgPach** and **mgDelete**. If some of the predefined in the module options don’t fit your needs you can create your own modules or declare a json with a specific schema in the **options** attribute.
To modify the verb behaviour in your module or to create a new one, you can code as:

```
(function (angular, undefined) {
    var module;
    if (!angular) return;

    module = angular.module('myModule', ['mgCrud']);

    myIndex.$inject = ['mgIndex'];
    function myIndex(mgIndex) {
        return angular.extend(mgIndex, {init:"{index.model.description='hello'}"});
    }

    module.factory('myIndex', myIndex);

})(window.angular);
```

Once myIndex is created you can declare the index behaviour in html as:

```
<mg-ajax mg-path=’/invoices’ mg-options=’myIndex’>
…
</mg-ajax> 
```

or without declare a new factory:

```
<mg-ajax mg-path=’/invoices’ mg-options=’{.......}’>
…
</mg-ajax> 
```

### Attribute override

This attribute is used fot replace the options predefined behaviour in a declarative way. The allowed data type is a js object declared as string.

```
<mg-ajax mg-path=’/invoices’ mg-options=’mgIndex’ mg-override=”{init:’index.filter={page:0,recordsPerPage:15}’}” >
…
</mg-ajax> 
```

This example use the mgIndex predefined behaviour but the recordsPerPage value is replaced with 15 in the init object. This html produce the following REST request:

```
GET /invoices?page=0&recordsPerPage=15
```

### Attribute partialmodel

In some scenarios when you want to edit an entity you can show a related class description and only send the ids (a saved information projection in client side). With that option we save data to send in each roundtrip. This can be used in all verbs without rectrictions, but it only make sense in the POST, PUT and PATCH verbs.
In this edit example only the name will be send to server, cause of the id is defined in the http uri.

```
<mg-ajax data-path="/invoices/get/1" data-options="mgEdit" data-scope="false">
	<mg-ajax data-path="/invoices/put/{{edit.model.id}}" data-options="mgPut" data-scope="false" data-partialmodel='{name:edit.model.name}'>
		<form name="updatefrm" ng-submit="put.accept()">
			<input type="text" ng-model="edit.model.id" />
			<input type="text" ng-model="edit.model.name" />
			<br />
			computed field: {{edit.model.computed}}
			<br />
			<button type="submit">Guardar</button>
			<button type="button" ng-click="put.close()">Cancelar</button>
		</form>
	</mg-ajax>
</mg-ajax>
```

## JS object model for options and override attributes

### as

This field behaves like 'as' ngController and create an object with that name in its scope. Furthermore, a bind call is done in this process so the scope change in all functions and allow us to use 'this' in any factory function. It's required and unique inside the same scope.

###  config

Here we can define the http headers we need to send to server. Temporally they are stored in a module and will be send to server when build the request to server. With that option you can have different RESTFul providers.

The object config has the following signature:

```
config{url,additionalConfig{...}}
```

With additionalConfig you can resolve the following $http values:

* headers
* xsrfHeaderName
* xsrfCookieName 
* transformRequest 
* transformResponse 
* cache 
* timeout 
* withCredentials 
* responseType 

Optionally you can configure a default value in the consumer module.

```
var module = angular.module('myModule', ['mgCrud']);
module.config(function (mgHttpProvider) {
        mgHttpProvider.setDefaultConfig({ url: 'http://localhost:48196' });
});
```

### init

It has a similar behabiour to ngInit and allow us to update our scope (with predefined values) in the 'as' object.

### method

Supported methods are query, get, post, put, patch and delete. This field is required.

### service

It's a wrapper factory over $http where assign shorts methods to query (it's resolved with GET http verb) and patch. This value is required and you has to use 'mgHttpFactory' by default, although you can create your own service and replace it in override member or create your own factory. It's resolved using the $injector get method.

### before

Set of functions that are going to be executed before the REST invocation. This field is optional. Internally, it's a factory where all declared functionsare going to be executed in order.
For example, before an http call may be you want to set a property to true in the 'as' scope to show a spinner, and hide it in the success and error method.

```
beforeHttpFactory.$inject = ['phSpinnerFactory'];
function beforeHttpFactory(spinner) {
        return {
            show: spinner.show
        };
}
```

### success

It has the same behaviour as 'before', but it's executed in the success part of the $http promise. This field is optional, but it's more logical use it for update information after a server call success.

###  error

Has the same behabiour that success or before but it's executed in case of error of the $http promise. It's optional too.

### cacheService

Angular magic allow us to cache information in the angular cache ($cacheFactory) with the id defined in mgCache in localStorage y sesionStorage.

### cacheFactory

Model data that we want to save in the cache.

### cacheKey

This is the cache key and is equal to location.path() + the 'as' value. If some times this produce a colisión the developer had to set an specific key to solve it.

```
if (factory.cache) {
	factory.cache = parse(factory.cache)();
factory.cacheKey = factory.cacheKey || location.path() + (factory.as || '');
```

### cmd

Method factory where we define the public methods of our scope ('as'). for example, in mgIndex by default we define accept, previousPage and nextPage. These methods are what we bin in the View for example in the ngClick directive.

### auto

Function we want eo execute when the directive has been read, this is valid for the initial load in an index page. Usually we write "accept" by default. 
This function is solved after the path attribute is resolved via $attrs.observe, because the path attribute is bindeable and the ajax calls are execute in an asynchronous way. If our path is for example 'invoices/{{param.id}}' we can't execute the ajax call of this directive before higher level directives are solved in case of mgAjax embedded directives.

```
function checkPath(fn) {
	if (factory.regexPath) {
		attrs.$observe('path', function (value) {
			var result = factory.regexPath.regexp.exec(value);
			if (result) {
				factory.path = value;
				fn();
			};
		});
	} else {
		fn();
	}
}
```

### ajaxCmd

It has the same behaviour as 'auto' but it's for http verbs POST, PUT, PATCH and DELETE.

## Predefined factories

### Factory mgIndex

```
module.factory('mgIndex', function () {
	return {
		as: 'index',
		init: 'index.filter={page:0,records:20}',
		method: 'query',
		service: 'mgHttpFactory',
		cacheService: 'mgCacheFactory',
		cache: '["filter"]',
		before: 'mgBeforeHttpFactory',
		success: 'mgSuccessFactoryIndex',
		error: 'mgErrorHttpFactory',
		cmd: 'mgCommandIndex',
		auto: 'accept'
	};
});
```

### Factory mgEdit

```
 module.factory('mgEdit', function () {
	return {
		as: 'edit',
		method: 'get',
		service: 'mgHttpFactory',
		cacheService: 'mgCacheFactory',
		cache: '["model"]',
		before: 'mgBeforeHttpFactory',
		success: 'mgSuccessFactoryIndex',
		error: 'mgErrorHttpFactory',
		cmd: 'mgAcceptFactory',
		auto: 'accept'
	};
});
```

### Factory mgPut

```
module.factory('mgPut', function () {
	return {
		as: 'put',
		init: 'put.model=edit.model',
		method: 'put',
		service: 'mgHttpFactory',
		before: 'mgBeforeHttpFactory',
		success: 'mgSuccessFactoryCreate',
		error: 'mgErrorHttpFactory',
		cmd: 'mgCommandCreate',
		ajaxCmd: 'accept'
	};
});
```

### Factory mgPatch

```
module.factory('mgPatch', function () {
	return {
		as: 'patch',
		init: patch.model=edit.model',
		method: 'patch',
		service: 'mgHttpFactory',
		before: 'mgBeforeHttpFactory',
		success: 'mgSuccessFactoryCreate',
		error: 'mgErrorHttpFactory',
		cmd: 'mgCommandCreate',
		ajaxCmd: 'accept'
	};
});
```

### Factory mgCreate

```
module.factory('mgCreate', function () {
	return {
		as: 'create',
		method: 'post',
		service: 'mgHttpFactory',
		cacheService: 'mgCacheFactory',
		cache: '["model"]',
		before: 'mgBeforeHttpFactory',
		success: 'mgSuccessFactoryCreate',
		error: 'mgErrorHttpFactory',
		cmd: 'mgCommandCreate',
		ajaxCmd: 'accept'
	};
});
```

### Factory mgDelete

```
module.factory('mgDelete', function () {
	return {
		as: 'delete',
		method: 'delete',
		service: 'mgHttpFactory',
		before: 'mgBeforeHttpFactory',
		success: 'mgSucessFactoryDelete',
		error: 'mgErrorHttpFactory',
		cmd: 'mgCommandCreate',
		ajaxCmd: 'accept'
	};
});
```

Service, before, success, error and cmd are factories that join one or more functions and are solved in execution time with the $injector get method.
All cmd have a factory object as inbound argument where path and subfactory resolutions are saved.
All functions used in success and error have the http response as inbound argument with the following format.

```
{ data: data, status: status, headers: headers, config: config }
```

All functions used in 'before' has no inbound arguments.

## Data model

The mgAjax directive join always filter and model, although filter is only used in mgIndex options.

Model is solved before data are sended to server via mgHttpFactory with the same factory.

```
acceptFactory.$inject = [];
function acceptFactory() {
	function accept(factory) {
		var model = (factory.partialModel && this.mgEval(factory.partialModel)) || this.filter || this.model || {};
		factory.service(factory.path, model);
	}
	return {
		accept: accept
	};
}
module.factory('mgAcceptFactory', acceptFactory);
```

When data are received from server they are allocated in the object model in the 'as' scope as this factory show.

```
createModelFactory.$inject = [];
function createModelFactory() {
	function assignModel(response) {
		angular.extend(this.model, response.data || {});
	}
	return {
		assignModel: assignModel
	};
 }
module.factory('mgCreateModelFactory', createModelFactory);
```


With all it's commented before the 'as' scope for index option is like:

```
{
	filter: {page:0,recorsPerPage:25} // applied filter
	model:[...]
	status:200 // after http service call
	errorText : // only exists if an error has occurred when the http service is called
	show:false // spinner is hidden
	accept:function() // call to http service with the filter value
	previousPage: function()  // page is decreased 1 and call to accept
	mgEval:function() // it's binded to $scope to solve a global expression where ever we where
	nextPage: function() // page is increased 1 and call to accept
	params:{} // only available in case of the path use parameters
}
```

Example of html

```
<mg-ajax data-path="/invoices" data-options="mgIndex">
	<div class=’spinner’ ng-show=’index.show’/>
	<div class=’error’’ ng-show=’index.errorText> 
		{{index.errorText}}
	</div>
	<input type="text" ng-model="parent.filter.name" ng-change="parent.accept()" />
	<div>
		<button ng-click="index.accept()">Accept</button>
		<button ng-click="index.nextPage()">Next</button>
		<button ng-click="index.previousPage()" ng-disabled="index.filter.page==0">Previous</button>
	</div>
	<div>          
		<ul>
			<li ng-repeat="item in index.model">
				{{item.id}}-{{item.name}}
			</li>               
		</ul>
	</div>
</mg-ajax>
```

You can view a simple index without services neither controller. This allow you a declarative language thanks to magic angular.

## src directory structure

* Directives
  * mgAjaxDirective: Responsible for the magical module
* Factories
  * mgCacheFactory: Contains the responsible method of angularjs cache management
  * mgSessionStorageFactory: Responsible for sessionStorage cache management
  * mgLocalStorageFactory: Responsible for localStorage cache management
  * mgCreateFactory: Predefined behaviour for options=mgCreate
  * mgDeleteFactory: Predefined behaviour for options=mgDelete
  * mgGlobalFactory: Global functions for reusing code
  * mgIndexFactory: Predefined behaviour for options=mgIndex
  * mgPutFactory: Predefined behaviour for options=mgPut
  * mgPatchFactory: Predefined behaviour for options=mgPatch
  * mgResolveFactory: Solve controller and directive dependencies
* Providers
  * mgHttpProvider: Wrapper over $http in case of patch and query methods
* Services
  * mgResolvePathService: Solve binding paths
* Global
  * module: global file that define a function to check if an object is null

## Dependences

mgCrud has dependencies with:
* Angularjs
* ngRoute

## How to use it

```
<script scr=’angular.js’>
<script src=’angular-route.js’’>
<script src=’mgcrud.js’>
```

## Advantages of using mgCrud.

* Avoid repetitive code.
* Avoid big JavaScript files in large apps.
* Focus our attention in the view and forget of write not important and repetitive code.
* Has in our scope an subscope that bind to this.
* Wrap our scope this that is equal to 'as'.
* Global scope for binding in case of nested scopes.
* Eval expressions for this scope ('as') with global scope (mgEval).
* Call to different Rest services providers.
* Can call to different RESTFul providers from the module.


## Roadmap

* Support Foreign keys and maintain state in the view when round trip go back from create a related object.
* Directive to cache data in the current view when navigate to other views.
* Directive to clear cache.
* MVC Razor helpers
* Jade Helpers