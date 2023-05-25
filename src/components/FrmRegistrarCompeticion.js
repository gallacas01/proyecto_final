import { useRef,useState } from "react";
import '../css/bootstrap.css';
import '../css/styles.css';
import MyModal from "./Modal";

export default function FrmRegistrarCompeticion (){

    //Variables de estado
    const frmRegistrarCompeticionRef = useRef (null);
    const nombreCompeticionRef = useRef(null);
    const temporadaCompeticionRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    const guardarCompeticion = ( async () => {

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
            <form className="mx-auto p-0" ref={frmRegistrarCompeticionRef}>
                <h3 className="text-center mt-1 fs-2">Datos de la competición</h3>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Nombre</label>
                    <input type="text" className="form-control shadow-none" ref={nombreCompeticionRef} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Temporada</label>
                    <input type="text" className="form-control shadow-none" ref={temporadaCompeticionRef} pattern="^\d{4}-\d{4}$" placeholder="Ej: 2022-2023" minLength={9} maxLength={9} required />
                </div>
                <button className="btn1 p-lg-2 col-lg-3" onClick={ (event) => {event.preventDefault(); guardarCompeticion();}}>ENVIAR </button>
            </form>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />                
        </>
    );
}