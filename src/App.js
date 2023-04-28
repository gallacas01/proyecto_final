import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import NavBar from "./NavBar";
import Jugadores from "./VerJugadores";
import Equipos from "./VerEquipos";
import Movimientos from "./Movimientos";
import Estadisticas from "./Estadisticas";
import Inicio from "./Inicio";
import FrmRegistrarJugador from "./FrmRegistrarJugador";
import FrmRegistrarEquipo from "./FrmRegistrarEquipo";
import FrmRegistrarPartido from "./FrmRegistrarPartido";
import Panel from "./PanelDeRegistro";
import './css/styles.css';
import 'animate.css';

const router = createBrowserRouter([
  {
    path : "/",
    element: <Inicio /> ,
    errorElement : <ErrorPage />
  },
  {
    path : "/ver_jugadores",
    element: <><NavBar /> <Jugadores /> </>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/registrar_jugador",
    element: <><FrmRegistrarJugador /> </>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/registrar_equipo",
    element: <><FrmRegistrarEquipo /> </>,
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
    path : "/estadisticas",
    element: <><NavBar /><Estadisticas/></>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/panel_de_registro",
    element: <><NavBar /><Panel/></>,
    errorElement : <ErrorPage />,
  }
]);

export default function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
    
  );
}


