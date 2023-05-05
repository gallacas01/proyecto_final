import { useState,useRef, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import '../css/bootstrap.css';
import '../css/styles.css';
import 'animate.css';

// import {Animation} from 'react-animate-style'; 

export default function Card({ info, metodos }) {

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
    const [verDatos, setVerDatos] = useState(false);
    const cardRef = useRef(null);

    const handleVerdatos = ( () => {

        cardRef.current.classList.add("animate__animated" ,"animate__flipOutY");
        cardRef.current.addEventListener("animationend", () => {
            cardRef.current.classList.remove("animate__animated" ,"animate__flipOutY");
            setVerDatos(true);
        });
    })

    const handleOcultarDatos = ( () => {

        cardRef.current.classList.add("animate__animated" ,"animate__flipOutY");
        cardRef.current.addEventListener("animationend", () => {
            cardRef.current.classList.remove("animate__animated" ,"animate__flipOutY");
            setVerDatos(false);
        });
    })

    const eliminarJugador = ( () => {

        if (window.confirm("¿Eliminar jugador?")){

            cardRef.current.classList.add("animate__animated" ,"animate__fadeOut");
            cardRef.current.addEventListener("animationend", async () => {
                cardRef.current.classList.remove("animate__animated" ,"animate__fadeOut");
                
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
                        metodos();
                    }
                }
            });
        }      

    })

    return (
        <div className='col-lg-3 p-1 my-1' ref={cardRef}>
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

                            {/* <div className="row mt-2 mx-auto">
                                <p className='text-start my-auto'>Posición: {datos.posicion}</p>
                            </div>

                            <div className="row mx-auto my-2">
                                <p className='text-start my-auto'>Dorsal: {datos.dorsal}</p>
                            </div> */}

                            {user.uid === "CPifWKxzLqPFg3N8hIauBdhf3lT2" &&
                                <div className='row mx-auto'>
                                    <div className='col-4 m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={handleVerdatos}><i class="bi bi-info-circle-fill"></i></button></div>
                                    <div className='col-4 m-0 fs-4 p-1'><button className='btn1 w-100 p-0'><i class="bi bi-pencil-square m-auto"></i></button></div>
                                    <div className='col-4 m-0 fs-4 p-1'><button className='btn1 w-100 p-0' onClick={eliminarJugador}><i class="bi bi-trash3-fill"></i></button></div>
                                </div>                              
                            }
                        </>                                           
                    }

                    {verDatos === true &&

                        <>           
                            {/* <Animation animationIn="bounceIn" animationOut="bounceOut" > */}
                                <div className="row my-2 mx-auto p-1">
                                    <p className='text-start my-auto'>DNI / INE: {datos.dni_jugador}</p>
                                </div>
                                <div className="row my-2 mx-auto p-1">
                                    <p className='text-start my-auto'>Nombre completo: {datos.nombre_completo}</p>
                                </div>
                                <div className="row my-1 mx-auto p-1">
                                    <p className='text-start my-auto'>F. nacimiento: {datos.fecha_nacimiento}</p>
                                </div>
                                <div className="row mx-auto my-1 p-1">
                                    <p className='text-start my-auto'>Origen: {datos.pais} </p>
                                </div>
                                <div className="row mx-auto my-1 p-1">
                                    <p className='text-start my-auto'>Peso: {datos.peso} kg</p>
                                </div>
                                <div className="row mx-auto my-1 p-1">
                                    <p className='text-start my-auto'>Altura: {datos.altura} cm</p>
                                </div>
                                <div className="row mx-auto my-2 p-1">
                                    <p className='text-start my-auto'>Dorsal: {datos.dorsal}</p>
                                </div> 
                                <div className='row mx-auto'>
                                    <div className='col-4 m-0 fs-6 p-1'><button className='btn1 w-100 p-0'><i class="bi bi-info-circle-fill"></i></button></div>
                                    <div className='col-4 m-0 fs-6 p-1'><button className='btn1 w-100 p-0' onClick={handleOcultarDatos}><i class="bi bi-arrow-left-circle-fill"></i></button></div>
                                </div>     
                            {/* </Animation> */}
                        </>             
                    }

                </div>
            </div>
        </div>

    );
}

