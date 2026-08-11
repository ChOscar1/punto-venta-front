import { apiFetch } from './api'

export const obtenerVendedores = async () => {

    const response = await apiFetch(
        '/punto-venta/vendedores/obtener-vendedores'
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al obtener los vendedores'
        )
    }

    return data
}