import { useRef, useState } from "react";
import '../css/bootstrap.css';
import '../css/styles.css';
import MyModal from "./Modal";


export default function FrmRegistrarEquipo() {

    //Variables de estado
    const [file, setFile] = useState(null);
    const frmRegistrarEquipoRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    function handleChangeFile(file) {

        setFile(file);
    }//Fin de la función.

    async function guardarEquipoEnBD() {

        //Si el archivo es una imagen, se introducirá en la base de datos.
        if (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png') || file.name.endsWith('.webp') || file.name.endsWith('.jpe')) {
           
            const reader = new FileReader();
            reader.onloadend = async () => {
                let base64Imagen = reader.result.replace('data:', '').replace(/^.+,/, '');

                let nombreEquipo = document.getElementById('txtNombreEquipo').value;
                let estadio = document.getElementById('txtNombreEstadio').value;
                let fechaFundacion = document.getElementById('txtFechaFundacion').value;
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
                    <MyModal showModal={showModal} setShowModal={setShowModal} tipo={"INFORMACIÓN"} texto={respuesta.datos} />                         
                    frmRegistrarEquipoRef.current.reset();
                }
            }
            reader.readAsDataURL(file);
        }
        
    }//Fin de la función

    return (

        <form className="bg-transparent p-0" ref={frmRegistrarEquipoRef}>
            <h3 className="text-center mt-2">Datos del equipo </h3>
            <div className="my-2 row mx-0">
                <label htmlFor="txtNombreEquipo" className="form-label">Nombre</label>
                <input type="text" className="form-control shadow-none" id="txtNombreEquipo" name="txtNombreEquipo" required />
            </div>
            <div className="my-2 row mx-0">
                <label htmlFor="txtNombreEstadio" className="form-label">Estadio </label>
                <input type="text" className="form-control shadow-none" maxLength={35} id="txtNombreEstadio" name="txtNombreEstadio" required />
            </div>
            <div className="my-2 row mx-0">
                <label htmlFor="txtFechaFundacion" className="form-label">Fecha de fundación </label>
                <input type="date" className="form-control shadow-none" id="txtFechaFundacion" name="txtFechaFundacion" min={0} required />
            </div>
            <div className="my-2 row mx-0">
                <label htmlFor="fileEscudo" className="form-label">Escudo</label>
                <input type="file" className="form-control shadow-none" id="fileEscudo" name="fileEscudo" onChange={(event) => handleChangeFile(event.target.files[0])} required />
            </div>
            <input type="button" className="btn1 p-lg-2 col-lg-3" value={"ACEPTAR"} onClick={guardarEquipoEnBD} />
        </form>
       
    );
}


