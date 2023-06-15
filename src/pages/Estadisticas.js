import { useEffect, useRef, useState } from "react";
import { IconBallFootball } from '@tabler/icons-react';
import { IconShoe } from '@tabler/icons-react';
import tarjeta_amarilla from '../img/tarjeta_amarilla.png';
import tarjeta_roja from '../img/tarjeta_roja.png';
import tarjeta_amarilla_sin_mano from '../img/yellow_card_wo_hand.png';
import tarjeta_roja_sin_mano from '../img/red_card_wo_hand.png';
import MyModal from "../components/Modal";
import MyFooter from "../components/Footer";

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
    const tbodyRef1 = useRef(null);
    const bigTableRef = useRef(null);
    const smallTableRef = useRef(null);
     
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
    
                    bigTableRef.current.classList.remove('d-none');
                    tbodyRef1.current.innerHTML = "";
                    //Si ya se han añadido jugadores al DOM, se eliminan para poder mostrar únicamente los nuevos que
                    //sean anyadidos.
                    if (smallTableRef.current.firstElementChild.nextElementSibling !== null){
                        smallTableRef.current.firstElementChild.nextElementSibling.innerHTML = "";
                    }
                    smallTableRef.current.classList.remove('d-none');
                    let contadorJugadores = 1;
                    for (let jugador of respuesta.datos){
                        
                        // Tabla grande
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

                        imagen.classList.add('img-fluid');
                        imagen.style.width = '3.5em';
                        imagen.style.height = '4em';
                        imagen.style.backgroundColor = 'white';
                        td.appendChild(imagen);
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = jugador.nombre_completo;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        let pos
                        if (jugador.posicion === "Portero"){
                            pos = "POR";
                        }else if(jugador.posicion === "Defensas"){
                            pos = "DEF";
                        }else if(jugador.posicion === "Centrocampista"){
                            pos = "CEN";
                        }else {
                            pos = "DEL";
                        } 
                        td.textContent = pos;                       
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

                        tbodyRef1.current.appendChild(tr);

                        //Tabla pequeña
                        let rowPrincipal = document.createElement('div');
                        let backgroundColor2 = contadorJugadores % 2 === 0 ? "#182E3E" : "rgb(252, 224, 179)";
                        let fontColor2 = contadorJugadores % 2 === 0 ? "rgb(252, 224, 179)" : "#182E3E";   
                        rowPrincipal.style.backgroundColor = backgroundColor2;
                        rowPrincipal.style.color = fontColor2;
                        rowPrincipal.style.borderBottom = "4px solid white";
                        rowPrincipal.classList.add('row', 'fs-6');

                        //Columna donde se mostará la imagen 
                        let col = document.createElement('div');
                        col.classList.add('col-3','p-0');
                        col.key = "jugador" + contadorJugadores;
                        let imagen2 = document.createElement('img');
                        imagen2.src = urlImagenJugador; //Usamos la url de generada en la línea 99
                        imagen2.classList.add('img-fluid','my-auto');
                        imagen2.style.width = '100%';
                        imagen2.style.height = '80px';
                        imagen2.style.backgroundColor = 'white';
                        col.appendChild(imagen2);
                        rowPrincipal.appendChild(col);

                        //Columna donde se mostarán los datos del jugador.
                        let colDatos = document.createElement('div');
                        colDatos.classList.add('col-8','p-1');

                        let containerDatos = document.createElement('div');
                        containerDatos.classList.add('container-fluid');

                        let row = document.createElement('div');
                        row.classList.add('row');
                        containerDatos.appendChild(row);

                        col = document.createElement('col');
                        col.classList.add('col-12', 'p-0');
                        col.textContent = "Nombre: " + jugador.nombre_completo;
                        row.appendChild(col);

                        col = document.createElement('col');
                        col.classList.add('col-3', 'p-0');
                        col.textContent = "G: " + jugador.goles;
                        row.appendChild(col);

                        col = document.createElement('col');
                        col.classList.add('col-3', 'p-0', 'text-center');
                        col.textContent = "As: " + jugador.asistencias;
                        row.appendChild(col);

                        col = document.createElement('div');
                        col.classList.add('col-3','p-0');
                        imagen = document.createElement('img');
                        imagen.src = tarjeta_amarilla_sin_mano; 
                        imagen.classList.add('img-fluid','my-auto');
                        imagen.style.width = '16px';
                        imagen.style.height = '20px';
                        col.appendChild(imagen);

                        let span = document.createElement('span');
                        span.textContent = jugador.tarjetas_amarillas;
                        col.appendChild(span);
                        row.appendChild(col);

                        col = document.createElement('div');
                        col.classList.add('col-3','p-0');
                        imagen = document.createElement('img');
                        imagen.src = tarjeta_roja_sin_mano; 
                        imagen.classList.add('img-fluid','my-auto');
                        imagen.style.width = '16px';
                        imagen.style.height = '20px';
                        col.appendChild(imagen);

                        span = document.createElement('span');
                        span.textContent = jugador.tarjetas_rojas;  
                        col.appendChild(span);                   
                        row.appendChild(col);

                        //Insertamos el container con los datos en la columna donde se muestran los datos.
                        colDatos.appendChild(containerDatos);
                        rowPrincipal.append(colDatos);                      

                        smallTableRef.current.appendChild(rowPrincipal);
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
            setTextoModal("Por favor, selecciona una competición.");
            setModalError(true);
            setShowModal(true);
        }

    });


    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <form className="col-12 col-sm-10 col-lg-7 mx-auto mt-4 p-0">
                        <div className="row m-sm-auto me-md-4">
                            <div className="col-12 col-sm-3 text-center p-0">                        
                                <label className="form-label my-auto">Competición</label>
                            </div>
                            <div className="col-10 col-sm-9 p-0 mx-auto mx-sm-0 my-auto">
                                <select className="form-select shadow-none p-1" ref={desplegableCompeticionesRef} required>

                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                {/* Botones para pantallas de resolución en md e inferior */}
                <div className="row">
                    <div className="col-12 col-sm-11 col-md-10 d-lg-none mx-auto mt-4 p-0">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-6 col-sm-3">
                                    <button className="text-center p-3 btn1 w-100" onClick={() => handleChangeCriterioOrdenacion('goles')}> <IconBallFootball size={'42'} /> </button>
                                </div>
                                <div className="col-6 col-sm-3">
                                    <button className="text-center p-3 btn1 w-100" onClick={() => handleChangeCriterioOrdenacion('asistencias')}> <IconShoe size={'42'} /> </button>
                                </div>
                                <div className="col-6 col-sm-3 mt-3 mt-sm-0">
                                    <button className="text-center p-1 btn1 w-100" onClick={() => handleChangeCriterioOrdenacion('tarjetas_amarillas')}> 
                                            <img src={tarjeta_amarilla}  className="mt-2" width={'55px'} height={'58px'} alt="Yellow Card" />
                                        </button>                                
                                </div>
                                <div className="col-6 col-sm-3 mt-3 mt-sm-0">
                                    <button className="text-center p-1 btn1 w-100" onClick={() => handleChangeCriterioOrdenacion('tarjetas_rojas')}> 
                                        <img src={tarjeta_roja} className="mt-2" width={'55px'} height={'58px'} alt="Red Card" />
                                    </button>  
                                </div>                                
                            </div>
                        </div>                           
                    </div>
                     {/* Botones para pantallas grandes */}
                     <div className="d-none d-lg-block col-lg-2 col-xl-aut2 p-0 mt-3 p-lg-3 ms-auto">
                        <button className="text-center p-3 btn1 w-100 mt-2 mt-lg-5 mt-xl-3 mb-3" onClick={() => handleChangeCriterioOrdenacion('goles')}> <IconBallFootball size={'42'} /> </button>
                        <button className="text-center p-3 btn1 w-100 mb-3" onClick={() => handleChangeCriterioOrdenacion('asistencias')}> <IconShoe size={'42'} /> </button>
                        <button className="text-center p-1 btn1 w-100 mb-3" onClick={() => handleChangeCriterioOrdenacion('tarjetas_amarillas')}> 
                            <img src={tarjeta_amarilla}  className="mt-2" width={'55px'} height={'55px'} alt="Yellow Card" />
                        </button>
                        <button className="text-center p-1 btn1 w-100 mb-3" onClick={() => handleChangeCriterioOrdenacion('tarjetas_rojas')}> 
                            <img src={tarjeta_roja} className="mt-2" width={'55px'} height={'55px'} alt="Red Card" />
                        </button>            
                    </div>      
                    {/* Tabla para pantallas de resolución sm en adelante */}
                    <div className="d-none d-sm-block col-sm-11 col-md-10 col-lg-8 col-xl-7 p-0 p-md-1 mx-sm-auto mx-lg-0 me-lg-auto">
                        <table className="table p-0 d-none mx-auto" ref={bigTableRef}>
                            <thead>
                                <tr>
                                    <th className="text-center">Jugador</th>
                                    <th className="text-center">Nombre</th>
                                    <th className="text-center">Pos</th>
                                    <th className="text-center">Goles</th>
                                    <th className="text-center">Asistencias</th>
                                    <th className="text-center">
                                        <img src={tarjeta_amarilla}  className="mt-2" width={'50px'} height={'50px'} alt="Yellow Card" />
                                    </th>
                                    <th className="text-center">
                                        <img src={tarjeta_roja}  className="mt-2" width={'50px'} height={'50px'} alt="Yellow Card" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody ref={tbodyRef1} className="fs-5">

                            </tbody>
                        </table>    
                    </div>
                    {/* Tabla para pantallas de tamaño menor a sm */}
                    <div className="col-11 d-sm-none mx-auto mt-2 p-0">
                        <div className="d-none container-fluid mx-auto" ref={smallTableRef}>
                            <div className="row m-auto">
                                <div className="col-6 p-0">Jugador</div>
                                <div className="col-6 p-0">Datos</div>
                            </div>                           
                        </div>
                    </div>                      
                </div>
            </div>
            <MyFooter />
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
        </>
    );
}
   

