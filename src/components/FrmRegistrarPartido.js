import { useState, useEffect, useRef } from "react";
import MyModal from "./Modal";
import Select from 'react-select';
import tarjeta_amarilla_sin_mano from '../img/yellow_card_wo_hand.png';
import tarjeta_roja_sin_mano from '../img/red_card_wo_hand.png';

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
    const [jugadores, setJugadores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    const styleSelect = {
        control: (provided, state) => ({
            ...provided,
            border: state.isFocused ? '2px solid #182E3E' : '1px solid #182E3E',
            '&:hover': {
                border: '2px solid #182E3E',
            },
        }),
    };

    function handleTipoEvento(event) {
        //Recuperamos el textContent de la etiqueta option del select que contiene los tipos de eventos.
        let optionSeleccionado = event.target.options[event.target.selectedIndex];
        let tipoEvento = optionSeleccionado.text;
        setTipoEvento(tipoEvento);
        console.log("TIpo de evento");
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
            console.log("DATOS DEL NUEVO EVENTO: ", datosEvento);
        }
    }

    ///Cuuando se produzca un cambio en algunos de los equipos seleccionados, actualizamos la variable de estado de los jugadores.
    useEffect(() => {

        //Creamos le JSON con la información del jugador para rellenar el desplegable de jugadores.
        let allPlayers = info.jugadores.map((jugador, i) =>
            ({ value: jugador.id_jugador, label: jugador.nombre_completo })
        );
        setJugadores(allPlayers);
    }, [info.jugadores]); //Si se produce un cambio en la variable info.jugadores que pasa del componente padre al hijo, se ejecuta el useEffect.

    return (
        <div className="my-2 row mx-0" id={info.numEvento}>
            <div className="container-fluid">

                {eventoAceptado === false &&
                    <div className="row">
                        <div className="col-7 col-md-5 m-auto p-1">
                            <Select
                                className="shadow-none fs-6 m-0 p-0"
                                options={jugadores} styles={styleSelect}
                                onChange={(selectedOption) => {setIdJugador(selectedOption.value); setNombreJugador(selectedOption.label)}}
                                isSearchable={true}
                                placeholder="Buscar" 
                            />
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
                        <div className="col-8 col-sm-8 p-1 rounded-2 fs-5" id="infoEvento">
                             {nombreJugador}
                           </div>
                        <div className="col">

                        </div>
                        <div className="col-3 p-1 rounded-2 fs-5 text-center" id="infoEvento">
                            {tipoEvento === "Tarjeta amarilla" &&
                                <img src={tarjeta_amarilla_sin_mano} width={'25pxx'} height={'35px'} alt="tarjeta_amarilla" />
                            }
                            {tipoEvento === "Tarjeta roja" &&
                                <img src={tarjeta_roja_sin_mano}  width={'25px'} height={'35px'} alt="tarjeta_roja" />
                            }
                            {tipoEvento !== "Tarjeta roja" && tipoEvento !== "Tarjeta amarilla" &&
                                tipoEvento
                            }
                               
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
    const [idEquipoLocal, setIdEquipoLocal] = useState('-');
    const [idEquipoVisitante, setIdEquipoVisitante] = useState('-');
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    //Referencias al DOM
    const formRef = useRef(null);
    const desplegableCompeticionesRef = useRef(null);
    const desplegableEquipoLocalRef = useRef(null);
    const desplegableEquipoVisitanteRef = useRef(null);
    const fechaPartidoRef = useRef(null);
    const golesEquipoLocalRef = useRef(null);
    const golesEquipoVisitanteRef = useRef(null);
    const encabezadoEventosRef = useRef(null);

         //Función que rellena los dos campos select con los nombres de los equipos.
         async function rellenarDesplegableEquipos(idCompeticion) {

            let parametros = new FormData();
            parametros.append("id_competicion", idCompeticion);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquiposDeUnaCompeticion.php",{
                body : parametros,
                method : 'POST'
            });

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

    const handleChangeCompeticion = ( async (idCompeticion) => {

        if (idCompeticion !== "-"){
            rellenarDesplegableEquipos(idCompeticion);
        }else if (idCompeticion === "-"){
            desplegableEquipoLocalRef.current.innerHTML = "";
            desplegableEquipoVisitanteRef.current.innerHTML = "";
        }
    });

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
            //Obtenemos los jugadores y el estadio del equipo local.
            let jugadoresLocales = await getJugadoresDeUnEquipo(idEquipo);
            console.log("Jugadores locales", jugadoresLocales);
            setJugadoresEquipoLocal(jugadoresLocales);
            
            let estadio = await getEstadioDeUnEquipo(idEquipo);
            setEstadioEquipoLocal(estadio);
        }
    }//Fin de la función.

    async function handleChangeEquipoVisitante(idEquipo) {

        if (idEquipo !== "-") {

            setIdEquipoVisitante(idEquipo);
            //Obtenemos los jugadores.
            let jugadoresVisitantes = await getJugadoresDeUnEquipo(idEquipo);
            setJugadoresEquipoVisitante(jugadoresVisitantes);
           
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
                primerOption.selected = true;
                desplegableCompeticionesRef.current.appendChild(primerOption);

                for (let competicion of respuesta.datos) {
                    let option = createOptionElement(competicion.id_competicion, competicion.nombre);
                    desplegableCompeticionesRef.current.appendChild(option);
                }
            }
        }//Fin de la función.


        rellenarDesplegableCompeticiones();
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
                    // console.log(respuesta.datos);
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

        if (idCompeticion !== "-" && idEquipoLocal !== "-" && idEquipoVisitante !== "-" && fecha !== ""
            && golesEquipoLocal !== "" && golesEquipoVisitante !== "" && golesEquipoLocal >= 0 && golesEquipoVisitante >= 0) {

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
                parametros.append("goles_equipo_local", golesEquipoLocal.trim());
                parametros.append("goles_equipo_visitante", golesEquipoVisitante.trim());
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
                        setEstadioEquipoLocal('');
                        setModalError(false);
                        setShowModal(true);
                        formRef.current.reset();
                    }
                }
            }
        } else {

            if(idCompeticion === "-" || idEquipoLocal === "-" || idEquipoVisitante === "-" || fecha === ""
                || golesEquipoLocal === "" || golesEquipoVisitante === ""){
                setTextoModal("Por favor, rellena todos los campos del formulario correctamente.");

            }else if (golesEquipoLocal.startsWith('-') || golesEquipoVisitante.startsWith('-')){
                setTextoModal("Los números negativos no son válidos.");
            }
            setModalError(true);
            setShowModal(true);
        }

    });//Fin de la función.

    return (
        <>
            <form className="mx-auto p-0" ref={formRef}>
                <h2 className="text-center mt-1 fs-2">Datos del partido</h2>
                <div className="my-2 row mx-0">
                    <label className="form-label">Competición</label>
                    <select className="form-select shadow-none" ref={desplegableCompeticionesRef} onChange={(event) => handleChangeCompeticion(event.target.value)}  required >

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
                    <input type="date" className="form-control shadow-none" ref={fechaPartidoRef} min={'1930-06-06'} required />
                </div>
                <div className="my-2 row mx-auto">
                    <div className="col-11 col-sm-3 mx-auto text-sm-center p-0 mb-2 mb-sm-0"><p className="form-label my-auto">Resultado del partido</p> </div>
                    <div className="col-5 col-sm-3 mx-auto p-0 my-auto">
                        <input type="number" className="form-control shadow-none" ref={golesEquipoLocalRef} min={0} max={200} pattern="[0-9]*" required />
                    </div>
                    <div className="col-1 col-sm-2 mx-auto text-center my-auto">
                        <span className="w-100">-</span>
                    </div>
                    <div className="col-5 col-sm-3 mx-auto p-0 my-auto">
                        <input type="number" className="form-control shadow-none" ref={golesEquipoVisitanteRef} min={0} max={200} required />
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
                        <div className="col-12 p-0" key={i}>{evento}</div>
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