import { useEffect, useRef } from "react";
import NavBar from "./NavBar";
import './css/bootstrap.css';
import './css/styles.css';

//Método que crea un elemento de tipo option cuyo valor y textContent se pasan por parámetro.
function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function Clasificacion (){

    //Variables de estado.
    const desplegableCompeticionesRef = useRef(null);
    const tablaRef = useRef(null);
    const tbodyRef = useRef(null);

    const getClasificacion = ( async () => {
       
        let idComepticion = desplegableCompeticionesRef.current.value;
        if (idComepticion !== "-"){

            let parametros = new FormData();
            parametros.append("id_competicion", idComepticion);

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getClasificacion.php",
            {
                method : 'POST',
                body : parametros
            });
            if (response.ok){
    
                let respuesta = await response.json();
                if (!respuesta.error && respuesta.datos.length > 0){
    
                    //Visibilizamos la tabla.
                    tablaRef.current.classList.remove('d-none');
                    tbodyRef.current.innerHTML = " ";
                   
                    //Recorremos los equipos creando un td por cada equipo y añadiendolo a la tabla.
                    let contadorEquipos = 1;
                    for (let equipo of respuesta.datos){
                        
                        let tr = document.createElement('tr');
                        let backgroundColor = contadorEquipos % 2 === 0 ? "#182E3E" : "rgb(252, 224, 179)";
                        let fontColor = contadorEquipos % 2 === 0 ? "rgb(252, 224, 179)" : "#182E3E";   
                        tr.style.backgroundColor = backgroundColor;
                        tr.style.color = fontColor;
                        tr.style.borderBottom = "4px solid white";

                        let td;
                        td = document.createElement('td');
                        td.textContent = contadorEquipos;
                        td.classList.add('text-center');
                        
                        // tr.style.backgroundColor = "black";
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = equipo.nombre_equipo;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = equipo.puntos;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = equipo.partidos_jugados;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = equipo.partidos_ganados;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = equipo.partidos_perdidos;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = equipo.partidos_empatados;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = equipo.goles_a_favor;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        td = document.createElement('td');
                        td.textContent = equipo.goles_en_contra;
                        td.classList.add('text-center');
                        tr.appendChild(td);
    
                        tbodyRef.current.appendChild(tr);
                        contadorEquipos++;
                    }//Fin del bucle for.
    
                }else if (!respuesta.error && respuesta.datos.length === 0){
                    alert("No hay datos registrados para esa competición.");
                }
            }
        }else{
            alert("Selecciona una competición");
        }       

    }); //Fin de la función.

    useEffect ( () => {

        const rellenarDesplegableCompeticiones = ( async () => {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getCompeticiones.php");
            if (response.ok){

                let respuesta = await response.json();
                if (!respuesta.error && respuesta.datos.length > 0){

                    //Recuperamos el desplegable de competiciones y añadimos el primer elemento, cuyo valor será '-'.
                    desplegableCompeticionesRef.current.innerHTML = " ";
                    let optionVacio = createOptionElement("-","-");
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

    return (
        <div className="container-fluid">

            <div className="row"><NavBar /></div>
            <div className="row">
                <form className="col-lg-6 mx-auto mt-lg-4 p-0">
                    <div className="row mx-auto">
                        <label className="form-label text-end my-auto col-lg-3">Competición</label>
                        <div className="col-lg p-0 my-auto">
                            <select className="form-select shadow-none" ref={desplegableCompeticionesRef} required>

                            </select>
                        </div>
                    <button className="btn1 col-lg-2 ms-lg-2" onClick={ (event) => {event.preventDefault(); getClasificacion();}}><i className="bi bi-search fs-5"></i></button>  
                    </div>
                </form>
            </div>
            <div className="row mt-3 d-none" ref={tablaRef}>
                <div className="col-lg-9 p-0 m-0 mx-auto">
                    <table className="table">
                        <thead>
                            <th className="text-center">Pos</th>
                            <th className="text-center">Equipo</th>
                            <th className="text-center">Puntos</th>
                            <th className="text-center">P. J.</th>
                            <th className="text-center">V </th>
                            <th className="text-center">E</th>
                            <th className="text-center">D</th>
                            <th className="text-center">G.F.</th>
                            <th className="text-center">G.C.</th>
                        </thead>
                        <tbody ref={tbodyRef}>

                        </tbody>
                    </table>  
                </div>          
            </div>

        </div>
       
    );
}