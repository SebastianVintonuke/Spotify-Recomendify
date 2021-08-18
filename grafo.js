exports.Grafo = class Grafo {
    // Constructor del grafo
    constructor() {
        this.grafo = new Map()
    }
    // Recibe un vertice valido y devuelve un bool
    // Crea dicho vertice
    agregarVertice(vertice) {
        if (this.existe(vertice)) {
            return false
        }
        this.grafo.set(vertice, new Map())
        return true
    }
    // Recibe un vertice
    // Si pertenece al grafo lo borra y devuelve true, si no, devuelve false.
    sacarVertice(vertice) {
        if (!this.existe(vertice)) {
            return false
        }
        let adyacentes = this.obtenerAdyacentes(vertice)
        for (let i = 0; i < adyacentes.length; i++) {
            this.sacarArista(vertice, adyacentes[i])
        }
        this.grafo.delete(vertice)
        return true
    }
    // Recibe 2 vertices validos, un peso y devuelve un bool.
    // Crea una arista entre dos vertices, si ya existe, actualiza su peso.
    agregarArista(vertice1, vertice2, peso) {
        if (!this.existe(vertice1) || !this.existe(vertice2)) {
            return false
        }
        let vertice1Aristas = this.grafo.get(vertice1)
        let vertice2Aristas = this.grafo.get(vertice2)
        vertice1Aristas.set(vertice2, peso)
        vertice2Aristas.set(vertice1, peso)
        return true
    }
    // Recibe 2 vertices validos y devuelve un bool.
    // Si existe la arista entre vertice1 y vertice2, la borra
    sacarArista(vertice1, vertice2) {
        if (!this.existe(vertice1) || !this.existe(vertice2)) {
            return false
        }
        let vertice1Aristas = this.grafo.get(vertice1)
        let vertice2Aristas = this.grafo.get(vertice2)
        vertice1Aristas.delete(vertice2)
        vertice2Aristas.delete(vertice1)
        return true
    }
    // Recibe 2 vertices validos y devuelve un bool
    // Si ambos vertices son adyacentes devuelve true, si no devuelve false.
    sonAdyacentes(vertice1, vertice2) {
        if (!this.existe(vertice1) || !this.existe(vertice2)) {
            return false
        }
        let vertice1Aristas = this.grafo.get(vertice1)
        return vertice1Aristas.has(vertice2)
    }
    // Recibe un vertice y devuelve un bool
    // Si el vertice esta en el grafo devuelve true, si no, devuelve false.
    existe(vertice) {
        return this.grafo.has(vertice)
    }
    // Si el grafo tiene al menos un vertice, devuelve un vertice random.
    obtenerVerticeRandom() {
        let vertices = this.obtenerVertices()
        let i = Math.round(Math.random() * (this.grafo.size - 1))
        if (vertices[i] == null) {
            return null
        }
        return vertices[i]
    }
    // Devuelve un array con los vertices del grafo.
    obtenerVertices() {
        let vertices = Array.from(this.grafo.keys())
        return vertices
    }
    // Recibe un vertice valido
    // Si existe el vertice devuelve un array con los vertices adyacentes, si no, devuelve null.
    obtenerAdyacentes(vertice) {
        if (!this.existe(vertice)) {
            return null
        }
        let verticeAristas = this.grafo.get(vertice)
        let adyacentes = Array.from(verticeAristas.keys())
        return adyacentes
    }
    // Recibe 2 vertices validos
    // Si existe la arista entre los 2, devuelve su peso.
    peso(vertice1, vertice2) {
        if (!this.existe(vertice1) || !this.existe(vertice2)) {
            return false
        }
        let vertice1Aristas = this.grafo.get(vertice1)
        let peso = vertice1Aristas.get(vertice2)
        return peso
    }
}
