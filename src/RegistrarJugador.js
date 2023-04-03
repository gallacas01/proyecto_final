import { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import './css/styles.css';

function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function RegistrarJugador() {


    //useEffect que rellena el desplegable de equipos la primera vez que se renderice el componente.
    useEffect(() => {

        async function rellenarDesplegableEquipos() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");
            if (response.ok) {

                let respuesta = await response.json();

                let listadoEquipos = document.getElementById('txtEquipos');
                listadoEquipos.innerHTML = " ";

                //Creamos el primer option de cada select, el cual estará vacío.
                let optionSinValor = createOptionElement("-","-");

                // Anidamos rl option al select.
                listadoEquipos.appendChild(optionSinValor);

                for (let equipo of respuesta.datos) {
                    // Creamos un elemento de tipo option por cada equipo y lo añadimos al select.
                    let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                    listadoEquipos.appendChild(option);
                }
            }
        }
        rellenarDesplegableEquipos();
    }, [])


    async function guardarJugadorEnBD() {
        let dniJugador = document.getElementById('txtDni').value;
        let nombreCompleto = document.getElementById('txtNombreCompleto').value;
        let fechaNacimiento = document.getElementById('txtFechaNacimiento').value;
        let peso = document.getElementById('txtPeso').value;
        let altura = document.getElementById('txtAltura').value;
        let posicion = document.getElementById('txtPosicion').value;
        let pais = document.getElementById('txtPais').value;
        let idEquipo = document.getElementById('txtEquipos').value;

        if (peso !== "" && peso !== "" && idEquipo !== "") {

            //Parametros para la inserción del jugador
            let parametrosJugador = new FormData();
            parametrosJugador.append("dni_jugador", dniJugador);
            parametrosJugador.append("nombre_completo", nombreCompleto);
            parametrosJugador.append("fecha_nacimiento", fechaNacimiento);
            parametrosJugador.append("peso", peso);
            parametrosJugador.append("altura", altura);
            parametrosJugador.append("posicion", posicion);
            parametrosJugador.append("pais", pais);

            //Primero registramos el jugador.
            let response1 = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarJugador.php",
                {
                    body: parametrosJugador,
                    method: "POST"
                });

            if (response1.ok) {

                let respuesta1 = await response1.json();
                console.log(respuesta1);
                //Si la inserción en la tabla jugador ha sido satisfactoria, se registra el movimiento.
                if (!respuesta1.error) {

                    //Parámetros para la inserción del movimiento (la primera vez que se inserte un jugador,
                    //no tendrá equipo antiguo).
                   let parametrosMovimiento = new FormData();
                   parametrosMovimiento.append("dni_jugador", dniJugador);
                   parametrosMovimiento.append("id_equipo_antiguo",0);
                   parametrosMovimiento.append("id_equipo_nuevo",idEquipo);
                   parametrosMovimiento.append("fecha", null);
                   parametrosMovimiento.append("mercado", null);

                    let response2 = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarMovimiento.php",
                        {
                            body: parametrosMovimiento,
                            method: "POST"
                        });

                    let respuesta2 = await response2.json();
                    if (!respuesta2.error) {
                        alert("Se ha realizado la inserción del jugador y del movimiento en la base de datos.")
                        let formulario = document.getElementById('frmRegistrarJugador');
                        formulario.reset();
                    } else {
                        alert(respuesta2.datos);
                    }
                } else {
                    alert("Error: " + respuesta1.datos);
                }
            } else {
                alert(response1.datos)
            }

        //Cuando se introduce texto en un campo numérico, al recoger su valor con un .value
        //se interpreta como una cadena vacía.
        } else {
            if (peso === "")
                alert("Introduce un valor numérico en el campo 'peso'");
            if (altura === "")
                alert("Introduce un valor numérico en el campo 'altura'");
            if (idEquipo === "-")
                alert("Introduce un equipo para el jugador.");
        }
    }//Fin de la función.

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto mb-4 p-0" name="frmRegistrarJugador" id="frmRegistrarJugador">

                <h3 className="text-center mt-1">Datos del jugador</h3>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtDni" className="form-label my-auto">DNI / INE</label>
                    <input type="text" className="form-control shadow-none" id="txtDni" name="txtDni" minLength={9} maxLength={9} required />
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtNombreCompleto" className="form-label">Nombre completo </label>
                    <input type="text" className="form-control shadow-none" maxLength={35} id="txtNombreCompleto" name="txtNombreCompleto" required />
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtFechaNacimiento" className="form-label">Fecha de nacimiento </label>
                    <input type="date" className="form-control shadow-none" id="txtFechaNacimiento" name="txtFechaNacimiento" min={0} required />
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtPeso" className="form-label">Peso (Kg)</label>
                    <input type="number" className="form-control shadow-none" id="txtPeso" name="txtPeso" minLength={2} maxLength={5} step="0.1" min={50} required />
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtAltura" className="form-label">Altura (cm) </label>
                    <input type="number" className="form-control shadow-none" id="txtAltura" name="txtAltura" min={0} required />
                </div>
                <div className="my-3 row mx-0">
                    <label htmlFor="txtPosicion" className="form-label">Posición</label>
                    <select className="form-select shadow-none" id="txtPosicion" name="txtPosicion" aria-label="Default select example" required>
                        <option value="portero">Portero</option>
                        <option value="defensa">Defensa</option>
                        <option value="centrocampista">Centrocampista</option>
                        <option value="delantero">Delantero</option>
                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtPais" className="form-label">País</label>
                    <input type="text" className="form-control shadow-none" id="txtPais" name="txtPais" required />
                </div>
                <div className="my-2 row mx-0">
                    <label htmlFor="txtEquipos" className="form-label">Equipo</label>
                    <select className="form-control shadow-none" id="txtEquipos" name="txtEquipos" required>

                    </select>
                </div>
                <button className="btn1 p-1" onClick={guardarJugadorEnBD}> REGISTRAR</button>
            </form>
            <Footer/>
        </>
    );
}