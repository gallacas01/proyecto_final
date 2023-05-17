import React, { useEffect,useRef } from "react";
import { useState } from "react";

// class RegistrarMovimiento extends React.Component{
//     render(){
//     }
// }

function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function RegistrarMovimiento() {

    //Variables de estado
    const [idCompeticionEquipoAnterior, setIdCompeticionEquipoAnterior] = useState('');
    const [idEquipoAnterior, setIdEquipoAnterior] = useState('');
    const [dniJugador, setDniJugador] = useState('');
    const [idCompeticionEquipoNuevo, setIdCompeticionEquipoNuevo] = useState('');
    const [idEquipoNuevo, setIdEquipoNuevo] = useState('');
    const [fechaTraspaso, setFechaTraspaso] = useState('');

    //Referencias al DOM del componente
    const equiposCompeticionEquipoAnteriorRef = useRef(null);
    const competicionesEquipoAnteriorRef = useRef(null);
    const desplegableJugadoresRef = useRef(null);
    const competicionesEquipoNuevoRef = useRef(null);
    const equiposCompeticionEquipoNuevoRef = useRef(null);
    const frmRegistrarMovimiento = useRef(null);
    
    const rellenarDesplegableCompeticiones = ( async (desplegable) => {

        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getCompeticiones.php");
        if (response.ok){

            let respuesta = await response.json();
            if (!respuesta.error && respuesta.datos.length > 0){

                //Recuperamos el desplegable de competiciones y añadimos el primer elemento, cuyo valor será '-'.
                desplegable.current.innerHTML = " ";
                let optionVacio = createOptionElement("-","-");
                desplegable.current.appendChild(optionVacio);
                
                //Recorremos el array de competiciones anyadiendo cada una al desplegable de competiciones.
                for (let competicion of respuesta.datos){
                    let option = createOptionElement(competicion.id_competicion, competicion.nombre + ", Temp " + competicion.temporada);
                    desplegable.current.appendChild(option);
                }
            }
        }            
    });

    //Método que obtiene los equipos de una competición
    async function getEquipos(desplegableEquipos,idCompeticion) {

        let parametros = new FormData();
        parametros.append("id_competicion", idCompeticion);
        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquiposDeUnaCompeticion.php",
            {
                method : 'POST',
                body : parametros
            });

        if (response.ok){

            let respuesta = await response.json();
            if (!respuesta.error && respuesta.datos.length > 0){

                desplegableEquipos.current.innerHTML = " ";
                let optionVacio = createOptionElement("-","-");
                optionVacio.select = true;
                desplegableEquipos.current.appendChild(optionVacio);

                //Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                for (let equipo of respuesta.datos){
                    let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                    desplegableEquipos.current.appendChild(option);
                }
            }
        }     
    }

    useEffect(() => {

        rellenarDesplegableCompeticiones(competicionesEquipoAnteriorRef);
        rellenarDesplegableCompeticiones(competicionesEquipoNuevoRef);
    }, [])

    useEffect( () => {

        async function getEquiposCompeticionAnterior() {

                let parametros = new FormData();
                parametros.append("id_competicion", idCompeticionEquipoAnterior);
                let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquiposDeUnaCompeticion.php",
                    {
                        method : 'POST',
                        body : parametros
                    });

                if (response.ok){

                    let respuesta = await response.json();
                    if (!respuesta.error && respuesta.datos.length > 0){

                        equiposCompeticionEquipoAnteriorRef.current.innerHTML = " ";
                        let optionVacio = createOptionElement("-","-");
                        equiposCompeticionEquipoAnteriorRef.current.appendChild(optionVacio);

                        //Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                        for (let equipo of respuesta.datos){
                            let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                            equiposCompeticionEquipoAnteriorRef.current.appendChild(option);
                        }
                }
            }     
        }
        getEquiposCompeticionAnterior();
    }, [idCompeticionEquipoAnterior]);

    useEffect( () => {

        if (idCompeticionEquipoAnterior !== "-"){
            //Rellenamos el desplegable de equipos de la competición donde se encontraba el equipo anterior de jugador
            getEquipos(equiposCompeticionEquipoAnteriorRef, idCompeticionEquipoAnterior);
        }
    }, [idCompeticionEquipoAnterior]);


    useEffect( () => {

        async function getJugadoresDeUnEquipo() {        

            let parametros = new FormData();
            parametros.append("id_equipo", idEquipoAnterior);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getJugadoresDeUnEquipo.php", {
                method: 'POST',
                body: parametros
            });

            if (response.ok) {

                let respuesta = await response.json();
                if (!respuesta.error && !respuesta.datos.length >= 0) {
                    
                    desplegableJugadoresRef.current.innerHTML = " ";
                    let optionVacio = createOptionElement("-","-");
                    optionVacio.select = true;
                    desplegableJugadoresRef.current.appendChild(optionVacio);

                    //Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                    for (let jugador of respuesta.datos){
                        let option = createOptionElement(jugador.dni_jugador, jugador.nombre_completo);
                        desplegableJugadoresRef.current.appendChild(option);
                    }
                }
            }
        }//Fin de la función

        if (idEquipoAnterior !== "-"){
            getJugadoresDeUnEquipo();
        }
    }, [idEquipoAnterior]);

    useEffect( () => {

        if (idCompeticionEquipoNuevo !== "-"){
            getEquipos(equiposCompeticionEquipoNuevoRef, idCompeticionEquipoNuevo);
        }
    }, [idCompeticionEquipoNuevo]);

    const updateEquipoDelJugador = ( async (event) => {

        event.preventDefault();
        console.log(idCompeticionEquipoAnterior, idEquipoAnterior, dniJugador, idCompeticionEquipoNuevo, idEquipoNuevo, fechaTraspaso)
        if (idEquipoAnterior === idEquipoNuevo){
            alert("El equipo anterior y el nuevo equipo no pueden ser el mismo.");

        }else if (idCompeticionEquipoAnterior === "-" || idEquipoAnterior === "-" || dniJugador === "-" 
            || idCompeticionEquipoNuevo === "-" || idEquipoNuevo === "-" || fechaTraspaso === ""){
            alert("Por favor, rellena todos los campos.");
        }else{

            let parametros = new FormData();
            parametros.append("dni_jugador", dniJugador);
            parametros.append("id_equipo_antiguo", idEquipoAnterior);
            parametros.append("id_equipo_nuevo", idEquipoNuevo);
            parametros.append("fecha", fechaTraspaso);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarMovimiento.php",{
                method : 'POST',
                body : parametros        
            });

            if (response.ok){

                let respuesta = await response.json();
                if (!respuesta.error){

                    alert(respuesta.datos);
                    frmRegistrarMovimiento.current.reset();
                }
            }
        }
    });

    return(
        <form ref={frmRegistrarMovimiento}>
            <h3 className="text-center mt-1">Datos del movimiento</h3>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Liga del equipo anterior</label>             
                <select className="form-control shadow-none" ref={competicionesEquipoAnteriorRef} onChange={(event ) => setIdCompeticionEquipoAnterior(event.target.value)} required>

                </select>
            </div>           
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Equipo anterior</label>   
                <select className="form-control shadow-none" ref={equiposCompeticionEquipoAnteriorRef} onChange={(event) => setIdEquipoAnterior(event.target.value)} required>

                </select>
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Jugador traspasado</label>   
                <select className="form-control shadow-none" ref={desplegableJugadoresRef} onChange={(event) => setDniJugador(event.target.value)} required>

                </select>
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Liga del nuevo equipo</label>   
                <select className="form-control shadow-none" ref={competicionesEquipoNuevoRef} onChange={(event) => setIdCompeticionEquipoNuevo(event.target.value)} required>

                </select>
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Equipo nuevo</label>   
                <select className="form-control shadow-none" ref={equiposCompeticionEquipoNuevoRef} onChange={(event) => setIdEquipoNuevo(event.target.value)} required>

                </select>
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Fecha del traspaso </label>
                <input type="date" className="form-control shadow-none" onChange={(event) => setFechaTraspaso(event.target.value)} required />
            </div>
            <div className="my-2 row mx-0">
                <button className="btn1 col-3 p-2" onClick={updateEquipoDelJugador}>ACEPTAR</button>
            </div>
        </form>
    );
}

