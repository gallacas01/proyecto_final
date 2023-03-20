import { useState } from "react";
import NavBar from "./NavBar";

// Función que genera un formulario para almacenar algún evento de un partido (goles, asistencias, tarjetas,etc)
// function OptionJugador(){

// }

function Evento({info}) {

    return (
        <div className="my-2 row mx-0 p-0">

            <div className="container-fluid">  

                <div className="row">
                    <label for="txtNombreJugador" className="form-label col-5 my-auto text-start">Jugador</label>
                    <label for="txtTipoEvento" className="form-label col-5 my-auto text-start">Evento</label>
                </div>
                <div className="row mt-2 border-white me-1">
                    <input type="text" className="form-control shadow-none p-0 col" id="txtNombreJugador" name="txtNombreJugador" required />
                    <select class="form-select shadow-none col p-0" id="txtPosicion" name="txtPosicion" required>
                        <option value="gol">Gol</option>
                        <option value="asistencia">Asistencia</option>
                        <option value="tarjetaAmarilla">Tarjeta amarilla</option>
                        <option value="tarjetaRoja">Tarjeta roja</option>
                    </select>     
                    <div className="col-2 ms-lg-3 p-0">
                        <div className=" container-fluid p-0">                     
                            <div className="row p-0">
                                <button className="p-1 col-6"><i class="fa-solid fa-circle-check fs-3"></i></button> 
                                <button className="p-1 col-6" onClick={info[0]}><i class="fa-sharp fa-solid fa-circle-xmark fs-3"></i></button> 
                            </div>      
                        </div>                  
                    </div>
                </div>    

            </div>

        </div>
    );
}




export default function RegistrarPartido() {

    //Estados
    const [numEventos, setNumEventos] = useState(0);

    //Cada vez que se pulse en añadir un nuevo evento, se creará y añadirá un nuevo
    // componente evento. Le pasamos el array con todos lo métodos que deberán llamarse
    //cuando se produzcan los diferentes eventos del componente.
    const eventos = [];
    const accionesEventos = [DeleteEvent, AcceptEvent];
    for (let i = 0; i < numEventos; i++) {
        eventos.push(<Evento key={i} info={accionesEventos}/>);
    }

    //Cuando se pulse el botón de añadir evento, se actualizará la variable que 
    //los cuenta y se renderizará un nuevo componente.
    function incNumEventos() {
        setNumEventos(numEventos + 1);
    }

    function AcceptEvent(){
        alert("aceptado");
    }

    //Decrementamos el contador de eventos y eliminamos el último evento del array.
    function DeleteEvent(){
        setNumEventos(numEventos - 1);
        eventos.pop();
    }

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto p-0" name="frmRegistrarEquipo">

                <h3 className="text-center">Información del partido</h3>
                <div className="my-2 row mx-0">
                    <label for="txtCompeticion" className="form-label my-auto">Competición</label>
                    <input type="text" className="form-control shadow-none" id="txtCompeticion" name="txtCompeticion" required />
                </div>
                <div className="my-2 row mx-0">
                    <label for="txtEquipoLocal" className="form-label">Equipo local</label>
                    <input type="text" className="form-control shadow-none" id="txtEquipoLocal" name="txtEquipoLocal" required />
                </div>
                <div className="my-2 row mx-0">
                    <label for="txtEquipoVisitante" className="form-label">Equipo visitante</label>
                    <input type="text" className="form-control shadow-none" id="txtEquipoVisitante" name="txtEquipoVisitante" min={0} required />
                </div>
                <div className="my-2 row mx-0">
                    <label for="txtFechaPartido" className="form-label">Fecha del partido</label>
                    <input type="date" className="form-control shadow-none" id="txtFechaPartido" name="txtFechaPartido" min={0} required />
                </div>
                <div className="my-2 row mx-0">
                    <label for="txtResultado" className="form-label">Resultado del partido</label>
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