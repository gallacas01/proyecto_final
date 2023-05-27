import { useState } from "react";
import FrmRegistrarEquipo from "./FrmRegistrarEquipo";
import FrmRegistrarJugador from "./FrmRegistrarJugador";
import FrmRegistrarPartido from "./FrmRegistrarPartido";
import FrmRegistrarCompeticion from "./FrmRegistrarCompeticion";
import FrmRegistrarMovimiento from "./FrmRegistrarFichaje";
import '../css/bootstrap.css';
import '../css/styles.css';

export default function Panel(){

    const [frmActual, setFrmActual] = useState(null);

    //Funciones
    const showFrmRegistrarCompeticion = ( () => {
      
        setFrmActual(<FrmRegistrarCompeticion />)
    });//Fin de la función.

    const showFrmRegistrarEquipo = ( () => {

        setFrmActual(<FrmRegistrarEquipo/>);
    });//Fin de la función.

    const showFrmRegistrarJugador = ( () => {

        setFrmActual(<FrmRegistrarJugador />);
    });//Fin de la función.s

    const showFrmRegistrarPartido = ( () => {

        setFrmActual(<FrmRegistrarPartido/>);
    });//Fin de la función.


    const showFrmRegistrarMovimiento = ( () => {

        setFrmActual(<FrmRegistrarMovimiento/>);
    });//Fin de la función.

    return(

        <>
            <div className="container">
                <div className="row mt-lg-3 p-1"> 
                    <div className="col-10 mx-auto p-0">
                        <div className="container-fluid">
                            <div className="row p-0" style={{borderBottom : "3px solid #182E3E"}}>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarCompeticion}> Registrar competición </button></div>     
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarEquipo}> Registrar equipo </button></div> 
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarJugador}> Registrar jugador </button></div> 
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarPartido}> Registrar partido </button></div>        
                                <div className="col-xs-12 col-sm-6 col-md-6 mx-sm-auto col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarMovimiento}> Registrar fichaje </button></div>        
                            </div>
                        </div>
                    </div>    
                </div>

                <div className="row">
                    <div className="col-10 col-lg-6 mx-auto">
                        {frmActual}
                    </div>
                </div>

            </div>            
        </>

    );

}