import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";

export default function CardEquipo({info}){

     //Constantes
    const auth = useAuth();
    const user = auth.user;    

    const [datos, setDatos] = useState({nombre : info.nombre, estadio : info.estadio, fecha_fundacion : info.fecha_fundacion});
    const [datosAnteriores, setDatosAnteriores] = useState({});
    const [verDatos, setVerDatos] = useState(true);
    const [activarEdicion, setActivarEdicion] = useState(false);

    //Referencias al DOM
    const imagenRef = useRef(null);

    const handleChangeCambioImagen = ( () => {

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

    const updateDatosEquipo = ( () => {


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
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador" >Nombre</label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" onChange={handleChangeNuevoDato} defaultValue={datos.nombre} name='dni_jugador' readOnly={!activarEdicion} minLength={9} maxLength={9}  /></div>
                                </div>
                                <div className='row mx-auto my-2'>
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">Estadio </label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="text" className="form-control shadow-none p-1" defaultValue={datos.estadio} onChange={handleChangeNuevoDato} name='nombre_completo' readOnly={!activarEdicion} minLength={40} maxLength={40}  /></div>
                                </div>
                                <div className='row mx-auto my-2'>
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'> <label className="form-label my-auto labelCardJugador">Fundación </label></div>
                                    <div className='col-8 p-0 d-flex align-items-center justify-content-center'><input type="date" className="form-control shadow-none p-1" defaultValue={datos.fecha_fundacion } onChange={handleChangeNuevoDato} name='nombre_completo' readOnly={!activarEdicion} minLength={40} maxLength={40}  /></div>
                                </div>
                                <div className="row mx-0">
                                    <div className='col-4 p-0 text-center d-flex align-items-center justify-content-center'><label className="form-label labelCardJugador">Imagen</label></div>
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
        </div>
    );
}