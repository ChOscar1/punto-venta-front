const API_URL = import.meta.env.VITE_API_URL

export const descargarReporteExcel = async (fecha) => {

    const response = await fetch(
        `${API_URL}/punto-venta/reporte/ventas/excel?fecha=${fecha}`
    )

    if (!response.ok) {

        let mensaje = 'Error al generar el reporte'

        try {

            const data = await response.json()

            mensaje = data.message || mensaje

        } catch {
            console.log("No era JSON la respuesta")
        }

        throw new Error(mensaje)
    }

    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)

    const enlace = document.createElement('a')

    enlace.href = url

    enlace.download = `reporte-ventas-${fecha}.xlsx`

    document.body.appendChild(enlace)

    enlace.click()

    enlace.remove()

    window.URL.revokeObjectURL(url)
}