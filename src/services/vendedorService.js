const API_URL = import.meta.env.VITE_API_URL

export const obtenerVendedores = async () => {

    const response = await fetch(
        `${API_URL}/punto-venta/vendedores/obtener-vendedores`
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al obtener los vendedores'
        )
    }

    return data
}