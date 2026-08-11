import { useEffect, useState } from 'react'
import { registrarVenta } from '../services/ventaService'
import { obtenerProductos } from '../services/productoService'
import { obtenerCategorias } from '../services/categoriaService'
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
                    categoriasData
                ] = await Promise.all([
                    obtenerProductos(),
                    obtenerCategorias()
                ])

                if (cancelado) {
                    return
                }

                setProductos(productosData)

                setCategorias(categoriasData)

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

    const productosDisponibles = productos.filter(
        producto => {

            if (!producto.activo) {
                return false
            }

            if (filtroVendedor === 'TODOS') {
                return true
            }

            const categoria =
                categorias.find(
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

            const carritoActualizado =
                carrito.map(item => {

                    if (item.id === producto.id) {

                        return {
                            ...item,
                            cantidad:
                                item.cantidad + 1
                        }
                    }

                    return item
                })

            setCarrito(carritoActualizado)

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

        const carritoActualizado =
            carrito
                .map(item => {

                    if (item.id === productoId) {

                        return {
                            ...item,
                            cantidad:
                                item.cantidad - 1
                        }
                    }

                    return item
                })
                .filter(
                    item => item.cantidad > 0
                )

        setCarrito(carritoActualizado)
    }


    const eliminarProducto = (productoId) => {

        const carritoActualizado =
            carrito.filter(
                item => item.id !== productoId
            )

        setCarrito(carritoActualizado)
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

    const descuento = 0

    const total = subtotal - descuento


    const manejarRegistroVenta = async () => {

        if (carrito.length === 0) {

            alert(
                'Debes agregar al menos un producto'
            )

            return
        }


        if (!metodoPago) {

            alert(
                'Debes seleccionar un método de pago'
            )

            return
        }


        const venta = {

            metodoPago: metodoPago,

            productos: carrito.map(
                producto => ({

                    productoId: producto.id,

                    cantidad: producto.cantidad
                })
            )
        }


        try {

            const respuestas =
                await registrarVenta(venta)


            console.log(
                'Venta registrada correctamente'
            )

            console.log(respuestas)


            setVentaRegistrada(respuestas)

            setCarrito([])

            setMetodoPago('')

        } catch (error) {

            console.error(
                'Error al registrar la venta:',
                error
            )

            alert(error.message)
        }
    }


    const totalCompraRegistrada =
        ventaRegistrada
            ? ventaRegistrada.reduce(
                (total, venta) =>
                    total + venta.total,
                0
            )
            : 0


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


                    <div className="venta-confirmacion-total">

                        <span>
                            Total de la compra
                        </span>

                        <strong>
                            ${totalCompraRegistrada}
                        </strong>

                    </div>


                    {ventaRegistrada.map(
                        venta => (

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


                                <div className="venta-confirmacion-subtotal">

                                    <span>
                                        Total {venta.vendedor}
                                    </span>

                                    <strong>
                                        ${venta.total}
                                    </strong>

                                </div>

                            </div>

                        )
                    )}


                    <p>
                        Método de pago:
                        {' '}
                        {ventaRegistrada[0]?.metodoPago}
                    </p>


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

                            {productosDisponibles.map(producto => (

                                <div className="producto-card" key={producto.id}>

                                    {imagenesProductos[producto.id] && (
                                        <img
                                            src={imagenesProductos[producto.id]}
                                            alt={producto.nombre}
                                        />
                                    )}

                                    <div className="producto-card-contenido">

                                        <h3>{producto.nombre}</h3>

                                        <strong>${producto.precio}</strong>

                                        <button onClick={() => agregarAlCarrito(producto)}>
                                            Agregar
                                        </button>

                                    </div>

                                </div>

                            ))}

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

                            carrito.map(
                                producto => (

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

                                )
                            )
                        )}


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
                                    setMetodoPago(
                                        'EFECTIVO'
                                    )
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
                                    setMetodoPago(
                                        'TARJETA'
                                    )
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
                                    setMetodoPago(
                                        'TRANSFERENCIA'
                                    )
                                }
                            >
                                Transferencia
                            </button>

                        </div>


                        <button
                            type="button"
                            className="registrar-venta-button"
                            onClick={
                                manejarRegistroVenta
                            }
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