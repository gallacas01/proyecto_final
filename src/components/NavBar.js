import {useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../css/bootstrap.css';
import '../css/styles.css';
import { useRef } from 'react';

//Componente NavItem
function NavItem({ info }) {

    //Variables de estado
    const linkRef = useRef(null);

    return (
            <li key={info.id} className="nav-item" ref={linkRef}>
                <Link
                    className='nav-link' 
                    id={info.id}
                    to={info.url}>{info.titulo}
                </Link>
            </li>
         /*El evento onBlur se desencadena cuando un elemento pierde el foco */
    );
}

function BarraNavegacion({ datosNavBar }) {

      //Constantes
      const auth = useAuth();
      const navigate = useNavigate();
      const location = useLocation();
      const currentPath = location.pathname;

      //Función que cierra la sesión
      const cerrarSesion = ( () => {

        if  (window.confirm('¿Estás seguro/a de que quieres cerrar la sesión?')){
            navigate("/inicio");
            auth.logOut();
            window.location.reload();
        }
     });
   
    let listaNavItem = datosNavBar.listaItems.map((elemInfo, i) => {
        return (
            <NavItem key={i} info={elemInfo} />
        );       
    });

    return (
        <nav className={`navbar navbar-expand-md p-0 ${currentPath === '/' || currentPath === '/register' ? 'd-none' : ''}`}>
            <div className="container-fluid p-1">
                <button className="navbar-toggler mb-2 text-light mt-2" style={{backgroundColor : "#f0f0f0"}} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {listaNavItem}
                        <li className='nav-item'>
                            <button className='p-0 mt-2 fs-4' onClick={cerrarSesion} id='btnCerrarSesion'><i className="fa-solid fa-right-from-bracket"/></button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default function NavBar() {

    const auth = useAuth();
    const user = auth.user;
    const navigate = useNavigate();

    useEffect ( () => {

        if (!user &&auth.checkedSession){
            navigate("/");
        }
      },[user, auth.checkedSession]);


    let estructuraDatosNavBar = {
        listaItems: [
            {
                id: "inicio",
                titulo: "Inicio",
                url : "/inicio"
            },
            {
                id: "equipos",
                titulo: "Equipos",
                url : "/ver_equipos"
            },
            {
                id: "jugadores",
                titulo: "Jugadores",
                url : "/ver_jugadores"
            },
            {
                url : "/estadisticas",
                id: "stats",
                titulo: "Estadísticas"
            },     
            {
                id: "clasificacion",
                titulo: "Clasificación",
                url : "/clasificacion"
            },
            //Si el usuario que ha iniciado sesión es el admin, se añaden más enlaces a la NavBar
            user.uid === "CPifWKxzLqPFg3N8hIauBdhf3lT2" ?
                {
                    url : "/panel_de_registro",
                    id: "panelDeregistro",
                    titulo: "Panel de registro"
                } : {},
        ]
    };

    return (
        <BarraNavegacion datosNavBar={estructuraDatosNavBar} />
    );
}
