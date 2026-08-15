import { useEffect, useState } from 'react'
import {
    obtenerPedidosPendientes,
    entregarPedido,
    cancelarPedido
} from '../services/ventaService'

function PedidosPendientesPage() {

    const [pedidos, setPedidos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [entregando, setEntregando] = useState(null)
    const [cancelando, setCancelando] = useState(null)

    const cargarPedidos = async () => {

        try {

            setError('')

            const data =
                await obtenerPedidosPendientes()

            setPedidos(data)

        } catch (error) {

            console.error(error)

            setError(error.message)

        } finally {

            setCargando(false)
        }
    }

    useEffect(() => {

        cargarPedidos()

    }, [])

    const manejarEntregar = async (id) => {

        try {

            setError('')

            setEntregando(id)

            await entregarPedido(id)

            setPedidos(
                pedidos.filter(
                    pedido => pedido.id !== id
                )
            )

        } catch (error) {

            console.error(error)

            setError(error.message)

        } finally {

            setEntregando(null)
        }
    }

    const manejarCancelar = async (id) => {

        const confirmar = window.confirm(
            '¿Estás seguro de que deseas cancelar este pedido?'
        )

        if (!confirmar) {
            return
        }

        try {

            setCancelando(id)
            setError('')

            await cancelarPedido(id)

            setPedidos(
                pedidos.filter(
                    pedido => pedido.id !== id
                )
            )

        } catch (error) {

            console.error(error)

            setError(error.message)

        } finally {

            setCancelando(null)
        }
    }

    if (cargando) {

        return (
            <section className="ventas-pendientes-page">

                <h1>
                    Pedidos pendientes
                </h1>

                <p>
                    Cargando pedidos...
                </p>

            </section>
        )
    }

    return (

        <section className="ventas-pendientes-page">

            <div className="ventas-pendientes-header">

                <div>

                    <h1>
                        Pedidos pendientes
                    </h1>

                    <p>
                        Ordenes que aún están pendientes
                        de entregar.
                    </p>

                </div>

                <button
                    type="button"
                    className="ventas-pendientes-recargar"
                    onClick={cargarPedidos}
                >
                    ↻ Actualizar
                </button>

            </div>

            {error && (

                <div className="ventas-pendientes-error">
                    {error}
                </div>

            )}

            {pedidos.length === 0 ? (

                <div className="ventas-pendientes-vacio">

                    <div className="ventas-pendientes-vacio-icono">
                        ✓
                    </div>

                    <h2>
                        No hay pedidos pendientes
                    </h2>

                    <p>
                        Todos los pedidos han sido entregados.
                    </p>

                </div>

            ) : (

                <div className="ventas-pendientes-grid">

                    {pedidos.map(pedido => (

                        <div
                            key={pedido.id}
                            className="venta-pendiente-card"
                        >

                            <div className="venta-pendiente-header">

                                <div>

                                    <h2>
                                        Pedido #{pedido.id}
                                    </h2>

                                    <p>
                                        {pedido.nombreCliente}
                                    </p>

                                </div>

                                <span className="venta-pendiente-estado">
                                    {pedido.estado}
                                </span>

                            </div>


                            {pedido.ventas.map(venta => (

                                <div
                                    key={venta.id}
                                    className="pedido-venta"
                                >

                                    <div className="pedido-venta-header">

                                        <h3>
                                            {venta.vendedor}
                                        </h3>

                                    </div>


                                    <div className="venta-pendiente-productos">

                                        <h3>
                                            Productos
                                        </h3>

                                        {venta.productos.map(
                                            (producto, index) => (

                                                <div
                                                    key={index}
                                                    className="venta-pendiente-producto"
                                                >

                                                    <div>

                                                        <strong>
                                                            {producto.producto}
                                                        </strong>

                                                        <span>
                                                            {producto.cantidad}
                                                            {' x $'}
                                                            {producto.precioUnitario}
                                                        </span>

                                                    </div>

                                                    <strong>
                                                        ${producto.subtotal}
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    <div className="venta-pendiente-resumen">

                                        <div>

                                            <span>
                                                Subtotal
                                            </span>

                                            <strong>
                                                ${venta.subtotal}
                                            </strong>

                                        </div>


                                        {venta.descuento > 0 && (

                                            <div className="venta-pendiente-descuento">

                                                <span>
                                                    Descuento
                                                </span>

                                                <strong>
                                                    -${venta.descuento}
                                                </strong>

                                            </div>

                                        )}


                                        <div>

                                            <span>
                                                Total {venta.vendedor}
                                            </span>

                                            <strong>
                                                ${venta.total}
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            ))}


                            <div className="pedido-total">

                                <span>
                                    Total del pedido
                                </span>

                                <strong>
                                    ${pedido.total}
                                </strong>

                            </div>

                            <div className="venta-pendiente-acciones">

                                <button
                                    type="button"
                                    className="venta-pendiente-entregar"
                                    disabled={
                                        entregando === pedido.id ||
                                        cancelando === pedido.id
                                    }
                                    onClick={() =>
                                        manejarEntregar(pedido.id)
                                    }
                                >

                                    {entregando === pedido.id
                                        ? 'Marcando como entregado...'
                                        : '✓ Marcar como entregado'
                                    }

                                </button>

                                <button
                                    type="button"
                                    className="venta-pendiente-cancelar"
                                    disabled={
                                        entregando === pedido.id ||
                                        cancelando === pedido.id
                                    }
                                    onClick={() =>
                                        manejarCancelar(pedido.id)
                                    }
                                >

                                    {cancelando === pedido.id
                                        ? 'Cancelando...'
                                        : '✕ Cancelar pedido'
                                    }

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>
    )
}

export default PedidosPendientesPage