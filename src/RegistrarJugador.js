import NavBar from "./NavBar";

export default function RegistrarJugador() {

    async function guardarJugadorEnBD(){
        let dniJugador = document.getElementById('txtDni').value;
        let nombreCompleto = document.getElementById('txtNombreCompleto').value;
        let fechaNacimiento = document.getElementById('txtFechaNacimiento').value;
        let peso = document.getElementById('txtPeso').value;
        let altura = document.getElementById('txtAltura').value;
        let posicion = document.getElementById('txtPosicion').value;
        let idEquipo = document.getElementById('txtIdEquipo').value;

        if (peso !== "" && peso !== ""){
            alert(peso, altura)
            let parametros = new FormData();
            parametros.append("dni_jugador", dniJugador);
            parametros.append("nombre_completo", nombreCompleto);
            parametros.append("fecha_nacimiento", fechaNacimiento);
            parametros.append("peso", peso);
            parametros.append("altura", altura);
            parametros.append("posicion", posicion);
            parametros.append("id_equipo", idEquipo);

            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/INSERT/registrarJugador.php",
                {
                    body: parametros,  // objeto FormData
                    method: "POST"
                });

            let respuesta = await response.json();
            alert(respuesta.datos);

            if (response.ok){
                if (respuesta.contains('correctamente')){
                    let formulario = document.getElementById('frmRegistrarJugador');
                    formulario.reset();  
                }                      
            }else{
                alert(response.datos)
            }
           
            //Cuando se introduce texto en un campo numérico, al recoger su valor con un .value
            //se interpreta como una cadena vacía.
        }else {
            if (peso === "")
                alert("Introduce un valor numérico en el campo 'peso'");
            if (altura === "")
                alert("Introduce un valor numérico en el campo 'altura'");            
        }       
    }

    return (
        <>
            <NavBar />
            <form className="bg-transparent col-lg-5 mx-auto p-0" name="frmRegistrarJugador" id="frmRegistrarJugador">
                
                <h3 className="text-center">Datos del jugador</h3>
                <div class="my-2 row mx-0">
                    <label htmlFor="txtDni" class="form-label my-auto">DNI / INE</label>
                    <input type="text" class="form-control shadow-none" id="txtDni" name="txtDni" minLength={9} maxLength={9} required/>
                </div>
                <div class="my-2 row mx-0">
                    <label htmlFor="txtNombreCompleto" class="form-label">Nombre completo </label>
                    <input type="text" class="form-control shadow-none" maxLength={35} id="txtNombreCompleto" name="txtNombreCompleto" required/>
                </div>
                <div class="my-2 row mx-0">
                    <label htmlFor="txtFechaNacimiento" class="form-label">Fecha de nacimiento </label>
                    <input type="date" class="form-control shadow-none" id="txtFechaNacimiento" name="txtFechaNacimiento" min={0} required/>
                </div>
                <div class="my-2 row mx-0">
                    <label htmlFor="txtPeso" class="form-label">Peso (Kg)</label>
                    <input type="number" class="form-control shadow-none" id="txtPeso" name="txtPeso" minLength={2} maxLength={5} step="0.1" min={50} required/>
                </div>
                <div class="my-2 row mx-0">
                    <label htmlFor="txtAltura" class="form-label">Altura (cm) </label>
                    <input type="number" class="form-control shadow-none" id="txtAltura" name="txtAltura" min={0} required/>
                </div>
                <div class="my-3 row mx-0">
                    <label htmlFor="txtPosicion" class="form-label">Posición</label>
                    <select class="form-select shadow-none" id="txtPosicion" name="txtPosicion" aria-label="Default select example" required>
                        <option value="portero">Portero</option>
                        <option value="defensa">Defensa</option>
                        <option value="centrocampista">Centrocampista</option>
                        <option value="delantero">Delantero</option>
                    </select>
                </div>
                <div class="my-2 row mx-0">
                    <label htmlFor="txtIdEquipo" class="form-label">Equipo</label>
                    <input type="number" class="form-control shadow-none" id="txtIdEquipo" name="txtIdEquipo" min={0} required/>
                </div>
                <input type="text" class="btn btn-primary" value={"REGISTRAR"} onClick={guardarJugadorEnBD}/>
            </form>
        </>
    );
}