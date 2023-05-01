import { useEffect, useRef, useState } from "react";
import './css/bootstrap.css';
import './css/styles.css';

function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function FrmRegistrarJugador() {

    const frmRegistrarJugadorRef = useRef(null);
    const [imagenJugador, setImagenJugador] = useState(null);
    const dniJugadorRef = useRef(null);
    const nombreCompletoRef = useRef(null);
    const fechaNacimientoRef = useRef(null);
    const pesoRef = useRef(null);
    const alturaRef = useRef(null);
    const posicionRef = useRef(null);
    const dorsalRef = useRef(null);
    const paisRef = useRef(null);
    const desplegableEquiposRef = useRef(null);
    
    function handleChangeFile(imagen){

        setImagenJugador(imagen);
    }//Fin de la función.

    //useEffect que rellena el desplegable de equipos la primera vez que se renderice el componente.
    useEffect(() => {

        async function rellenarDesplegableEquipos() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");
            if (response.ok) {

                let respuesta = await response.json();

                desplegableEquiposRef.current.innerHTML = " ";

                //Creamos el primer option de cada select, el cual estará vacío.
                let optionSinValor = createOptionElement("-","-");

                // Anidamos rl option al select.
                desplegableEquiposRef.current.appendChild(optionSinValor);

                for (let equipo of respuesta.datos) {
                    // Creamos un elemento de tipo option por cada equipo y lo añadimos al select.
                    let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                    desplegableEquiposRef.current.appendChild(option);
                }
            }
        }

        rellenarDesplegableEquipos();
    }, [])

    async function guardarJugadorEnBD() {

            if (pesoRef !== "" && pesoRef !== "" && desplegableEquiposRef !== "") {

                //Si el archivo es una imagen, se introducirá en la base de datos.
                if (imagenJugador.name.endsWith('.jpg') || imagenJugador.name.endsWith('.jpeg') || imagenJugador.name.endsWith('.png') || imagenJugador.name.endsWith('.webp') || imagenJugador.name.endsWith('.jpe')) {

                    const reader = new FileReader();
                    reader.onloadend = async () => {
                    let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

                    //Parametros para la inserción del jugador
                    let parametrosJugador = new FormData();
                    parametrosJugador.append("dni_jugador", dniJugadorRef.current.value);
                    parametrosJugador.append("nombre_completo", nombreCompletoRef.current.value);
                    parametrosJugador.append("fecha_nacimiento", fechaNacimientoRef.current.value);
                    parametrosJugador.append("peso", pesoRef.current.value);
                    parametrosJugador.append("altura", alturaRef.current.value);
                    parametrosJugador.append("posicion", posicionRef.current.value);
                    parametrosJugador.append("dorsal", dorsalRef.current.value);
                    parametrosJugador.append("pais", paisRef.current.value);
                    parametrosJugador.append("id_equipo", desplegableEquiposRef.current.value);
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
                        parametrosMovimiento.append("dni_jugador", dniJugadorRef.current.value);
                        parametrosMovimiento.append("id_equipo_antiguo",0);
                        parametrosMovimiento.append("id_equipo_nuevo",desplegableEquiposRef.current.value);
                        parametrosMovimiento.append("fecha", null);
                        parametrosMovimiento.append("mercado", null);

                            let response2 = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarMovimiento.php",
                                {
                                    body: parametrosMovimiento,
                                    method: "POST"
                                });

                            let respuesta2 = await response2.json();
                            if (!respuesta2.error) {
                                alert("Se ha realizado la inserción del jugador y del movimiento en la base de datos.");
                                frmRegistrarJugadorRef.current.reset();
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
                if (pesoRef === "")
                    alert("Introduce un valor numérico en el campo 'peso'");
                if (alturaRef === "")
                    alert("Introduce un valor numérico en el campo 'altura'");
                if (desplegableEquiposRef === "-")
                    alert("Introduce un equipo para el jugador.");
            }
          
    }//Fin de la función.

    return (
    
        <form className="bg-transparent p-0" ref={frmRegistrarJugadorRef}>
            <h3 className="text-center mt-1">Datos del jugador</h3>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">DNI / INE</label>
                <input type="text" className="form-control shadow-none" ref={dniJugadorRef} minLength={9} maxLength={9} required />
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Nombre completo </label>
                <input type="text" className="form-control shadow-none" ref={nombreCompletoRef} maxLength={35} required />
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Fecha de nacimiento </label>
                <input type="date" className="form-control shadow-none" ref={fechaNacimientoRef} min={0} required />
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Peso (Kg)</label>
                <input type="number" className="form-control shadow-none" ref={pesoRef} minLength={2} maxLength={5} step="0.1" min={50} required />
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Altura (cm) </label>
                <input type="number" className="form-control shadow-none" ref={alturaRef} min={0} required />
            </div>
            <div className="my-3 row mx-0">
                <label className="form-label my-auto">Posición</label>
                <select className="form-select shadow-none" ref={posicionRef} aria-label="Default select example" required>
                    <option value="-">-</option>
                    <option value="portero">Portero</option>
                    <option value="defensa">Defensa</option>
                    <option value="centrocampista">Centrocampista</option>
                    <option value="delantero">Delantero</option>
                </select>
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Dorsal </label>
                <input type="number" className="form-control shadow-none" ref={dorsalRef} min={0} max={100} required />
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Lugar de nacimiento</label>
                <input type="text" className="form-control shadow-none" ref={paisRef} required />
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label my-auto">Equipo</label>
                <select className="form-control shadow-none" ref={desplegableEquiposRef} required>

                </select>
            </div>
            <div className="my-2 row mx-0">
                <label className="form-label">Imagen</label>
                <input className="form-control shadow-none" type="file" ref={imagenJugador} onChange={(event) => handleChangeFile(event.target.files[0])} required/>
            </div>
            <input type="button" className="btn1 p-lg-2 col-3" value={"ACEPTAR"} onClick={guardarJugadorEnBD} />
        </form>
    );
}