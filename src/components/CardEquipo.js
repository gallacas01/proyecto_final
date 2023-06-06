import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";
import MyModal from "./Modal";

export default function CardEquipo({info}){

     //Constantes
    const auth = useAuth();
    const user = auth.user;    

    const [datos, setDatos] = useState({
        id_equipo: info.id_equipo,
        nombre : info.nombre, 
        estadio : info.estadio, 
        fecha_fundacion : info.fecha_fundacion,
        escudo : info.escudo});
    const [datosAnteriores, setDatosAnteriores] = useState({});
    const [verDatos, setVerDatos] = useState(true);
    const [activarEdicion, setActivarEdicion] = useState(false);
    const [imagenEquipo, setImagenEquipo] = useState(null);
     const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    //Referencias al DOM
    const imagenRef = useRef(null);

    const handleChangeCambioImagen = ( (event) => {

        console.log("imagen ANTERIOR: ", datos.escudo); 

        let img = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

            //Convertimos la imagen en formato base64 para insertarla en la bbdd.
            setImagenEquipo(base64Imagen);            
            let img = "data:image/png;base64," + base64Imagen;
            const blob = await fetch(img).then((res) => res.blob());
            let urlImagen = URL.createObjectURL(blob);
            setDatos({...datos, imagen : urlImagen});
            console.log("NUEVA IMAGEN:", datos.imagen);
        } 
        reader.readAsDataURL(img);
    });

    const handleChangeNuevoDato = ( (event) => {

        const name = event.target.name;  // por ej: dorsal
        const value = event.target.value;
        console.log("Name y value del nuevo dato: ", name, value);
        setDatos ({...datos, [name]: value});
    });

    const handleActivarEdicion = ( () => {

        setVerDatos(false);
        //Guardamos los datos anteriores antes por si la edición se cancela.
        setDatosAnteriores({...datos});
        setActivarEdicion(true);     

    });

    const handleCancelarEdicion = ( (event) => {

        event.preventDefault();
        setDatos({...datosAnteriores});
        setActivarEdicion(false); 
        setVerDatos(true);
    });

    const updateDatosEquipo = ( async (event) => {

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
                  
              }else{
                  setTextoModal(respuesta.datos);
                  setModalError(true);
                  setShowModal(true);
              }       
          }       

    });

    return(
        <div className='col-lg-3 p-1 my-1'>
            <div className="card cardEquipo my-0 rounded-3">
                <div className="card-body fs-5 p-0">
                <div className="row mx-auto">          
                    <div className="col-12 p-0">
                        <img src={info.escudo} className="w-100 h-100" alt="Imagen del equipo"/>
                    </div>
                </div>
                {verDatos === true && 
                    <>
                    {console.log("datosss", datos)}
                        <div className="row mx-auto p-1">
                            <div className="col-12">
                                <p className="m-auto">Nombre: {info.nombre}</p>
                            </div>
                        </div>
                        <div className="row mx-auto p-1">
                            <div className="col-12">
                                <p className="m-auto">Estadio: {info.estadio}</p>
                            </div>
                        </div>
                        <div className="row mx-auto p-1">
                            <div className="col-12">
                                <p className="m-auto">Fundación: {info.fecha_fundacion}</p>
                            </div>
                        </div>
                    
                        {user.uid === "CPifWKxzLqPFg3N8hIauBdhf3lT2" &&
                            <div className="row mx-auto p-0">
                                <div className="col-6 p-0">
                                    <div className='fs-4 p-1'><button className='btn1 w-100 p-0' onClick={handleActivarEdicion}> <i className="bi bi-pencil-square m-auto"></i></button></div>
                                </div>
                                <div className="col-6 p-0">
                                    <div className='fs-4 p-1'><button className='btn1 w-100 p-0'><i className="bi bi-trash3-fill"></i></button></div>                            </div>
                                </div>
                        }     
                    </>    
                }

                    {activarEdicion === true &&   
                        <>                   
                            <form className='p-1'>
                                <div className='row mx-auto'>
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardEquipo" >Nombre</label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" onChange={handleChangeNuevoDato} defaultValue={datos.nombre} name='dni_jugador' readOnly={!activarEdicion} minLength={9} maxLength={9}  /></div>
                                </div>
                                <div className='row mx-auto my-2'>
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardEquipo">Estadio </label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" defaultValue={datos.estadio} onChange={handleChangeNuevoDato} name='nombre_completo' readOnly={!activarEdicion} minLength={40} maxLength={40}  /></div>
                                </div>
                                <div className='row mx-auto my-2'>
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardEquipo">Fundación </label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="date" className="form-control shadow-none p-1" defaultValue={datos.fecha_fundacion } onChange={handleChangeNuevoDato} name='nombre_completo' readOnly={!activarEdicion} minLength={40} maxLength={40}  /></div>
                                </div>
                                <div className="row mx-0">
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'><label className="form-label labelCardEquipo">Imagen</label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'>
                                        <input className="form-control shadow-none p-1" type="file" name='imagen' ref={imagenRef} onChange={handleChangeCambioImagen} />
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