# Documentación Rutas Cripto - Coins 

#### - Registro de usuarios /auth/signup
* firstName: Requerido del tipo string.
* lastName: Requerido del tipo string.
* password: Requerido del tipo string. Además tiene que ser alfanúmerico con un mínimo de 8 caracteres. Se guarda encriptado en el campo.
* email: Requerido del tipo email. Se valida que sea email(formato) y sea único.
* preferedCurrency: Requerido del tipo integrer. Tiene como default value 1. 

Ningún usuario es creado si alguno de estos datos, son nulos. 

#### - Login de usuarios /auth/signin
Recibimos username(email) y password.
Verificamos que el usuario exista, y que el password sea de ese usuario. Si da errores devuelve mensajes de error.
Al pasar la validación se genera el token y se envia un JSON con data del usuario necesarios para utilizar la api.
* idUser
* username
* preferedCurrency
* preferedCurrencyisoName
* accessToken(El token tiene una validez de 1hr).

Se podrían incluir otros datos de ser necesarios para nuevas implementaciones.

#### - Todas las siguientes rutas necesitan el token para poder acceder. De lo contrario les manda un mensaje de error. 

#### - Listado coins por moneda preferida del usuario /list/coins
Recibimos el valor de preferedCurrencyisoName del usuario
Retornamos el listado de todas las monedas con su cotización en la moneda preferida del usuario.

#### - Agregar monedas a favoritos, cada usuario puede generar su listado /user/add/coins
Recibimos los datos del id de usuario en la tabla users. Además de todos los datos de la moneda que luego vamos agregar en la tabla favuserscoins.
Verificamos que no exista ya en la tabla, nos evita que un usuario agregue dos veces la misma moneda.
Retornamos los valores que hemos agregado o si existe algún error lo retornamos sin agregar ningun dato.

#### - Listado monedas favoritas /user/favlist/coins
En esta ruta recibiremos estos datos
- idUser En este parametro nos llega el id del usuario
- number Es el número de items a mostrar. Acá el usuario puede definir, hasta un máximo de 25 monedas favoritas para mostrar. Si tuviera menos del número se muestra el total. Se realizan verificaciones por poder retornar valores acordes a las peticiones. 
- orderName Es un string para definir el orden a mostrar del listado. Se puede ordenar ascendente o descendente. Por defecto se muestra el listado descendente. Esta ordenado por el valor de las monedas en la moneda preferida del usuario, pero tambien retorna el valor en las otras monedas disponibles.

#### - Borrar monedas de la lista de fav /user/favdelete/coins
Requerimos para borrar la moneda del listado
- idUser En este parametro nos llega el id del usuario
- id Este es el id de la moneda es único para cada moneda
Acá retornamos mensajes de borrado o de error según corresponda.

#### - Update valores de precio y última actualización user/favupdate/coins
En esta ruta vamos a actualizar los valores de mercado del listado de monedas favoritas vamos a requerir
- idUser En este parametro nos llega el id del usuario
- id Este es el id de la moneda es único para cada moneda
- preferedCurrencyisoName Este parametro es el isoName que nos permitira traer los valores actualizados, junto con el id del coin a actualizar
Aca además del valor también actualizamos la fecha de última actualización para poder llevar un control visual del ultimo update de la moneda.
Retornamos un mensaje si se ha hecho el update o un mensaje de error en caso de que no lo haya hecho.

Todas las rutas retornan mensajes de error en caso de que no haya sido posible realizar el request y catch para control de errores.
