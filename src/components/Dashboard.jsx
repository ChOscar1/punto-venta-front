import { Link } from 'react-router-dom'

function Dashboard() {
    return (
        <section className="dashboard">

            <div className="dashboard-header">
                <h1>Punto de Venta</h1>

                <p>
                    Bienvenido al sistema de ventas
                </p>
            </div>

            <div className="dashboard-cards">

                <Link to="/venta" className="dashboard-card">
                    <span className="dashboard-icon">🛒</span>

                    <span className="dashboard-card-title">
            Registrar venta
          </span>

                    <span className="dashboard-card-description">
            Registrar una nueva venta
          </span>
                </Link>

                <Link to="/reportes" className="dashboard-card">
                    <span className="dashboard-icon">📊</span>

                    <span className="dashboard-card-title">
            Reporte del día
          </span>

                    <span className="dashboard-card-description">
            Consultar las ventas del día
          </span>
                </Link>

                <Link to="/productos/agregar" className="dashboard-card">
                    <span className="dashboard-icon">📦</span>

                    <span className="dashboard-card-title">
            Agregar producto
          </span>

                    <span className="dashboard-card-description">
            Registrar un nuevo producto
          </span>
                </Link>

                <Link to="/productos" className="dashboard-card">
                    <span className="dashboard-icon">✏️</span>

                    <span className="dashboard-card-title">
            Actualizar producto
          </span>

                    <span className="dashboard-card-description">
            Modificar un producto existente
          </span>
                </Link>

            </div>

        </section>
    )
}

export default Dashboard