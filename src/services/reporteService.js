import { apiFetch } from './api'

export const descargarReporteExcel = async (
    fechaInicio,
    fechaFin
) => {

    const response = await apiFetch(
        `/punto-venta/reporte/ventas/excel?inicio=${encodeURIComponent(fechaInicio)}&fin=${encodeURIComponent(fechaFin)}`
    )

    if (!response.ok) {

        let mensaje = 'Error al generar el reporte'

        try {

            const data = await response.json()

            mensaje = data.message || mensaje

        } catch {
            console.log('No era JSON la respuesta')
        }

        throw new Error(mensaje)
    }

    const blob = await response.blob()

    const url = window.URL.createObjectURL(blob)

    const enlace = document.createElement('a')

    enlace.href = url

    enlace.download =
        `reporte-ventas-${fechaInicio.replace(/[:]/g, '-')}-${fechaFin.replace(/[:]/g, '-')}.xlsx`

    document.body.appendChild(enlace)

    enlace.click()

    enlace.remove()

    window.URL.revokeObjectURL(url)
}