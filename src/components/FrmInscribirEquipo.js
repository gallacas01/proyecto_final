import Select from 'react-select'
import MyModal from "./Modal";
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

function createOptionElement(value, textContent) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    return option;
}

export default function FrmInscribirEquipo() {

    const [equipos, setEquipos] = useState([]);
    const [idEquipo, setIdEquipo] = useState('-');
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);
    const competicionesRef = useRef(null);
    const frmRef = useRef(null);
    const styleSelect = {
        control: (provided, state) => ({
            ...provided,
            border: state.isFocused ? '2px solid #182E3E' : '1px solid #182E3E',
            '&:hover': {
                border: '2px solid #182E3E',
            },
        }),
    };

    useEffect(() => {

        async function getEquipos() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getEquipos.php");
            if (response.ok) {

                let respuesta = await response.json();
                let equiposBD = respuesta.datos.map((equipo, i) =>
                    ({ value: equipo.id_equipo, label: equipo.nombre })
                );
                setEquipos(equiposBD);
            }
        }

        async function rellenarDesplegableCompeticiones() {

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getCompeticiones.php");
            if (response.ok) {

                let respuesta = await response.json();
                competicionesRef.current.innerHTML = " ";
                let primerOption = createOptionElement("-", "-");
                primerOption.selected = true;
                competicionesRef.current.appendChild(primerOption);

                for (let competicion of respuesta.datos) {
                    let option = createOptionElement(competicion.id_competicion, competicion.nombre);
                    competicionesRef.current.appendChild(option);
                }
            }
        }//Fin de la función.

        getEquipos();
        rellenarDesplegableCompeticiones();
    }, []);

    const registrarInscripcion = ( async (event) => {

        event.preventDefault();
        let idCompeticion = competicionesRef.current.value; 
        if (idEquipo !== "-" && idCompeticion !== "-"){
           
            let parametros = new FormData();
            parametros.append("id_equipo", idEquipo);
            parametros.append("id_competicion", idCompeticion);
            
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarEquipoEnCompeticion.php", {
                method: 'POST',
                body: parametros
            });

            if (response.ok){

                let respuesta = await response.json();
                    setTextoModal(respuesta.datos);
                if (!respuesta.error){
                   setModalError(false);
                   frmRef.current.reset();
                }else{
                    setModalError(true);
                }
                setShowModal(true);
            }

        }else if (idEquipo === "-" || idCompeticion === "-") {
            setTextoModal("Por favor, rellena todos los campos del formulario.");            
            setModalError(true);
            setShowModal(true);
        }
    });

    return (

        <>  
            <form className='mb-3' ref={frmRef}>
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center mt-1">Inscripción del equipo</h2>
                    </div>
                </div>
                <div className="row mx-0 mt-2">
                    <div className='col-12'>
                        <label className="form-label my-auto">Equipo</label>
                    </div>
                    <div className='col-12 p-0'>
                        <Select
                            className="shadow-none fs-6 m-0 p-0"
                            options={equipos} styles={styleSelect}
                            onChange={(selectedOption) => setIdEquipo(selectedOption.value)}
                            isSearchable={true}
                            placeholder="Buscar" />
                    </div>
                </div>
                <div className="row mx-0 mt-2">
                    <div className='col-12'>
                        <label className="form-label my-auto">Competición</label>
                    </div>
                    <div className='col-12 p-0'>
                        <select className="form-select shadow-none" ref={competicionesRef} required >

                        </select>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12 col-sm-4 col-md-3 col-lg-3">
                        <button className="btn1 text-truncate p-1 w-100 p-lg-2" onClick={registrarInscripcion}>ACEPTAR </button>
                    </div>
                </div>
            </form>
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />    
        </>
    )

}