import { useState } from 'react'
import { descargarReporteExcel } from '../services/reporteService'

function ReportePage() {

    const [fecha, setFecha] = useState(() => {

        const hoy = new Date()

        return hoy.toISOString().split('T')[0]

    })

    const [generando, setGenerando] = useState(false)

    const [error, setError] = useState('')


    const manejarDescarga = async () => {

        if (!fecha) {

            setError('Debes seleccionar una fecha')

            return
        }

        try {

            setError('')

            setGenerando(true)

            await descargarReporteExcel(fecha)

        } catch (error) {

            console.error(
                'Error al generar reporte:',
                error
            )

            setError(error.message)

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
                        Genera el reporte de ventas
                        correspondiente a una fecha.
                    </p>

                </div>

            </div>


            <div className="reporte-card">

                <div className="reporte-campo">

                    <label htmlFor="fecha">
                        Fecha
                    </label>

                    <input
                        id="fecha"
                        type="date"
                        value={fecha}
                        onChange={event =>
                            setFecha(
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