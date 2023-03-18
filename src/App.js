import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import NavBar from "./NavBar";
import Jugadores from "./VerJugadores";
import Equipos from "./VerEquipos";
import Movimientos from "./Movimientos";
import Estadisticas from "./Estadisticas";
import Inicio from "./Inicio";
import RegistrarJugador from "./RegistrarJugador";
import RegistrarEquipo from "./RegistrarEquipo";
import RegistrarPartido from "./RegistrarPartido";


const router = createBrowserRouter([
  {
    path : "/",
    element: <Inicio /> ,
    errorElement : <ErrorPage />
  },
  {
    path : "/verJugadores",
    element: <><NavBar /> <Jugadores /> </>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/registrar_jugador",
    element: <><RegistrarJugador /> </>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/registrar_equipo",
    element: <><RegistrarEquipo /> </>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/verEquipos",
    element: <><NavBar /><Equipos/></>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/registar_partido",
    element: <RegistrarPartido/>,
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
  }
]);

export default function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
    
  );
}


