import {useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import '../css/bootstrap.css';
import '../css/styles.css';
import { useRef } from 'react';

//Componente NavItem
function NavItem({ info }) {

    //Variables de estado
    const linkRef = useRef(null);

    return (
         <li key={info.id} className="nav-item">
            <a ref={linkRef} className='nav-link' onClick={() => linkRef.current.classList.add('isFocused')} onBlur={() => linkRef.current.classList.remove('isFocused') } id={info.id} href={info.url}>{info.titulo}</a>
        </li>
         /*El evento onBlur se desencadena cuando un elemento pierde el foco */
    );
}

function BarraNavegacion({ datosNavBar }) {

      //Constantes
      const auth = useAuth();
      const navigate = useNavigate();

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
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href={datosNavBar.url}>{datosNavBar.titulo}</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {listaNavItem}
                        <button className='p-0' onClick={cerrarSesion} id='btnCerrarSesion'>Cerrar sesión</button>
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
        titulo: "Inicio",
        url: "/inicio",
        listaItems: [
            {
                id: "jugadores",
                titulo: "Jugadores",
                url : "/ver_jugadores"
            },
            //Si el usuario que ha iniciado sesión es el admin, se añaden más enlaces a la NavBar
            user.uid === "CPifWKxzLqPFg3N8hIauBdhf3lT2" ?
                {
                    id: "equipos",
                    titulo: "Equipos",
                    url : "/ver_equipos"
                } : {},

            {
                url: "/movimientos",
                id: "movimientos",
                titulo: "Movimientos"
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
