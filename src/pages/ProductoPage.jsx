import { useEffect, useState } from 'react'
import {
    obtenerProductos,
    crearProducto,
    actualizarProducto
} from '../services/productoService'
import { obtenerCategorias } from '../services/categoriaService'

function ProductoPage() {

    const [productos, setProductos] = useState([])

    const [categorias, setCategorias] = useState([])

    const [cargando, setCargando] = useState(true)

    const [error, setError] = useState('')

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false)

    const [productoEditando, setProductoEditando] =
        useState(null)

    const [nombre, setNombre] = useState('')

    const [precio, setPrecio] = useState('')

    const [categoriaId, setCategoriaId] =
        useState('')

    const [activo, setActivo] = useState(true)

    const [guardando, setGuardando] =
        useState(false)


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

                console.error(
                    'Error al cargar los datos:',
                    error
                )

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


    const limpiarFormulario = () => {

        setNombre('')

        setPrecio('')

        setCategoriaId('')

        setActivo(true)

        setProductoEditando(null)

    }


    const abrirFormulario = () => {

        limpiarFormulario()

        setMostrarFormulario(true)
    }

    const abrirEdicion = (producto) => {

        setProductoEditando(producto)

        setNombre(producto.nombre)

        setPrecio(producto.precio)

        setCategoriaId(producto.categoriaId)

        setActivo(producto.activo)

        setMostrarFormulario(true)
    }

    const cerrarFormulario = () => {

        limpiarFormulario()

        setMostrarFormulario(false)

    }


    const manejarGuardarProducto = async (event) => {

        event.preventDefault()

        if (!nombre.trim()) {

            alert(
                'Debes ingresar el nombre del producto'
            )

            return
        }

        if (!categoriaId) {

            alert(
                'Debes seleccionar una categoría'
            )

            return
        }

        if (!precio) {

            alert(
                'Debes ingresar el precio'
            )

            return
        }


        const producto = {

            nombre: nombre.trim(),

            categoriaId: Number(categoriaId),

            precio: Number(precio),

            activo: activo

        }


        try {

            setGuardando(true)


            if (productoEditando) {

                const respuesta =
                    await actualizarProducto(
                        productoEditando.id,
                        producto
                    )

                console.log(
                    'Producto actualizado correctamente:',
                    respuesta
                )

                setProductos(productosActuales =>
                    productosActuales.map(item =>
                        item.id === productoEditando.id
                            ? respuesta
                            : item
                    )
                )

                alert(
                    'Producto actualizado correctamente'
                )

            } else {

                const respuesta =
                    await crearProducto(producto)

                console.log(
                    'Producto creado correctamente:',
                    respuesta
                )

                setProductos(productosActuales => [
                    ...productosActuales,
                    respuesta
                ])

                alert(
                    'Producto creado correctamente'
                )
            }


            cerrarFormulario()

        } catch (error) {

            console.error(
                'Error al guardar producto:',
                error
            )

            alert(error.message)

        } finally {

            setGuardando(false)

        }
    }


    if (cargando) {

        return (
            <section className="productos-page">

                <h1>
                    Productos
                </h1>

                <p>
                    Cargando productos...
                </p>

            </section>
        )
    }


    if (error) {

        return (
            <section className="productos-page">

                <h1>
                    Productos
                </h1>

                <p className="productos-error">
                    {error}
                </p>

            </section>
        )
    }


    return (

        <section className="productos-page">

            <div className="productos-header">

                <div>

                    <h1>
                        Productos
                    </h1>

                    <p>
                        Consulta y administra los productos
                        disponibles.
                    </p>

                </div>


                <button
                    type="button"
                    className="agregar-producto-button"
                    onClick={abrirFormulario}
                >
                    + Agregar producto
                </button>

            </div>


            {mostrarFormulario && (

                <div className="producto-formulario">

                    <h2>
                        {productoEditando
                            ? 'Editar producto'
                            : 'Nuevo producto'
                        }
                    </h2>


                    <form
                        onSubmit={
                            manejarGuardarProducto
                        }
                    >

                        <div className="producto-form-grid">

                            <div className="producto-form-campo">

                                <label htmlFor="nombre">
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
                                    type="text"
                                    value={nombre}
                                    onChange={event =>
                                        setNombre(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Ej. Alitas BBQ"
                                />

                            </div>


                            <div className="producto-form-campo">

                                <label htmlFor="precio">
                                    Precio
                                </label>

                                <input
                                    id="precio"
                                    type="number"
                                    min="1"
                                    value={precio}
                                    onChange={event =>
                                        setPrecio(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Ej. 80"
                                />

                            </div>


                            <div className="producto-form-campo">

                                <label htmlFor="categoria">
                                    Categoría
                                </label>

                                <select
                                    id="categoria"
                                    value={categoriaId}
                                    onChange={event =>
                                        setCategoriaId(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Seleccionar categoría
                                    </option>

                                    {categorias.map(
                                        categoria => (

                                            <option
                                                key={
                                                    categoria.id
                                                }
                                                value={
                                                    categoria.id
                                                }
                                            >
                                                {
                                                    categoria.nombre
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="producto-form-campo">

                                <label>
                                    Estado
                                </label>

                                <label className="producto-checkbox">

                                    <input
                                        type="checkbox"
                                        checked={activo}
                                        onChange={event =>
                                            setActivo(
                                                event.target.checked
                                            )
                                        }
                                    />

                                    Producto activo

                                </label>

                            </div>

                        </div>


                        <div className="producto-form-acciones">

                            <button
                                type="button"
                                className="producto-cancelar-button"
                                onClick={
                                    cerrarFormulario
                                }
                                disabled={guardando}
                            >
                                Cancelar
                            </button>


                            <button
                                type="submit"
                                className="producto-guardar-button"
                                disabled={guardando}
                            >
                                {guardando
                                    ? 'Guardando...'
                                    : productoEditando
                                        ? 'Guardar cambios'
                                        : 'Guardar producto'
                                }
                            </button>

                        </div>

                    </form>

                </div>

            )}


            <div className="productos-tabla-container">

                <table className="productos-tabla">

                    <thead>

                    <tr>

                        <th>
                            ID
                        </th>

                        <th>
                            Nombre
                        </th>

                        <th>
                            Categoría
                        </th>

                        <th>
                            Precio
                        </th>

                        <th>
                            Estado
                        </th>

                        <th>
                            Acciones
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {productos.map(producto => {

                        const categoria =
                            categorias.find(
                                categoria =>
                                    categoria.id ===
                                    producto.categoriaId
                            )

                        return (

                            <tr key={producto.id}>

                                <td>
                                    {producto.id}
                                </td>

                                <td>
                                    <strong>
                                        {producto.nombre}
                                    </strong>
                                </td>

                                <td>
                                    {categoria
                                        ? categoria.nombre
                                        : producto.categoriaId
                                    }
                                </td>

                                <td>
                                    ${producto.precio}
                                </td>

                                <td>

                                        <span
                                            className={
                                                producto.activo
                                                    ? 'producto-activo'
                                                    : 'producto-inactivo'
                                            }
                                        >
                                            {producto.activo
                                                ? 'Activo'
                                                : 'Inactivo'
                                            }
                                        </span>

                                </td>

                                <td>

                                    <button
                                        type="button"
                                        className="producto-editar-button"
                                        onClick={() => abrirEdicion(producto)}
                                    >
                                        Editar
                                    </button>

                                </td>

                            </tr>

                        )
                    })}

                    </tbody>

                </table>

            </div>

        </section>
    )
}

export default ProductoPage