import { useRef,useState } from "react";

import MyModal from "./Modal";

export default function FrmRegistrarCompeticion (){

    //Variables de estado
    const frmRegistrarCompeticionRef = useRef (null);
    const nombreCompeticionRef = useRef(null);
    const temporadaCompeticionRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    const guardarCompeticion = ( async (event) => {

        event.preventDefault();
        if (nombreCompeticionRef.current.value !== "" && /^\d{4}\d{4}$/.test(temporadaCompeticionRef.current.value)){

            let parametros = new FormData();
            parametros.append("nombre", nombreCompeticionRef.current.value);
            parametros.append("temporada", temporadaCompeticionRef.current.value);

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarCompeticion.php", 
            {
                method :'POST',
                body : parametros
            });

            if (response.ok){

                let respuesta = await response.json();
                if (!respuesta.error){

                    setModalError(false);
                    setTextoModal(respuesta.datos);
                    setShowModal(true);
                    frmRegistrarCompeticionRef.current.reset();
                }else{
                    setModalError(true);
                    setTextoModal(respuesta.datos);
                    setShowModal(true);
                }
            }
        }else{
            
            if (nombreCompeticionRef.current.value === " " || temporadaCompeticionRef.current.value === ""){
                setTextoModal("Por favor, rellena todos los campos.");
                    
            }else  if (!/^\d{4}-\d{4}$/.test(temporadaCompeticionRef.current.value)) {
                setTextoModal("El texto que introduzcas en el campo temporada debe seguir el siguiente patrón: 2022-2023");
            }
            setModalError(true);
            setShowModal(true);
        }        

    })//Fin de la función.

    return (
        <>
            <form className="mx-auto p-0 mb-3" ref={frmRegistrarCompeticionRef}>
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center mt-1">Datos de la competición</h2>
                    </div>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto col-12">Nombre</label>
                    <input type="text" className="form-control shadow-none col-12" ref={nombreCompeticionRef} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto col-12">Temporada</label>
                    <input type="text" className="form-control shadow-none col-12" ref={temporadaCompeticionRef} pattern="^\d{4}-\d{4}$" placeholder="Ej: 2022-2023" minLength={9} maxLength={9} required />
                </div>
                <div className="row">
                    <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                        <button className="btn1 text-truncate p-1 w-100 p-lg-2" onClick={guardarCompeticion}>ACEPTAR </button>
                    </div>
                </div>
            </form>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
        </>
    );
}