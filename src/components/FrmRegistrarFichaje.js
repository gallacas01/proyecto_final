import React, { useEffect, useRef } from "react";
import { useState } from "react";
import MyModal from "./Modal";

function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function RegistrarFichaje() {

    //Variables de estado
    const [idCompeticionEquipoAnterior, setIdCompeticionEquipoAnterior] = useState('-');
    const [idEquipoAnterior, setIdEquipoAnterior] = useState('-');
    const [dniJugador, setDniJugador] = useState('-');
    const [idCompeticionEquipoNuevo, setIdCompeticionEquipoNuevo] = useState('-');
    const [idEquipoNuevo, setIdEquipoNuevo] = useState('-');
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    //Referencias al DOM del componente
    const equiposDeLaCompeticionDelEquipoAnteriorRef = useRef(null);
    const competicionesEquipoAnteriorRef = useRef(null);
    const desplegableJugadoresRef = useRef(null);
    const competicionesEquipoNuevoRef = useRef(null);
    const equiposDeLaCompeticionDelEquipoNuevoRef = useRef(null);
    const frmRegistrarMovimiento = useRef(null);

    const rellenarDesplegableCompeticiones = (async (desplegable) => {

        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getCompeticiones.php");
        if (response.ok) {

            let respuesta = await response.json();
            if (!respuesta.error && respuesta.datos.length > 0) {

                //Recuperamos el desplegable de competiciones y añadimos el primer elemento, cuyo valor será '-'.
                desplegable.current.innerHTML = " ";
                let optionVacio = createOptionElement("-", "-");
                desplegable.current.appendChild(optionVacio);

                //Recorremos el array de competiciones anyadiendo cada una al desplegable de competiciones.
                for (let competicion of respuesta.datos) {
                    let option = createOptionElement(competicion.id_competicion, competicion.nombre + ", Temp " + competicion.temporada);
                    desplegable.current.appendChild(option);
                }
            }
        }
    });

    async function rellenarDesplegableEquipos(idCompeticion, desplegableEquiposRef) {

        let parametros = new FormData();
        parametros.append("id_competicion", idCompeticion);
        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquiposDeUnaCompeticion.php",
            {
                method: 'POST',
                body: parametros
            });

        if (response.ok) {

            let respuesta = await response.json();
            if (!respuesta.error && respuesta.datos.length > 0) {

                desplegableEquiposRef.current.innerHTML = " ";
                let optionVacio = createOptionElement("-", "-");
                desplegableEquiposRef.current.appendChild(optionVacio);

                //Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                for (let equipo of respuesta.datos) {
                    let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                    desplegableEquiposRef.current.appendChild(option);
                }
                
            }
        }
    }

    useEffect(() => {

        rellenarDesplegableCompeticiones(competicionesEquipoAnteriorRef);
        rellenarDesplegableCompeticiones(competicionesEquipoNuevoRef);
    }, []);

    const handleChangeCompeticionDelEquipoAnterior = ( (event) => {

        let idCompeticion = event.target.value;
        setIdCompeticionEquipoAnterior(idCompeticion);
        if (idCompeticion !== "-"){
            rellenarDesplegableEquipos(idCompeticion, equiposDeLaCompeticionDelEquipoAnteriorRef);
        }
    });

    useEffect(() => {

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
                    let optionVacio = createOptionElement("-", "-");
                    optionVacio.select = true;
                    desplegableJugadoresRef.current.appendChild(optionVacio);

                    //Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                    for (let jugador of respuesta.datos) {
                        let option = createOptionElement(jugador.dni_jugador, jugador.nombre_completo);
                        desplegableJugadoresRef.current.appendChild(option);
                    }
                }
            }
        }//Fin de la función

        if (idEquipoAnterior !== "-") {
            getJugadoresDeUnEquipo();
        }
    }, [idEquipoAnterior]);

    const handleChangeCompeticionDelEquipoNuevo = ( (event) => {

        let idCompeticion = event.target.value;
        setIdCompeticionEquipoNuevo(idCompeticion);
        if (idCompeticion !== "-"){
            rellenarDesplegableEquipos(idCompeticion, equiposDeLaCompeticionDelEquipoNuevoRef);
        }
    });

    const updateEquipoDelJugador = (async (event) => {

        console.log(idCompeticionEquipoAnterior + " ", idEquipoAnterior + " ", dniJugador + " ", idCompeticionEquipoNuevo + " ",idEquipoNuevo + " ", )
        event.preventDefault();
        if (idCompeticionEquipoAnterior === "-" || idEquipoAnterior === "-" || dniJugador === "-"
            || idCompeticionEquipoNuevo === "-" || idEquipoNuevo === "-") {
            setModalError(true);
            setTextoModal('Por favor, rellena todos los campos.');
            setShowModal(true);
        } else if (idEquipoAnterior === idEquipoNuevo) {
            setModalError(true);
            setTextoModal("El equipo anterior y el nuevo equipo no pueden ser el mismo.");
            setShowModal(true);
        } else {

            let parametros = new FormData();
            parametros.append("dni_jugador", dniJugador);
            parametros.append("id_equipo_antiguo", idEquipoAnterior);
            parametros.append("id_equipo_nuevo", idEquipoNuevo);
            // parametros.append("fecha", fechaTraspaso);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarMovimiento.php", {
                method: 'POST',
                body: parametros
            });

            if (response.ok) {

                let respuesta = await response.json();
                if (!respuesta.error) {

                    setModalError(false);
                    setTextoModal(respuesta.datos);
                    setShowModal(true);
                    frmRegistrarMovimiento.current.reset();

                }
            }
        }
    });

    return (
        <>
            <form className="mb-3" ref={frmRegistrarMovimiento}>
                <h2 className="text-center mt-1 fs-2">Datos del fichaje</h2>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Competición del equipo anterior</label>
                    <select className="form-control shadow-none" ref={competicionesEquipoAnteriorRef} onChange={(event) => handleChangeCompeticionDelEquipoAnterior(event)} required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Equipo anterior</label>
                    <select className="form-control shadow-none" ref={equiposDeLaCompeticionDelEquipoAnteriorRef} onChange={(event) => setIdEquipoAnterior(event.target.value)} required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Jugador traspasado</label>
                    <select className="form-control shadow-none" ref={desplegableJugadoresRef} onChange={(event) => setDniJugador(event.target.value)} required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Competición del nuevo equipo</label>
                    <select className="form-control shadow-none" ref={competicionesEquipoNuevoRef} onChange={(event) => handleChangeCompeticionDelEquipoNuevo(event)} required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Equipo nuevo</label>
                    <select className="form-control shadow-none" ref={equiposDeLaCompeticionDelEquipoNuevoRef} onChange={(event) => setIdEquipoNuevo(event.target.value)} required>

                    </select>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                        <button className="btn1 text-truncate p-1 w-100 p-lg-2" onClick={updateEquipoDelJugador}>ACEPTAR </button>
                    </div>
                </div>
                <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />
            </form>
        </>

    );
}

