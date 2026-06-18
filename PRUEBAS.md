pruebas de la api

estas son las pruebas que cubren los codigos de estado que pide el laboratorio. las hice con curl contra el servidor en localhost en el puerto 4321. al lado de cada comando va el codigo de estado que devolvio y un ejemplo de la respuesta.

prueba 1 listar todos los albumes (200)

curl -i http://localhost:4321/albumes

devuelve solo los slugs ordenados por anio

200 OK
["the-chronic","nevermind","thriller","back-in-black","rumours","the-dark-side-of-the-moon","abbey-road","kind-of-blue"]

prueba 2 listar los albumes con todos los datos (200)

curl http://localhost:4321/albumes?include=full

aqui salen todos los campos de cada album

prueba 3 ver un album por su slug (200)

curl http://localhost:4321/album/thriller

200 OK
{"id":1,"titulo":"Thriller","artista":"Michael Jackson","genero":"Pop","anio":1982,"sello":"Epic","pistas":9,"imagen":"thriller.png","slug":"thriller","resumen":"El album mas vendido de la historia.","descripcion":"Album de Michael Jackson que redefinio la musica pop de los anios 80 con exitos como Billie Jean, Beat It y el propio Thriller."}

prueba 4 ver un album que no existe (404)

curl -i http://localhost:4321/album/inexistente

404 Not Found
{"error":"No existe ese album"}

prueba 5 los albumes de un genero (200)

curl http://localhost:4321/genero/Rock

devuelve los slugs de los albumes de ese genero

200 OK
["rumours","abbey-road"]

prueba 6 un genero que no tiene albumes (404)

curl -i http://localhost:4321/genero/Reggaeton

404 Not Found
{"error":"No hay albumes del genero: Reggaeton"}

prueba 7 buscar por texto (200)

curl http://localhost:4321/search/dre

busca la palabra en varios campos y trae los albumes que coinciden

200 OK
[{"id":8,"titulo":"The Chronic","artista":"Dr. Dre",...}]

prueba 8 buscar con un texto muy corto (400)

curl -i http://localhost:4321/search/ab

como ab tiene menos de 3 letras la validacion de zod falla

400 Bad Request
{"error":"La busqueda debe tener al menos 3 caracteres"}

prueba 9 crear un album (201)

curl -i -X POST http://localhost:4321/albumes -H "Content-Type: application/json" -d "{\"titulo\":\"OK Computer\",\"artista\":\"Radiohead\",\"genero\":\"Rock alternativo\",\"anio\":1997,\"sello\":\"Parlophone\",\"pistas\":12,\"resumen\":\"Disco clave.\",\"descripcion\":\"Tercer album de Radiohead.\"}"

el slug se genera del titulo y la respuesta trae la cabecera Location

201 Created
Location: /album/ok-computer

prueba 10 crear un album con un slug que ya existe (409)

curl -i -X POST http://localhost:4321/albumes -H "Content-Type: application/json" -d "{\"titulo\":\"Thriller\",\"artista\":\"Michael Jackson\",\"genero\":\"Pop\",\"anio\":1982,\"sello\":\"Epic\",\"pistas\":9}"

409 Conflict
{"error":"Ya existe un album con el slug: thriller"}

prueba 11 crear un album con datos invalidos (400)

curl -i -X POST http://localhost:4321/albumes -H "Content-Type: application/json" -d "{\"titulo\":\"\",\"artista\":\"X\",\"genero\":\"Pop\",\"anio\":1982,\"sello\":\"Epic\",\"pistas\":9}"

el titulo vacio no pasa la validacion de zod

400 Bad Request
{"error":"El titulo es obligatorio"}

prueba 12 actualizar un album (200)

curl -i -X PUT http://localhost:4321/album/ok-computer -H "Content-Type: application/json" -d "{\"titulo\":\"OK Computer\",\"artista\":\"Radiohead\",\"genero\":\"Rock alternativo\",\"anio\":1997,\"sello\":\"EMI\",\"pistas\":12,\"resumen\":\"Editado.\",\"descripcion\":\"Version actualizada.\"}"

200 OK con el album ya actualizado

prueba 13 actualizar un album que no existe (404)

curl -i -X PUT http://localhost:4321/album/inexistente -H "Content-Type: application/json" -d "{...}"

404 Not Found
{"error":"No existe ese album"}

prueba 14 eliminar un album (204)

curl -i -X DELETE http://localhost:4321/album/ok-computer

204 No Content, sin cuerpo en la respuesta

prueba 15 eliminar un album que no existe (404)

curl -i -X DELETE http://localhost:4321/album/ok-computer

404 Not Found
{"error":"No existe ese album"}

prueba 16 las portadas existen y se muestran (200)

abrir en el navegador http://localhost:4321/imagenes/thriller.png y se ve la portada del album, asi se comprueba que las imagenes existen y se pueden mostrar

nota: en windows con powershell conviene mandar el cuerpo json desde un archivo con --data-binary "@archivo.json" por que las comillas de la linea de comandos se pueden romper.
