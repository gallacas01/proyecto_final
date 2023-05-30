import { useState } from "react";
import FrmRegistrarEquipo from "../components/FrmRegistrarEquipo";
import FrmRegistrarJugador from "../components/FrmRegistrarJugador";
import FrmRegistrarPartido from "../components/FrmRegistrarPartido";
import FrmRegistrarCompeticion from "../components/FrmRegistrarCompeticion";
import FrmRegistrarMovimiento from "../components/FrmRegistrarFichaje";
import '../css/bootstrap.css';
import '../css/styles.css';
import MyFooter from "../components/Footer";

export default function Panel(){

    const [frmActual, setFrmActual] = useState(null);
    const [showFooter, setShowFooter] = useState(null);

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
                    <div className="col-11 col-sm-12 col-md-11 col-lg-10 mx-auto p-0">
                        <div className="container-fluid">
                            <div className="row p-0" style={{borderBottom : "3px solid #182E3E"}} onClick={() => setShowFooter(true)}>
                                <div className="col-xs-12 col-sm-4 col-md-6 col-lg p-1 fs-5"> <button className="btnShowFrm p-2 h-100 w-100 rounded-2" onClick={showFrmRegistrarCompeticion}> Registrar torneo </button></div>     
                                <div className="col-xs-12 col-sm-4 col-md-6 col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarEquipo}> Registrar equipo </button></div> 
                                <div className="col-xs-12 col-sm-4 col-md-6 col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarJugador}> Registrar jugador </button></div> 
                                <div className="col-xs-12 col-sm-4 ms-sm-auto col-md-6 col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarPartido}> Registrar partido </button></div>        
                                <div className="col-xs-12 col-sm-4 me-sm-auto col-md-6 mx-md-auto col-lg p-1 fs-5"> <button className="btnShowFrm p-2 w-100 rounded-2" onClick={showFrmRegistrarMovimiento}> Registrar fichaje </button></div>        
                            </div>
                        </div>
                    </div>    
                </div>

                <div className="row">
                    <div className="col-11 col-sm-10 col-md-8 col-lg-7 mx-auto">
                        {frmActual}
                    </div>
                </div>
            </div>  
            <div className={showFooter ? "" : 'd-none'}>
                <MyFooter />   
            </div>                  
        </>

    );

}