# Spotify Recomendify

## Dependencias
Archivos TSV con formato compatible (incluidos minimo.tsv y spotify-mini.tsv), mas detalles al final.

No es requerido ningun paquete o modulo.
El proyecto esta enteramente realizado en JavaScript y NodeJs con funciones nativas.

## Inicio
Recibe por parametro el nombre del archivo tsv a utilizar.

`node recomendify.js spotify-mini.tsv`

`node recomendify.js minimo.tsv`

Ctrl + C para finalizar. 

## Acerca del proyecto
Recomendify es una aplicacion que permite al usuario obtener datos sobre canciones como: importancia, ciclos, rangos, clustering y obtener recomendaciones de usuarios o canciones.
La aplicacion funciona sobre en analisis de una base de datos liberada por spotify en formato TSV.
Se modelan diferentes grafos que nos permiten aplicar sobre ellos diversos algoritmos para el analisis de sus datos.
Entre los algoritmos utilizados estan BFS, Backtracking, Clustering e incluso diferentes aplicaciones de PageRank (Algoritmo utilizado por Google para asignar de forma numérica la relevancia de los documentos (o páginas web) indexados por un motor de búsqueda.)

## IMPORTANTE
NombreCancion esta compuesto de la siguiente manera:
`nombreDeLaCancion - NombreDelArtista`

Consultar el CSV para ver los usuarios y canciones. Asegurarse de tipear bien los nombres. (La mayoria de funciones no incluyen soporte para tolerar errores de tipeo)

Ejemplos:
`Eraser - Ed Sheeran`
`Bad Romance - Lady Gaga`
`Radioactive - Imagine Dragons`

## Comandos

`camino nombreCancion1 >>>> nombreCancion2`

Donde "nombreCancion1" y "nombreCancion2" son nombres de canciones.
Realiza un bfs del vertice inicial hasta (si es posible) el vertice destino.
Devuelve el string con el camino indicado o "No se encontro recorrido".

Ejemplo: `camino Eraser - Ed Sheeran >>>> Perfect - Selena Gomez`

___

`mas_importantes n`

Donde "n" es un numero natural.
Devuelve un string de las n canciones con mayor PageRank.

Ejemplo: `mas_importantes 10`

___

`recomendacion canciones n nombreCancion1 >>>> nombreCancion2 >>>> nombreCancion3`

Donde "n" es el numero de recomendaciones solicitadas, y "nombreCancion1","2","3",etc... son canciones que al usuario le gustan (Puede ingresar cuantas quiera).
Realiza randoms walks a partir de los vertices indicados para conseguir vertices similares.
Devuelve un string con las recomendaciones.

Ejemplo: `recomendacion canciones 4 Don't Let Me Down - The Beatles >>>> Love Of My Life - Queen`

___

`recomendacion usuarios n nombreCancion1 >>>> nombreCancion2 >>>> nombreCancion3`

Donde "n" es el numero de recomendaciones solicitadas, y "nombreCancion1","2","3",etc... son canciones que al usuario le gustan (Puede ingresar cuantas quiera).
Realiza randoms walks a partir de los vertices indicados para conseguir vertices similares.
Devuelve un string con las recomendaciones.

Ejemplo: `recomendacion usuarios 3 Eraser - Ed Sheeran >>>> Doom And Gloom - Rolling Stones`

___

`ciclo n nombreCancion`

Donde "n" es el largo del ciclo y "nombreCancion" el nombre de la cancion inicial.
Busca un ciclo de largo n mediante backtracking.
Devuelve un string con el ciclo indicado o "No se encontro recorrido".

Ejemplo: `ciclo 5 Eraser - Ed Sheeran`

___

`rango n nombreCancion`

Donde "n" es el rango de las canciones buscadas y "nombreCancion" el nombre de la cancion inicial.
A partir del vertice indicado realiza un bfs de rango maximo n.
Devuelve el numero de canciones a rango n.

Ejemplo: `rango 5 Radioactive - Imagine Dragons`

___

`clustering`
`clustering nombreCancion`

Donde "nombreCancion" es el nombre de la cancion a la que se le quiere conocer su clustering, dejar en blanco para calcular el clustering general.
Calcula el coeficiente de clustering de la cantidad indicada o la sumatoria del de todos los vertices dividido el numero de vertices.
Devuelve el coeficiente de clustering particular de la cancion o el del grafo segun corresponda.

Ejemplo: `clustering Bohemian Rhapsody - Queen` `clustering`
(El algoritmo para todas las canciones toma varios minutos)

## Archivos TSV
Se adjunta el archivo spotify-mini.tsv y minimo.tsv, ambos compatibles y con la siguiente estructura:
```
ID	USER_ID	TRACK_NAME	ARTIST	PLAYLIST_ID	PLAYLIST_NAME	GENRES
1	sitevagalume	Eraser	Ed Sheeran	6736120	Ed Sheeran - Divide	Pop,Rock,Pop/Rock
2	sitevagalume	Castle On The Hill	Ed Sheeran	6736120	Ed Sheeran - Divide	Pop,Rock,Pop/Rock
3	...etc...
```

spotify-mini.tsv es el archivo completo, posee 30000 entradas. (Recomendado, al tener mas datos permite un mejor analisis)
minimo.tsv es un archivo parcial, conveniente para pruebas o equipos de bajas especificaciones, posee solo 2005 entradas.

### Sebastian M. Vintoñuke
### Contact Information:

- [GitHub](https://github.com/SebastianVintonuke)
- [LinkedIn](https://www.linkedin.com/in/sebastian-vintoñuke-7ab06a161/)
- sebastian.m.vintonuke@gmail.com
