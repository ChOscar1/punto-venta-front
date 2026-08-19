import { useState } from 'react'
import { descargarReporteExcel } from '../services/reporteService'

function ReportePage() {

    const obtenerFechaHoraActual = () => {

        const ahora = new Date()

        const año = ahora.getFullYear()
        const mes = String(ahora.getMonth() + 1).padStart(2, '0')
        const dia = String(ahora.getDate()).padStart(2, '0')
        const hora = String(ahora.getHours()).padStart(2, '0')
        const minutos = String(ahora.getMinutes()).padStart(2, '0')

        return `${año}-${mes}-${dia}T${hora}:${minutos}`
    }


    const [fechaInicio, setFechaInicio] = useState(() => {

        const ahora = new Date()

        const año = ahora.getFullYear()
        const mes = String(ahora.getMonth() + 1).padStart(2, '0')
        const dia = String(ahora.getDate()).padStart(2, '0')

        return `${año}-${mes}-${dia}T19:00`

    })


    const [fechaFin, setFechaFin] = useState(() =>
        obtenerFechaHoraActual()
    )


    const [generando, setGenerando] = useState(false)

    const [error, setError] = useState('')


    const manejarDescarga = async () => {

        if (!fechaInicio || !fechaFin) {

            setError(
                'Debes seleccionar la fecha y hora de inicio y fin'
            )

            return
        }


        if (fechaInicio >= fechaFin) {

            setError(
                'La fecha y hora de inicio debe ser anterior a la fecha y hora de fin'
            )

            return
        }


        try {

            setError('')

            setGenerando(true)

            await descargarReporteExcel(
                fechaInicio,
                fechaFin
            )

        } catch (error) {

            console.error(
                'Error al generar reporte:',
                error
            )

            setError(
                error.message ||
                'Ocurrió un error al generar el reporte'
            )

        } finally {

            setGenerando(false)

        }
    }


    return (

        <section className="reporte-page">

            <div className="reporte-header">

                <div>

                    <h1>
                        Reporte de ventas
                    </h1>

                    <p>
                        Genera un reporte de ventas
                        seleccionando un rango de fecha
                        y hora.
                    </p>

                </div>

            </div>


            <div className="reporte-card">

                <div className="reporte-campo">

                    <label htmlFor="fechaInicio">
                        Desde
                    </label>

                    <input
                        id="fechaInicio"
                        type="datetime-local"
                        value={fechaInicio}
                        onChange={event =>
                            setFechaInicio(
                                event.target.value
                            )
                        }
                    />

                </div>


                <div className="reporte-campo">

                    <label htmlFor="fechaFin">
                        Hasta
                    </label>

                    <input
                        id="fechaFin"
                        type="datetime-local"
                        value={fechaFin}
                        onChange={event =>
                            setFechaFin(
                                event.target.value
                            )
                        }
                    />

                </div>


                {error && (

                    <p className="reporte-error">
                        {error}
                    </p>

                )}


                <button
                    type="button"
                    className="reporte-button"
                    onClick={manejarDescarga}
                    disabled={generando}
                >

                    {generando
                        ? 'Generando reporte...'
                        : 'Descargar reporte Excel'
                    }

                </button>

            </div>

        </section>
    )
}

export default ReportePage