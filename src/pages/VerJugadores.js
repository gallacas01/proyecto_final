import { useEffect, useRef, useState } from 'react';
import CardJugador from '../components/CardJugador';
import MyModal from '../components/Modal';

//Método que crea un elemento de tipo option cuyo valor y textContent se pasan por parámetro.
function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    option.style.fontSize = "0.9rem";
    return option;
}

export default function VerJugadores() {

    const [jugadoresRecuperados, setJugadoresRecuperados] = useState(false);
    const [jugadores,setJugadores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    //Referencias al DOM.
    const desplegableCompeticionesRef = useRef(null);
    const desplegableEquiposRef = useRef(null);
    const nombreEquipoRef = useRef(null);
    const containerJugadoresRef = useRef(null);

    const rellenarDesplegableEquipos = ( async (id) => {

            let parametros = new FormData();
            parametros.append("id_competicion", id);
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquiposDeUnaCompeticion.php",
            {
                method : 'POST',
                body : parametros
            })
            if (response.ok){
    
                let respuesta = await response.json();
                if (!respuesta.error && respuesta.datos.length > 0){
    
                    desplegableEquiposRef.current.innerHTML = " ";
                    let optionVacio = createOptionElement("-","-");
                    desplegableEquiposRef.current.appendChild(optionVacio);
    
                     //Recorremos el array de equipos anyadiendo cada una al desplegable de competiciones.
                     for (let equipo of respuesta.datos){
                        let option = createOptionElement(equipo.id_equipo, equipo.nombre);
                        desplegableEquiposRef.current.appendChild(option);
                    }
                }
            }     
    })//Fin de la función

    const handleChangeCompeticion = ( (event) => {

        let optionSeleccionado = event.target.options[event.target.selectedIndex];
        let id = optionSeleccionado.value;

        if (id !== "-"){
            rellenarDesplegableEquipos(id);
        }   
    });

    let porteros;
    let defensas;
    let centrocampistas;
    let delanteros;
    const getJugadores = ( async (event) => {

        event.preventDefault();
        porteros = [];
        defensas = [];
        centrocampistas = [];
        delanteros = [];       

        let idCompeticion = desplegableCompeticionesRef.current.value;
        let idEquipo = desplegableEquiposRef.current.value;

        console.log("ID de la competición", idCompeticion);
        console.log("ID del equipo", idEquipo);
        if (idCompeticion !== "-" && idEquipo !== "-"){

            //Escribimos el nombre del equipo dentro del h2 del div donde se encuentran los jugadores.
            let nombreDelEquipo = desplegableEquiposRef.current.options[desplegableEquiposRef.current.selectedIndex].textContent;
            nombreEquipoRef.current.textContent = nombreDelEquipo;

            let idEquipo = desplegableEquiposRef.current.value; 
            let parametros = new FormData();
            parametros.append("id_equipo", idEquipo);     

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getJugadoresDeUnEquipo.php",
            {
                method : 'POST',
                body : parametros
            });

            if (response.ok){

                let respuesta = await response.json();
                if(!respuesta.error){

                    for (let jugador of respuesta.datos){

                        //Obtenemos la url de la imagen de la base de datos, que se encuentra en formato base 64.
                        let imagenDB = "data:image/png;base64," + jugador.imagen;
                        const blob = await fetch(imagenDB).then((res) => res.blob());
                        let urlImagen = URL.createObjectURL(blob);

                        let info = { id_jugador : jugador.id_jugador, dni_jugador: jugador.dni_jugador, 
                            nombre_completo : jugador.nombre_completo, fecha_nacimiento : jugador.fecha_nacimiento, 
                            peso : jugador.peso, altura: jugador.altura, posicion : jugador.posicion, dorsal: jugador.dorsal,
                            pais : jugador.pais, imagen : urlImagen};
                        console.log(info);

                        let cardJugador = <CardJugador  key={jugador.id_jugador} info={info} getJugadores={getJugadores} />
                        if  (jugador.posicion === "Portero"){
                            porteros.push(cardJugador);
                        }else if (jugador.posicion === "Defensa"){
                            defensas.push(cardJugador);
                        }else if (jugador.posicion === "Centrocampista"){
                            centrocampistas.push(cardJugador);
                        }else {
                            delanteros.push(cardJugador);
                        }
                    }
                    //Cambiamos el valor de esta variable de estado para que se muestren los jugadores.
                    setJugadores([porteros,defensas,centrocampistas,delanteros]);
                    containerJugadoresRef.current.classList.remove('d-none');
                    console.log("Jugadores");
                    setJugadoresRecuperados(true);
                }
            }

        }else{

            if (idCompeticion === "-"){
                setTextoModal("Selecciona una competición.");
            }else if (idEquipo === "-" ){
                setTextoModal("Selecciona un equipo.");
            }
            setModalError(true);
            setShowModal(true);
        }     
        
    })//Fin de la función.

    useEffect( () => {
        
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
                        let option = createOptionElement(competicion.id_competicion, competicion.nombre);
                        desplegableCompeticionesRef.current.appendChild(option);
                    }
                }
            }            
        });

        rellenarDesplegableCompeticiones();
    },[]);

    return (
        <div className='container-fluid'>
            <div className='row'>
                <form className="col-10 col-sm-12 col-md-9 col-lg-9 my-4 mx-auto ms-sm-1 ms-md-auto">
                    <div className="row">
                        <div className='col-12 col-sm-auto col-md-auto fs-4 ms-lg-4 text-start text-sm-end'>
                            <label className='my-auto'>Competición</label>
                        </div>
                        <div className="col-12 col-sm-3 p-0 my-auto">
                            <select className="form-select shadow-none p-1" ref={desplegableCompeticionesRef} onChange={handleChangeCompeticion} required>

                            </select>
                        </div>
                        <div className='col-12 col-sm-2 text-start text-sm-end fs-4'>
                            <label className="form-label my-auto">Equipo</label>
                        </div>                        
                        <div className="col-12 col-sm-3 p-0 my-auto">
                            <select className="form-select shadow-none p-1" ref={desplegableEquiposRef} required>

                            </select>
                        </div>
                        <div className='col-12 col-sm-1 mx-auto mt-2 mt-sm-0 ms-sm-3 p-0'>                    
                            <button className="btn1 w-100" onClick={(event) => getJugadores(event)} ><i className="bi bi-search fs-4"></i></button>  
                        </div>
                    </div>
                </form>
            </div>

            <div className='row'>
                <div className='col-10 col-sm-9 m-auto p-1 d-none' ref={containerJugadoresRef}>
                    <div className='row m-auto'> 
                        <div className='col-12 p-0'>
                            <h1 className="text-center mt-lg-1 p-2" ref={nombreEquipoRef} style={{color : 'rgb(252, 224, 179)', backgroundColor : "#182E3E"}}></h1>
                        </div>
                    </div>
                    <div className='row p-0 mx-auto'>
                        {jugadoresRecuperados &&
                            <>
                                <div className='col-12 p-0 mx-auto m-sm-0'>
                                    <h5 className='p-1 fs-4' id='tituloPosicion'>Porteros</h5>
                                </div>                                
                                {jugadores[0]}                                

                                <div className='col-12 p-0 mx-auto m-sm-0'>
                                    <h5 className='p-1 fs-4' id='tituloPosicion'>Defensas</h5>
                                </div>                                
                                {jugadores[1]}                                

                                <div className='col-12 p-0 mx-auto m-sm-0'>
                                    <h5 className='p-1 fs-4' id='tituloPosicion'>Centrocampistas</h5>
                                </div>                               
                                {jugadores[2]}                             

                                <div className='col-12 p-0 mx-auto m-sm-0'>
                                    <h5 className='p-1 fs-4' id='tituloPosicion'>Delanteros</h5>
                                </div>                               
                                {jugadores[3]} 
                                
                            </>                      
                        }
                    
                    </div>
                </div>
            </div>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />   
        </div>
    );
}


