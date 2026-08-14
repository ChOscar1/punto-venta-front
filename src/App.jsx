import './App.css'
import Dashboard from "./components/Dashboard.jsx";
import ProtectedLayout from "./components/ProtectedLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductoPage from "./pages/ProductoPage.jsx";
import ReportesPage from "./pages/ReportesPage.jsx";
import VentaPage from "./pages/VentaPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PedidosPendientesPage from "./pages/PedidosPendientesPage.jsx";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route element={<ProtectedRoute />}>

                    <Route element={<ProtectedLayout />}>

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/venta"
                            element={<VentaPage />}
                        />

                        <Route
                            path="/ventas-pendientes"
                            element={<PedidosPendientesPage />}
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

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    )
}

export default App