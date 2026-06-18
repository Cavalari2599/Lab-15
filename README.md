api discostore

esta es una api rest que hice para el laboratorio de multimedios con node y express. administra el catalogo de albumes de una tienda de musica. los datos se guardan en una base de datos sqlite y las entradas se validan con zod. se pueden listar los albumes, ver uno por su slug, filtrar por genero, buscar por texto y ademas crear, actualizar y eliminar albumes.

segui la estructura de las presentaciones del curso, la de node y la de express.

requisitos

se necesita node 22.5 o mas nuevo por que usa el modulo node:sqlite que ya viene incluido en node. yo lo probe con node 24. el modulo de sqlite es experimental asi que node tira un aviso, por eso los scripts ya llevan la opcion para que no salga. uso npm para las dependencias.

instalacion

primero se instalan las dependencias

npm install

poblar la base de datos

la base de datos no esta subida al repo, se genera con los scripts a partir del archivo data.json y el esquema schema.sql. el seed borra y vuelve a crear la tabla asi que se puede correr las veces que quieras. primero se bajan las portadas y despues se crea la base, tambien hay un atajo que hace las dos cosas de una vez

npm run images:download
npm run db:create

o solamente

npm run setup

las portadas ya vienen incluidas en la carpeta public/imagenes asi que el primer paso solo se ocupa si por alguna razon faltan, el script se salta las que ya estan.

correr el servidor

npm start

y queda corriendo en http://localhost:4321/ . tambien esta npm run dev que recarga solo cuando guardas un archivo. el host y el puerto se leen del archivo .env (hay un .env.example de ejemplo), si no existe usa localhost y 4321.

rutas

GET / da la informacion de la api y sus rutas
GET /albumes lista los slugs, si le agregas ?include=full salen todos los datos
POST /albumes crea un album, el slug se genera a partir del titulo
GET /album/:slug es el detalle de un album por su slug, si no existe da 404
PUT /album/:slug actualiza un album existente
DELETE /album/:slug elimina un album
GET /genero/:genero devuelve los slugs de los albumes de ese genero
GET /search/:text busca por texto, tiene que tener minimo 3 letras o da 400
GET /imagenes/ son las portadas de cada album

para crear o actualizar se manda el cuerpo en json. ejemplo con curl

curl -X POST http://localhost:4321/albumes -H "Content-Type: application/json" -d "{\"titulo\":\"OK Computer\",\"artista\":\"Radiohead\",\"genero\":\"Rock alternativo\",\"anio\":1997,\"sello\":\"Parlophone\",\"pistas\":12,\"resumen\":\"Disco clave.\",\"descripcion\":\"Tercer album de Radiohead.\"}"

los generos con espacios (como rock progresivo o hard rock) hay que mandarlos codificados en la url, por ejemplo /genero/Hard%20rock

codigos de estado

200 lectura exitosa o actualizacion (PUT) exitosa
201 el POST creo el recurso, viene con la cabecera Location
204 el DELETE salio bien, sin cuerpo en la respuesta
400 la validacion del cuerpo con zod fallo
404 el recurso a leer, actualizar o eliminar no existe
409 el POST intenta crear un album cuyo slug ya existe

cada album tiene estos campos: titulo, artista, genero, anio, sello, pistas, imagen, slug, resumen y descripcion. el slug se genera solo a partir del titulo. hay 8 albumes en la carga inicial, desde kind of blue (1959) hasta the chronic (1992) y nevermind (1991).

pruebas automatizadas

hay una suite de pruebas hecha con vitest y supertest que cubre un caso por cada operacion y codigo de estado (200, 201, 204, 400, 404 y 409). la suite siembra una base de datos limpia antes de correr, asi que no depende del estado previo. para correrla

npm install
npm test

tambien esta npm run test:watch que se queda escuchando los cambios.

como esta organizado

el archivo index.js solo carga el .env y levanta el servidor; la aplicacion de express con todas las rutas esta en app.js (separada para poder probarla con supertest). en la carpeta data esta el data.json con los datos, el schema.sql con la tabla, el seed.js que crea y llena la base, el createdb.js que llama al seed desde la terminal, el downloadImages.js que baja las portadas y el albumes.js que tiene las consultas a la base. en la carpeta routes/albumes esta un archivo por cada ruta. en utils estan los helpers para los errores y la funcion que genera el slug. en public/imagenes estan las portadas. y en test esta la suite de pruebas.

las pruebas manuales estan documentadas en el archivo PRUEBAS.md, la suite automatizada en test/albumes.test.js y las fuentes que consulte estan en REFERENCIAS.md
