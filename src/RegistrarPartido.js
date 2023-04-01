import { useState, useRef, useEffect } from "react";
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
    //Le asignamos al useRef el valor de la variable que se pasa en info que controla cuando se cambia uno de los equipos seleccionados.
    const cambioEquipo = useRef(info[2]);
    const jugadores = info[3];

    function handleNombreJugador(event) {
        setNombreJugador(event.target.value);
    }

    function handleTipoEvento(event) {
        setTipoEvento(event.target.selectedOptions[0].textContent);
    }

    async function rellenarDesplegableJugadores() {

        let listadoJugadores = document.getElementById('txtJugadores');

        //Anidamos a nuestro select una primera opción, que tendrá el valor '-'
        listadoJugadores.appendChild(createOptionElement("-", "-"));

        for (let jugador of jugadores) {
            //Creamos un elemento de tipo option por cada jugador y lo anidamos al select.
            let idJugador = jugador.id_jugador;
            let nombreJugador = jugador.nombre_completo;
            let option = createOptionElement(idJugador, nombreJugador);
            listadoJugadores.appendChild(option);
        }
    }

    //useEffect que se ejecutará cuando se produzca un cambio en algunos de los equipos seleccionados.
    useEffect( () => {

        if (cambioEquipo.current === true){
            rellenarDesplegableJugadores();
        }

    },[cambioEquipo.current]);

    return (
        <div className="my-2 row mx-0" id={info[1]}>
            <div className="container-fluid">

                <div className="row p-0">
                    <div className="col-5"><label htmlFor="txtNombreJugador" className="form-label my-auto text-start">Jugador</label></div>
                    <div className="col-5"><label htmlFor="txtTipoEvento" className="form-label my-auto ms-lg-3">Evento</label></div>
                </div>

                {eventoAceptado === false &&
                    <div className="row mt-2 p-0">
                        <div className="col-5 p-0 m-auto">
                            <select className="form-select shadow-none" onChange={handleNombreJugador} id="txtJugadores" name="txtJugadores" required>

                            </select>
                        </div>
                        <div className="p-0 m-auto col-4">
                            <select className="form-select shadow-none" onChange={handleTipoEvento} id="txtPosicion" name="txtPosicion" required>
                                <option value="-" selected>-</option>
                                <option value="Gol">Gol</option>
                                <option value="asistencia">Asistencia</option>
                                <option value="tarjetaAmarilla">Tarjeta amarilla</option>
                                <option value="tarjetaRoja">Tarjeta roja</option>
                            </select>
                        </div>
                        <div className="col-3 m-auto">
                            <div className="container-fluid">
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
    const [jugadoresEquipoLocal, setJugadoresEquipoLocal] = useState([]);
    const [jugadoresEquipoVisitante, setJugadoresEquipoVisitante] = useState([]);
    const [cambiandoEquipo, setCambiandoEquipo] = useState(false);
    const [jugadores,setJugadores] = useState([]);


    async function rellenarDesplegableEquipos() {

        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");
        if (response.ok) {

            let respuesta = await response.json();

            let listadoEquiposLocal = document.getElementById('txtEquipoLocal');   
            listadoEquiposLocal.innerHTML = " ";         
            let listadoEquiposVisitante = document.getElementById('txtEquipoVisitante');
            listadoEquiposVisitante.innerHTML = " ";

            //Creamos el primer option de cada select, el cual estará vacío.
            let optionSinValor = document.createElement("option");
            optionSinValor.value = "-";
            optionSinValor.textContent = "-";

            // Anidamos los elementos option a los dos select.
            listadoEquiposLocal.appendChild(optionSinValor);
            listadoEquiposVisitante.appendChild(optionSinValor);

            for (let equipo of respuesta.datos) {
                // Creamos un elemento de tipo option por cada equipo.
                let optionLocal = document.createElement("option");
                optionLocal.value = equipo.id_equipo;
                optionLocal.textContent = equipo.nombre;                

                let optionVisitante = document.createElement("option");
                optionVisitante.value = equipo.id_equipo;
                optionVisitante.textContent = equipo.nombre;

                listadoEquiposLocal.appendChild(optionLocal);
                listadoEquiposVisitante.appendChild(optionVisitante);
            }
        }
    }

    async function getJugadoresDeUnEquipo(idEquipo) {

        console.log(idEquipo);
        if (idEquipo !== '-') {

            let parametros = new FormData();
            parametros.append("id_equipo", idEquipo);          
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getJugadoresDeUnEquipo.php", parametros);

            if (response.ok) {

                let respuesta = await response.json();
                console.log(respuesta);
                if (respuesta.datos.length === 0) {
                    alert("El equipo con id = " + idEquipo + " no tiene jugadores.")
                } else if (!respuesta.datos.length >= 0 && !respuesta.error) {
                    alert("Se ha recuperado correctamente los jugadores de un equipo.");
                    console.log(respuesta);
                    return respuesta.datos;
                }
            }
        }

    }//Fin de la función

    function actualizarJugadoresDeAmbosEquipos() {
        //El ...descompone el array en cada uno de sus elementos individuales.  De esta forma se añade cada elemento individual del array y no todo el array en sí
        setJugadores([...jugadoresEquipoLocal, ...jugadoresEquipoVisitante]);
    }

    async function handleChangeEquipoLocal(idEquipo) {
        setCambiandoEquipo(true);
        let jugadoresEquipoLocal = getJugadoresDeUnEquipo(idEquipo);
        setJugadoresEquipoLocal(jugadoresEquipoLocal);
        actualizarJugadoresDeAmbosEquipos();
        setCambiandoEquipo(false);
    }

    async function handleChangeEquipoVisitante(idEquipo) {
        setCambiandoEquipo(true);
        let jugadores = getJugadoresDeUnEquipo(idEquipo);
        setJugadoresEquipoVisitante(jugadores);
        actualizarJugadoresDeAmbosEquipos();
        setCambiandoEquipo(false);
    }
    //Cada vez que se pulse en añadir un nuevo evento, se creará y añadirá un nuevo
    // componente evento. Le pasamos el array con todos lo métodos que deberán llamarse
    //cuando se produzcan los diferentes eventos del componente.
    const eventos = [];

    for (let i = 0; i < numEventos; i++) {
        const numEvento = "evento" + i;
        const info = [eliminarEvento, numEvento, cambiandoEquipo, jugadores];
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