# Angular Magic-(mgCrud)

El objetivo principal de este módulo es demostrar como hacer todas las llamadas a servicios RESTfull que necesitemos de una forma declarativa con 7Kb y con menos de 600 líneas de JavaScript gracias a la potencia de [Angularjs](https://angularjs.org/). Es decir en un 98% de tu app no tener que escribir ni controladores ni servicios y por tanto no código.
Nos gustan los módulos [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource) y [restangular](https://github.com/mgonto/restangular), pero nuestro objetivo es simplemente convencerte que con Angular Magic tu puedes evitar escribir JavaScript en un porcentaje muy alto de tu aplicación.

## Directive mg-ajax

**mg-ajax** es la única directiva y tiene solo 4 atributos opcionales.

### Attribute mg-path

Este atributo permite enlazar parte de la ruta al modelo de datos o parametros.
/invoices/{{model.id}}
/invoices/{{params.id}}
El valor por defecto de este atributo es [location.path()](https://docs.angularjs.org/api/ng/service/$location#path) como el action de un Forms de Html.

### Attribute mg-options

Este módulo define cómo y qué se envía a la capa servidora y cómo se sincronizan los datos de respuesta con los ya existentes.
Lo más importante es definir qué verbo http se va a utilizar entre: GET, POST, PUT, PATCH  o DELETE. Para ello se ha escrito un wrapper sobre [$http](https://docs.angularjs.org/api/ng/service/$http) que inserta llamadas a functions JavaScript en el ciclo de vida de la llamada a la servidora. Estas funciones se pueden insertar **before** o después de que la promise [$http](https://docs.angularjs.org/api/ng/service/$http) retorne **success** o **error**. Además te permite declarar distintos command que podrás bindear a directivas de angular como [ngClick](https://docs.angularjs.org/api/ngTouch/directive/ngClick).
Para la configuración de peticiones se han predefinido las siguientes opciones: **mgQuery**, **mgPost**, **mgPut**, **mgPach** y **mgDelete**. Si algunos de las opciones predefinidas en el módulo no se ajustan a tus necesidades puedes crear tus propios módulos o bien declarar un json con un esquema específico en el atributo **mg-options**.