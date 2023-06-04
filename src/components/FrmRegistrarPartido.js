import { useState, useEffect, useRef } from "react";
import MyModal from "./Modal";
import { SettingsPhoneSharp } from "@mui/icons-material";

//Método que crea un elemento de tipo option cuyo valor y textContent se pasan por parámetro.
function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

function Evento({ info }) {
    const [eventoAceptado, setEventoAceptado] = useState(false);
    const [tipoEvento, setTipoEvento] = useState('');
    const [nombreJugador, setNombreJugador] = useState('');
    const [idJugador, setIdJugador] = useState(false);
    const desplegableJugadoresRef = useRef('');
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    function handleNombreJugador(event) {
        //El value del option del campo select tiene la siguiente estructura: nombre-id
        let nombre = event.target.value.split("-")[0];
        setNombreJugador(nombre);

        let id = event.target.value.split("-")[1];
        setIdJugador(id);
    }

    function handleTipoEvento(event) {
        //Recuperamos el textContent de la etiqueta option del select que contiene los tipos de eventos.
        let optionSeleccionado = event.target.options[event.target.selectedIndex];
        let tipoEvento = optionSeleccionado.text;
        setTipoEvento(tipoEvento);
    }

    function handleEventoAceptado(event) {

        event.preventDefault();
        if (nombreJugador === "" || tipoEvento === "") {

            if (nombreJugador === "" && tipoEvento === "") {
                setTextoModal("Selecciona un jugador y un evento.");
            } else if (nombreJugador === "") {
                event.preventDefault();
                setTextoModal("Selecciona un jugador.");
            } else if (tipoEvento === "") {
                event.preventDefault();
                setTextoModal("Selecciona un evento para el jugador.");
            }
            setModalError(true);
            setShowModal(true);
        } else {
            setEventoAceptado(true);
            //Añadimos al array de datos de evento del componente paddre los datos de s
            const datosEvento = { "idJugador": idJugador, "tipo": tipoEvento };
            info.infoEventos.push(datosEvento);
        }
    }

    async function rellenarDesplegableJugadores() {


        desplegableJugadoresRef.current.innerHTML = "";
        //Anidamos a nuestro select una primera opción, que tendrá el valor '-'
        desplegableJugadoresRef.current.appendChild(createOptionElement("-", "-"));

        for (let jugador of info.jugadores) {
            //Creamos un elemento de tipo option por cada jugador y lo anidamos al select.
            let idJugador = jugador.id_jugador;
            let nombreJugador = jugador.nombre_completo;
            let option = createOptionElement((nombreJugador + "-" + idJugador), nombreJugador);
            desplegableJugadoresRef.current.appendChild(option);
        }
    }

    //useEffect que se ejecutará cuando se produzca un cambio en algunos de los equipos seleccionados.
    useEffect(() => {

        rellenarDesplegableJugadores();
    }, [info.jugadores]); //Si se produce un cambio en la variable info.jugadores que pasa del componente padre al hijo, se ejecuta el useState.

    return (
        <div className="my-2 row mx-0" id={info.numEvento}>
            <div className="container-fluid">

                {eventoAceptado === false &&
                    <div className="row">
                        <div className="col-7 col-md-5 m-auto p-1">
                            <select className="form-select shadow-none" onChange={handleNombreJugador} ref={desplegableJugadoresRef} required>

                            </select>
                        </div>
                        <div className="col-5 col-md-4 m-auto p-1">
                            <select className="form-select shadow-none" onChange={handleTipoEvento} defaultValue="-" required>
                                <option value="-">-</option>
                                <option value="Gol">Gol</option>
                                <option value="asistencia">Asistencia</option>
                                <option value="tarjetaAmarilla">Tarjeta amarilla</option>
                                <option value="tarjetaRoja">Tarjeta roja</option>
                            </select>
                        </div>
                        <div className="col-6 col-md ms-auto m-sm-0 col-sm p-1"> 
                            <button className="btnAceptarEvento w-100" onClick={(event) => handleEventoAceptado(event)}><i className="fa-solid fa-circle-check fs-3"></i></button> 
                        </div>
                        <div className="col-6 col-md me-auto m-sm-0 col-sm p-1"> 
                            <button className="btnEliminarEvento w-100" onClick={info.eliminarEvento}><i className="fa-sharp fa-solid fa-circle-xmark fs-3"></i></button>
                        </div>
                    </div>
                }
                {eventoAceptado === true &&

                    <div className="row">
                        <div className="col-8 col-sm-9 p-1 rounded-2 fs-5" id="infoEvento">
                             {nombreJugador}
                           </div>
                        <div className="col">

                        </div>
                        <div className="col-2 p-1 rounded-2 fs-5" id="infoEvento">
                            {tipoEvento}
                        </div>
                    </div>
                }
            </div>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />
        </div>

    );
}


export default function FrmRegistrarPartido() {

    //Variables de estado.
    const [eventos, setEventos] = useState([]);
    const [infoEventos, setInfoEventos] = useState([]);
    const [jugadoresEquipoLocal, setJugadoresEquipoLocal] = useState([]);
    const [jugadoresEquipoVisitante, setJugadoresEquipoVisitante] = useState([]);
    const [jugadores, setJugadores] = useState([]);
    const [estadioEquipoLocal, setEstadioEquipoLocal] = useState('');
    const [idEquipoLocal, setIdEquipoLocal] = useState('');
    const [idEquipoVisitante, setIdEquipoVisitante] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    // const [idPartidoActual, setIdPartidoActual] = useState('');

    //Referencias al DOM
    const formRef = useRef(null);
    const desplegableCompeticionesRef = useRef(null);
    const desplegableEquipoLocalRef = useRef(null);
    const desplegableEquipoVisitanteRef = useRef(null);
    const fechaPartidoRef = useRef(null);
    const golesEquipoLocalRef = useRef(null);
    const golesEquipoVisitanteRef = useRef(null);
    const encabezadoEventosRef = useRef(null);

    async function getJugadoresDeUnEquipo(idEquipo) {

        if (idEquipo !== "-") {

            let parametros = new FormData();
            parametros.append("id_equipo", idEquipo);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getJugadoresDeUnEquipo.php", {
                method: 'POST',
                body: parametros
            });

            if (response.ok) {

                let respuesta = await response.json();
                if (respuesta.datos.length === 0) {
                } else if (!respuesta.datos.length >= 0 && !respuesta.error) {
                    return respuesta.datos;
                }
            }
        }
    }//Fin de la función

    async function getEstadioDeUnEquipo(idEquipo) {

        let parametros = new FormData();
        parametros.append('id_equipo', idEquipo);
        //Obtenemos el estadio
        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEstadioDeUnEquipo.php", {
            method: 'POST',
            body: parametros
        });

        if (response.ok) {

            let respuesta = await response.json();
            if (!respuesta.error) {

                let estadio = respuesta.datos.estadio;
                return estadio;
            }
        }
    }//Fin del método.

    async function handleChangeEquipoLocal(idEquipo) {

        if (idEquipo !== "-") {

            setIdEquipoLocal(idEquipo);
            //Obtenemos los jugadores
            let jugadoresLocales = await getJugadoresDeUnEquipo(idEquipo);
            setJugadoresEquipoLocal(jugadoresLocales);

            let estadio = await getEstadioDeUnEquipo(idEquipo);
            // console.log(estadio);
            setEstadioEquipoLocal(estadio);
        }
    }//Fin de la función.

    async function handleChangeEquipoVisitante(idEquipo) {

        if (idEquipo !== "-") {

            setIdEquipoVisitante(idEquipo);
            //Obtenemos los jugadores.
            let jugadoresVisitantes = await getJugadoresDeUnEquipo(idEquipo);
            setJugadoresEquipoVisitante(jugadoresVisitantes);
            // console.log("Jugadores visitantes actualizados.");
        }
    }//Fin de la función.

    //Cuando se pulse el botón de añadir evento, se actualizará la variable que 
    //los cuenta y se renderizará un nuevo componente.
    const incNumEventos = ((event) => {

        event.preventDefault();
        //Pasamos a cada componente evento el método que elimina el evento del componente principal,
        //el método que maneja el cambio de equipo, y los jugadores de los equipos seleccionados.
        const info = { eliminarEvento, jugadores, infoEventos };
        setEventos([...eventos, <Evento key={eventos.length} info={info} />]);
    });

    //Decrementamos el contador de eventos y eliminamos el último evento del array.
    const eliminarEvento = ((event) => {

        event.preventDefault();
        //Creamos una copia del array de eventos y eliminamos la última posición del array.
        setEventos((eventosAnteriores) => {
            const eventosActualizados = [...eventosAnteriores];
            eventosActualizados.pop();
            return eventosActualizados;
        });
    });

    //Encargado de mostrar u ocultar el título según el número de eventos.
    useEffect(() => {

        // console.log("El número de eventos es ", eventos.length);
        let encabezadoEventos = encabezadoEventosRef.current;
        if (eventos.length === 0) {
            encabezadoEventos.classList.add('d-none');
        } else if (eventos.length === 1) {
            encabezadoEventos.classList.remove('d-none');
        }
    }, [eventos]);

    //useEffect que rellena el desplegable de competiciones y equipos.
    useEffect(() => {

        async function rellenarDesplegableCompeticiones() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getCompeticiones.php");
            if (response.ok) {

                let respuesta = await response.json();
                desplegableCompeticionesRef.current.innerHTML = " ";
                let primerOption = createOptionElement("-", "-");
                desplegableCompeticionesRef.current.appendChild(primerOption);

                for (let competicion of respuesta.datos) {
                    let option = createOptionElement(competicion.id_competicion, competicion.nombre);
                    desplegableCompeticionesRef.current.appendChild(option);
                }
            }
        }//Fin de la función.

        //Función que rellena los dos campos select con los nombres de los equipos.
        async function rellenarDesplegableEquipos() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");
            if (response.ok) {

                let respuesta = await response.json();

                desplegableEquipoLocalRef.current.innerHTML = " ";
                desplegableEquipoVisitanteRef.current.innerHTML = " ";

                //Creamos el primer option de cada select, el cual estará vacío.
                let optionSinValor1 = createOptionElement("-", "-");
                let optionSinValor2 = createOptionElement("-", "-");

                // Anidamos los elementos option a los dos select.
                desplegableEquipoLocalRef.current.appendChild(optionSinValor1);
                desplegableEquipoVisitanteRef.current.appendChild(optionSinValor2);

                for (let equipo of respuesta.datos) {
                    // Creamos un elemento de tipo option por cada equipo.
                    let optionLocal = createOptionElement(equipo.id_equipo, equipo.nombre);
                    let optionVisitante = createOptionElement(equipo.id_equipo, equipo.nombre);

                    desplegableEquipoLocalRef.current.appendChild(optionLocal);
                    desplegableEquipoVisitanteRef.current.appendChild(optionVisitante);
                }
            }
        }//Fin de la función.

        rellenarDesplegableCompeticiones();
        rellenarDesplegableEquipos();
    }, []);

    //UseEffect que hará que se renderice el componente sólo cuando cuando se produzca un cambio en alguna
    //de las dos variables.
    useEffect(() => {

        function actualizarJugadoresDeAmbosEquipos() {

            //El ...descompone el array en cada uno de sus elementos individuales.  De esta forma se añade cada elemento individual del array y no todo el array en sí
            if (jugadoresEquipoLocal.length > 0 && jugadoresEquipoVisitante.length > 0) {
                setJugadores([...jugadoresEquipoLocal, ...jugadoresEquipoVisitante]);
            }
        }//Fin de la función.

        actualizarJugadoresDeAmbosEquipos();
    }, [jugadoresEquipoLocal, jugadoresEquipoVisitante]);

    async function getUltimoIdPartido() {

        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getUltimoIdDePartido.php");
        if (response.ok) {

            let respuesta = await response.json();
            if (!respuesta.error) {
                return respuesta.datos.id_partido;
            }
        }
    }

    async function registrarEventos() {

        let idPartido = await getUltimoIdPartido();
        for (let evento of infoEventos) {

            console.log("DATOS DEL EVENTO: ", evento);
            let parametros = new FormData();
            parametros.append("id_partido", idPartido);
            parametros.append("id_jugador", evento.idJugador);
            parametros.append("tipo", evento.tipo);

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarEvento.php", {
                method: 'POST',
                body: parametros
            });

            if (response.ok) {

                let respuesta = await response.json();
                if (!respuesta.error) {
                    console.log(respuesta.datos);
                } else {
                    setTextoModal(respuesta.datos);
                    setModalError(true);
                    setShowModal(true);
                }
            }
        }
    }

    const registrarPartido = (async (event) => {

        event.preventDefault();
        console.log("INFORMACIÓN DE LOS EVENTOS: ", infoEventos);
        let idCompeticion = desplegableCompeticionesRef.current.value;
        let fecha = fechaPartidoRef.current.value;
        let golesEquipoLocal = golesEquipoLocalRef.current.value;
        let golesEquipoVisitante = golesEquipoVisitanteRef.current.value;

        if (idCompeticion !== "-" && idEquipoLocal !== "-" && idEquipoVisitante !== "-" && fecha !== "-"
            && golesEquipoLocal !== "-" && golesEquipoVisitante !== "-") {

            if (idEquipoLocal === idEquipoVisitante) {
                setModalError(true);
                setTextoModal("El equipo local y el visitante no pueden ser el mismo.");
                setShowModal(true);
            } else {

                let parametros = new FormData();
                parametros.append("id_equipo_local", idEquipoLocal);
                parametros.append("id_equipo_visitante", idEquipoVisitante);
                parametros.append("id_competicion", idCompeticion);
                parametros.append("estadio", estadioEquipoLocal);
                parametros.append("goles_equipo_local", golesEquipoLocal);
                parametros.append("goles_equipo_visitante", golesEquipoVisitante);
                parametros.append("fecha", fecha);

                let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarPartido.php", {
                    method: 'POST',
                    body: parametros
                });

                if (response.ok) {

                    let respuesta = await response.json();
                    if (!respuesta.error) {
                        //Si el partido se ha guardado correctamente, guardamos los eventos en la bbd.
                        registrarEventos();
                        setEventos([]);
                        setInfoEventos([]);
                        setTextoModal("El partido ha sido registrado correctamente.");
                        setModalError(false);
                        SettingsPhoneSharp(true);
                        formRef.current.reset();
                    }
                }
            }
        } else {
            setModalError(true);
            setTextoModal("Por favor, rellena todos los campos del formulario.");
            setShowModal(true);
        }

    });//Fin de la función.

    return (
        <>
            <form className="mx-auto p-0" ref={formRef}>
                <h2 className="text-center mt-1 fs-2">Datos del partido</h2>
                <div className="my-2 row mx-0">
                    <label className="form-label">Competición</label>
                    <select className="form-select shadow-none" ref={desplegableCompeticionesRef} id="txtCompeticion" name="txtCompeticion" required >

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label">Equipo local</label>
                    <select className="form-select shadow-none" ref={desplegableEquipoLocalRef} onChange={(event) => handleChangeEquipoLocal(event.target.value)} required >

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label">Equipo visitante</label>
                    <select className="form-control shadow-none" ref={desplegableEquipoVisitanteRef} onChange={(event) => handleChangeEquipoVisitante(event.target.value)} required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label">Fecha del partido</label>
                    <input type="date" className="form-control shadow-none" ref={fechaPartidoRef} min={0} required />
                </div>
                <div className="my-2 row mx-auto">
                    <div className="col-11 col-sm-3 mx-auto text-sm-center p-0 mb-2 mb-sm-0"><p className="form-label my-auto">Resultado del partido</p> </div>
                    <div className="col-5 col-sm-3 mx-auto p-0 my-auto">
                        <input type="number" className="form-control shadow-none" ref={golesEquipoLocalRef} min={0} max={999} minLength={0} maxLength={3} required />
                    </div>
                    <div className="col-1 col-sm-2 mx-auto text-center my-auto">
                        <span className="w-100">-</span>
                    </div>
                    <div className="col-5 col-sm-3 mx-auto p-0 my-auto">
                        <input type="number" className="form-control shadow-none" ref={golesEquipoVisitanteRef} min={0} minLength={0} maxLength={3} required />
                    </div>
                </div>
                <div className="my-2 row mx-auto">
                    <div className="col-12 mx-auto p-0">
                        <label className="form-label ms-2 text-center">Estadio del partido : {estadioEquipoLocal}</label>
                    </div>
                </div>


                <div className="row mx-auto">
                    <div className="col-12 p-0">
                        <h2 className="text-center d-none rounded-2 p-1" ref={encabezadoEventosRef} id="encabezadoEventos">EVENTOS DEL PARTIDO</h2>
                    </div>

                    {eventos.map((evento, i) =>
                        <div className="col-12" key={i}>{evento}</div>
                    )}

                </div>

                <div className="my-2 row mx-0">
                    <div className="col-5 mx-auto col-sm-4 col-md-3 col-lg-3 p-0">
                        <button className="btn1 text-truncate p-1 p-sm-1 w-100 p-lg-2" onClick={registrarPartido}>ACEPTAR </button>
                    </div>
                    <div className="col"></div>
                    <div className="col-5 col-sm-4 col-md-3 col-lg-3 p-0">
                        <button className="btn1 text-truncate p-1 p-sm-1 w-100 p-lg-2" onClick={(event) => incNumEventos(event)}>EVENTO <i className="fa-solid fa-flag ms-lg-1"></i></button>
                    </div>
                </div>
            </form>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />
        </>

    );
}