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