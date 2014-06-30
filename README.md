# Magic Crud Angular (mgCrud)

The main goal of this module is to show how to made all calls to RESTful services we need in a declarative way with 7Kb and less than 600 lines of JavaScript thanks to the power of Angularjs. This allow you to develop 98% of your app without write any controller or service, in other words without javascript code.
We like [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource) and [restangular](https://github.com/mgonto/restangular) modules, but our goal is simply for convincing you that with Angular Magic you can avoid to write JavaScript in a very high percentage of your application.

## Directive mg-ajax

**mg-ajax** is the only directive and it has only 4 optional attributes.

### Attribute path

This attribute allows to bind part of the path to our model data or params.
/invoices/{{model.id}}
/invoices/{{params.id}}
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