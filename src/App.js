import {createBrowserRouter, RouterProvider} from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path : "/login",
    element: <LoginScreen /> ,
    errorElement : <ErrorPage />
  },
  {
    path : "/inicio",
    element: <Inicio /> ,
    errorElement : <ErrorPage />
  },
  {
    path : "/register",
    element: <SignUpScreen /> ,
    errorElement : <ErrorPage />
  },
  {
    path : "/ver_jugadores",
    element: <><VerJugadores /> </>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/ver_equipos",
    element: <><NavBar /><Equipos/></>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/registar_partido",
    element: <FrmRegistrarPartido/>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/movimientos",
    element: <><NavBar /><Movimientos/></>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/clasificacion",
    element: <><Clasificacion/></>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/estadisticas",
    element: <><NavBar /><Estadisticas/></>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/panel_de_registro",
    element: <><NavBar /><Panel/></>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/modal",
    element: <><NavBar /><Modal /></>,
    errorElement : <ErrorPage />,
  }
]);

export default function App() {

  return (    
    <RouterProvider router={router} />
  );
}


