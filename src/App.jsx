import './App.css'
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductoPage from "./pages/ProductoPage.jsx";
import ReportesPage from "./pages/ReportesPage.jsx";
import VentaPage from "./pages/VentaPage.jsx";

function App() {
    return (
        <BrowserRouter>

            <div className="app">

                <Sidebar />

                <main className="main-content">

                    <Routes>

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/venta"
                            element={<VentaPage />}
                        />

                        <Route
                            path="/productos"
                            element={<ProductoPage />}
                        />

                        <Route
                            path="/productos/agregar"
                            element={
                                <Navigate
                                    to="/productos"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="/reportes"
                            element={<ReportesPage />}
                        />

                    </Routes>

                </main>

            </div>

        </BrowserRouter>
    )
}

export default App