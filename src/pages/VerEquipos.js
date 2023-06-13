import { useEffect, useRef, useState } from 'react';
import MyModal from '../components/Modal';
import CardEquipo from '../components/CardEquipo.js';
import MyFooter from '../components/Footer';

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
    const [showFooter, setShowFooter] = useState(false);


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

                        //Obtenemos la url de la imagen de la BBDD.
                        let imagenDB = "data:image/png;base64," + equipo.escudo;
                        const blob = await fetch(imagenDB).then((res) => res.blob());
                        let urlImagen = URL.createObjectURL(blob);

                        //Creamos un Card del equipo por cada equipo del bucle y lo añadimos al array de equipos.
                        let info = { "id_equipo" : equipo.id_equipo, "nombre" : equipo.nombre, "estadio" : equipo.estadio
                        , "fecha_fundacion" : equipo.fecha_fundacion, "escudo" : urlImagen}
                        arrayEquipos.push(<CardEquipo key={equipo.id_equipo} info={info} getEquipos={getEquipos}/>);
                    }
                    //Asignamos a equipos el array de equipos creado anteriormente.
                    setEquipos(arrayEquipos);
                    setShowFooter(true);
                }
            }    
        }else{
            setTextoModal("Por favor, selecciona una competición.");
            setModalError(true);
            setShowModal(true);
        }
    }); 
    
    return (
        <>
            <div className="container-fluid">
                <div className="row p-0">
                    <form className="col-12 col-sm-9 col-md-9 col-lg-6 my-3 p-0 mx-auto">
                        <div className="row m-auto">
                            <div className="col-12 col-sm-auto text-start p-1 ms-2 ms-sm-0">                        
                                <label className="form-label m-auto">Competición</label>
                            </div>
                            <div className="col-9 col-sm-7 col-md-8 col-xx-6 mx-2 p-0 my-auto">
                                <select className="form-select shadow-none p-1" ref={desplegableCompeticionesRef} onChange={(event) => setIdCompeticion(event.target.value)} required>

                                </select>
                            </div>
                            <div className='col-2 col-sm col-xxl-1 ms-1 p-0'>                    
                                <button className="btn1 w-100" onClick={getEquipos} ><i className="bi bi-search fs-4"></i></button>  
                            </div>
                        </div>
                    </form>
                </div>
                <div className='row d-none p-0' ref={contenedorEquiposRef}>
                    
                    <div className='col-12 col-sm-10 col-md-9 text-center mx-auto p-1'>
                        <h1 className="text-center mt-lg-1 p-2" ref={encabezadoCompeticionRef} style={{color : 'rgb(252, 224, 179)', backgroundColor : "#182E3E"}}> </h1>
                    </div>       
                </div>            
                <div className='row p-0'>
                    <div className='col-10 col-sm-8 col-md-9 mx-auto p-0'>
                        <div className='container-fluid p-0 m-auto'>
                            <div className='row p-0 mx-auto'>
                                {equipos}
                            </div>
                        </div>
                    </div>                                
                </div> 
                <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
            </div>
            <div className={showFooter ? 'd-block' : 'd-none'}>
                <MyFooter />
            </div>
        </>
    );
}
   

