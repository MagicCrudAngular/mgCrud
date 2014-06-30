# Magic Crud Angular (mgCrud)

El objetivo principal de este módulo es demostrar como hacer todas las llamadas a servicios RESTfull que necesitemos de una forma declarativa con 7Kb y con menos de 600 líneas de JavaScript gracias a la potencia de [Angularjs](https://angularjs.org/). Es decir en un 98% de tu app no tener que escribir ni controladores ni servicios y por tanto no código.
Nos gustan los módulos [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource) y [restangular](https://github.com/mgonto/restangular), pero nuestro objetivo es simplemente convencerte que con Angular Magic tu puedes evitar escribir JavaScript en un porcentaje muy alto de tu aplicación.

## Directive mg-ajax

**mg-ajax** es la única directiva y tiene solo 4 atributos opcionales.

### Attribute path

Este atributo permite enlazar parte de la ruta al modelo de datos o parametros.
/invoices/{{model.id}}
/invoices/{{params.id}}
El valor por defecto de este atributo es [location.path()](https://docs.angularjs.org/api/ng/service/$location#path) como el action de un Forms de Html.

### Attribute options

Este módulo define cómo y qué se envía a la capa servidora y cómo se sincronizan los datos de respuesta con los ya existentes.
Lo más importante es definir qué verbo http se va a utilizar entre: GET, POST, PUT, PATCH  o DELETE. Para ello se ha escrito un wrapper sobre [$http](https://docs.angularjs.org/api/ng/service/$http) que inserta llamadas a functions JavaScript en el ciclo de vida de la llamada a la servidora. Estas funciones se pueden insertar **before** o después de que la promise [$http](https://docs.angularjs.org/api/ng/service/$http) retorne **success** o **error**. Además te permite declarar distintos command que podrás bindear a directivas de angular como [ngClick](https://docs.angularjs.org/api/ngTouch/directive/ngClick).
Para la configuración de peticiones se han predefinido las siguientes opciones: **mgQuery**, **mgPost**, **mgPut**, **mgPach** y **mgDelete**. Si algunos de las opciones predefinidas en el módulo no se ajustan a tus necesidades puedes crear tus propios módulos o bien declarar un json con un esquema específico en el atributo **options**.
Para modificar el comportamiento de un verbo en tu módulo o crear uno nuevo puedes implementarlo de la siguiente forma:

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

Una vez creado myIndex tu puedes declarar en el html el comportamiento de index de la siguiente forma:

```
<mg-ajax mg-path=’/invoices’ mg-options=’myIndex’>
…
</mg-ajax> 
```

o sin declarar una nueva factoria:

```
<mg-ajax mg-path=’/invoices’ mg-options=’{.......}’’>
…
</mg-ajax> 
```
