import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import VerJugadores from "./pages/VerJugadores";
import Equipos from "./pages/VerEquipos";
import Estadisticas from "./pages/Estadisticas";
import Panel from "./pages/PanelDeRegistro";
import Clasificacion from "./pages/Clasificacion";
import LoginScreen from "./pages/SignIn";
import SignUpScreen from "./pages/SignUp";
import Inicio from "./pages/Inicio";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <>
      <NavBar />      
        <Routes>
          <Route path="/" element={<LoginScreen />}/>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/register" element={<SignUpScreen />} />
          <Route path="/ver_jugadores" element={<VerJugadores />} />
          <Route path="/ver_equipos" element={<Equipos />} />
          <Route path="/clasificacion" element={<Clasificacion />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/panel_de_registro" element={<Panel />} />
          <Route path="*" element={<LoginScreen />} />
        </Routes>
    </>
  );
}