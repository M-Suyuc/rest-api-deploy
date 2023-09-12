# rest-api-deploy
GET
- url/movies -> Recupera todas las peliculas
- url/id     -> Recupra una pelicula por su id
  
POST
- url/movies -> Agrega una nueva pelicula ejemplo:
```json
   "title": "The GoodFatherR",
    "year": 1975,
    "director":"Francis FordD",
    "duration": 190,
    "poster": "https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg",
    "genre":["Crime","Drame"]
```
PATCH
-url/id   -> Actualiza una parte de la pelicula ejemplo:
 ```json
{
  "year": 1994
}
```
DELETE
-url/id  -> Elimina una pelicula ejemplo:
```javascript
fetch(`url/${id}`, {
method: 'DELETE',
})
```
