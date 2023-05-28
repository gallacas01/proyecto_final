import { useEffect, useRef, useState } from "react";
import '../css/bootstrap.css';
import '../css/styles.css';
import MyModal from "./Modal";

function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function FrmRegistrarJugador() {

    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    const [imagenJugador, setImagenJugador] = useState(null);
    //Referencias al DOM.
    const frmRegistrarJugadorRef = useRef(null);
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

    async function guardarJugadorEnBD(event) {

        console.log(imagenJugador);
        event.preventDefault();
        if (dniJugadorRef.current.value !=="" && nombreCompletoRef.current.value !== "" && fechaNacimientoRef.current.value
         !== "" && pesoRef.current.value !== "" && alturaRef.current.value !== "" && posicionRef.current.value !== ""
         && dorsalRef.current.value !== "" && paisRef.current.value !== "" && desplegableEquiposRef.current.value !== ""
         && imagenJugador !== null ) {

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
                    //Si la inserción en la tabla jugador ha sido satisfactoria, se registra el movimiento.
                    if (!respuesta1.error) {

                    //Parámetros para la inserción del movimiento (la primera vez que se inserte un jugador,
                    //no tendrá equipo antiguo).
                    let parametrosMovimiento = new FormData();
                    parametrosMovimiento.append("dni_jugador", dniJugadorRef.current.value);
                    parametrosMovimiento.append("id_equipo_antiguo",0);
                    parametrosMovimiento.append("id_equipo_nuevo",desplegableEquiposRef.current.value);
                    parametrosMovimiento.append("fecha", null);

                        let response2 = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarMovimiento.php",
                            {
                                body: parametrosMovimiento,
                                method: "POST"
                            });

                        let respuesta2 = await response2.json();
                        if (!respuesta2.error) {
                            setTextoModal("Se ha realizado la inserción del jugador y del movimiento en la base de datos.");
                            setModalError(false);
                            setImagenJugador(null);
                            frmRegistrarJugadorRef.current.reset();
                        } else {
                            setModalError(true);
                            setTextoModal(respuesta2.datos);
                        }
                        setShowModal(true);
                    } else {
                        setModalError(true);
                        setTextoModal(respuesta1.datos);
                        setShowModal(true);
                    }
                } else {
                    setModalError(true);
                    setTextoModal(response1.datos);
                    setShowModal(true);
                }                    
            }
            reader.readAsDataURL(imagenJugador);

            }else{
                setTextoModal("El archivo que selecciones debe ser una imagen.");
                setModalError(true);
                setShowModal(true);
            }           
            
        //Cuando se introduce texto en un campo numérico, al recoger su valor con un .value
        //se interpreta como una cadena vacía.
        } else {

            setTextoModal("Por favor, rellena todos los campos del formulario.");  
            setModalError(true);
            setShowModal(true);
        }          
    }//Fin de la función.

    return (    
        <>
            <form className="p-0 mb-3 mx-auto" ref={frmRegistrarJugadorRef}>
                <h3 className="text-center mt-1 fs-2">Datos del jugador</h3>
                <div className="row">
                   <div className="col-4">
                        <label className="form-label my-auto">DNI / INE</label>
                   </div> 
                   <div className="col-8">
                        <label className="form-label my-auto">Nombre completo </label>
                   </div> 
                </div>
                <div className="row">
                   <div className="col-4">
                        <input type="text" className="form-control shadow-none" ref={dniJugadorRef} minLength={9} maxLength={9} required />
                   </div> 
                   <div className="col-8">
                        <input type="text" className="form-control shadow-none" ref={nombreCompletoRef} maxLength={35} required />
                   </div> 
                </div>
                <div className="row mt-2">
                   <div className="col-4">
                        <label className="form-label my-auto">Fecha de nacimiento </label>
                   </div> 
                   <div className="col-4">
                        <label className="form-label my-auto">Altura (cm) </label>
                   </div> 
                   <div className="col-4">
                       <label className="form-label my-auto">Peso (Kg)</label>
                   </div> 
                </div>
                <div className="row mt-2">
                   <div className="col-4">
                        <input type="date" className="form-control shadow-none" ref={fechaNacimientoRef} min={0} required />
                   </div> 
                   <div className="col-4">
                       <input type="number" className="form-control shadow-none" ref={alturaRef} min={0} required />
                   </div> 
                   <div className="col-4">
                       <input type="number" className="form-control shadow-none" ref={pesoRef} minLength={2} maxLength={5} step="0.1" min={50} required />
                   </div> 
                </div>
                <div className="row mt-2">
                   <div className="col-4">
                        <label className="form-label my-auto">Posición</label>
                   </div> 
                   <div className="col-3">
                        <label className="form-label my-auto">Dorsal </label>
                   </div> 
                   <div className="col-5">
                        <label className="form-label my-auto">País</label>
                   </div> 
                </div>

                <div className="row mt-2">
                   <div className="col-4">
                        <select className="form-select shadow-none" ref={posicionRef} aria-label="Default select example" required>
                            <option value="-">-</option>
                            <option value="Portero">Portero</option>
                            <option value="Defensa">Defensa</option>
                            <option value="Centrocampista">Centrocampista</option>
                            <option value="Delantero">Delantero</option>
                        </select>
                   </div> 
                   <div className="col-3">
                        <input type="number" className="form-control shadow-none" ref={dorsalRef} min={0} max={100} required />
                   </div> 
                   <div className="col-5">
                        <input type="text" className="form-control shadow-none" ref={paisRef} required />
                   </div> 
                </div>
              
                <div className="row mt-2">
                   <div className="col-5">
                        <label className="form-label my-auto">Equipo</label>
                   </div> 
                   <div className="col-7">
                        <label className="form-label">Imagen</label>
                   </div> 
                </div>

                <div className="row">
                   <div className="col-5">
                        <select className="form-control shadow-none" ref={desplegableEquiposRef} required>

                        </select>
                   </div> 
                   <div className="col-7">
                        <input className="form-control shadow-none" type="file" onChange={(event) => handleChangeFile(event.target.files[0])} required/>
                   </div> 
                </div>
               
                <button className="btn1 mt-2 p-2 col-3" onClick={guardarJugadorEnBD}>ACEPTAR</button>

            </form>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
        </>
    );
}