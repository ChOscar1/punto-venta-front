import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

function ProtectedLayout() {

    return (
        <div className="app">

            <Sidebar />

            <main className="main-content">
                <Outlet />
            </main>

        </div>
    )
}

export default ProtectedLayout