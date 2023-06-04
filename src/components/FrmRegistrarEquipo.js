import { useRef, useState } from "react";
import MyModal from "./Modal";

export default function FrmRegistrarEquipo() {

    //Variables de estado
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    const frmRegistrarEquipoRef = useRef(null);
    const nombreEquipoRef = useRef(null);
    const estadioRef = useRef(null);
    const fechaFundacionRef = useRef(null);

    function handleChangeFile(file) {

        setFile(file);
    }//Fin de la función.

    async function guardarEquipoEnBD(event) {

        event.preventDefault();
        //Si el archivo es una imagen, se introducirá en la base de datos.
        if (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png') || file.name.endsWith('.webp') || file.name.endsWith('.jpe')) {
           
            const reader = new FileReader();
            reader.onloadend = async () => {
                let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

                let nombreEquipo = nombreEquipoRef.current.value;
                let estadio = estadioRef.current.value;
                let fechaFundacion = fechaFundacionRef.current.value;
                let parametros = new FormData();
                parametros.append("nombre", nombreEquipo);
                parametros.append("estadio", estadio);
                parametros.append("fecha_fundacion", fechaFundacion);
                parametros.append("escudo", base64Imagen);

                let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarEquipo.php",
                    {
                        body: parametros,
                        method: 'POST'
                    });

                if (response.ok) {
                    
                    let respuesta = await response.json();
                    if (!respuesta.error){
                        setTextoModal(respuesta.datos);
                        setModalError(false);
                        frmRegistrarEquipoRef.current.reset();
                    }else{
                        setTextoModal(respuesta.datos);
                        setModalError(false);
                    }

                    setShowModal(true);
                }else{
                    setTextoModal(response.statusText);
                    setModalError(false);
                    setShowModal(true);
                }
            }
            reader.readAsDataURL(file);
        }
        
    }//Fin de la función

    return (

        <>
            <form className="p-0 mb-3" ref={frmRegistrarEquipoRef}>
            <div className="row">
                    <div className="col-12">
                        <h2 className="text-center mt-1">Datos del equipo</h2>
                    </div>
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto">Nombre</label>
                    <input type="text" className="form-control shadow-none" ref={nombreEquipoRef} minLength={5} maxLength={40}required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto col-12">Estadio </label>
                    <input type="text" className="form-control shadow-none col-12" ref={estadioRef} minLength={8} maxLength={40} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto col-12">Fecha de fundación </label>
                    <input type="date" className="form-control shadow-none col-12" ref={fechaFundacionRef} min={0} maxLength={10} required />
                </div>
                <div className="my-2 row mx-0">
                    <label className="form-label my-auto col-12">Escudo</label>
                    <input type="file" className="form-control shadow-none col-12" onChange={(event) => handleChangeFile(event.target.files[0])} required />
                </div>
                <div className="row">
                    <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                        <button className="btn1 text-truncate p-1 w-100 p-lg-2" onClick={guardarEquipoEnBD}>ACEPTAR </button>
                    </div>
                </div>
            </form>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />  
        </>
    );
}


