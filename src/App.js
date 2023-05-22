import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import NavBar from "./components/NavBar";
import VerJugadores from "./components/VerJugadores";
import Equipos from "./components/VerEquipos";
import Movimientos from "./components/Movimientos";
import Estadisticas from "./components/Estadisticas";
import FrmRegistrarPartido from "./components/FrmRegistrarPartido";
import Panel from "./components/PanelDeRegistro";
import Clasificacion from "./components/Clasificacion";
import LoginScreen from "./components/SignIn";
import SignUpScreen from "./components/SignUp";
import Inicio from "./components/Inicio";
import Modal from "./components/Modal";

export default function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/register" element={<SignUpScreen />} />
        <Route path="/ver_jugadores" element={<VerJugadores />} />
        <Route path="/ver_equipos" element={<Equipos />} />
        <Route path="/registar_partido" element={<FrmRegistrarPartido />} />
        <Route path="/movimientos" element={<Movimientos />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/panel_de_registro" element={<Panel />} />
        <Route path="/modal" element={<Modal />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router >
    </>
  );
}



