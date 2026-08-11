function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-header">
                <h2>Alitas Haydee</h2>
            </div>

            <nav className="sidebar-menu">

                <button className="menu-button">
                    🏠
                    <span>Inicio</span>
                </button>

                <button className="menu-button">
                    🛒
                    <span>Registrar venta</span>
                </button>

                <button className="menu-button">
                    📦
                    <span>Productos</span>
                </button>

                <button className="menu-button">
                    📊
                    <span>Reportes</span>
                </button>

            </nav>

        </aside>
    )
}

export default Sidebar