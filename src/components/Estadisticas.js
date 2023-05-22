import { useEffect, useRef, useState } from "react";
import { IconBallFootball } from '@tabler/icons-react';
import { IconShoe } from '@tabler/icons-react';
import '../css/bootstrap.css';
import '../css/styles.css';
import NavBar from "./NavBar";

const convertirImagenDB = ( async (img) => {

    let imagen = "data:image/png;base64," + img;
    const blob = await fetch(imagen).then((res) => res.blob());
    return URL.createObjectURL(blob);
});

export default function Estadisticas(){

    //Variables de estado
    const tbodyRef = useRef(null);
    const tableRef = useRef(null);
    const [criterioDeOrdenacion, setCriterioDeOrdenacion] = useState(''); 

    useEffect ( () => {

        const getEstadisticas = ( async (criterioDeOrdenacion) => {

            let parametros = new FormData();
            parametros.append("ordenacion", criterioDeOrdenacion);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEstadisticas.php",{
                method : 'POST',
                body : parametros
            });
    
            if (response.ok){
    
                let respuesta = await response.json();
                if(!respuesta.error && respuesta.datos.length > 0){
    
                    tableRef.current.classList.remove('d-none');
                    tbodyRef.current.innerHTML = "";
                    //Recorremos el array que contiene los jugadores y montamos la tabla.
                    let contadorJugadores = 1;
                    for (let jugador of respuesta.datos){
                        
                        let tr = document.createElement('tr');
                        tr.key = "jugador" + contadorJugadores;
                        let backgroundColor = contadorJugadores % 2 === 0 ? "#182E3E" : "rgb(252, 224, 179)";
                        let fontColor = contadorJugadores % 2 === 0 ? "rgb(252, 224, 179)" : "#182E3E";   
                        tr.style.backgroundColor = backgroundColor;
                        tr.style.color = fontColor;
                        tr.style.borderBottom = "4px solid white";
    
                        let td = document.createElement('td');
                        let urlImagenJugador = await convertirImagenDB(jugador.imagen);
                        let imagen = document.createElement('img');
                        imagen.src = urlImagenJugador;
                        // let borderColor = contadorEquipos % 2 === 0 ? "rgb(252, 224, 179)" : "#182E3E";   
                        imagen.classList.add('img-fluid');
                        imagen.style.width = '60px';
                        imagen.style.height = '60px';
                        // imagen.style.border = '3px solid ' + borderColor;
                        td.appendChild(imagen);
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = jugador.nombre_completo;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = jugador.posicion;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = jugador.goles;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = jugador.asistencias;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = jugador.tarjetas_amarillas;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = jugador.tarjetas_rojas;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        tbodyRef.current.appendChild(tr);
                        contadorJugadores++;
                    };
                }
            }
        });//Fin de la función.

        getEstadisticas(criterioDeOrdenacion);
    },[criterioDeOrdenacion]);

    return (
        <>
            <div className="col-12 p-0"><NavBar /></div>
            <div className="container">
                <div className="row mt-4">
                    <div className="col-lg-2">
                        <button className="text-center p-3 btn1 w-100 mt-2 mb-3" onClick={() => setCriterioDeOrdenacion('goles')}> <IconBallFootball size={'42'} /> </button>
                        <button className="text-center p-3 btn1 w-100 mb-3" onClick={() => setCriterioDeOrdenacion('asistencias')}> <IconShoe size={'42'} /> </button>
                        <button className="text-center p-1 btn1 w-100 mb-3" onClick={() => setCriterioDeOrdenacion('tarjetas_amarillas')}> 
                            <img src="https://www.iconpacks.net/icons/1/free-yellow-card-icon-489-thumb.png" className="mt-2" width={'55px'} height={'55px'} alt="Yellow Card" />
                        </button>
                        <button className="text-center p-1 btn1 w-100 mb-3" onClick={() => setCriterioDeOrdenacion('tarjetas_rojas')}> 
                            <img src="https://www.iconpacks.net/icons/1/free-red-card-icon-460-thumb.png" className="mt-2" width={'55px'} height={'55px'} alt="Red Card" />
                        </button>            
                    </div>
                    <div className="col">
                        <table className="table p-0 d-none" ref={tableRef}>
                            <thead>
                                <th className="text-center">Jugador</th>
                                <th className="text-center">Nombre</th>
                                <th className="text-center">Posición</th>
                                <th className="text-center">Goles</th>
                                <th className="text-center">Asistencias</th>
                                <th className="text-center">Tarjetas amarillas </th>
                                <th className="text-center">Tarjetas rojas</th>
                            </thead>
                            <tbody ref={tbodyRef}>

                            </tbody>
                        </table>                       
                    </div>
                </div>
            </div>
        </>
    );
}
   

