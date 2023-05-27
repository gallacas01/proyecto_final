import { useEffect, useRef, useState } from 'react';
import '../css/bootstrap.css';
import '../css/styles.css';
import MyModal from './Modal';
import CardEquipo from './CardEquipo.js';

//Método que crea un elemento de tipo option cuyo valor y textContent se pasan por parámetro.
function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function Equipos(){

    const [idCompeticion, setIdCompeticion] = useState("-");
    const [nombreCompeticion, setnombreCompeticion] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    const desplegableCompeticionesRef = useRef(null);
    const desplegableEquiposRef = useRef(null);
    const contenedorEquiposRef = useRef(null);


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


    const handleChangeCambioCompeticion = ( (event) => {

        setIdCompeticion(event.target.value);
        let competicion = event.target.options[event.target.selectedIndex].textContent;
        setnombreCompeticion(competicion);
    });
        
    const getEquipos = ( async (event) => {

        event.preventDefault();
        if (idCompeticion !== "-"){

       
            let parametros = new FormData();
            parametros.append("id_competicion", idCompeticion);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquiposDeUnaCompeticion.php",
            {
                method : 'POST',
                body : parametros
            })
            if (response.ok){

                let respuesta = await response.json();
                if (!respuesta.error && respuesta.datos.length > 0){                

                    contenedorEquiposRef.current.classList.remove('d-none');
                        // Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                        for (let equipo of respuesta.datos){

                            let imagenDB = "data:image/png;base64," + equipo.escudo;
                            const blob = await fetch(imagenDB).then((res) => res.blob());
                            let urlImagen = URL.createObjectURL(blob);

                            let info = { "id_equipo" : equipo.id_equipo, "nombre" : equipo.nombre, "estadio" : equipo.estadio
                            , "fecha_fundacion" : equipo.fecha_fundacion, "escudo" : urlImagen}
                            setEquipos([...equipos, <CardEquipo key={equipo.id_equipo} info={info} />])
                    }
                }
            }    
        }else{
            alert("Por favor, selecciona una competición.");
        }
    }); 
    
    return (
        <div className="container-fluid">
            <div className="row p-0">
                <form className="col-lg-6 mx-auto mt-lg-4 p-0">
                    <div className="row">
                        <div className="col-2 text-start p-0">                        
                            <label className="form-label">Competición</label>
                        </div>
                        <div className="col-8 p-0 my-auto">
                            <select className="form-select shadow-none" ref={desplegableCompeticionesRef} onChange={handleChangeCambioCompeticion} required>

                            </select>
                        </div>

                        <div className='col ms-3 p-0'>                    
                            <button className="btn1 w-75" onClick={getEquipos} ><i className="bi bi-search fs-4"></i></button>  
                        </div>
                    </div>
                </form>
            </div>
            <div className='row d-none p-0' ref={contenedorEquiposRef}>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-10 text-center mx-auto p-0'>
                            Equipos de la competición {nombreCompeticion}
                        </div>       
                    </div>            
                    <div className='row'>
                        <div className='col-9 mx-auto p-0'>
                            {equipos}
                        </div>
                    </div>
                </div>                    
            </div> 
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
        </div>
    );
}
   

