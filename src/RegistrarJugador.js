import NavBar from "./NavBar";

export default function RegistrarJugador() {

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto p-0" name="frmRegistrarJugador">
                
                <h3 className="text-center">Datos del jugador</h3>
                <div class="my-2 row mx-0">
                    <label for="txtNumFicha" class="form-label my-auto">Número de ficha </label>
                    <input type="text" class="form-control shadow-none" id="txtNumFicha" name="txtNumFicha" required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtNombreCompleto" class="form-label">Nombre completo </label>
                    <input type="text" class="form-control shadow-none" maxLength={35} id="txtNombreCompleto" name="txtNombreCompleto" required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtEdad" class="form-label">Edad </label>
                    <input type="number" class="form-control shadow-none" id="txtEdad" name="txtEdad" min={0} required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtPeso" class="form-label">Peso</label>
                    <input type="number" class="form-control shadow-none" id="txtPeso" name="txtPeso" min={0} required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtAltura" class="form-label">Altura (cm) </label>
                    <input type="number" class="form-control shadow-none" id="txtAltura" name="txtAltura" min={0} required/>
                </div>
                <div class="my-3 row mx-0">
                    <label for="txtPosicion" class="form-label">Posición</label>
                    <select class="form-select shadow-none" id="txtPosicion" name="txtPosicion" aria-label="Default select example" required>
                        <option value="portero">Portero</option>
                        <option value="defensa">Defensa</option>
                        <option value="centrocampista">CentroCampista</option>
                        <option value="delantero">Delantero</option>
                    </select>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtIdEquipo" class="form-label">Equipo</label>
                    <input type="number" class="form-control shadow-none" id="txtIdEquipo" name="txtIdEquipo" min={0} required/>
                </div>
                <input type="text" class="btn btn-primary" value={"ENVIAR"}/>
            </form>
        </>
    );
}