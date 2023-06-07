import {useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useRef } from 'react';

//Componente NavItem
function NavItem({ info }) {

    //Variables de estado
    const linkRef = useRef(null);

    const changeFocus = ( () => {

        //Obtenemos la ul que contiene todos li y eliminamos la clase isFocuses de aquel li que lo contenga.
        let siblings = Array.from(linkRef.current.parentNode.children);
        siblings.forEach(sibling => {
            if (sibling.className.includes('isFocused')){
                sibling.classList.remove('isFocused');
            }
        });
        linkRef.current.classList.add('isFocused');
    });


    return (
            <li key={info.id} className={`nav-item ${info.url === '/inicio' ? 'isFocused' : ''}`} ref={linkRef}
                onClick={changeFocus}
            >
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
            navigate("/login");
            auth.logOut();
            window.location.reload();
        }
     });
   
    let listaNavItem = datosNavBar.listaItems.map((elemInfo, i) => {

        if (!elemInfo.url){
            return null;
        }
        return (
            <NavItem key={i} info={elemInfo} />
        );       
    });

    return (
        <nav className={`navbar navbar-expand-md p-0 ${currentPath === '/inicio' ||currentPath ===  '/ver_jugadores' || currentPath ===  '/ver_equipos' ||
            currentPath === '/clasificacion' || currentPath === '/estadisticas' || currentPath === '/panel_de_registro' ? '' : 'd-none'}`}>
            <div className="container-fluid p-0">
                <button className="navbar-toggler my-2 text-light m-1" style={{backgroundColor : "#f0f0f0"}} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-lg-0 p-2">
                        {listaNavItem}
                        <li className='nav-item'>
                            <button className='p-0 mt-2 fs-5 fs-sm-4' onClick={cerrarSesion} id='btnCerrarSesion'><i className="fa-solid fa-right-from-bracket"/></button>
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
            navigate("/login");
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
