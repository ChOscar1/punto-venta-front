const API_URL = import.meta.env.VITE_API_URL

export const registrarVenta = async (venta) => {

    const response = await fetch(
        `${API_URL}/punto-venta/ventas/crear-venta`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

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
            console.log("error")
        }

        throw new Error(mensaje)
    }

    return await response.json()
}