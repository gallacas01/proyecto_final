<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$dni_jugador = $_POST['dni_jugador'];
$id_equipo_antiguo = $_POST['id_equipo_antiguo'];
$id_equipo_nuevo = $_POST['id_equipo_nuevo'];
$fecha = $_POST['fecha'];
$sql = "";

// echo $sql;
//id_equipo_antiguo será 0 cuando se inserte un juagador en la bbdd por primera vez.
if ($id_equipo_antiguo == 0){
    $sql = "INSERT INTO movimiento (dni_jugador, id_equipo_antiguo, id_equipo_nuevo,fecha)
	values ('$dni_jugador', null, $id_equipo_nuevo, '00-00-0000');";
}else{
    $sql = "INSERT INTO movimiento (dni_jugador, id_equipo_antiguo, id_equipo_nuevo, fecha)
    values ('$dni_jugador', $id_equipo_antiguo, $id_equipo_nuevo, now());";
}

// echo $sql;
$resultado = mysqli_query( $conexion, $sql); // or die(mysqli_error($conexion));

// Devolvemos el resultado
if (!$resultado){ // Aquí entrará si hay errores
    // if(mysqli_errno($conexion) == 1062) //Error que corresponde a un PK repetida.
    //     responderError("El jugador ya ha sido registrado, introduzca un DNI / INE distinto.", $conexion);
    // else if(mysqli_errno($conexion) == 1452) //Cuando la FK que referencia al equipo no existe
    //     responderError( "Error, el equipo '$jugador->_equipoAlQuePertenece' no existe: ", $conexion );
    // else
        responderError("Error al registrar el fichaje: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
} else {
    responder("El fichaje ha sido registrado correctamente.", $conexion);
}

?>

