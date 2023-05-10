import { useState,useRef } from 'react';
import { useAuth } from "../context/AuthContext";
import '../css/bootstrap.css';
import '../css/styles.css';
import 'animate.css';

function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function Card({ info, getJugadores }) {

    //Constantes
    const auth = useAuth();
    const user = auth.user;

    //Inicializamos la variable de estado 'datos' con los datos que pasen en la prop.
    const [datos, setDatos] = useState({
        id_jugador: info.id_jugador, dni_jugador: info.dni_jugador,
        nombre_completo: info.nombre_completo, fecha_nacimiento: info.fecha_nacimiento,
        peso: info.peso, altura: info.altura, posicion: info.posicion, dorsal: info.dorsal,
        pais: info.pais, equipo: info.equipo, imagen: info.imagen
    });
    const [datosAnteriores, setDatosAnteriores] = useState({});
    const [verDatos, setVerDatos] = useState(false);
    const [activarEdicion, setActivarEdicion] = useState(false);
    const [nuevaImagen, setNuevaImagen] = useState('');
    const cardRef = useRef(null);
    const estadoInicialRef = useRef(null);
    const nombreJugadorRef = useRef(null);
    const desplegableEquiposRef = useRef(null);

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
        nombreJugadorRef.current.textContent = "Nuevos datos";
        //Guardamos los datos anteriores antes por si la edición se cancela.
        setDatosAnteriores({...datos});
        setActivarEdicion(true);     
        rellenarDesplegableEquipos();   
    });

    const handleChangeNuevoDato = ( (event) => {

        const name = event.target.name;  // "nombre" o "apellidos"  
        const value = event.target.value;
        console.log("Name y value del nuevo dato: ", name, value);
        setDatos ({...datos, [name]: value});
    });


    const handleChangeCambioImagen = ( (event) => {

        console.log("imagen ANTERIOR: ", datos.imagen); 

        let img = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

            setNuevaImagen(base64Imagen);
            console.log("NUEVA IMAGEN: ", base64Imagen);
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
                if (equipo.id_equipo === datos.equipo){
                    option.selected = true;
                }
                desplegableEquiposRef.current.appendChild(option);
            }
        }
    }

    const updateDatosJugador = ( async (event) => {

        event.preventDefault();        
        console.log("Datos anteriores: ", datos);

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
        parametros.append("id_equipo", datos.equipo);
        parametros.append("imagen", nuevaImagen);
        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/UPDATE/actualizarJugador.php",{

            method : 'POST',
            body : parametros        
        });

        if (response.ok){
            
            let respuesta = await response.json();
            if (!respuesta.error){

                let img = "data:image/png;base64," + nuevaImagen;
                const blob = await fetch(img).then((res) => res.blob());
                let urlImagen = URL.createObjectURL(blob);

                setDatos({...datos, imagen : urlImagen});
                console.log("nuevos datos: ", datos);
                setActivarEdicion(false);
                setVerDatos(true);
            }        
        }       

    });

    return (
        <div className='col-lg-3  p-1 my-1' ref={cardRef}>
            <div className="card my-0 border-2 rounded-3">
                <div className="card-body p-0" >
                    <div className="row mb-2 mx-auto text-center fs-5 p-lg-1 text-white" style={{ backgroundColor: '#182E3E' }}>
                        <p className='m-auto' ref={nombreJugadorRef}>{datos.nombre_completo.split(" ")[0]}</p>
                    </div>

                    {verDatos === false && activarEdicion === false &&
                        <div ref={estadoInicialRef}>                
                            <div className="row my-2">
                                <img src={datos.imagen} className="img-fluid" alt="..." />
                            </div>

                            <div className='row mx-auto'>
                                <div className='col m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={handleVerdatos}><i className="bi bi-info-circle-fill"></i></button></div>
                            </div>                              
                        </div>                                           
                    }

                    {verDatos === true &&                      
                        <>    
                          {console.log("Imagen cuando se ven los datos", datos.imagen)}       
                            {/* <Animation animationIn="bounceIn" animationOut="bounceOut" > */}
                                <div className="row mx-auto p-1">
                                    <p className='text-start my-auto'>DNI / INE: {datos.dni_jugador}</p>
                                </div>
                                <div className="row mx-auto p-1">
                                    <p className='text-start my-auto'>Nombre completo: {datos.nombre_completo}</p>
                                </div>
                                <div className="row mx-auto p-1">
                                    <p className='text-start my-auto'>F. nacimiento: {datos.fecha_nacimiento}</p>
                                </div>
                                <div className="row mx-auto p-1">
                                    <p className='text-start my-auto'>Origen: {datos.pais} </p>
                                </div>
                                <div className="row mx-auto p-1">
                                    <p className='text-start my-auto'>Peso: {datos.peso} kg</p>
                                </div>
                                <div className="row mx-auto p-1">
                                    <p className='text-start my-auto'>Altura: {datos.altura} cm</p>
                                </div>
                                <div className="row mx-auto p-1">
                                    <p className='text-start my-auto'>Dorsal: {datos.dorsal}</p>
                                </div> 

                              
                                {!user.uid === "CPifWKxzLqPFg3N8hIauBdhf3lT2" &&
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
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto">DNI / INE</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none" onChange={handleChangeNuevoDato} defaultValue={datos.dni_jugador} name='dni_jugador' readOnly={!activarEdicion} minLength={9} maxLength={9}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto">Nombre </label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none" defaultValue={datos.nombre_completo} onChange={handleChangeNuevoDato} name='nombre_completo' readOnly={!activarEdicion} minLength={9} maxLength={9}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto">F. nac</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none" defaultValue={datos.fecha_nacimiento} onChange={handleChangeNuevoDato} name='fecha_nacimiento' readOnly={!activarEdicion} minLength={9} maxLength={9}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto">Peso </label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none"defaultValue={datos.peso} onChange={handleChangeNuevoDato} name='peso' readOnly={!activarEdicion} minLength={2} maxLength={3}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto">Altura </label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none" defaultValue={datos.altura} onChange={handleChangeNuevoDato} name='altura' readOnly={!activarEdicion} minLength={3} maxLength={3}  /></div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto">Posición</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'>
                                    <select className="form-select shadow-none d-flex align-items-center justify-content-center" defaultValue={datos.posicion} onChange={handleChangeNuevoDato} readOnly={!activarEdicion} name='posicion' aria-label="Default select example" >
                                        <option value="-">-</option>
                                        <option value="portero">Portero</option>
                                        <option value="defensa">Defensa</option>
                                        <option value="centrocampista">Centrocampista</option>
                                        <option value="delantero">Delantero</option>
                                    </select>
                                </div>
                            </div>
                            <div className='row mx-auto my-2'>
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto">Dorsal</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none" defaultValue={datos.dorsal} name='dorsal' readOnly={!activarEdicion} minLength={1} maxLength={2}  /></div>
                            </div>
                            <div className="my-2 row mx-0">
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'><label className="form-label my-auto">Equipo</label></div>
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'> 
                                    <select className="form-control shadow-none" name='equipo' onChange={handleChangeNuevoDato} ref={desplegableEquiposRef} equired>

                                    </select>
                                </div>
                            </div>
                            <div className="row mx-0">
                                <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'><label className="form-label">Imagen</label></div>
                                {/* onChange={(event) => {setNuevaImagen(event.target.files[0]); console.log(nuevaImagen)}} */}
                                <div className='col-8 p-0 d-flex align-items-center justify-content-center'>
                                    <input className="form-control shadow-none" type="file" name='imagen' onChange={handleChangeCambioImagen} />
                                </div>
                            </div>
                            <div className='row mx-auto p-0'>
                                <div className='col-6 m-0 fs-4 p-1'> <button className='btn1 w-100 fs-3 p-0' onClick={updateDatosJugador} ><i className="bi bi-check-circle-fill"></i></button></div>   
                                <div className='col-6 m-0 fs-4 p-1'> <button className='btn1 w-100 fs-3 p-0' onClick={cancelarEdicion}><i className="bi bi-x-circle-fill"></i></button></div>     
                            </div>
                        </form>
                    }

                </div>
            </div>
        </div>

    );
}

