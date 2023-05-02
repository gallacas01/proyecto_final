import { useState } from 'react';
import '../css/bootstrap.css';
import '../css/styles.css';

//Función encargada de crear un NavItem
function NavItem({ info, esDropdown }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
         <li key={info.id} className={esDropdown ? "dropdown-item" : "nav-item"}>
            <a className={isFocused ? "nav-link isFocused" : "nav-link"} onClick={() => setIsFocused(!isFocused)} onBlur={() => setIsFocused(false)} id={info.id} href={info.url}>{info.titulo}</a>
        </li>
         /*El evento onBlur se desencadena cuando un elemento pierde el foco */
    );
}

//Funcion encargada de crear un NavItemDropdown
function NavItemDropdown({ info }) {

    const listaNavItem = info.listaItems.map((elemInfo) => {
        return (
            <NavItem info={elemInfo} esDropdown={true} />
        );
    });

    return (
        <li key={info.id} className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {info.titulo}
            </a>
            <ul className="dropdown-menu">
                {listaNavItem}
            </ul>
        </li>
    );
}

function BarraNavegacion({ datosNavBar }) {

   
    let listaNavItem = datosNavBar.listaItems.map((elemInfo) => {

        if (elemInfo.url) { // Si está definida la url se trara de un NavItem
            return (
                <NavItem info={elemInfo} esDropdown={false} />
            );
        } else { // elemInfo.url == undefined --> Se trata de un NavItemDropdown
            return (
                <NavItemDropdown info={elemInfo} esDropdown={true}/>
            );
        }
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
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default function NavBar() {
    let estructuraDatosNavBar = {
        titulo: "Inicio",
        url: "/",
        listaItems: [
            {
                id: "jugadores",
                titulo: "Jugadores",
                url : "/ver_jugadores"
            },
            {
                id: "equipos",
                titulo: "Equipos",
                url : "/ver_equipos"
            },
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
            {
                url : "/panel_de_registro",
                id: "panelDeregistro",
                titulo: "Panel de registro"
            }         
        ]
    };

    return (
        <BarraNavegacion datosNavBar={estructuraDatosNavBar} />
    );
}
