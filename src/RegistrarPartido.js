import { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import './css/styles.css';

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

    function handleEventoAceptado(event){

        if (nombreJugador === "" || tipoEvento === ""){

            if (nombreJugador === ""){
                alert("Selecciona un jugador.");
            }else if (tipoEvento === ""){
                alert("Selecciona un evento para el jugador.");
            }else if(nombreJugador === "" && tipoEvento === ""){
                alert("Selecciona un jugador y un evento.");
            }

        }else{
            setEventoAceptado(true);
        }
    }

    async function rellenarDesplegableJugadores() {

        let id = "txtJugadores" + info.numEvento
        let listadoJugadores = document.getElementById(id);
        listadoJugadores.innerHTML = "";

        //Anidamos a nuestro select una primera opción, que tendrá el valor '-'
        listadoJugadores.appendChild(createOptionElement("-", "-"));

        for (let jugador of info.jugadores) {
            //Creamos un elemento de tipo option por cada jugador y lo anidamos al select.
            let idJugador = jugador.id_jugador;
            let nombreJugador = jugador.nombre_completo;
            let option = createOptionElement((nombreJugador + "-" + idJugador), nombreJugador);
            listadoJugadores.appendChild(option);
        }
    }

    //useEffect que se ejecutará cuando se produzca un cambio en algunos de los equipos seleccionados.
    useEffect(() => {

        rellenarDesplegableJugadores();
        console.log(info.numEvento.charAt(info.numEvento.length-1));
    }, [info.jugadores]);

    useEffect(() => {

        async function registrarEvento(){
            
            let idPartido = info.idPartido.current;
            let idDelJugador = idJugador;
            let tipo = tipoEvento;
            let parametros = new FormData();
            parametros.append("id_partido", idPartido);
            parametros.append("id_jugador", idDelJugador);
            parametros.append("tipo", tipo);

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarEvento.php", {
                method: 'POST',
                body: parametros
            });

            if (response.ok){

                let respuesta = await response.json();
                if (!respuesta.error){
                    console.log(respuesta.datos);
                }else{
                    alert(respuesta.datos);
                }
            }
        }

        //Si no se ha aceptado el evento, se preguntará al usuario si desea aceptarlo.
        if (info.guardarDatosEnBD === true && eventoAceptado === false){
            if (window.confirm("¿Deseas guardar el evento número " + (parseInt((info.numEvento.charAt(info.numEvento.length - 1))) + 1) +  "?")){
                setEventoAceptado(true);
            }else{
                info.eliminarEvento();
            }
        }
        if (info.guardarDatosEnBD === true && eventoAceptado === true){
            registrarEvento();
        }

    }, [info.guardarDatosEnBD]);


    return (
        <div className="my-2 row mx-0" id={info.numEvento}>
            <div className="container-fluid">

                <div className="row p-0">
                    <div className="col-lg-6"><label htmlFor="txtNombreJugador" className="form-label my-auto text-start">Jugador</label></div>
                    <div className="col-lg"><label htmlFor="txtTipoEvento" className="form-label my-auto ms-lg-3">Evento</label></div>
                </div>

                {eventoAceptado === false &&
                    <div className="row mt-2 p-0">
                        <div className="col-lg-6 p-0 my-auto">
                            <select className="form-select shadow-none" onChange={handleNombreJugador} id={"txtJugadores" + info.numEvento} name="txtJugadores" required>

                            </select>
                        </div>
                        <div className="p-0 my-auto mx-2 col">
                            <select className="form-select shadow-none" onChange={handleTipoEvento} id="txtPosicion" name="txtPosicion" required>
                                <option value="-" selected>-</option>
                                <option value="Gol">Gol</option>
                                <option value="asistencia">Asistencia</option>
                                <option value="tarjetaAmarilla">Tarjeta amarilla</option>
                                <option value="tarjetaRoja">Tarjeta roja</option>
                            </select>
                        </div>
                        <div className="col-lg-2 my-auto">
                            <div className="container-fluid p-0">
                                <div className="row">
                                    <div className="col-6 m-0 p-0 text-start"> <button className="btnAceptarEvento p-lg-1" onClick={(event) => handleEventoAceptado(event)}><i className="fa-solid fa-circle-check fs-3"></i></button> </div>
                                    <div className="col-6 m-0 p-0"> <button className="btnEliminarEvento p-lg-1 ms-lg-1" onClick={info.eliminarEvento}><i className="fa-sharp fa-solid fa-circle-xmark fs-3"></i></button> </div>
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
    const [jugadoresEquipoLocal, setJugadoresEquipoLocal] = useState([]);
    const [jugadoresEquipoVisitante, setJugadoresEquipoVisitante] = useState([]);
    const [jugadores, setJugadores] = useState([]);
    const [estadioEquipoLocal, setEstadioEquipoLocal] = useState('');
    const [idEquipoLocal, setIdEquipoLocal] = useState('');
    const [idEquipoVisitante, setIdEquipoVisitante] = useState('');
    const [guardarDatosEnBD, setGuardarDatosEnBD] = useState(false);
    //id del partido que se va a registrar y al que harán referencia los eventos cuando se guarden en la BD.
    const idPartido = useRef('');

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
    function incNumEventos() {
        setNumEventos(numEventos + 1);
    }

    //Decrementamos el contador de eventos y eliminamos el último evento del array.
    function eliminarEvento() {
        setNumEventos(numEventos - 1);
    }

    //useEffect que rellena el desplegable de competiciones y equipos.
    useEffect(() => {

        async function rellenarDesplegableCompeticiones() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getCompeticiones.php");
            if (response.ok) {

                let respuesta = await response.json();
                let desplegableCompeticiones = document.getElementById('txtCompeticion');
                desplegableCompeticiones.innerHTML = " ";
                let primerOption = createOptionElement("-", "-");
                desplegableCompeticiones.appendChild(primerOption);

                for (let competicion of respuesta.datos) {
                    let option = createOptionElement(competicion.id_competicion, competicion.nombre);
                    desplegableCompeticiones.appendChild(option);
                }
            }
        }//Fin de la función.

        //Función que rellena los dos campos select con los nombres de los equipos.
        async function rellenarDesplegableEquipos() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");
            if (response.ok) {

                let respuesta = await response.json();

                let listadoEquiposLocal = document.getElementById('txtEquipoLocal');
                listadoEquiposLocal.innerHTML = " ";
                let listadoEquiposVisitante = document.getElementById('txtEquipoVisitante');
                listadoEquiposVisitante.innerHTML = " ";

                //Creamos el primer option de cada select, el cual estará vacío.
                let optionSinValor1 = createOptionElement("-", "-");
                let optionSinValor2 = createOptionElement("-", "-");

                // Anidamos los elementos option a los dos select.
                listadoEquiposLocal.appendChild(optionSinValor1);
                listadoEquiposVisitante.appendChild(optionSinValor2);

                for (let equipo of respuesta.datos) {
                    // Creamos un elemento de tipo option por cada equipo.
                    let optionLocal = createOptionElement(equipo.id_equipo, equipo.nombre);
                    let optionVisitante = createOptionElement(equipo.id_equipo, equipo.nombre);

                    listadoEquiposLocal.appendChild(optionLocal);
                    listadoEquiposVisitante.appendChild(optionVisitante);
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

    async function getIdPartido (){

        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getUltimoIdDePartido.php");
        if (response.ok){

            let respuesta = await response.json();
            if (!respuesta.error){
                let idPartido = respuesta.datos.id_partido;
                return idPartido;
            }
        }
    }

    //MIGUEL CONTINÚA POR AQUÍ
    async function registrarPartido() {

        let idCompeticion = document.getElementById('txtCompeticion').value;
        let fecha = document.getElementById('txtFechaPartido').value;
        let golesEquipoLocal = document.getElementById('txtGolesEquipoLocal').value;
        let golesEquipoVisitante = document.getElementById('txtGolesEquipoVisitante').value;

        if (idCompeticion !== "-" && idEquipoLocal !== "-" && idEquipoVisitante !== "-") {

            if (idEquipoLocal === idEquipoVisitante) {
                alert("ERROR: El equipo local y el visitante no pueden ser el mismo.");
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
                    if (!respuesta.error){
                        idPartido.current = await getIdPartido();
                        setGuardarDatosEnBD(true);     
                        setTimeout(function() {
                            alert(respuesta.datos);
                            window.location.reload(false);
                          }, 1000)  ;                 
                    }
                }
            }

        } else {
            alert("ERROR: Por favor, introduce datos válidos.");
        }

    }//Fin de la función.

    //Cada vez que se pulse en añadir un nuevo evento, se creará y añadirá un nuevo
    // componente evento. Le pasamos el array con todos lo métodos que deberán llamarse
    //cuando se produzcan los diferentes eventos del componente.
    const eventos = [];

    for (let i = 0; i < numEventos; i++) {
        const numEvento = "evento" + i;
        //Mandamos a cada componente evento el método que elimina el evento del componente principal,
        //el método que maneja el cambio de equipo, y los jugadores de los equipos seleccionados.
        const info = { eliminarEvento, numEvento, jugadores, guardarDatosEnBD, idPartido};
        eventos.push(<Evento key={i} info={info} />);
    }

    return (
        <>
            <NavBar />
            <form className="col-lg-5 mx-auto p-0" name="frmRegistrarEquipo">

                <h3 className="text-center mt-1">Información del partido</h3>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtCompeticion" className="form-label">Competicion</label>
                    <select className="form-select shadow-none" id="txtCompeticion" name="txtCompeticion" required >

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtEquipoLocal" className="form-label">Equipo local</label>
                    <select className="form-select shadow-none" id="txtEquipoLocal" onChange={(event) => handleChangeEquipoLocal(event.target.value)} name="txtEquipoLocal" required >

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtEquipoVisitante" className="form-label">Equipo visitante</label>
                    <select className="form-control shadow-none" id="txtEquipoVisitante" onChange={(event) => handleChangeEquipoVisitante(event.target.value)} name="txtEquipoVisitante" required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtFechaPartido" className="form-label">Fecha del partido</label>
                    <input type="date" className="form-control shadow-none" id="txtFechaPartido" name="txtFechaPartido" min={0} required />
                </div>
                <div className="my-2 row mx-0">
                    <div className="col-4  m-auto p-0 text-center"><p className="my-auto">Resultado del partido</p> </div>
                    <div className="col-3"><input type="number" className="form-control shadow-none" id="txtGolesEquipoLocal" name="txtGolesEquipoLocal" min={0} max={999} minLength={0} maxLength={3} required /></div>
                    <div className="col-1 m-auto">-</div>
                    <div className="col-3"><input type="number" className="form-control shadow-none" id="txtGolesEquipoVisitante" name="txtGolesEquipoVisitante" min={0} minLength={0} maxLength={3} required /></div>

                    {/* Caracteres del patron: ^ indica el comienzo de la cadena, \d{1,2} indica que se permiten de 1 a 2 dígitos, - indica el carácter - literal, $ indica el final de la cadena. */}
                </div>
                <div className="my-2 row mx-0">
                    <p>Estadio del partido: {estadioEquipoLocal}</p>
                </div>
                {eventos}

                <div className="my-2 row mx-0">
                    <input type="button" className="btn1 p-lg-2 col-3" value={"ACEPTAR"} onClick={registrarPartido} />
                    <div className="col"></div>
                    <button className="btn1 p-lg-2 col-3" onClick={(event) => {event.preventDefault(); incNumEventos();}}>EVENTO <i class="fa-solid fa-flag ms-lg-1"></i></button>
                </div>
            </form>
        </>
    );
}