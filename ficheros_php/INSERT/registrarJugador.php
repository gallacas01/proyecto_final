<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$dni_jugador = $_POST['dni_jugador'];
$nombre_completo = $_POST['nombre_completo'];
$fecha_nacimiento = $_POST['fecha_nacimiento'];
$peso = $_POST['peso'];
$altura = $_POST['altura'];
$posicion = $_POST['posicion'];
$dorsal = $_POST['dorsal'];
$pais = $_POST['pais'];
$imagen = $_POST['imagen'];

$sql = "INSERT INTO jugador (dni_jugador, nombre_completo, fecha_nacimiento, peso, altura, posicion, pais, imagen, dorsal) 
VALUES ('$dni_jugador', '$nombre_completo', '$fecha_nacimiento', $peso, $altura, '$posicion', '$pais','$imagen', $dorsal)";
// echo $sql;
$resultado = mysqli_query( $conexion, $sql); // or die(mysqli_error($conexion));

// Devolvemos el resultado
if (!$resultado){ // Aquí entrará si hay errores
    if(mysqli_errno($conexion) == 1062) //Error que corresponde a un PK repetida.
        responderError( "El jugador ya existe, introduzca un DNI / INE distinto.", $conexion);
    else if(mysqli_errno($conexion) == 1452) //Cuando la FK que referencia al equipo no existe
        responderError( "Error, el equipo '$jugador->_equipoAlQuePertenece' no existe: ", $conexion );
    else
        responderError("Error al insertar el jugador: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
} else {
    responder("El jugador ha sido registrado correctamente.", $conexion);
}

?>

