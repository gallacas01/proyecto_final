import { useEffect, useRef, useState } from 'react';
import CardJugador from './CardJugador';
import './css/styles.css';

//Método que crea un elemento de tipo option cuyo valor y textContent se pasan por parámetro.
function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function Jugadores() {

    const [idCompeticion, setIdCompeticion] = useState('');
    const desplegableCompeticiones = useRef(null);
    const desplegableEquipos = useRef(null);
    const nombreEquipo = useRef(null);
    const [jugadores, setJugadores] = useState([]);
    const containerJugadores = useRef(null);

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
    
                    desplegableEquipos.current.innerHTML = " ";
                    let optionVacio = createOptionElement("-","-");
                    desplegableEquipos.current.appendChild(optionVacio);
    
                     //Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                     for (let equipo of respuesta.datos){
                        let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                        desplegableEquipos.current.appendChild(option);
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

    const arrayJugadores = [];
    const getJugadores = ( async () => {

        if (idCompeticion !== "-" && desplegableEquipos.current.value !== "-"){

            //Escribimos el nombre del equipo dentro del h2 del div donde se encuentran los jugadores.
            let nombreDelEquipo = desplegableEquipos.current.options[desplegableEquipos.current.selectedIndex].textContent;
            nombreEquipo.current.textContent = nombreDelEquipo;

            let idEquipo = desplegableEquipos.current.value; 
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
                        arrayJugadores.push(< CardJugador  key={jugador.id_jugador} info={info} />);
                    }
                }
            }

            //Mostramos el contenedor de los jugadores y guardamos los jugadores del array dentro de la variable de estado.
            containerJugadores.current.classList.remove('d-none');
            setJugadores(...[arrayJugadores]);

        }else{

            if (idCompeticion === "-"){
                alert("Selecciona una competición.");
            }
            if (desplegableEquipos.current.value === "-" ){
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
                    desplegableCompeticiones.current.innerHTML = " ";
                    let optionVacio = createOptionElement("-","-");
                    desplegableCompeticiones.current.appendChild(optionVacio);
                    
                    //Recorremos el array de competiciones anyadiendo cada una al desplegable de competiciones.
                    for (let competicion of respuesta.datos){
                        let option = createOptionElement(competicion.id_competicion, competicion.nombre);
                        desplegableCompeticiones.current.appendChild(option);
                    }
                }
            }            
        });

        rellenarDesplegableCompeticiones();
    },[]);

    return (
        <>
            <form className="col-lg-9 mx-auto p-0">
                <div className="row mx-auto mt-lg-3">
                    <label className="form-label my-auto text-lg-end col-lg-2">Competición</label>
                    <div className="col-lg-3 p-0 my-auto">
                        <select className="form-select shadow-none" ref={desplegableCompeticiones} onChange={(event) => (handleChangeCompeticion(event))} required>

                        </select>
                    </div>
                    <label className="form-label my-auto text-lg-end col-lg-2">Equipo</label>
                    <div className="col-lg-3 p-0 my-auto">
                        <select className="form-select shadow-none" ref={desplegableEquipos} required>

                        </select>
                    </div>
                   <button className="btn1 ms-lg-3 col-lg-1" onClick={ (event) => {event.preventDefault(); getJugadores();}}><i className="bi bi-search fs-5"></i></button>  
                </div>
            </form>

            <div className='col-lg-9 mx-auto mt-lg-4 p-1 d-none' ref={containerJugadores}>
                <div className='row p-0 m-auto'> <h2 className="text-center mt-lg-1" ref={nombreEquipo} style={{color : '#182E3E'}}></h2></div>
                <div className='row p-0 m-0'>
                    {jugadores}
                </div>

            </div>
        </>
    );
}


