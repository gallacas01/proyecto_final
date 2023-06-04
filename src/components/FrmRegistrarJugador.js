import { useEffect, useRef, useState } from "react";
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
    //Referencias al DOM (frm para pantallas medianas y grandes).
    const frmRegistrarJugadorRef1 = useRef(null);
    const dniJugadorRef1 = useRef(null);
    const nombreCompletoRef1 = useRef(null);
    const fechaNacimientoRef1 = useRef(null);
    const pesoRef1 = useRef(null);
    const alturaRef1 = useRef(null);
    const posicionRef1 = useRef(null);
    const dorsalRef1 = useRef(null);
    const paisRef1 = useRef(null);
    const desplegableEquiposRef1 = useRef(null);
    //Referencias al DOM (frm para pantallas pequeñas).
    const frmRegistrarJugadorRef2 = useRef(null);
    const dniJugadorRef2 = useRef(null);
    const nombreCompletoRef2 = useRef(null);
    const fechaNacimientoRef2 = useRef(null);
    const pesoRef2 = useRef(null);
    const alturaRef2 = useRef(null);
    const posicionRef2 = useRef(null);
    const dorsalRef2 = useRef(null);
    const paisRef2 = useRef(null);
    const desplegableEquiposRef2 = useRef(null);

    function handleChangeFile(imagen){

        setImagenJugador(imagen);
    }//Fin de la función.

    //useEffect que rellena el desplegable de equipos la primera vez que se renderice el componente.
    useEffect(() => {

        async function rellenarDesplegableEquipos() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");
            if (response.ok) {

                let respuesta = await response.json();

                desplegableEquiposRef1.current.innerHTML = " ";
                desplegableEquiposRef2.current.innerHTML = " ";

                //Creamos el primer option de cada select, el cual estará vacío.
                let optionSinValor1 = createOptionElement("-","-");
                let optionSinValor2 = createOptionElement("-","-");

                // Anidamos rl option al select.
                desplegableEquiposRef1.current.appendChild(optionSinValor1);
                desplegableEquiposRef2.current.appendChild(optionSinValor2);

                for (let equipo of respuesta.datos) {
                    // Creamos un elemento de tipo option por cada equipo y lo añadimos al select.
                    let option1 = createOptionElement(equipo.id_equipo, equipo.nombre);
                    let option2 = createOptionElement(equipo.id_equipo, equipo.nombre);
                    desplegableEquiposRef1.current.appendChild(option1);
                    desplegableEquiposRef2.current.appendChild(option2);
                }
            }
        }

        rellenarDesplegableEquipos();
    }, []);

    async function guardarJugadorEnBD1(event) {

        console.log(imagenJugador);
        event.preventDefault();
        if (dniJugadorRef1.current.value !=="" && nombreCompletoRef1.current.value !== "" && fechaNacimientoRef1.current.value
         !== "" && pesoRef1.current.value !== "" && alturaRef1.current.value !== "" && posicionRef1.current.value !== ""
         && dorsalRef1.current.value !== "" && paisRef1.current.value !== "" && desplegableEquiposRef1.current.value !== ""
         && imagenJugador !== null ) {

            //Si el archivo es una imagen, se introducirá en la base de datos.
            if (imagenJugador.name.endsWith('.jpg') || imagenJugador.name.endsWith('.jpeg') || imagenJugador.name.endsWith('.png') || imagenJugador.name.endsWith('.webp') || imagenJugador.name.endsWith('.jpe')) {

                const reader = new FileReader();
                reader.onloadend = async () => {
                let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

                //Parametros para la inserción del jugador
                let parametrosJugador = new FormData();
                parametrosJugador.append("dni_jugador", dniJugadorRef1.current.value);
                parametrosJugador.append("nombre_completo", nombreCompletoRef1.current.value);
                parametrosJugador.append("fecha_nacimiento", fechaNacimientoRef1.current.value);
                parametrosJugador.append("peso", pesoRef1.current.value);
                parametrosJugador.append("altura", alturaRef1.current.value);
                parametrosJugador.append("posicion", posicionRef1.current.value);
                parametrosJugador.append("dorsal", dorsalRef1.current.value);
                parametrosJugador.append("pais", paisRef1.current.value);
                parametrosJugador.append("id_equipo", desplegableEquiposRef1.current.value);
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
                    parametrosMovimiento.append("dni_jugador", dniJugadorRef1.current.value);
                    parametrosMovimiento.append("id_equipo_antiguo",0);
                    parametrosMovimiento.append("id_equipo_nuevo",desplegableEquiposRef1.current.value);
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
                            frmRegistrarJugadorRef1.current.reset();
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

    async function guardarJugadorEnBD2(event) {

        console.log(imagenJugador);
        event.preventDefault();
        if (dniJugadorRef2.current.value !=="" && nombreCompletoRef2.current.value !== "" && fechaNacimientoRef2.current.value
         !== "" && pesoRef2.current.value !== "" && alturaRef2.current.value !== "" && posicionRef2.current.value !== ""
         && dorsalRef2.current.value !== "" && paisRef2.current.value !== "" && desplegableEquiposRef2.current.value !== ""
         && imagenJugador !== null ) {

            //Si el archivo es una imagen, se introducirá en la base de datos.
            if (imagenJugador.name.endsWith('.jpg') || imagenJugador.name.endsWith('.jpeg') || imagenJugador.name.endsWith('.png') || imagenJugador.name.endsWith('.webp') || imagenJugador.name.endsWith('.jpe')) {

                const reader = new FileReader();
                reader.onloadend = async () => {
                let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

                //Parametros para la inserción del jugador
                let parametrosJugador = new FormData();
                parametrosJugador.append("dni_jugador", dniJugadorRef2.current.value.trim());
                parametrosJugador.append("nombre_completo", nombreCompletoRef2.current.value.trim());
                parametrosJugador.append("fecha_nacimiento", fechaNacimientoRef2.current.value);
                parametrosJugador.append("peso", pesoRef2.current.value.trim());
                parametrosJugador.append("altura", alturaRef2.current.value.trim());
                parametrosJugador.append("posicion", posicionRef2.current.value);
                parametrosJugador.append("dorsal", dorsalRef2.current.value.trim());
                parametrosJugador.append("pais", paisRef2.current.value.trim());
                parametrosJugador.append("id_equipo", desplegableEquiposRef2.current.value);
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
                    parametrosMovimiento.append("dni_jugador", dniJugadorRef2.current.value);
                    parametrosMovimiento.append("id_equipo_antiguo",0);
                    parametrosMovimiento.append("id_equipo_nuevo",desplegableEquiposRef2.current.value);
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
                            frmRegistrarJugadorRef1.current.reset();
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
            <form className="p-0 mb-3 mx-auto d-none d-md-block" ref={frmRegistrarJugadorRef1}>
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center mt-1">Datos del jugador</h2>
                    </div>
                </div>
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
                        <input type="text" className="form-control shadow-none" ref={dniJugadorRef1} minLength={9} maxLength={9} required />
                   </div> 
                   <div className="col-8">
                        <input type="text" className="form-control shadow-none" ref={nombreCompletoRef1} maxLength={40} required />
                   </div> 
                </div>
                <div className="row mt-2">
                   <div className="col-4">
                        <label className="form-label my-auto">F. nac </label>
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
                        <input type="date" className="form-control shadow-none" ref={fechaNacimientoRef1} min={0} required />
                   </div> 
                   <div className="col-4">
                       <input type="number" className="form-control shadow-none" ref={alturaRef1} min={0} required />
                   </div> 
                   <div className="col-4">
                       <input type="number" className="form-control shadow-none" ref={pesoRef1} minLength={2} maxLength={5} step="0.1" min={50} required />
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
                        <select className="form-select shadow-none" ref={posicionRef1} aria-label="Default select example" required>
                            <option value="-">-</option>
                            <option value="Portero">Portero</option>
                            <option value="Defensa">Defensa</option>
                            <option value="Centrocampista">Centrocampista</option>
                            <option value="Delantero">Delantero</option>
                        </select>
                   </div> 
                   <div className="col-3">
                        <input type="number" className="form-control shadow-none" ref={dorsalRef1} max={99} required />
                   </div> 
                   <div className="col-5">
                        <input type="text" className="form-control shadow-none" ref={paisRef1} minLength={3} maxLength={30} required />
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
                        <select className="form-control shadow-none" ref={desplegableEquiposRef1} required>

                        </select>
                   </div> 
                   <div className="col-7">
                        <input className="form-control shadow-none" type="file" onChange={(event) => handleChangeFile(event.target.files[0])} required/>
                   </div> 
                </div>         
                <div className="row mt-2">
                    <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                        <button className="btn1 text-truncate p-1 w-100 p-lg-2" onClick={guardarJugadorEnBD1}>ACEPTAR </button>
                    </div>
                </div>      
            </form>

        {/* Formulario para tamaños de pantalla pequeños */}
            <form className="d-block d-md-none mb-3 mx-auto p-0" ref={frmRegistrarJugadorRef2}>
                <div className="row">
                    <div className="col-22">
                        <h2 className="text-center mt-2">Datos del jugador</h2>
                    </div>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">DNI / INE</label>
                    <input type="text" className="form-control shadow-none" ref={dniJugadorRef2} minLength={9} maxLength={9} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Nombre completo </label>
                    <input type="text" className="form-control shadow-none" ref={nombreCompletoRef2} maxLength={35} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Fecha de nacimiento </label>
                    <input type="date" className="form-control shadow-none" ref={fechaNacimientoRef2} min={0} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Peso (Kg)</label>
                    <input type="number" className="form-control shadow-none" ref={pesoRef2} minLength={2} maxLength={5} step="0.1" min={50} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Altura (cm) </label>
                    <input type="number" className="form-control shadow-none" ref={alturaRef2} min={0} required />
                </div>
                <div className="my-3 row mx-0">
                    <label className="form-label my-auto">Posición</label>
                    <select className="form-select shadow-none" ref={posicionRef2} aria-label="Default select example" required>
                        <option value="-">-</option>
                        <option value="portero">Portero</option>
                        <option value="defensa">Defensa</option>
                        <option value="centrocampista">Centrocampista</option>
                        <option value="delantero">Delantero</option>
                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Dorsal </label>
                    <input type="number" className="form-control shadow-none" ref={dorsalRef2} min={0} max={99} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Lugar de nacimiento</label>
                    <input type="text" className="form-control shadow-none" ref={paisRef2} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Equipo</label>
                    <select className="form-control shadow-none" ref={desplegableEquiposRef2} required>

                    </select>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label">Imagen</label>
                    <input className="form-control shadow-none" type="file" ref={imagenJugador} onChange={(event) => handleChangeFile(event.target.files[0])} required/>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                        <button className="btn1 text-truncate p-1 w-100 p-lg-2" onClick={guardarJugadorEnBD2}>ACEPTAR </button>
                    </div>
                </div>              
            </form>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
        </>
    );
}