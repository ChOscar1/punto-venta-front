const API_URL = import.meta.env.VITE_API_URL

export const obtenerProductos = async () => {

    const response = await fetch(
        `${API_URL}/punto-venta/productos/obtener-productos`
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al obtener los productos'
        )
    }

    return data
}

export const crearProducto = async (producto) => {

    const response = await fetch(
        `${API_URL}/punto-venta/productos/crear-producto`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al crear el producto'
        )
    }

    return data
}

export const actualizarProducto = async (id, producto) => {

    const response = await fetch(
        `${API_URL}/punto-venta/productos/actualizar-producto/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(producto)
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al actualizar el producto'
        )
    }

    return data
}


export const obtenerProducto = async (id) => {

    const response = await fetch(
        `${API_URL}/punto-venta/productos/obtener-producto/${id}`
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al obtener el producto'
        )
    }

    return data
}


export const eliminarProducto = async (id) => {

    const response = await fetch(
        `${API_URL}/punto-venta/productos/eliminar-producto/${id}`,
        {
            method: 'DELETE'
        }
    )

    if (!response.ok) {

        const data = await response.json()

        throw new Error(
            data.message || 'Error al eliminar el producto'
        )
    }
}