import { useEffect, useState } from 'react'
import { registrarVenta } from '../services/ventaService'
import { obtenerProductos } from '../services/productoService'
import { obtenerCategorias } from '../services/categoriaService'
import { obtenerVendedores } from '../services/vendedorService'

import alitasImg from '../assets/alitas.jpg'
import costillasImg from '../assets/costillas.jpg'
import micheladaImg from '../assets/michelada.png'
import micheladaCamImg from '../assets/micheladaCamaron.png'
import sodaItaImg from '../assets/sodaItaliana.png'
import totoposCamImg from '../assets/totoposCamaron.png'
import totoposCueImg from '../assets/totoposCuertiso.png'
import papasLocasImg from '../assets/papasLocas.png'
import brochetasCamImg from '../assets/brochetasCam.png'

function VentaPage() {

    const [productos, setProductos] = useState([])
    const [carrito, setCarrito] = useState([])
    const [metodoPago, setMetodoPago] = useState('')
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [ventaRegistrada, setVentaRegistrada] = useState(null)
    const [categorias, setCategorias] = useState([])
    const [filtroVendedor, setFiltroVendedor] = useState('TODOS')
    const [vendedoresData, setVendedoresData] = useState([])

    const [tieneDescuento, setTieneDescuento] = useState(false)
    const [montoDescuento, setMontoDescuento] = useState('')
    const [vendedorDescuentoId, setVendedorDescuentoId] = useState('')

    const [nombreCliente, setNombreCliente] = useState('')

    const imagenesProductos = {
        1: alitasImg,
        2: costillasImg,
        3: micheladaImg,
        4: micheladaCamImg,
        5: sodaItaImg,
        6: totoposCamImg,
        7: totoposCueImg,
        8: papasLocasImg,
        10: brochetasCamImg
    }

    useEffect(() => {

        let cancelado = false

        const cargarDatos = async () => {

            try {

                const [
                    productosData,
                    categoriasData,
                    vendedoresData
                ] = await Promise.all([
                    obtenerProductos(),
                    obtenerCategorias(),
                    obtenerVendedores()
                ])

                if (cancelado) {
                    return
                }

                setProductos(productosData)
                setCategorias(categoriasData)
                setVendedoresData(vendedoresData)

            } catch (error) {

                if (cancelado) {
                    return
                }

                console.error(error)
                setError(error.message)

            } finally {

                if (!cancelado) {
                    setCargando(false)
                }
            }
        }

        cargarDatos()

        return () => {
            cancelado = true
        }

    }, [])

    const vendedores = [
        ...new Set(
            categorias
                .map(categoria => categoria.vendedor)
                .filter(Boolean)
        )
    ]

    const vendedoresEnCarrito = [
        ...new Map(
            carrito
                .map(producto => {

                    const categoria = categorias.find(
                        categoria =>
                            categoria.id === producto.categoriaId
                    )

                    if (!categoria?.vendedor) {
                        return null
                    }

                    const vendedor = vendedoresData.find(
                        vendedor =>
                            vendedor.nombre === categoria.vendedor
                    )

                    if (!vendedor) {
                        return null
                    }

                    return [vendedor.id, vendedor]

                })
                .filter(Boolean)
        ).values()
    ]

    useEffect(() => {

        if (!tieneDescuento) {
            return
        }

        if (vendedoresEnCarrito.length === 1) {

            setVendedorDescuentoId(
                String(vendedoresEnCarrito[0].id)
            )

            return
        }

        if (vendedoresEnCarrito.length > 1) {

            const vendedorExiste =
                vendedoresEnCarrito.some(
                    vendedor =>
                        String(vendedor.id) ===
                        String(vendedorDescuentoId)
                )

            if (!vendedorExiste) {
                setVendedorDescuentoId('')
            }
        }

        if (vendedoresEnCarrito.length === 0) {
            setVendedorDescuentoId('')
        }

    }, [
        carrito,
        vendedoresData,
        categorias,
        tieneDescuento
    ])

    const subtotalPorVendedor = vendedoresEnCarrito.reduce(
        (resultado, vendedor) => {

            const subtotal = carrito.reduce(
                (total, producto) => {

                    const categoria = categorias.find(
                        categoria =>
                            categoria.id === producto.categoriaId
                    )

                    const vendedorProducto =
                        vendedoresData.find(
                            vendedorData =>
                                vendedorData.nombre ===
                                categoria?.vendedor
                        )

                    if (
                        vendedorProducto?.id !==
                        vendedor.id
                    ) {
                        return total
                    }

                    return total +
                        producto.precio *
                        producto.cantidad

                },
                0
            )

            resultado[vendedor.id] = subtotal

            return resultado
        },
        {}
    )

    const productosDisponibles = productos.filter(
        producto => {

            if (!producto.activo) {
                return false
            }

            if (filtroVendedor === 'TODOS') {
                return true
            }

            const categoria = categorias.find(
                categoria =>
                    categoria.id === producto.categoriaId
            )

            return categoria?.vendedor === filtroVendedor
        }
    )

    const agregarAlCarrito = (producto) => {

        const productoExistente =
            carrito.find(
                item => item.id === producto.id
            )

        if (productoExistente) {

            setCarrito(
                carrito.map(item => {

                    if (item.id === producto.id) {

                        return {
                            ...item,
                            cantidad: item.cantidad + 1
                        }
                    }

                    return item
                })
            )

            return
        }

        setCarrito([
            ...carrito,
            {
                ...producto,
                cantidad: 1
            }
        ])
    }

    const disminuirCantidad = (productoId) => {

        setCarrito(
            carrito
                .map(item => {

                    if (item.id === productoId) {

                        return {
                            ...item,
                            cantidad: item.cantidad - 1
                        }
                    }

                    return item
                })
                .filter(
                    item => item.cantidad > 0
                )
        )
    }

    const eliminarProducto = (productoId) => {

        setCarrito(
            carrito.filter(
                item => item.id !== productoId
            )
        )
    }

    const calcularSubtotal = () => {

        return carrito.reduce(
            (total, producto) =>
                total +
                producto.precio *
                producto.cantidad,
            0
        )
    }

    const subtotal = calcularSubtotal()

    const descuento =
        tieneDescuento
            ? Number(montoDescuento) || 0
            : 0

    const total = subtotal - descuento

    const manejarRegistroVenta = async () => {

        if (carrito.length === 0) {
            alert(
                'Debes agregar al menos un producto'
            )
            return
        }

        if (!nombreCliente.trim()) {
            alert('Debes ingresar el nombre del cliente')
            return
        }

        if (!metodoPago) {
            alert(
                'Debes seleccionar un método de pago'
            )
            return
        }

        if (tieneDescuento) {

            if (
                !montoDescuento ||
                Number(montoDescuento) <= 0
            ) {
                alert(
                    'Debes ingresar un monto de descuento'
                )
                return
            }

            if (!vendedorDescuentoId) {
                alert(
                    'Debes seleccionar el vendedor que otorgó el descuento'
                )
                return
            }

            const subtotalVendedor =
                subtotalPorVendedor[
                    vendedorDescuentoId
                    ] || 0

            if (
                Number(montoDescuento) >
                subtotalVendedor
            ) {
                alert(
                    'El descuento no puede ser mayor al subtotal del vendedor seleccionado'
                )
                return
            }
        }

        const venta = {
            nombreCliente: nombreCliente.trim(),
            metodoPago,
            descuento: tieneDescuento
                ? Number(montoDescuento)
                : 0,
            vendedorDescuentoId: tieneDescuento
                ? Number(vendedorDescuentoId)
                : null,
            productos: carrito.map(
                producto => ({
                    productoId: producto.id,
                    cantidad: producto.cantidad
                })
            )
        }

        try {

            const respuesta =
                await registrarVenta(venta)

            setVentaRegistrada(respuesta)
            setCarrito([])
            setNombreCliente('')
            setMetodoPago('')
            setTieneDescuento(false)
            setMontoDescuento('')
            setVendedorDescuentoId('')

        } catch (error) {

            console.error(
                'Error al registrar la venta:',
                error
            )

            alert(error.message)
        }
    }

    /*
     * Ahora ventaRegistrada es un Pedido,
     * por lo que las ventas están dentro de:
     *
     * ventaRegistrada.ventas
     */

    const ventasRegistradas =
        ventaRegistrada?.ventas || []

    const subtotalCompraRegistrada =
        ventasRegistradas.reduce(
            (total, venta) =>
                total + venta.subtotal,
            0
        )

    const descuentoCompraRegistrada =
        ventasRegistradas.reduce(
            (total, venta) =>
                total +
                (venta.descuento || 0),
            0
        )

    const totalCompraRegistrada =
        ventasRegistradas.reduce(
            (total, venta) =>
                total + venta.total,
            0
        )

    if (cargando) {

        return (
            <section className="venta-page">

                <h1>
                    Registrar venta
                </h1>

                <p>
                    Cargando información...
                </p>

            </section>
        )
    }

    if (error) {

        return (
            <section className="venta-page">

                <h1>
                    Registrar venta
                </h1>

                <p>
                    {error}
                </p>

            </section>
        )
    }

    return (

        <section className="venta-page">

            <h1>
                Registrar venta
            </h1>

            {ventaRegistrada && (

                <div className="venta-confirmacion">

                    <h2>
                        Venta registrada correctamente
                    </h2>

                    <p className="venta-confirmacion-cliente">
                        Pedido #{ventaRegistrada.id}
                        {' — '}
                        Cliente:
                        {' '}
                        <strong>
                            {ventaRegistrada.nombreCliente}
                        </strong>
                    </p>

                    <div className="venta-confirmacion-resumen-general">

                        <div>

                            <span>
                                Subtotal de la compra
                            </span>

                            <strong>
                                ${subtotalCompraRegistrada}
                            </strong>

                        </div>

                        {descuentoCompraRegistrada > 0 && (

                            <div className="venta-confirmacion-descuento-general">

                                <span>
                                    Descuento
                                </span>

                                <strong>
                                    -${descuentoCompraRegistrada}
                                </strong>

                            </div>

                        )}

                        <div className="venta-confirmacion-total-general">

                            <span>
                                Total de la compra
                            </span>

                            <strong>
                                ${totalCompraRegistrada}
                            </strong>

                        </div>

                    </div>

                    {ventasRegistradas.map(venta => (

                        <div
                            key={venta.id}
                            className="venta-confirmacion-vendedor"
                        >

                            <h3>
                                {venta.vendedor}
                            </h3>

                            <p>
                                Venta #{venta.id}
                            </p>

                            <div className="venta-confirmacion-productos">

                                {venta.productos.map(
                                    (producto, index) => (

                                        <div
                                            key={index}
                                            className="venta-confirmacion-producto"
                                        >

                                            <span>
                                                {producto.producto}
                                            </span>

                                            <span>
                                                {producto.cantidad}
                                                {' x $'}
                                                {producto.precioUnitario}
                                            </span>

                                            <strong>
                                                ${producto.subtotal}
                                            </strong>

                                        </div>

                                    )
                                )}

                            </div>

                            <div className="venta-confirmacion-resumen">

                                <div>

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ${venta.subtotal}
                                    </strong>

                                </div>

                                {venta.descuento > 0 && (

                                    <div className="venta-confirmacion-descuento">

                                        <span>
                                            Descuento
                                        </span>

                                        <strong>
                                            -${venta.descuento}
                                        </strong>

                                    </div>

                                )}

                                <div className="venta-confirmacion-total">

                                    <span>
                                        Total {venta.vendedor}
                                    </span>

                                    <strong>
                                        ${venta.total}
                                    </strong>

                                </div>

                            </div>

                            <p>
                                Método de pago:
                                {' '}
                                {venta.metodoPago}
                            </p>

                        </div>

                    ))}

                    <button
                        type="button"
                        className="nueva-venta-button"
                        onClick={() =>
                            setVentaRegistrada(null)
                        }
                    >
                        Nueva venta
                    </button>

                </div>
            )}

            {!ventaRegistrada && (

                <div className="venta-contenedor">

                    <div className="venta-productos">

                        <h2>
                            Productos
                        </h2>

                        <div className="filtros-vendedor">

                            <button
                                type="button"
                                className={
                                    filtroVendedor === 'TODOS'
                                        ? 'filtro-vendedor-activo'
                                        : ''
                                }
                                onClick={() =>
                                    setFiltroVendedor('TODOS')
                                }
                            >
                                Todos
                            </button>

                            {vendedores.map(vendedor => (

                                <button
                                    key={vendedor}
                                    type="button"
                                    className={
                                        filtroVendedor === vendedor
                                            ? 'filtro-vendedor-activo'
                                            : ''
                                    }
                                    onClick={() =>
                                        setFiltroVendedor(vendedor)
                                    }
                                >
                                    {vendedor}
                                </button>

                            ))}

                        </div>

                        <div className="productos-grid">

                            {productosDisponibles.map(
                                producto => (

                                    <div
                                        className="producto-card"
                                        key={producto.id}
                                    >

                                        {imagenesProductos[
                                            producto.id
                                            ] && (

                                            <img
                                                src={
                                                    imagenesProductos[
                                                        producto.id
                                                        ]
                                                }
                                                alt={
                                                    producto.nombre
                                                }
                                            />

                                        )}

                                        <div className="producto-card-contenido">

                                            <h3>
                                                {producto.nombre}
                                            </h3>

                                            <strong>
                                                ${producto.precio}
                                            </strong>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    agregarAlCarrito(
                                                        producto
                                                    )
                                                }
                                            >
                                                Agregar
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                    <div className="venta-carrito">

                        <h2>
                            Venta actual
                        </h2>

                        {carrito.length === 0 ? (

                            <p>
                                No hay productos agregados.
                            </p>

                        ) : (

                            carrito.map(producto => (

                                <div
                                    key={producto.id}
                                    className="carrito-item"
                                >

                                    <div>

                                        <strong>
                                            {producto.nombre}
                                        </strong>

                                        <small>
                                            ${producto.precio} c/u
                                        </small>

                                    </div>

                                    <div className="carrito-cantidad">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                disminuirCantidad(
                                                    producto.id
                                                )
                                            }
                                        >
                                            -
                                        </button>

                                        <span>
                                            {producto.cantidad}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                agregarAlCarrito(
                                                    producto
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    <strong>
                                        $
                                        {producto.precio *
                                            producto.cantidad}
                                    </strong>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            eliminarProducto(
                                                producto.id
                                            )
                                        }
                                    >
                                        🗑️
                                    </button>

                                </div>

                            ))
                        )}

                        <div className="descuento-section">

                            <div className="descuento-header">

                                <div>

                                    <h3>
                                        Descuento
                                    </h3>

                                    <p>
                                        Aplica un descuento a la venta
                                    </p>

                                </div>

                                <label className="descuento-toggle">

                                    <input
                                        type="checkbox"
                                        checked={tieneDescuento}
                                        onChange={(e) => {

                                            const activo =
                                                e.target.checked

                                            setTieneDescuento(
                                                activo
                                            )

                                            if (!activo) {

                                                setMontoDescuento('')
                                                setVendedorDescuentoId('')

                                                return
                                            }

                                            if (
                                                vendedoresEnCarrito.length === 1
                                            ) {

                                                setVendedorDescuentoId(
                                                    String(
                                                        vendedoresEnCarrito[0].id
                                                    )
                                                )

                                            } else {

                                                setVendedorDescuentoId('')
                                            }
                                        }}
                                    />

                                    <span className="descuento-toggle-slider"></span>

                                </label>

                            </div>

                            {tieneDescuento && (

                                <div className="descuento-form">

                                    <div className="descuento-campo">

                                        <label htmlFor="montoDescuento">
                                            Monto
                                        </label>

                                        <div className="descuento-monto">

                                            <span>
                                                $
                                            </span>

                                            <input
                                                id="montoDescuento"
                                                type="number"
                                                min="1"
                                                value={montoDescuento}
                                                placeholder="0"
                                                onChange={(e) =>
                                                    setMontoDescuento(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                    <div className="descuento-campo">

                                        <label htmlFor="vendedorDescuento">
                                            Otorgado por
                                        </label>

                                        <select
                                            id="vendedorDescuento"
                                            value={vendedorDescuentoId}
                                            onChange={(e) =>
                                                setVendedorDescuentoId(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                vendedoresEnCarrito.length === 1
                                            }
                                        >

                                            {vendedoresEnCarrito.length === 1 ? (

                                                <option
                                                    value={
                                                        vendedoresEnCarrito[0].id
                                                    }
                                                >
                                                    {
                                                        vendedoresEnCarrito[0]
                                                            .nombre
                                                    }
                                                </option>

                                            ) : (

                                                <>
                                                    <option value="">
                                                        Selecciona vendedor
                                                    </option>

                                                    {vendedoresEnCarrito.map(
                                                        vendedor => (

                                                            <option
                                                                key={
                                                                    vendedor.id
                                                                }
                                                                value={
                                                                    vendedor.id
                                                                }
                                                            >
                                                                {
                                                                    vendedor.nombre
                                                                }
                                                                {' — $'}
                                                                {
                                                                    subtotalPorVendedor[
                                                                        vendedor.id
                                                                        ] || 0
                                                                }
                                                            </option>

                                                        )
                                                    )}
                                                </>
                                            )}

                                        </select>

                                    </div>

                                </div>
                            )}

                        </div>

                        <div className="venta-totales">

                            <div>

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ${subtotal}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Descuento
                                </span>

                                <strong>
                                    ${descuento}
                                </strong>

                            </div>

                            <div className="venta-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ${total}
                                </strong>

                            </div>

                        </div>

                        <div className="nombre-cliente">

                            <label htmlFor="nombreCliente">
                                Nombre del cliente
                            </label>

                            <input
                                id="nombreCliente"
                                type="text"
                                value={nombreCliente}
                                placeholder="Ej. Juan"
                                maxLength={100}
                                onChange={(e) =>
                                    setNombreCliente(e.target.value)
                                }
                            />

                        </div>

                        <div className="metodo-pago">

                            <h3>
                                Método de pago
                            </h3>

                            <button
                                type="button"
                                className={
                                    metodoPago === 'EFECTIVO'
                                        ? 'metodo-pago-activo'
                                        : ''
                                }
                                onClick={() =>
                                    setMetodoPago('EFECTIVO')
                                }
                            >
                                Efectivo
                            </button>

                            <button
                                type="button"
                                className={
                                    metodoPago === 'TARJETA'
                                        ? 'metodo-pago-activo'
                                        : ''
                                }
                                onClick={() =>
                                    setMetodoPago('TARJETA')
                                }
                            >
                                Tarjeta
                            </button>

                            <button
                                type="button"
                                className={
                                    metodoPago === 'TRANSFERENCIA'
                                        ? 'metodo-pago-activo'
                                        : ''
                                }
                                onClick={() =>
                                    setMetodoPago('TRANSFERENCIA')
                                }
                            >
                                Transferencia
                            </button>

                        </div>

                        <button
                            type="button"
                            className="registrar-venta-button"
                            onClick={manejarRegistroVenta}
                        >
                            Registrar venta
                        </button>

                    </div>

                </div>
            )}

        </section>
    )
}

export default VentaPage