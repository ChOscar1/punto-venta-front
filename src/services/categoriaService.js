import { apiFetch } from './api'

export const obtenerCategorias = async () => {

    const response = await apiFetch(
        '/punto-venta/categorias/listar-categorias'
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al obtener las categorías'
        )
    }

    return data
}