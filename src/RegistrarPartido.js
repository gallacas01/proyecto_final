import NavBar from "./NavBar";

export default function RegistrarPartido(){


    return(
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto p-0" name="frmRegistrarEquipo">
                
                <h3 className="text-center">Información del partido</h3>
                <div class="my-2 row mx-0">
                    <label for="txtCompeticion" class="form-label my-auto">Competición</label>
                    <input type="text" class="form-control shadow-none" id="txtCompeticion" name="txtCompeticion" required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtEquipoLocal" class="form-label">Equipo local</label>
                    <input type="text" class="form-control shadow-none" id="txtEquipoLocal" name="txtEquipoLocal" required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtEquipoVisitante" class="form-label">Equipo visitante</label>
                    <input type="text" class="form-control shadow-none" id="txtEquipoVisitante" name="txtEquipoVisitante" min={0} required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtFechaPartido" class="form-label">Fecha del partido</label>
                    <input type="date" class="form-control shadow-none" id="txtFechaPartido" name="txtFechaPartido" min={0} required/>
                </div>
                <div class="my-2 row mx-0">
                    <label for="txtResultado" class="form-label">Resultado del partido</label>
                    <input type="text" class="form-control shadow-none" id="txtResultado" name="txtResultado" pattern="^\d{1,2}-\d{1,2}$" placeholder="Ej: 1-0" title="hola" required/>
                    {/* Caracteres del patron: ^ indica el comienzo de la cadena, \d{1,2} indica que se permiten de 1 a 2 dígitos, - indica el carácter - literal, $ indica el final de la cadena. */}
                </div>
            
                <input type="submit" class="btn btn-primary" value={"ENVIAR"}/>
            </form>
        </>
    );
}