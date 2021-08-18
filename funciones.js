var gr = require("./grafo")

// Recibe un grafo, un vertice y un orden maximo.
// Realiza un recorrido BFS desde el origen hasta el primer vertice con rango mayor al orden maximo.
// Devuelve un array con un diccionario de padres y de orden.
exports.bfsOrdenMax = function bfsOrdenMax(grafo, origen, ordenMax) {
    let visitados = new Set()
    let padres = new Map()
    let orden = new Map()
    padres.set(origen, null)
    orden.set(origen, 0)
    visitados.add(origen)
    let q = []
    q.push(origen)
    let v
    while (q[0] != null) {
        v = q.shift()
        let adyacentes = grafo.obtenerAdyacentes(v)
        for (let i = 0; i < adyacentes.length; i++) {
            let w = adyacentes[i]
            if (!visitados.has(w)) {
                padres.set(w, v)
                orden.set(w, (orden.get(v) + 1))
                visitados.add(w)
                q.push(w)
            }
        }
    }
    return [padres, orden]
}

// Wrapper
// Recibe un grafo, un numero n y un vertice.
// Busca un ciclo de tamaño n del vertice
// Devuelve un set con dicho ciclo
exports.buscaCicloBacktracking = function buscaCicloBacktracking(grafo, nCiclo, vertice) {
    let visitados = new Set()
    let largo = 0
    _buscaCicloBacktracking(grafo, (nCiclo - 1), vertice, vertice, visitados, largo)
    return visitados
}

function _buscaCicloBacktracking(grafo, nCiclo, vertice, verticeActual, visitados, largo) {
    if (verticeActual != vertice) {
        visitados.add(verticeActual)
        largo += 1
    }
    // Llegue en la cantidad de pasos indicados
    if (verticeActual == vertice && largo == nCiclo) {
        return true
    }
    // Llegue en menos pasos.
    if (verticeActual == vertice && largo < nCiclo && largo != 0) {
        if (verticeActual != vertice) {
            visitados.delete(verticeActual)
            largo -= 1
        }
        return false
    }
    // Hice pasos de mas
    if (largo > nCiclo) {
        if (verticeActual != vertice) {
            visitados.delete(verticeActual)
            largo -= 1
        }
        return false
    }
    let adyacentes = grafo.obtenerAdyacentes(verticeActual)
    for (let i = 0; i < adyacentes.length; i++) {
        let a = adyacentes[i]
        if (!visitados.has(a)) {
            if (_buscaCicloBacktracking(grafo, nCiclo, vertice, a, visitados, largo)) {
                return true
            }
        }
    }
    visitados.delete(verticeActual)
    largo -= 1
    return false
}

// Recibe un grafo y un vertice
// Devuelve el coeficiente de Clustering de dicho vertice en el grafo
exports.coeficienteDeClustering = function coeficienteDeClustering(grafo, vertice) {
    let adyacentes = grafo.obtenerAdyacentes(vertice)
    // En caso de tener menos de 2 adyacentes, se define que el coeficiente de clustering de dicho vertice es 0
    if (adyacentes.length < 2) {
        return 0
    }
    let grado = adyacentes.length
    let contadorAristas = 0
    for (let i = 0; i < adyacentes.length; i++) {
        let vertice1 = adyacentes[i]
        for (let i2 = 0; i2 < adyacentes.length; i2++) {
            let vertice2 = adyacentes[i2]
            if (vertice1 != vertice2 && grafo.sonAdyacentes(vertice1, vertice2)) {
                contadorAristas++
            }
        }
    }
    let coeficiente = contadorAristas / (grado * (grado - 1))
    return coeficiente
}

// Recibe un grafo, un vertice y un diccionario de todas las aristas del grafo con su PageRank
// Devuelve el pagerank de dicho vertice en el grafo.
exports.pageRank = function pageRank(grafo, vertice, mapPageRank) {
    let rank = 0
    let adyacentes = grafo.obtenerAdyacentes(vertice)
    for (let i = 0; i < adyacentes.length; i++) {
        let verticeAdyacente = adyacentes[i]
        let nAdyacente = grafo.obtenerAdyacentes(verticeAdyacente).length
        rank += (1 - 0.85) / adyacentes.length + 0.85 * mapPageRank.get(verticeAdyacente) / nAdyacente
    }
    return rank
}

// Recibe un grafo, un origen y un destino.
// Si existe camino entre ambos, devuelve un diccionario de padres y
// uno de orden de los vertices involucrados.
// Si no existe devuelve null.
exports.caminoMinimo = function caminoMinimo(grafo, origen, destino) {
    let visitados = new Set()
    let padres = new Map()
    let orden = new Map()
    padres.set(origen, null)
    orden.set(origen, 0)
    visitados.add(origen)
    let q = []
    q.push(origen)
    let v
    while (q[0] != null) {
        v = q.shift()
        let adyacentes = grafo.obtenerAdyacentes(v)
        for (let i = 0; i < adyacentes.length; i++) {
            let w = adyacentes[i]
            if (!visitados.has(w)) {
                padres.set(w, v)
                orden.set(w, (orden.get(v) + 1))
                visitados.add(w)
                q.push(w)
            }
            if (w == destino) {
                return [padres, orden]
            }
        }
    }
    return null
}

// Recibe un grafo, un vertice, un diccionario [vertice, ranking] y un largo.
// Para el vertice inicial realiza un random walk del largo indicado y guarda su ranking.
exports.pageRankPersonalizado = function pageRankPersonalizado(grafo, vertice, mapPageRank, largo) {
    let pageRank = 1
    let actual = vertice
    for (let i = 0; i < largo; i++) {
        let adyacentes = grafo.obtenerAdyacentes(actual)
        let indiceRandom = Math.floor(Math.random() * (adyacentes.length))
        mapPageRank.set(adyacentes[indiceRandom], mapPageRank.get(adyacentes[indiceRandom]) + pageRank / adyacentes.length)
        actual = adyacentes[indiceRandom]
        pageRank = pageRank / adyacentes.length
    }
}
