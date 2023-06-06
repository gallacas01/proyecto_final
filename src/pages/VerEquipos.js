import { useEffect, useRef, useState } from 'react';
import MyModal from '../components/Modal';
import CardEquipo from '../components/CardEquipo.js';

//Método que crea un elemento de tipo option cuyo valor y textContent se pasan por parámetro.
function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function Equipos(){

    const [idCompeticion, setIdCompeticion] = useState("-");
    const [equipos, setEquipos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    const desplegableCompeticionesRef = useRef(null);
    const encabezadoCompeticionRef = useRef(null);
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
                if (!respuesta.error){                

                    let competicion = desplegableCompeticionesRef.current.options[desplegableCompeticionesRef.current.selectedIndex].textContent;
                    encabezadoCompeticionRef.current.textContent = competicion;
    
                    let arrayEquipos = [];     
                    contenedorEquiposRef.current.classList.remove('d-none');               
                    // Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                    for (let equipo of respuesta.datos){

                        let imagenDB = "data:image/png;base64," + equipo.escudo;
                        const blob = await fetch(imagenDB).then((res) => res.blob());
                        let urlImagen = URL.createObjectURL(blob);

                        let info = { "id_equipo" : equipo.id_equipo, "nombre" : equipo.nombre, "estadio" : equipo.estadio
                        , "fecha_fundacion" : equipo.fecha_fundacion, "escudo" : urlImagen}
                        arrayEquipos.push(<CardEquipo key={equipo.id_equipo} info={info} />);
                    }
                    setEquipos(arrayEquipos);
                }
            }    
        }else{
            setTextoModal("Por favor, selecciona una competición.");
            setModalError(true);
            setShowModal(true);
        }
    }); 
    
    return (
        <div className="container-fluid">
            <div className="row p-0">
                <form className="col-lg-6 mx-auto my-3 p-0">
                    <div className="row m-auto">
                        <div className="col-auto p-1">                        
                            <label className="form-label m-auto">Competición</label>
                        </div>
                        <div className="col-8 p-0 my-auto mx-2">
                            <select className="form-select shadow-none p-1" ref={desplegableCompeticionesRef} onChange={(event) => setIdCompeticion(event.target.value)} required>

                            </select>
                        </div>
                        <div className='col ms-1 p-0'>                    
                            <button className="btn1 w-100" onClick={getEquipos} ><i className="bi bi-search fs-4"></i></button>  
                        </div>
                    </div>
                </form>
            </div>
            <div className='row d-none p-0' ref={contenedorEquiposRef}>
                
                <div className='col-9 text-center mx-auto p-0'>
                    <h1 className="text-center mt-lg-1 p-2" ref={encabezadoCompeticionRef} style={{color : 'rgb(252, 224, 179)', backgroundColor : "#182E3E"}}></h1>
                </div>       
            </div>            
            <div className='row p-0'>
                <div className='col-9 mx-auto p-0'>
                    <div className='container-fluid p-0 m-auto'>
                        <div className='row p-0 m-auto'>
                            {equipos}
                        </div>
                    </div>
                </div>                                
            </div> 
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
        </div>
    );
}
   

