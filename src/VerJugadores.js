import { useEffect } from 'react';
import { getCompeticiones } from './api';
import './css/styles.css';


export default function Jugadores() {

    useEffect( () => {
        
        async function rellenarDesplegableCompeticiones(){

            let competicones = await getCompeticiones();
            console.log(competicones);
        }

        rellenarDesplegableCompeticiones();
    },[]);

    return (
        <>
            <form className="col-lg-8 mx-auto p-0" name="frmBuscarJugadores">
                <div className="row mt-2 p-0">
                    <label htmlFor="txtCompeticion" className="form-label my-auto col-lg-2">Competicion</label>
                    <div className="col-lg-3 p-0 my-auto">
                        <select className="form-select shadow-none" id="txtCompeticion" name="txtCompeticion" required>

                        </select>
                    </div>
                </div>
            </form>
        </>
    );
}


