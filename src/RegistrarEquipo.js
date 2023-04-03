import NavBar from "./NavBar";

export default function RegistrarEquipo() {

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto p-0" name="frmRegistrarEquipo">
                
                <h3 className="text-center">Datos del equipo</h3>
                <div className="my-2 row mx-0">
                    <label for="txdNombreEqiupo" className="form-label my-auto">Nombre</label>
                    <input type="text" className="form-control shadow-none" id="txdNombreEqiupo" name="txdNombreEqiupo" required/>
                </div>
                <div className="my-2 row mx-0">
                    <label for="txtNombreEstadio" className="form-label">Estadio </label>
                    <input type="text" className="form-control shadow-none" maxLength={35} id="txtNombreEstadio" name="txtNombreEstadio" required/>
                </div>
                <div className="my-2 row mx-0">
                    <label for="txtFechaFundacion" className="form-label">Fecha de fundación </label>
                    <input type="date" className="form-control shadow-none" id="txtFechaFundacion" name="txtFechaFundacion" min={0} required/>
                </div>
                <div className="my-2 row mx-0">
                    <label for="txtEscudo" className="form-label">Escudo </label>
                    <input type="text" className="form-control shadow-none" id="txtEscudo" name="txtEscudo" min={0} required/>
                </div>
             
                <input type="submit" className="btn btn-primary" value={"ENVIAR"}/>
            </form>
        </>
    );
}