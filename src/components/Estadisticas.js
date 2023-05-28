import { useEffect, useRef, useState } from "react";
import { IconBallFootball } from '@tabler/icons-react';
import { IconShoe } from '@tabler/icons-react';
import '../css/bootstrap.css';
import '../css/styles.css';
import tarjeta_amarilla from '../img/tarjeta_amarilla.png';
import tarjeta_roja from '../img/tarjeta_roja.png';
import MyModal from "./Modal";

//Método que crea un elemento de tipo option cuyo valor y textContent se pasan por parámetro.
function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

const convertirImagenDB = ( async (img) => {

    let imagen = "data:image/png;base64," + img;
    const blob = await fetch(imagen).then((res) => res.blob());
    return URL.createObjectURL(blob);
});

export default function Estadisticas(){

    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    const desplegableCompeticionesRef = useRef(null);
    //Referencias al DOM
    const tbodyRef = useRef(null);
    const tableRef = useRef(null);
     
    useEffect ( () => {

        const rellenarDesplegableCompeticiones = ( async () => {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getCompeticiones.php");
            if (response.ok){

                let respuesta = await response.json();
                if (!respuesta.error && respuesta.datos.length > 0){

                    //Recuperamos el desplegable de competiciones y añadimos el primer elemento, cuyo valor será '-'.
                    desplegableCompeticionesRef.current.innerHTML = " ";
                    let optionVacio = createOptionElement("-","-");
                    optionVacio.selected = true;
                    desplegableCompeticionesRef.current.appendChild(optionVacio);
                    
                    //Recorremos el array de competiciones anyadiendo cada una al desplegable de competiciones.
                    for (let competicion of respuesta.datos){
                        let option = createOptionElement(competicion.id_competicion, competicion.nombre + ", Temp " + competicion.temporada);
                        desplegableCompeticionesRef.current.appendChild(option);
                    }
                }
            }            
        });

        rellenarDesplegableCompeticiones();
    },[]);

    //Método que crea la tabla con las estadísticas de los jugadores.
    const getEstadisticas = ( async (idCompeticion, criterioDeOrdenacion) => {

            let parametros = new FormData();
            parametros.append("id_competicion", idCompeticion);
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
                        imagen.style.width = '100%';
                        imagen.style.height = '4em';
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

                }else if (respuesta.datos.length === 0){
                    setTextoModal("No se han jugado partidos en esa competición.");
                    setModalError(false);
                }else{
                    setTextoModal(respuesta.datos);
                    setModalError(true);
                }
            }
    });//Fin de la función.

    const handleChangeCriterioOrdenacion = ( (criterioDeOrdenacion) => {

        let idCompeticion = desplegableCompeticionesRef.current.value;
        if (idCompeticion !== "-"){

            getEstadisticas(idCompeticion, criterioDeOrdenacion);
        }else{
            console.log(idCompeticion, "||", criterioDeOrdenacion);
            setTextoModal("Por favor, selecciona una competición");
            setModalError(true);
            setShowModal(true);
        }

    });


    return (
        <>
            <div className="container">
                <div className="row">
                    <form className="col-lg-6 mx-auto my-3 p-0">
                        <div className="row m-auto">
                            <div className="col-2 text-start p-0">                        
                                <label className="form-label mt-1">Competición</label>
                            </div>
                            <div className="col-8 p-0 my-auto">
                                <select className="form-select shadow-none" ref={desplegableCompeticionesRef} required>

                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row mt-3 mx-4">
                    <div className="col-2">
                        <button className="text-center p-3 btn1 w-100 mt-2 mb-3" onClick={() => handleChangeCriterioOrdenacion('goles')}> <IconBallFootball size={'42'} /> </button>
                        <button className="text-center p-3 btn1 w-100 mb-3" onClick={() => handleChangeCriterioOrdenacion('asistencias')}> <IconShoe size={'42'} /> </button>
                        <button className="text-center p-1 btn1 w-100 mb-3" onClick={() => handleChangeCriterioOrdenacion('tarjetas_amarillas')}> 
                            <img src={tarjeta_amarilla}  className="mt-2" width={'55px'} height={'55px'} alt="Yellow Card" />
                        </button>
                        <button className="text-center p-1 btn1 w-100 mb-3" onClick={() => handleChangeCriterioOrdenacion('tarjetas_rojas')}> 
                            <img src={tarjeta_roja} className="mt-2" width={'55px'} height={'55px'} alt="Red Card" />
                        </button>            
                    </div>
                    <div className="col-10">
                        <table className="table p-0 d-none" ref={tableRef}>
                            <thead>
                                <tr>
                                    <th className="text-center">Jugador</th>
                                    <th className="text-center">Nombre</th>
                                    <th className="text-center">Posición</th>
                                    <th className="text-center">Goles</th>
                                    <th className="text-center">Asistencias</th>
                                    <th className="text-center">Tarj. amarillas </th>
                                    <th className="text-center">Tarj. rojas</th>
                                </tr>
                            </thead>
                            <tbody ref={tbodyRef}>

                            </tbody>
                        </table>                       
                    </div>
                </div>
            </div>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
        </>
    );
}
   

