import { useState, useRef, useEffect } from "react";
import NavBar from "./NavBar";
import './css/styles.css';

function Evento({ info }) {

    const [eventoAceptado, setEventoAceptado] = useState(false);
    const [tipoEvento, setTipoEvento] = useState('');
    const [nombreJugador, setNombreJugador] = useState('');

    function handleNombreJugador(event) {
        setNombreJugador(event.target.value);
    }

    function handleTipoEvento(event) {
        setTipoEvento(event.target.value);
    }

    return (
        <div className="my-2 row mx-0 p-0" id={info[1]}>
            <div className="container-fluid">

                <div className="row p-0">
                    <div className="col-5"><label htmlFor="txtNombreJugador" className="form-label my-auto text-start">Jugador</label></div>
                    <div className="col-5"><label htmlFor="txtTipoEvento" className="form-label my-auto ms-lg-3">Evento</label></div>
                </div>

                {eventoAceptado === false &&
                    <div className="row mt-2 p-0">
                        <div className="col-5 p-0 m-auto"><input type="text" className="form-control shadow-none" onChange={handleNombreJugador} id="txtNombreJugador" name="txtNombreJugador" required /> </div>
                        <div className="p-0 m-auto col-4">
                            <select className="form-select shadow-none" onChange={handleTipoEvento} id="txtPosicion" name="txtPosicion" required>
                                <option value="-" selected>-</option>
                                <option value="gol">Gol</option>
                                <option value="asistencia">Asistencia</option>
                                <option value="tarjetaAmarilla">Tarjeta amarilla</option>
                                <option value="tarjetaRoja">Tarjeta roja</option>
                            </select>
                        </div>
                        <div className="col-2 m-auto bg-dark">
                            <div className=" container-fluid p-0">
                                <div className="row p-0">
                                    <button className="p-1 col-6" onClick={() => setEventoAceptado(true)}><i className="fa-solid fa-circle-check fs-3"></i></button>
                                    <button className="p-1 col-6" onClick={info[0]}><i className="fa-sharp fa-solid fa-circle-xmark fs-3"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {eventoAceptado === true &&
                    <div className="row p-0">
                        <div className="col-5">{nombreJugador}</div>
                        <div className="col-5">{tipoEvento}</div>
                        <div className="col-2">Guardado</div>
                    </div>
                }

            </div>
        </div>

    );
}


export default function RegistrarPartido() {

    //Estados
    const [numEventos, setNumEventos] = useState(0);

    async function rellenarDesplegableEquipos() {

        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");

        if (response.ok) {

            let listadoEquiposLocal = document.getElementById('txtEquipoLocal');
            listadoEquiposLocal.innerHTML = "";
            let listadoEquiposVisitante = document.getElementById('txtEquipoVisitante');
            listadoEquiposVisitante.innerHTML = "";

            let respuesta = await response.json();

            //Creamos el primer option de cada select, el cual estará vacío.
            let optionLocal = document.createElement("option");
            optionLocal.value = "-";
            optionLocal.textContent = "-";

            let optionVisitante = document.createElement("option");
            optionVisitante.value = "-";
            optionVisitante.textContent = "-";

            // Anidamos los elementos option a los dos select.
            listadoEquiposLocal.appendChild(optionLocal);
            listadoEquiposVisitante.appendChild(optionVisitante);
            for (let equipo of respuesta.datos) {
                // Creamos un elemento de tipo option por cada equipo.
                let optionLocal = document.createElement("option");
                optionLocal.value = equipo.id_equipo;
                optionLocal.textContent = equipo.nombre;

                let optionVisitante = document.createElement("option");
                optionVisitante.value = equipo.id_equipo;
                optionVisitante.textContent = equipo.nombre;

                // Anidamos los elementos option a los dos select.
                listadoEquiposLocal.appendChild(optionLocal);
                listadoEquiposVisitante.appendChild(optionVisitante);
            }
        }
    }

    async function getJugadoresDeUnEquipo(nombreEquipo){

        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getJugadoresDeUnEquipo.php");

        if (response.ok){

            let respuesta = await response.json();
            if (!respuesta.datos.length === 0){
                alert("El equipo " + nombreEquipo + " no tiene jugadores.")
            }else if(!respuesta.datos.length >= 0 && !respuesta.error){
                alert("Se ha recuperado correctamente los jugadores de un equipo.");
            }
        }
    }

    // async function rellenarDesplegableJugadores(){

    //     let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");

    // }

    async function handleCambioEquipo(){

    }

    //Cada vez que se pulse en añadir un nuevo evento, se creará y añadirá un nuevo
    // componente evento. Le pasamos el array con todos lo métodos que deberán llamarse
    //cuando se produzcan los diferentes eventos del componente.
    const eventos = [];
    
    for (let i = 0; i < numEventos; i++) {
        const numEvento = "evento" + i
        const info = [eliminarEvento, numEvento];
        eventos.push(<Evento key={i} info={info} />);
    }

    //Cuando se pulse el botón de añadir evento, se actualizará la variable que 
    //los cuenta y se renderizará un nuevo componente.
    function incNumEventos() {
        setNumEventos(numEventos + 1);
    }

    //Decrementamos el contador de eventos y eliminamos el último evento del array.
    function eliminarEvento() {
        setNumEventos(numEventos - 1);
    }

    //UseEffect que se ejecutará la primera vez que se renderice el componente.
    useEffect(() => {

        rellenarDesplegableEquipos();
    }, [])

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto p-0" name="frmRegistrarEquipo">

                <h3 className="text-center">Información del partido</h3>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtCompeticion" className="form-label my-auto">Competición</label>
                    <input type="text" className="form-control shadow-none" id="txtCompeticion" name="txtCompeticion" required />
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtEquipoLocal" className="form-label">Equipo local</label>
                    <select className="form-control shadow-none" id="txtEquipoLocal" onChange={handleCambioEquipo} name="txtEquipoLocal" required >

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtEquipoVisitante" className="form-label">Equipo visitante</label>
                    <select className="form-control shadow-none" id="txtEquipoVisitante" name="txtEquipoVisitante" required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtFechaPartido" className="form-label">Fecha del partido</label>
                    <input type="date" className="form-control shadow-none" id="txtFechaPartido" name="txtFechaPartido" min={0} required />
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtResultado" className="form-label">Resultado del partido</label>
                    <input type="text" className="form-control shadow-none" id="txtResultado" name="txtResultado" pattern="^\d{1,2}-\d{1,2}$" placeholder="Ej: 1-0" title="hola" required />
                    {/* Caracteres del patron: ^ indica el comienzo de la cadena, \d{1,2} indica que se permiten de 1 a 2 dígitos, - indica el carácter - literal, $ indica el final de la cadena. */}
                </div>
                {eventos}

                <div className="my-2 row mx-0">
                    <input type="submit" className="btn btn-primary col-3" value={"ENVIAR"} />
                    <div className="col"></div>
                    <input type="button" className="btn btn-primary col-3" value={"EVENTO"} onClick={incNumEventos} />
                </div>

            </form>
        </>
    );
}