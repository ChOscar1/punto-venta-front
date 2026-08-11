import './App.css'
import Sidebar from "./components/Sidebar.jsx";

function App() {
  return (
      <div className="app">

        <Sidebar />

        <main className="main-content">
          <h1>Punto de Venta</h1>

          <p>
            Bienvenido al sistema de ventas.
          </p>
        </main>

      </div>
  )
}

export default App
