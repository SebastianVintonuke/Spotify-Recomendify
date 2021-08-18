#!/usr/bin/node

var gr = require("./grafo")
var fs = require("fs"),
    readline = require("readline");
var fu = require("./funciones")

// Recibe el grafo, el vertice origen, destino, el diccionario de padres y de orden.
// Mediante el diccionario de padres va obteniendo los vertices,
// para cada par de vertices calcula su arista intermedia y
// lo agrega a un array junto con los respectivos separadores.
// Va de destino a origeny da vuelta el array al final.
// Devuelve el string que corresponde al recorrido.
function reconstruirCamino(grafo, origen, destino, padres, orden) {
    let recorrido = []
    let cancion = destino
    let strCancion = cancion.slice(10, cancion.length)
    recorrido.push(strCancion)
    for (let i = 0; i < (orden.get(destino)/2); i++) {
        let usuario = padres.get(cancion)
        let cancion2 = padres.get(usuario)
        let vertice = grafo.peso(usuario, cancion)
        let vertice2 = grafo.peso(usuario, cancion2)
        let strVertice = vertice
        let strUsuario = usuario.slice(10, usuario.length)
        let strVertice2 = vertice2
        let strCancion2 = cancion2.slice(10, cancion2.length)
        recorrido.push(" --> donde aparece --> ")
        recorrido.push(strVertice)
        recorrido.push(" --> tiene una playlist --> ")
        recorrido.push(strUsuario)
        recorrido.push(" --> de --> ")
        recorrido.push(strVertice2)
        recorrido.push(" --> aparece en playlist --> ")
        recorrido.push(strCancion2)
        cancion = cancion2
    }
    recorrido.reverse()
    let salida = ""
    for (let i = 0; i < recorrido.length; i++) {
        salida += recorrido[i]
    }
    salida = salida.replace("	","")
    return salida
}

// Recibe el comando parsear con los datos necesarios y el grafo correspondiente.
// Realiza un bfs del vertice inicial hasta (si es posible) el vertice destino.
// Devuelve el string con el camino indicado o "No se encontro recorrido".
function camino(comando, grafoUsuarios) {
    let grafo = grafoUsuarios
    let origen = "CANCION - " + comando[1]
    let destino = "CANCION - " + comando[2]
    if (!grafo.existe(origen) || !grafo.existe(destino)) {
        return "Tanto el origen como el destino deben ser canciones"
    }
    let padresOrden = fu.caminoMinimo(grafo, origen, destino)
    let resultado
    if (padresOrden == null) {
        resultado = "No se encontro recorrido"
    } else {
        resultado = reconstruirCamino(grafo, origen, destino, padresOrden[0], padresOrden[1])
    }
    return resultado
}

// Recibe el comando y el PageRank de los vertices.
// Devuelve un string de las n canciones con mayor PageRank.
function verPageRank(comando, pageRank) {
    let n = parseInt(comando[1], 10)
    let stringCanciones = pageRank[0][0]
    for (let i = 1; i < n; i++) {
        stringCanciones = stringCanciones.concat("; ", pageRank[i][0])
    }
    return stringCanciones
}

// Recibe el grafo correspondiente.
// Calcula el PageRank de todos los vertices.
// Devuelve un array ordenado por PageRank.
function masImportantes(grafoUsuarios) {
    let grafo = grafoUsuarios
    let arrayVertices = grafo.obtenerVertices()
    let mapPageRank = new Map()
    let mapPageRankAux = new Map()
    
    for (let i = 0; i < arrayVertices.length; i++) {
        mapPageRank.set(arrayVertices[i], 1)
        mapPageRankAux.set(arrayVertices[i], 1)
    }
    
    for (let i = 0; i < 10; i++) {
        for (let i2 = 0; i2 < arrayVertices.length; i2++) {
            mapPageRank.set(arrayVertices[i2], (fu.pageRank(grafo, arrayVertices[i2], mapPageRankAux)))
        }
        mapPageRankAux = mapPageRank
    }
    
    let arrayRank = Array.from(mapPageRank.entries())
    let arrayCancionesRank = []

    for (let i = 0; i < arrayRank.length; i++) {
        if (arrayRank[i][0].slice(0, 7) == "CANCION") {
            arrayCancionesRank.push([arrayRank[i][0].slice(10),arrayRank[i][1]])
        }
    }

    arrayCancionesRank = arrayCancionesRank.sort(function compareNumbers(a, b) {
        return b[1] - a [1];
    })
    return arrayCancionesRank
}

//node recomendify.js "spotify-mini.tsv"

// Recibe el comando parseado con los datos necesarios y el grafo correspondiente.
// Realiza randoms walks a partir de los vertices indicados para conseguir vertices similares.
// Devuelve un string con las recomendaciones.
function recomendacion(comando, grafoUsuarios) {
    let grafo = grafoUsuarios
    let tipo = comando[1]
    let n = parseInt(comando[2], 10)
    let similares = comando.slice(3, comando.length)
    for (let i = 0; i < similares.length; i++) {
        similares[i] = "CANCION".concat(" - ", similares[i])
    }
    let arrayVertices = grafo.obtenerVertices()
    let mapPageRank = new Map()
    for (let i = 0; i < arrayVertices.length; i++) {
        mapPageRank.set(arrayVertices[i], 0)
    }
    for (let i = 0; i < similares.length; i++) {
        let vertice = similares[i]
        fu.pageRankPersonalizado(grafo, vertice, mapPageRank, 1000000) // Cuando mas largo mas tiempo tarda pero consigue mejores resultados.
    }
    let arrayRank = Array.from(mapPageRank.entries())
    arrayRank = arrayRank.sort(function compareNumbers(a, b) {
        return b[1] - a[1];
    })
    let recomendaciones = []
    let i = 0
    while (recomendaciones.length < n && arrayRank[i][1] != 0) {
        if (tipo == "usuarios" && arrayRank[i][0].slice(0, 7) == "USUARIO") {
            recomendaciones.push(arrayRank[i][0].slice(10, (arrayRank[i][0].length)))
        }
        if (tipo == "canciones" && arrayRank[i][0].slice(0, 7) == "CANCION") {
            recomendaciones.push(arrayRank[i][0].slice(10, (arrayRank[i][0].length)))
        }
        i++
    }
    let salida = recomendaciones[0]
    for (let i = 1; i < recomendaciones.length; i++) {
        salida += "; "
        salida += recomendaciones[i]
    }
    return salida
}

// Recibe el comando parseado con los datos necesarios y el grafo correspondiente.
// Busca un ciclo de largo n mediante backtracking.
// Devuelve un string con el ciclo indicado o "No se encontro recorrido".
function ciclo(comando, grafoCanciones) {
    let grafo = grafoCanciones
    let nCiclo = parseInt(comando[1], 10)
    let cancion = comando[2]
    let ciclo = fu.buscaCicloBacktracking(grafo, nCiclo, cancion)
    let salida
    if (ciclo.size == 0) {
        salida = "No se encontro recorrido"
    } else {
        let cicloArray = Array.from(ciclo.values())
        cicloArray.push(cancion)
        salida = cancion
        for (let i = 0; i < cicloArray.length; i++) {
            salida = salida.concat(" --> ", cicloArray[i])
        }
    }
    return salida
}

// Recibe el comando parseado con los datos necesarios y el grafo correspondiente.
// A partir del vertice indicado realiza un bfs de rango maximo n.
// Devuelve el numero de canciones a rango n.
function rango(comando, grafoCanciones) {
    let grafo = grafoCanciones
    let ordenMax = parseInt(comando[1], 10)
    let cancion = comando[2]
    let orden = Array.from(fu.bfsOrdenMax(grafo, cancion, ordenMax)[1].entries())
    let nCanciones = 0
    for (let i = 0; i < orden.length; i++) {
        if (orden[i][1] == ordenMax) {
            nCanciones++
        }
    }
    return nCanciones
}

// Recibe el comando parseado con los datos necesarios y el grafo correspondiente.
// Calcula el coeficiente de clustering de la cantidad indicada o
// la suatoria del de todos los vertices dividido el numero de vertices.
// Devuelve el coeficiente de clustering particular de la cancion o el del grafo segun corresponda.
function clustering(comando, grafoCanciones) {
    let grafo = grafoCanciones
    let cancion = comando[1]
    let coeficiente
    if (cancion == "") {
        let vertices = grafo.obtenerVertices()
        let sumatoria = 0
        for (let i = 0; i < vertices.length; i++) {
            sumatoria += fu.coeficienteDeClustering(grafo, vertices[i])
        }
        coeficiente = sumatoria / vertices.length
    } else {
        coeficiente = fu.coeficienteDeClustering(grafo, cancion)
    }
    let coeficienteString = String(coeficiente)
    coeficienteString = coeficienteString.slice(0, 5)
    return coeficienteString
}

// Recibe la linea del archivo original.
// Si no estan agrega el usuario/cancion y crea la arista intermedia.
function añadirGrafoUsuario(arrayline, grafoUsuarios) {
    let verticeUsuario = "USUARIO - " + arrayline[1]
    let verticeCancion = "CANCION - " + arrayline[2] + " - " + arrayline[3]
    let aristaPlaylist = arrayline[5]
    if (!grafoUsuarios.existe(verticeUsuario)) {
        grafoUsuarios.agregarVertice(verticeUsuario)
    }
    if (!grafoUsuarios.existe(verticeCancion)) {
        grafoUsuarios.agregarVertice(verticeCancion)
    }
    if (!grafoUsuarios.sonAdyacentes(verticeUsuario, verticeCancion)) { // Une solo por la primera playlist en comun.
        grafoUsuarios.agregarArista(verticeUsuario, verticeCancion, aristaPlaylist)
    }
}

// Recibe una playlist (conjunto de lineas del archivo original que pertenecen a la misma playlist) y un grafo.
// Para cada par de cancion, si no estan las agrega al grafo y crea la arista intermedia.
function añadirGrafoCanciones(playlist, grafoCanciones) {
    let contador = 0;
    for (let i = 0; i < playlist.length; i++) {
        let cancion = playlist[i]
        let verticeCancion = cancion[2] + " - " + cancion[3]
        if (!grafoCanciones.existe(verticeCancion)) {
            grafoCanciones.agregarVertice(verticeCancion)
        }
        for (let i2 = 0; i2 < playlist.length; i2++) {
            let cancion2 = playlist[i2]
            let verticeCancion2 = cancion2[2] + " - " + cancion2[3]
            if (verticeCancion != verticeCancion2) {
                grafoCanciones.agregarArista(verticeCancion, verticeCancion2, 1)
            }
        }
    }
}

// node recomendify.js "minimo.tsv"
// clustering Bohemian Rhapsody - Queen

// Recibe la entrada del usuario.
// Parsea la entrada.
// Devuelve un array con los parametros necesarios para cada funcion, o null de no ser valida.
function parsear(entrada) {
    let entradaParseada
    if (entrada.startsWith("camino")) {
        let parametros = entrada.slice(7)
        let arrayParametros = parametros.split(" >>>> ")
        entradaParseada = ["camino", arrayParametros[0], arrayParametros[1]]
    } else if (entrada.startsWith("mas_importantes")) {
        let numero = entrada.slice(16)
        entradaParseada = ["mas_importantes", numero]
    } else if (entrada.startsWith("recomendacion")) {
        entradaParseada = []
        entradaParseada.push("recomendacion")
        let parametros = entrada.slice(14)
        if (parametros.startsWith("canciones")) {
            entradaParseada.push("canciones")
            parametros = parametros.slice(10)
        } else if (parametros.startsWith("usuarios")) {
            entradaParseada.push("usuarios")
            parametros = parametros.slice(9)
        }
        let numero = parametros.slice(0, parametros.indexOf(" ") + 1)
        entradaParseada.push(numero)
        parametros = parametros.slice(parametros.indexOf(" ") + 1)
        let arrayParametros = parametros.split(" >>>> ")
        for (let i = 0; i < arrayParametros.length; i++) {
            entradaParseada.push(arrayParametros[i])
        }
    } else if (entrada.startsWith("ciclo")) {
        let parametros = entrada.slice(6)
        let numero = parametros.slice(0, parametros.indexOf(" "))
        let cancion = parametros.slice(parametros.indexOf(" ") + 1)
        entradaParseada = ["ciclo", numero, cancion]
    } else if (entrada.startsWith("rango")) {
        let parametros = entrada.slice(6)
        let numero = parametros.slice(0, parametros.indexOf(" "))
        let cancion = parametros.slice(parametros.indexOf(" ") + 1)
        entradaParseada = ["rango", numero, cancion]
    } else if (entrada.startsWith("clustering")) {
        let cancion = entrada.slice(11)
        entradaParseada = ["clustering", cancion]
    } else {
        return null
    }
    return entradaParseada
}

// Recibe las estructuras, el archivo en memoria y la entrada del usuario.
// Si la entrada del usuario parseada coincide con un comando valida,
// llama a la funcion asociada con los respectivos parametros,
// si no existe dicho parametro, lo crea.
// Imprime el resultado por pantalla y actualiza las estructuras de ser necesario.
function procesarEntrada(estructuras, archivo, line) {
    let comando = parsear(line)
    if (comando == null) {
        return estructuras
    } else if (comando[0] == "camino") {
        if (estructuras[0] == null) {
            estructuras[0] = inicializarGrafoUsuarios(archivo)
        }
        console.log(camino(comando, estructuras[0]))
    } else if (comando[0] == "mas_importantes") {
        if (estructuras[0] == null) {
            estructuras[0] = inicializarGrafoUsuarios(archivo)
        }
        if (estructuras[2] == null) {
            estructuras[2] = masImportantes(estructuras[0])
        }
        console.log(verPageRank(comando, estructuras[2]))
    } else if (comando[0] == "recomendacion") {
        if (estructuras[0] == null) {
            estructuras[0] = inicializarGrafoUsuarios(archivo)
        }
        console.log(recomendacion(comando, estructuras[0]))
    } else if (comando[0] == "ciclo") {
        if (estructuras[1] == null) {
            estructuras[1] = inicializarGrafoCanciones(archivo)
        }
        console.log(ciclo(comando, estructuras[1]))
    } else if (comando[0] == "rango") {
        if (estructuras[1] == null) {
            estructuras[1] = inicializarGrafoCanciones(archivo)
        }
        console.log(rango(comando, estructuras[1]))
    } else if (comando[0] == "clustering") {
        if (estructuras[1] == null) {
            estructuras[1] = inicializarGrafoCanciones(archivo)
        }
        console.log(clustering(comando, estructuras[1]))
    }
    return estructuras
}

// Recibe una ruta de archivo,
// Crea el grafo de usuarios,
// para cada linea la agrega al grafo bipartito usuario,
// Devuelve el grafo.
function inicializarGrafoUsuarios(archivo) {
    let lines = archivo.split('\n')
    let grafoUsuarios = new gr.Grafo()
    for (let i = 0; i < lines.length - 1; i++) {
        let line = lines[i]
        let arrayline = line.split('	')
        if (arrayline[0] != "ID") {
            añadirGrafoUsuario(arrayline, grafoUsuarios)
        }
    }
    return grafoUsuarios
}

// Recibe una ruta de archivo,
// Crea el grafo de canciones,
// para cada conjunto de canciones (playlist) lo agrega al grafo canciones.
// Devuelve el grafo.
function inicializarGrafoCanciones(archivo) {
    let lines = archivo.split('\n')
    let grafoCanciones = new gr.Grafo()
    let playlist = []
    for (let i = 0; i < lines.length - 1; i++) {
        let line = lines[i]
        let arrayline = line.split('	')
        if (arrayline[0] != "ID") {
            if (i == 1) {
                playlist.push(arrayline)
            } else if (i == (lines.length - 2)) {
                playlist.push(arrayline)
                añadirGrafoCanciones(playlist, grafoCanciones)
            } else {
                if (arrayline[5] == playlist[0][5]) {
                    playlist.push(arrayline)
                } else {
                    añadirGrafoCanciones(playlist, grafoCanciones)
                    playlist = []
                    playlist.push(arrayline)
                }
            }
        }
    }
    return grafoCanciones
}

// Carga el archivo en memoria,
// setea las estructuras en null,
// setea el evento input y espera la entrada del usuario.
function main() {
    let file = process.argv[2]
    if (!file) {
        process.exit(1)
    }
    let archivo = fs.readFileSync(file, 'utf-8');
    let grafoUsuarios = null
    let grafoCanciones = null
    let pageRank = null
    let estructuras = [grafoUsuarios, grafoCanciones, pageRank]

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.on('line', function (line) {
        estructuras = procesarEntrada(estructuras, archivo, line);
    });
}

main()