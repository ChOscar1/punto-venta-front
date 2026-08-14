import {Link, useNavigate} from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const cerrarSesion = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

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

                <Link
                    to="/ventas-pendientes"
                    className="menu-button"
                >
                    ⏳
                    <span>Ventas pendientes</span>
                </Link>

                <Link to="/productos" className="menu-button">
                    📦
                    <span>Productos</span>
                </Link>

                <Link to="/reportes" className="menu-button">
                    📊
                    <span>Reportes</span>
                </Link>

                <button
                    onClick={cerrarSesion}
                    className="menu-button"
                >
                    🚪
                    <span>Cerrar sesión</span>
                </button>

            </nav>

        </aside>
    )
}

export default Sidebar