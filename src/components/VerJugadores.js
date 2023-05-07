import { useEffect, useRef, useState } from 'react';
import CardJugador from './CardJugador';
import NavBar from "./NavBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../css/bootstrap.css';
import '../css/styles.css';

//Método que crea un elemento de tipo option cuyo valor y textContent se pasan por parámetro.
function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function VerJugadores() {

    const [idCompeticion, setIdCompeticion] = useState('');
    const [jugadoresRecuperados, setJugadoresRecuperados] = useState(false);
    const [jugadores,setJugadores] = useState([]);
    const desplegableCompeticionesRef = useRef(null);
    const desplegableEquiposRef = useRef(null);
    const nombreEquipoRef = useRef(null);
    const containerJugadoresRef = useRef(null);

    //Constantes
    const auth = useAuth();
    const user = auth.user;
    const navigate = useNavigate();

    const rellenarDesplegableEquipos = ( async (id) => {

            let parametros = new FormData();
            parametros.append("id_competicion", id);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquiposDeUnaCompeticion.php",
            {
                method : 'POST',
                body : parametros
            })
            if (response.ok){
    
                let respuesta = await response.json();
                if (!respuesta.error && respuesta.datos.length > 0){
    
                    desplegableEquiposRef.current.innerHTML = " ";
                    let optionVacio = createOptionElement("-","-");
                    desplegableEquiposRef.current.appendChild(optionVacio);
    
                     //Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                     for (let equipo of respuesta.datos){
                        let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                        desplegableEquiposRef.current.appendChild(option);
                    }
                }
            }     
    })//Fin de la función

    const handleChangeCompeticion = ( (event) => {

        let optionSeleccionado = event.target.options[event.target.selectedIndex];
        let id = optionSeleccionado.value;

            console.log("ID de la competición antes" + idCompeticion);
            setIdCompeticion(id);   
            console.log("ID de la competición despues" + idCompeticion);

            if (id !== "-"){
                /*Cuando cambie la competición y adopte un valor válido, se recuperarán aquellos equipos
                pertenecientes a esa competicion. */
                rellenarDesplegableEquipos(id);
            }          
    });

    let defensas;
    let centrocampistas;
    let delanteros;
    const getJugadores = ( async () => {

        defensas = [];
        centrocampistas = [];
        delanteros = [];
        if (idCompeticion !== "-" && desplegableEquiposRef.current.value !== "-"){

            //Escribimos el nombre del equipo dentro del h2 del div donde se encuentran los jugadores.
            let nombreDelEquipo = desplegableEquiposRef.current.options[desplegableEquiposRef.current.selectedIndex].textContent;
            nombreEquipoRef.current.textContent = nombreDelEquipo;

            let idEquipo = desplegableEquiposRef.current.value; 
            let parametros = new FormData();
            parametros.append("id_equipo", idEquipo);     

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getJugadoresDeUnEquipo.php",
            {
                method : 'POST',
                body : parametros
            });

            if (response.ok){

                let respuesta = await response.json();
                if(!respuesta.error){

                    for (let jugador of respuesta.datos){

                        //Obtenemos la url de la imagen de la base de datos, que se encuentra en formato base 64.
                        let imagenDB = "data:image/png;base64," + jugador.imagen;
                        const blob = await fetch(imagenDB).then((res) => res.blob());
                        let urlImagen = URL.createObjectURL(blob);

                        let info = { id_jugador : jugador.id_jugador, dni_jugador: jugador.dni_jugador, 
                            nombre_completo : jugador.nombre_completo, fecha_nacimiento : jugador.fecha_nacimiento, 
                            peso : jugador.peso, altura: jugador.altura, posicion : jugador.posicion, dorsal: jugador.dorsal,
                            pais : jugador.pais, equipo : jugador.equipo, imagen : urlImagen};
                        console.log(info);

                        let cardJugador = <CardJugador  key={jugador.id_jugador} info={info} getJugadores={getJugadores} />
                        if (jugador.posicion === "defensa"){
                            defensas.push(cardJugador);
                        }else if (jugador.posicion === "centrocampista"){
                            centrocampistas.push(cardJugador);
                        }else {
                            delanteros.push(cardJugador);
                        }
                    }
                    //Cambiamos el valor de esta variable de estado para que se muestren los jugadores.
                    setJugadores([defensas,centrocampistas,delanteros]);
                    containerJugadoresRef.current.classList.remove('d-none');
                    setJugadoresRecuperados(true);
                }
            }

        }else{

            if (idCompeticion === "-"){
                alert("Selecciona una competición.");
            }
            if (desplegableEquiposRef.current.value === "-" ){
                alert("Selecciona un equipo.");
            }
        }     
        
    })//Fin de la función.

    useEffect( () => {
        
        const rellenarDesplegableCompeticiones = ( async () => {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getCompeticiones.php");
            if (response.ok){

                let respuesta = await response.json();
                if (!respuesta.error && respuesta.datos.length > 0){

                    //Recuperamos el desplegable de competiciones y añadimos el primer elemento, cuyo valor será '-'.
                    desplegableCompeticionesRef.current.innerHTML = " ";
                    let optionVacio = createOptionElement("-","-");
                    desplegableCompeticionesRef.current.appendChild(optionVacio);
                    
                    //Recorremos el array de competiciones anyadiendo cada una al desplegable de competiciones.
                    for (let competicion of respuesta.datos){
                        let option = createOptionElement(competicion.id_competicion, competicion.nombre);
                        desplegableCompeticionesRef.current.appendChild(option);
                    }
                }
            }            
        });

        rellenarDesplegableCompeticiones();
    },[]);

    return (
        <div className='container-fluid'>
            <div className='row'><NavBar /> </div>
            <div className='row'>
                <form className="col-lg-9 mx-auto p-0">
                    <div className="row mx-auto mt-lg-3">
                        <label className="form-label my-auto text-lg-end col-lg-2">Competición</label>
                        <div className="col-lg-3 p-0 my-auto">
                            <select className="form-select shadow-none" ref={desplegableCompeticionesRef} onChange={(event) => (handleChangeCompeticion(event))} required>

                            </select>
                        </div>
                        <label className="form-label my-auto text-lg-end col-lg-2">Equipo</label>
                        <div className="col-lg-3 p-0 my-auto">
                            <select className="form-select shadow-none" ref={desplegableEquiposRef} required>

                            </select>
                        </div>
                    <button className="btn1 ms-lg-3 col-lg-1" onClick={ (event) => {event.preventDefault(); getJugadores();}}><i className="bi bi-search fs-5"></i></button>  
                    </div>
                </form>
            </div>

            <div className='row'>
                <div className='col-lg-9 mx-auto mt-lg-4 p-1 d-none' ref={containerJugadoresRef}>
                    <div className='row p-0 m-auto'> <h1 className="text-center mt-lg-1" ref={nombreEquipoRef} style={{color : '#182E3E'}}></h1></div>
                    <div className='row p-0 m-0'>
                        {jugadoresRecuperados &&
                            <>
                                <h5 className='p-1' id='tituloPosicion'>Defensas</h5>
                                {jugadores[0]}                    
                                <h5 className='p-1 mt-4' id='tituloPosicion'>Centrocampistas</h5>
                                {jugadores[1]}
                                <h5 className='p-1 mt-4' id='tituloPosicion'>Delanteros</h5>
                                {jugadores[2]}
                            </>                      
                        }
                    
                    </div>
                </div>

            </div>
        </div>
    );
}


