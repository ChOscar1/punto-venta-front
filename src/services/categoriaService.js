const API_URL = 'http://localhost:8080'

export const obtenerCategorias = async () => {

    const response = await fetch(
        `${API_URL}/punto-venta/categorias/listar-categorias`
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al obtener las categorías'
        )
    }

    return data
}