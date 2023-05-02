import { useState,useRef } from 'react';
import '../css/bootstrap.css';
import '../css/styles.css';
import 'animate.css';
// import {Animation} from 'react-animate-style'; 

export default function Card({ info }) {

    //Inicializamos la variable
    const [datos, setDatos] = useState({
        id_jugador: info.id_jugador, dni_jugador: info.dni_jugador,
        nombre_completo: info.nombre_completo, fecha_nacimiento: info.fecha_nacimiento,
        peso: info.peso, altura: info.altura, posicion: info.posicion, dorsal: info.dorsal,
        pais: info.pais, equipo: info.equipo, imagen: info.imagen
    });
    const [verDatos, setVerDatos] = useState(false);
    const cardRef = useRef(null);

    return (
        <div className='col-lg-3 p-1 my-1'ref={cardRef}>
            <div className="card my-0 border-2 rounded-3">
                <div className="card-body p-0" >
                    <div className="row mb-2 mx-auto text-center fs-5 p-lg-1 text-white" style={{ backgroundColor: '#182E3E' }}>
                        <p className='m-auto'>{datos.nombre_completo.split(" ")[0]}</p>
                    </div>

                    {verDatos === false &&
                        <>                
                            <div className="row my-2">
                                <img src={datos.imagen} className="img-fluid" alt="..." />
                            </div>

                            <div className="row mt-2 mx-auto">
                                <p className='text-start my-auto'>Posición: {datos.posicion}</p>
                            </div>

                            <div className="row mx-auto my-2">
                                <p className='text-start my-auto'>Dorsal: {datos.dorsal}</p>
                            </div>
                            <div className='row mx-auto'>
                                <button className='btn1 w-100' onClick={ () => setVerDatos(true)}>Ver datos</button>
                            </div>
                        </>                                           
                    }

                    {verDatos === true &&

                        <>           
                            {/* <Animation animationIn="bounceIn" animationOut="bounceOut" > */}
                                <div className="row my-2 mx-auto p-2">
                                    <p className='text-start my-auto'>Nombre completo: {datos.nombre_completo}</p>
                                </div>
                                <div className="row my-1 mx-auto p-2">
                                    <p className='text-start my-auto'>F. nacimiento: {datos.fecha_nacimiento}</p>
                                </div>
                                <div className="row mx-auto my-1 p-2">
                                    <p className='text-start my-auto'>Peso: {datos.peso} kg</p>
                                </div>
                                <div className="row mx-auto my-1 p-2">
                                    <p className='text-start my-auto'>Altura: {datos.altura} cm</p>
                                </div>
                            {/* </Animation> */}
                        </>             
                    }

                </div>
            </div>
        </div>

    );
}

