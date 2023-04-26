import { useEffect, useRef, useState } from "react";
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

    const frmRegistrarJugador = useRef(null);
    const [imagenJugador, setImagenJugador] = useState(null);
    const dniJugador = useRef(null);
    const nombreCompleto = useRef(null);
    const fechaNacimiento = useRef(null);
    const peso = useRef(null);
    const altura = useRef(null);
    const posicion = useRef(null);
    const pais = useRef(null);
    const desplegableEquipos = useRef(null);
    

    function handleChangeFile(imagen){

        setImagenJugador(imagen);
    }//Fin de la función.

    //useEffect que rellena el desplegable de equipos la primera vez que se renderice el componente.
    useEffect(() => {

        async function rellenarDesplegableEquipos() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");
            if (response.ok) {

                let respuesta = await response.json();

                desplegableEquipos.current.innerHTML = " ";

                //Creamos el primer option de cada select, el cual estará vacío.
                let optionSinValor = createOptionElement("-","-");

                // Anidamos rl option al select.
                desplegableEquipos.current.appendChild(optionSinValor);

                for (let equipo of respuesta.datos) {
                    // Creamos un elemento de tipo option por cada equipo y lo añadimos al select.
                    let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                    desplegableEquipos.current.appendChild(option);
                }
            }
        }

        rellenarDesplegableEquipos();
    }, [])

    async function guardarJugadorEnBD() {

            if (peso !== "" && peso !== "" && desplegableEquipos !== "") {

                //Si el archivo es una imagen, se introducirá en la base de datos.
                if (imagenJugador.name.endsWith('.jpg') || imagenJugador.name.endsWith('.jpeg') || imagenJugador.name.endsWith('.png') || imagenJugador.name.endsWith('.webp') || imagenJugador.name.endsWith('.jpe')) {

                    const reader = new FileReader();
                    reader.onloadend = async () => {
                    let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

                    //Parametros para la inserción del jugador
                    let parametrosJugador = new FormData();
                    parametrosJugador.append("dni_jugador", dniJugador.current.value);
                    parametrosJugador.append("nombre_completo", nombreCompleto.current.value);
                    parametrosJugador.append("fecha_nacimiento", fechaNacimiento.current.value);
                    parametrosJugador.append("peso", peso.current.value);
                    parametrosJugador.append("altura", altura.current.value);
                    parametrosJugador.append("posicion", posicion.current.value);
                    parametrosJugador.append("pais", pais.current.value);
                    parametrosJugador.append("id_equipo", desplegableEquipos.current.value);
                    parametrosJugador.append("imagen", base64Imagen);

                    //Primero registramos el jugador.
                    let response1 = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarJugador.php",
                        {
                            body: parametrosJugador,
                            method: 'POST'
                        });

                    if (response1.ok) {

                        let respuesta1 = await response1.json();
                        console.log(respuesta1);
                        //Si la inserción en la tabla jugador ha sido satisfactoria, se registra el movimiento.
                        if (!respuesta1.error) {

                        //Parámetros para la inserción del movimiento (la primera vez que se inserte un jugador,
                        //no tendrá equipo antiguo).
                        let parametrosMovimiento = new FormData();
                        parametrosMovimiento.append("dni_jugador", dniJugador.current.value);
                        parametrosMovimiento.append("id_equipo_antiguo",0);
                        parametrosMovimiento.append("id_equipo_nuevo",desplegableEquipos.current.value);
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
                    
                }
                reader.readAsDataURL(imagenJugador);

                }else{
                    alert("El archivo que selecciones debe ser una imagen.");
                }           
             
            //Cuando se introduce texto en un campo numérico, al recoger su valor con un .value
            //se interpreta como una cadena vacía.
            } else {
                if (peso === "")
                    alert("Introduce un valor numérico en el campo 'peso'");
                if (altura === "")
                    alert("Introduce un valor numérico en el campo 'altura'");
                if (desplegableEquipos === "-")
                    alert("Introduce un equipo para el jugador.");
            }
          
    }//Fin de la función.

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto mb-4 p-0" ref={frmRegistrarJugador}>

                <h3 className="text-center mt-1">Datos del jugador</h3>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">DNI / INE</label>
                    <input type="text" className="form-control shadow-none" ref={dniJugador} minLength={9} maxLength={9} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Nombre completo </label>
                    <input type="text" className="form-control shadow-none" ref={nombreCompleto} maxLength={35} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Fecha de nacimiento </label>
                    <input type="date" className="form-control shadow-none" ref={fechaNacimiento} min={0} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Peso (Kg)</label>
                    <input type="number" className="form-control shadow-none" ref={peso} minLength={2} maxLength={5} step="0.1" min={50} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Altura (cm) </label>
                    <input type="number" className="form-control shadow-none" ref={altura} min={0} required />
                </div>
                <div className="my-3 row mx-0">
                    <label className="form-label my-auto">Posición</label>
                    <select className="form-select shadow-none" ref={posicion} aria-label="Default select example" required>
                        <option value="-">-</option>
                        <option value="portero">Portero</option>
                        <option value="defensa">Defensa</option>
                        <option value="centrocampista">Centrocampista</option>
                        <option value="delantero">Delantero</option>
                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">País</label>
                    <input type="text" className="form-control shadow-none" ref={pais} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Equipo</label>
                    <select className="form-control shadow-none" ref={desplegableEquipos} required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label">Imagen</label>
                    <input className="form-control shadow-none" type="file" ref={imagenJugador} onChange={(event) => handleChangeFile(event.target.files[0])} required/>
                </div>
                <input type="button" className="btn1 p-lg-2 col-3" value={"ACEPTAR"} onClick={guardarJugadorEnBD} />
            </form>
            <Footer/>
        </>
    );
}