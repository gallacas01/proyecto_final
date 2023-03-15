import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import NavBar from "./NavBar";
import Jugadores from "./VerJugadores";
import Equipos from "./VerEquipos";
import Movimientos from "./Movimientos";
import Estadisticas from "./Estadisticas";


const router = createBrowserRouter([
  {
    path : "/",
    element: <NavBar /> ,
    errorElement : <ErrorPage />
  },
  {
    path : "/verJugadores",
    element: <><NavBar /> <Jugadores /> </>,
    errorElement : <ErrorPage />,
  },
  {
    path : "/verEquipos",
    element: <><NavBar /><Equipos/></>,
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


