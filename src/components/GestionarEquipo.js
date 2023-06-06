import { useState } from "react";
import FrmRegistrarEquipo from "./FrmRegistrarEquipo";
import FrmInscribirEquipo from "./FrmInscribirEquipo";

export default function GestionarEquipo ({setShowFooter}) {

    const [frmActual, setFrmActual] = useState(null);

    const showFrmRegistrarEquipo = ( () => {
        setFrmActual(<FrmRegistrarEquipo />)
    });

    const showFrmInscribirEquipo = ( () => {
        setFrmActual(<FrmInscribirEquipo />)
    });

    return(
        <div className="container-fluid">
            <div className="row">          
                <div className="col-sm-6 col-md-5 col-lg-4 p-1 fs-5 ms-md-auto"> 
                    <button className="btnShowFrm p-2 h-100 w-100 rounded-2 btnGestionarEquipo" onClick={() => {showFrmRegistrarEquipo();  setShowFooter(true);}}> Registrar equipo </button>
                </div>     
                <div className="col-sm-6 col-md-5 col-lg-4 p-1 fs-5 me-md-auto"> 
                    <button className="btnShowFrm p-2 h-100 w-100 rounded-2 btnGestionarEquipo" onClick={() => {showFrmInscribirEquipo();  setShowFooter(true);}}> Inscribir equipo </button>
                </div>     
            </div>
            <div className="row">
                <div className="col-12">
                    {frmActual}
                </div>
            </div>
           
        </div>
    );

}