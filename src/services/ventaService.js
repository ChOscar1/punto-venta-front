import { apiFetch } from './api'

export const registrarVenta = async (venta) => {

    const response = await apiFetch(
        '/punto-venta/ventas/crear-venta',
        {
            method: 'POST',
            body: JSON.stringify(venta)
        }
    )

    if (!response.ok) {

        let mensaje = 'No se pudo registrar la venta'

        try {

            const data = await response.json()

            mensaje =
                data.message ||
                data.descripcionError ||
                mensaje

        } catch {
            console.log('La respuesta no contiene JSON')
        }

        throw new Error(mensaje)
    }

    return await response.json()
}


export const obtenerPedidosPendientes = async () => {

    const response = await apiFetch(
        '/punto-venta/pedidos/obtener-pedidos-pendientes'
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message ||
            'Error al obtener los pedidos pendientes'
        )
    }

    return data
}


export const entregarPedido = async (id) => {

    const response = await apiFetch(
        `/punto-venta/pedidos/entregar-pedido/${id}`,
        {
            method: 'PUT'
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message ||
            'Error al entregar el pedido'
        )
    }

    return data
}

export const cancelarPedido = async (id) => {

    const response = await apiFetch(
        `/punto-venta/pedidos/${id}/cancelar`,
        {
            method: 'PUT'
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.descripcionError ||
            'Error al cancelar el pedido'
        )
    }

    return data
}