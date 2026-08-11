import {Link} from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-header">
                <h2>Alitas Haydee</h2>
            </div>

            <nav className="sidebar-menu">

                <Link to="/" className="menu-button">
                    🏠
                    <span>Inicio</span>
                </Link>

                <Link to="/venta" className="menu-button">
                    🛒
                    <span>Registrar venta</span>
                </Link>

                <Link to="/productos" className="menu-button">
                    📦
                    <span>Productos</span>
                </Link>

                <Link to="/reportes" className="menu-button">
                    📊
                    <span>Reportes</span>
                </Link>

            </nav>

        </aside>
    )
}

export default Sidebar