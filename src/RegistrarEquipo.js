import NavBar from "./NavBar";

export default function RegistrarEquipo() {

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto p-0" name="frmRegistrarEquipo">
                
                <h3 className="text-center">Datos del equipo</h3>
                <div class="my-2 row mx-0">
                    <label for="txdNombreEqiupo" class="form-label my-auto">Nombre</label>
                    <input type="text" class="form-control shadow-none" id="txdNombreEqiupo" name="txdNombreEqiupo" required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtNombreEstadio" class="form-label">Estadio </label>
                    <input type="text" class="form-control shadow-none" maxLength={35} id="txtNombreEstadio" name="txtNombreEstadio" required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtFechaFundacion" class="form-label">Fecha de fundación </label>
                    <input type="date" class="form-control shadow-none" id="txtFechaFundacion" name="txtFechaFundacion" min={0} required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtEscudo" class="form-label">Escudo </label>
                    <input type="text" class="form-control shadow-none" id="txtEscudo" name="txtEscudo" min={0} required/>
                </div>
             
                <input type="submit" class="btn btn-primary" value={"ENVIAR"}/>
            </form>
        </>
    );
}