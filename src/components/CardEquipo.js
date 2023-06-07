import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";
import MyModal from "./Modal";

export default function CardEquipo({ info, getEquipos }) {

    //Constantes
    const auth = useAuth();
    const user = auth.user;

    const [datos, setDatos] = useState({
        id_equipo: info.id_equipo,
        nombre: info.nombre,
        estadio: info.estadio,
        fecha_fundacion: info.fecha_fundacion,
        escudo: info.escudo
    });
    const [datosAnteriores, setDatosAnteriores] = useState({});
    const [verDatos, setVerDatos] = useState(false);
    const [activarEdicion, setActivarEdicion] = useState(false);
    const [imagenEquipo, setImagenEquipo] = useState(null);
    const [numJugadores, setNumJugadores] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    const imagenRef = useRef(null);
    const cardRef = useRef(null);

    useEffect ( () => {

        //Obtenemos el número de jugadores del equipo la primera vez que se renderice el componente.
        const getNumJugadores = ( async () => {

            let parametros = new FormData();
            parametros.append("id_equipo", info.id_equipo);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getJugadoresDeUnEquipo.php", {
                method: 'POST',
                body: parametros
            });

            if (response.ok){

                let respuesta  = await response.json();
                setNumJugadores(respuesta.datos.length);
            }
        });
        getNumJugadores();
    },[]);

    const handleVerdatos = (() => {

        cardRef.current.classList.add("animate__animated", "animate__flipOutY");
        cardRef.current.addEventListener("animationend", () => {
            cardRef.current.classList.remove("animate__animated", "animate__flipOutY");
            setVerDatos(true);
        });
    });

    const handleChangeCambioImagen = ((event) => {

        let img = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

            //Convertimos la imagen en formato base64 para insertarla en la bbdd.
            setImagenEquipo(base64Imagen);
            let img = "data:image/png;base64," + base64Imagen;
            const blob = await fetch(img).then((res) => res.blob());
            let urlImagen = URL.createObjectURL(blob);
            setDatos({ ...datos, escudo: urlImagen });
            // console.log("NUEVA IMAGEN:", datos.imagen);
        }
        reader.readAsDataURL(img);
    });

    const handleChangeNuevoDato = ((event) => {

        const name = event.target.name;  // por ej: dorsal
        const value = event.target.value;
        console.log("Name y value del nuevo dato: ", name, value);
        setDatos({ ...datos, [name]: value });
    });

    const handleActivarEdicion = (() => {

        setVerDatos(false);
        //Guardamos los datos anteriores antes por si la edición se cancela.
        setDatosAnteriores({ ...datos });
        setActivarEdicion(true);
    });

    const handleCancelarEdicion = ((event) => {

        event.preventDefault();
        setDatos({ ...datosAnteriores });
        setActivarEdicion(false);
        setVerDatos(true);
    });

    const handleOcultarDatos = (() => {

        cardRef.current.classList.add("animate__animated", "animate__flipOutY");
        cardRef.current.addEventListener("animationend", () => {
            cardRef.current.classList.remove("animate__animated", "animate__flipOutY");
            setVerDatos(false);
        });
    });

    const updateDatosEquipo = (async (event) => {

        event.preventDefault();
        //Comprobamos si hay imagen para enviar un valor u otro en función de eso a la BBDD.
        let noHayImagen = imagenRef.current.files.length === 0;
        // console.log("Datos anteriores", datosAnteriores.posicion);
        let parametros = new FormData();
        parametros.append("id_equipo", datos.id_equipo);
        parametros.append("nombre", datos.nombre);
        parametros.append("estadio", datos.estadio);
        parametros.append("fecha_fundacion", datos.fecha_fundacion);
        parametros.append("escudo", noHayImagen ? 0 : imagenEquipo);
        let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/UPDATE/actualizarEquipo.php", {

            method: 'POST',
            body: parametros
        });

        if (response.ok) {

            let respuesta = await response.json();
            if (!respuesta.error && respuesta.datos.includes('correctamente')) {

                // console.log("nuevos datos: ", datos);
                setActivarEdicion(false);
                setVerDatos(true);
            } else {
                setTextoModal(respuesta.datos);
                setModalError(true);
                setShowModal(true);
            }
            console.log(respuesta.datos);
        }
    });

    const eliminarEquipo = (() => {

        if (window.confirm("Al eliminar el equipo, se eliminarán sus jugadores. ¿Quieres continuar?")){

            cardRef.current.classList.add("animate__animated" ,"animate__fadeOut");
            cardRef.current.addEventListener("animationend", async () => {
                cardRef.current.classList.remove("animate__animated" ,"animate__fadeOut");
                
                //Eliminamos el elemento del DOM cuando se termine la animación.
                cardRef.current.classList.add('d-none');

                //Borramos el jugador de la BD.
                let parametros = new FormData();
                parametros.append("id_equipo", datos.id_equipo);
                let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/DELETE/eliminarEquipo.php", 
                {
                    method :'POST',
                    body : parametros
                });

                if (response.ok){

                    let respuesta = await response.json();
                    if (respuesta.datos.includes('correctamente')){
                        getEquipos();
                    }
                }
            });
        }      

    });

    return (
        <div className='col-10 col-sm-6 col-md-4 col-lg-3 p-1 my-1 mx-auto m-sm-0' ref={cardRef}>
            <div className="card cardEquipo my-0 rounded-3">
                <div className="card-body fs-5 p-0">

                    {verDatos === false && activarEdicion === false &&
                        <div className="row mx-auto">
                            <div className="col-12 p-0">
                                <img src={datos.escudo} className="img-fluid" alt="Imagen del equipo" />
                            </div>
                            <div className='col-12 p-0'>
                                <div className='col m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={handleVerdatos}><i className="bi bi-info-circle-fill"></i></button></div>
                            </div>
                        </div>
                    }

                    {verDatos === true &&
                        <>
                            {/* {console.log("datos", datos)} */}
                            <div className="row mx-auto">
                                <div className="col-12 p-0">
                                    <p className="text-center fs-4 m-0" style={{ backgroundColor: '#182E3E' , color : "white"}} >Información</p>
                                </div>
                            </div>
                            <div className="row mx-auto p-1 mt-0">
                                <div className="col-12">
                                    <p className="m-auto">Nombre: {datos.nombre}</p>
                                </div>
                            </div>
                            <div className="row mx-auto p-1">
                                <div className="col-12">
                                    <p className="m-auto">Estadio: {datos.estadio}</p>
                                </div>
                            </div>
                            <div className="row mx-auto p-1">
                                <div className="col-12">
                                    <p className="m-auto">Fundación: {datos.fecha_fundacion}</p>
                                </div>
                            </div>
                            <div className="row mx-auto p-1">
                                <div className="col-12">
                                    <p className="m-auto">Nº de jugadores: {numJugadores }</p>
                                </div>
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
                                    <div className='col-4 m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={eliminarEquipo}><i className="bi bi-trash3-fill"></i></button></div>
                                </div>
                            }
                        </>
                    }

                    {activarEdicion === true &&
                        <>
                            <div className="row mx-auto mb-2">
                                <div className="col-12 p-0">
                                    <p className="text-center fs-4 m-0" style={{ backgroundColor: '#182E3E' , color : "white"}} >Modificación</p>
                                </div>
                            </div>
                            <form className='p-1'>
                                <div className='row mx-auto'>
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardEquipo" >Nombre</label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" onChange={handleChangeNuevoDato} defaultValue={datos.nombre} name='nombre' readOnly={!activarEdicion} minLength={5} maxLength={40} /></div>
                                </div>
                                <div className='row mx-auto my-2'>
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardEquipo">Estadio </label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" defaultValue={datos.estadio} onChange={handleChangeNuevoDato} name='estadio' readOnly={!activarEdicion} minLength={5} maxLength={40} /></div>
                                </div>
                                <div className='row mx-auto my-2'>
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardEquipo">Fundación </label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="date" className="form-control shadow-none p-1" defaultValue={datos.fecha_fundacion} onChange={handleChangeNuevoDato} name='fecha_fundacion' readOnly={!activarEdicion} minLength={10} maxLength={10} /></div>
                                </div>
                                <div className="row mx-0">
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'><label className="form-label labelCardEquipo">Imagen</label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'>
                                        <input className="form-control shadow-none p-1" type="file" name='escudo' ref={imagenRef} onChange={handleChangeCambioImagen} />
                                    </div>
                                </div>
                            </form>
                            <div className='row mx-auto mb-0 my-1 p-0'>
                                <div className='col-6 m-0 fs-4 p-1'> <button className='btn1 w-100 fs-4 p-0' onClick={updateDatosEquipo} ><i className="bi bi-check-circle-fill"></i></button></div>
                                <div className='col-6 m-0 fs-4 p-1'> <button className='btn1 w-100 fs-4 p-0' onClick={handleCancelarEdicion}><i className="bi bi-x-circle-fill"></i></button></div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />
        </div>
    );
}