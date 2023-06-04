import { useState,useRef } from 'react';
import { useAuth } from "../context/AuthContext";
import 'animate.css';
import MyModal from './Modal';

export default function Card({ info, getJugadores }) {

    //Constantes
    const auth = useAuth();
    const user = auth.user;

    //Inicializamos la variable de estado 'datos' con los datos que pasen en la prop.
    const [datos, setDatos] = useState({
        id_jugador: info.id_jugador, dni_jugador: info.dni_jugador,
        nombre_completo: info.nombre_completo, fecha_nacimiento: info.fecha_nacimiento,
        peso: info.peso, altura: info.altura, posicion: info.posicion, dorsal: info.dorsal,
        pais: info.pais, imagen: info.imagen});
    const [datosAnteriores, setDatosAnteriores] = useState({});
    const [verDatos, setVerDatos] = useState(false);
    const [activarEdicion, setActivarEdicion] = useState(false);
    const [imagenJugador, setImagenJugador] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    //Referencias al DOM del componente.
    const cardRef = useRef(null);
    const estadoInicialRef = useRef(null);
    const nombreJugadorRef = useRef(null);
    const imagenRef = useRef('');

    const handleVerdatos = ( () => {

        cardRef.current.classList.add("animate__animated" ,"animate__flipOutY");
        cardRef.current.addEventListener("animationend", () => {
            cardRef.current.classList.remove("animate__animated" ,"animate__flipOutY");
            setVerDatos(true);
        });
    });

    const handleOcultarDatos = ( () => {

        cardRef.current.classList.add("animate__animated" ,"animate__flipOutY");
        cardRef.current.addEventListener("animationend", () => {
            cardRef.current.classList.remove("animate__animated" ,"animate__flipOutY");
            setVerDatos(false);
        });
    });

    const handleActivarEdicion = ( () => {

        setVerDatos(false);
        //Guardamos los datos anteriores antes por si la edición se cancela.
        setDatosAnteriores({...datos});
        setActivarEdicion(true);     

    });

    const handleChangeNuevoDato = ( (event) => {

        const name = event.target.name;  // por ej: dorsal
        const value = event.target.value;
        // console.log("Name y value del nuevo dato: ", name, value);
        setDatos ({...datos, [name]: value});
    });


    const handleChangeCambioImagen = ( (event) => {

        console.log("imagen ANTERIOR: ", datos.imagen); 

        let img = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

            //Convertimos la imagen en formato base64 para insertarla en la bbdd.
            setImagenJugador(base64Imagen);
            const name = event.target.name;  // "nombre" o "apellidos"  
            console.log("nombre: ", name);
            console.log("value: ", base64Imagen);
            console.log("NUEVA IMAGEN: ", base64Imagen);
            
            let img = "data:image/png;base64," + base64Imagen;
            const blob = await fetch(img).then((res) => res.blob());
            let urlImagen = URL.createObjectURL(blob);
            setDatos({...datos, imagen : urlImagen});
            console.log("NUEVA IMAGEN:", datos.imagen);
        } 
        reader.readAsDataURL(img);
    });

    const cancelarEdicion = ( (event) => {

        event.preventDefault();
        setDatos({...datosAnteriores});
        setActivarEdicion(false); 
        setVerDatos(true);

    });

    const eliminarJugador = ( () => {

        if (window.confirm("¿Eliminar jugador?")){

            cardRef.current.classList.add("animate__animated" ,"animate__fadeOut");
            cardRef.current.addEventListener("animationend", async () => {
                cardRef.current.classList.remove("animate__animated" ,"animate__fadeOut");
                
                //Eliminamos el elemento del DOM cuando se termine la animación.
                cardRef.current.classList.add('d-none');

                //Borramos el jugador de la BD.
                let parametros = new FormData();
                parametros.append("id_jugador", datos.id_jugador)
                let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/DELETE/eliminarJugador.php", 
                {
                    method :'POST',
                    body : parametros
                });

                if (response.ok){

                    let respuesta = await response.json();
                    if (respuesta.datos.includes('correctamente')){
                        getJugadores();
                    }
                }
            });
        }      

    });

    const updateDatosJugador = ( async (event) => {

        event.preventDefault();
        let noHayImagen = imagenRef.current.files.length === 0;
            // console.log("Dorsal: ", datos.posicion);
            // console.log("Datos anteriores", datosAnteriores.posicion);
        let parametros = new FormData();
        parametros.append("id_jugador", datos.id_jugador);
        parametros.append("dni_jugador", datos.dni_jugador);
        parametros.append("nombre_completo", datos.nombre_completo);
        parametros.append("fecha_nacimiento", datos.fecha_nacimiento);
        parametros.append("peso", datos.peso);
        parametros.append("altura", datos.altura);
        parametros.append("posicion", datos.posicion);
        parametros.append("dorsal", datos.dorsal);
        parametros.append("pais", datos.pais);
        parametros.append("imagen", noHayImagen ? 0 : imagenJugador);
        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/UPDATE/actualizarJugador.php",{

            method : 'POST',
            body : parametros        
        });

        if (response.ok){

            let respuesta = await response.json();
            if (!respuesta.error && respuesta.datos.includes('correctamente')){

                console.log("nuevos datos: ", datos);
                setActivarEdicion(false);
                setVerDatos(true);
                if (datos.posicion !== datosAnteriores.posicion){
                    getJugadores(event);
                }
            }else{
                setTextoModal(respuesta.datos);
                setModalError(true);
                setShowModal(true);
            }       
        }       

    });

    return (
        <div className='col-10 col-sm-5 col-md-4 col-lg-3 p-1 my-1 mx-auto m-sm-0' ref={cardRef}>
            <div className="card cardJugador my-0 border-2 rounded-3">
                <div className="card-body p-0">
                    <div className="row mb-2 mx-auto text-center fs-5 p-lg-1 text-white" style={{ backgroundColor: '#182E3E' }}>
                        <p className='m-auto' ref={nombreJugadorRef}>{datos.nombre_completo.split(" ")[0]   }</p>
                    </div>

                    {verDatos === false && activarEdicion === false &&
                        <div ref={estadoInicialRef}>                
                            <div className="row my-2">
                                {console.log("Imagen en el estado inicial", datos.imagen)}
                                <img src={datos.imagen} className="img-fluid" alt="..." />
                            </div>

                            <div className='row mx-auto'>
                                <div className='col m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={handleVerdatos}><i className="bi bi-info-circle-fill"></i></button></div>
                            </div>                              
                        </div>                                           
                    }

                    {verDatos === true &&                      
                        <>    
                            {/* {nombreJugadorRef.current.textContent = datos.nombre_completo.split(" ")[0]} */}
                            {console.log("Imagen cuando se ven los datos", datos.imagen)}       
                            <div className="row mx-auto datoJugador my-0">
                                <p className='text-start my-0'>DNI / INE: {datos.dni_jugador}</p>
                            </div>
                            <div className="row mx-auto datoJugador">
                                <p className='text-start my-1'>Nombre: {datos.nombre_completo}</p>
                            </div>
                            <div className="row mx-auto datoJugador">
                                <p className='text-start my-1'>F. nac: {datos.fecha_nacimiento}</p>
                            </div>
                            <div className="row mx-auto datoJugador">
                                <p className='text-start my-1'>Origen: {datos.pais} </p>
                            </div>
                            <div className="row mx-auto datoJugador">
                                <p className='text-start my-1'>Peso: {datos.peso} kg</p>
                            </div>
                            <div className="row mx-auto datoJugador">
                                <p className='text-start my-1'>Altura: {datos.altura} cm</p>
                            </div>
                            <div className="row mx-auto datoJugador">
                                <p className='text-start my-1'>Dorsal: {datos.dorsal}</p>
                            </div> 
                        
                            {user.uid !== "CPifWKxzLqPFg3N8hIauBdhf3lT2" &&
                                <div className='row mx-auto'>
                                    <div className='col m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={handleOcultarDatos}><i className="bi bi-arrow-left-circle-fill"></i></button></div>
                                </div>   
                            }  
                    
                            {/* Si el usuario es admin */}
                            {user.uid === "CPifWKxzLqPFg3N8hIauBdhf3lT2" &&
                            <div className='row mx-auto'>
                                <div className='col-4 m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={handleOcultarDatos}><i className="bi bi-arrow-left-circle-fill"></i></button></div>
                                <div className='col-4 m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={handleActivarEdicion}><i className="bi bi-pencil-square m-auto"></i></button></div>
                                <div className='col-4 m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={eliminarJugador}><i className="bi bi-trash3-fill"></i></button></div>
                            </div>      
                            }                                
                        </>             
                    }

                    {activarEdicion === true &&
                    
                        <form className='p-1'>
                            <div className='row mx-auto'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador" >DNI / INE</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" onChange={handleChangeNuevoDato} defaultValue={datos.dni_jugador} name='dni_jugador' readOnly={!activarEdicion} minLength={9} maxLength={9}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">Nombre </label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" defaultValue={datos.nombre_completo} onChange={handleChangeNuevoDato} name='nombre_completo' readOnly={!activarEdicion} minLength={40} maxLength={40}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">F. nac</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" defaultValue={datos.fecha_nacimiento} onChange={handleChangeNuevoDato} name='fecha_nacimiento' readOnly={!activarEdicion} minLength={10} maxLength={10}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">Peso </label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1"defaultValue={datos.peso} onChange={handleChangeNuevoDato} name='peso' readOnly={!activarEdicion} minLength={2} maxLength={3}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">Altura </label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" defaultValue={datos.altura} onChange={handleChangeNuevoDato} name='altura' readOnly={!activarEdicion} minLength={3} maxLength={3}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">Posición</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'>
                                    <select className="form-select shadow-none d-flex align-items-center justify-content-center p-1" defaultValue={datos.posicion} onChange={handleChangeNuevoDato} readOnly={!activarEdicion} name='posicion' aria-label="Default select example" >
                                        <option value="-">-</option>
                                        <option value="Portero">Portero</option>
                                        <option value="Defensa">Defensa</option>
                                        <option value="Centrocampista">Centrocampista</option>
                                        <option value="Delantero">Delantero</option>
                                    </select>
                                </div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">Dorsal</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" defaultValue={datos.dorsal} onChange={handleChangeNuevoDato} name='dorsal' readOnly={!activarEdicion} minLength={1} maxLength={2}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">País</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" defaultValue={datos.pais} onChange={handleChangeNuevoDato} name='pais' readOnly={!activarEdicion} minLength={3} maxLength={20}  /></div>
                            </div>
                            <div className="row mx-0">
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'><label className="form-label labelCardJugador">Imagen</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'>
                                    <input className="form-control shadow-none p-1" type="file" name='imagen' ref={imagenRef} onChange={handleChangeCambioImagen} />
                                </div>
                            </div>
                            <div className='row mx-auto mb-0 my-1 p-0'>
                                <div className='col-6 m-0 fs-4 p-1'> <button className='btn1 w-100 fs-4 p-0' onClick={updateDatosJugador} ><i className="bi bi-check-circle-fill"></i></button></div>   
                                <div className='col-6 m-0 fs-4 p-1'> <button className='btn1 w-100 fs-4 p-0' onClick={cancelarEdicion}><i className="bi bi-x-circle-fill"></i></button></div>     
                            </div>
                        </form>
                    }
                    <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />   
                </div>
            </div>
        </div>

    );
}

