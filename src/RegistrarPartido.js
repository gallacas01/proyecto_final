import { useState, useEffect } from "react";
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

    function handleNombreJugador(event) {
        //El value del option del campo select tiene la siguiente estructura: nombre-1
        let nombre = event.target.value.split("-")[0];
        setNombreJugador(nombre);
    }

    function handleTipoEvento(event) {
        //Recuperamos el textContent de la etiqueta option del select que contiene los tipos de eventos.
        let optionSeleccionado = event.target.options[event.target.selectedIndex];
        let tipoEvento = optionSeleccionado.text;
        setTipoEvento(tipoEvento);
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
    }, [info.jugadores]);

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
                                    <div className="col-6 m-0 p-0 text-start"> <button className="p-1" onClick={() => setEventoAceptado(true)}><i className="fa-solid fa-circle-check fs-3"></i></button> </div>
                                    <div className="col-6 m-0 p-0"> <button className="p-1" onClick={info.eliminarEvento}><i className="fa-sharp fa-solid fa-circle-xmark fs-3"></i></button> </div>
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
    }

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

    async function getEstadioDeUnEquipo(idEquipo){

        let parametros = new FormData();
        parametros.append('id_equipo', idEquipo);
         //Obtenemos el estadio
        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEstadioDeUnEquipo.php", {
                method : 'POST',
                body : parametros
        });

        if (response.ok){

            let respuesta = await response.json();
            if (!respuesta.error){

                let estadio = respuesta.datos.estadio;
                return estadio;
            }
        }
    }//Fin del método.

    async function handleChangeEquipoLocal(idEquipo) {

        if (idEquipo !== "-") {
            //Obtenemos los jugadores
            let jugadoresLocales = await getJugadoresDeUnEquipo(idEquipo);
            setJugadoresEquipoLocal(jugadoresLocales);

            let estadio = await getEstadioDeUnEquipo(idEquipo);
            console.log(estadio);
            setEstadioEquipoLocal(estadio);
        }
    }//Fin de la función.

    async function handleChangeEquipoVisitante(idEquipo) {

        if (idEquipo !== "-") {
            let jugadoresVisitantes = await getJugadoresDeUnEquipo(idEquipo);
            setJugadoresEquipoVisitante(jugadoresVisitantes);
            console.log("Jugadores visitantes actualizados.");
            // console.log("JUGADORES VISITANTES: " + jugadoresEquipoVisitante);
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

    //UseEffect que se ejecutará la primera vez que se renderice el componente.
    useEffect(() => {

        rellenarDesplegableEquipos();
    }, [])

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

    //MIGUEL CONTINÚA POR AQUÍ
    async function registrarPartido() {

        let competicion = document.getElementById('txtCompeticion');
        let equipoLocal = document.getElementById('txtEquipoLocal');
        let equipoVisitante = document.getElementById('txtEquipoVisitante');
        let fecha = document.getElementById('txtFechaPartido');
        let golesEquipoLocal = document.getElementById('txtGolesEquipoLocal');
        let golesEquipoVisitante = document.getElementById('txtGolesEquipoVisitante');
        let parametros = new FormData();
        parametros.append("competicion", competicion);
        parametros.append("equipo_local", equipoLocal);
        parametros.append("equipo_visitante", equipoVisitante);
        parametros.append("fecha", fecha);
        parametros.append("goles_equipo_local", golesEquipoLocal);
        parametros.append("goles_equipo_visitante", golesEquipoVisitante);

        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/registrarPartido.php", {
            method: 'POST',
            body: parametros
        });

        if (response.ok) {

            let respuesta = await response.json();
            alert(respuesta.datos);
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
        const info = { eliminarEvento, numEvento, jugadores };
        eventos.push(<Evento key={i} info={info} />);
    }

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto p-0" name="frmRegistrarEquipo">

                <h3 className="text-center mt-1">Información del partido</h3>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtCompeticion" className="form-label my-auto">Competición</label>
                    <input type="text" className="form-control shadow-none" id="txtCompeticion" name="txtCompeticion" required />
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
                    <div className="col-3"><input type="number" className="form-control shadow-none" id="txtGolesEquipoLocal" name="txtGolesEquipoLocal" required /></div>
                    <div className="col-1 m-auto">-</div>
                    <div className="col-3"><input type="number" className="form-control shadow-none" id="txtGolesEquipoVisitante" name="txtGolesEquipoVisitante" required /></div>

                    {/* Caracteres del patron: ^ indica el comienzo de la cadena, \d{1,2} indica que se permiten de 1 a 2 dígitos, - indica el carácter - literal, $ indica el final de la cadena. */}
                </div>
                <div className="my-2 row mx-0">
                    <p>Estadio del partido: {estadioEquipoLocal}</p>
                </div>

                {eventos}

                <div className="my-2 row mx-0">
                    <input type="submit" className="btn1 p-lg-2 col-3" value={"ENVIAR"} onClick={registrarPartido} />
                    <div className="col"></div>
                    <input type="button" className="btn1 p-lg-2 col-3" value={"EVENTO"} onClick={incNumEventos} />
                </div>
            </form>
        </>
    );
}