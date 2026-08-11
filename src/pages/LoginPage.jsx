import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function LoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async (e) => {

        e.preventDefault();

        setError("");
        setCargando(true);

        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Usuario o contraseña incorrectos"
                );
            }

            localStorage.setItem("token", data.token);

            navigate("/");

        } catch (error) {

            setError(error.message);

        } finally {

            setCargando(false);

        }
    };

    return (
        <div className="login-page">

            <div className="login-overlay"></div>

            <div className="login-card">

                <div className="login-header">

                    <div className="login-icon">
                        🍗
                    </div>

                    <h1>Alitas Haydee</h1>

                    <p>
                        Punto de Venta
                    </p>

                </div>

                <form onSubmit={iniciarSesion}>

                    <div className="input-group">

                        <label>
                            Usuario
                        </label>

                        <div className="input-container">

                            <span>👤</span>

                            <input
                                type="text"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>

                    <div className="input-group">

                        <label>
                            Contraseña
                        </label>

                        <div className="input-container">

                            <span>🔒</span>

                            <input
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={cargando}
                    >
                        {cargando
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"
                        }
                    </button>

                </form>

                <div className="login-footer">
                    Sistema de Punto de Venta
                </div>

            </div>

        </div>
    );
}

export default LoginPage;