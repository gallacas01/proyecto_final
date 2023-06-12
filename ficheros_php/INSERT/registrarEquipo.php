<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$nombre = $_POST['nombre'];
$estadio = $_POST['estadio'];
$fecha_fundacion = $_POST['fecha_fundacion'];
$imagenEscudoBase64 = $_POST['escudo'];

$sql = "INSERT INTO equipo (nombre,estadio,fecha_fundacion, escudo)
VALUES('$nombre', '$estadio', '$fecha_fundacion', '$imagenEscudoBase64');";
$resultado = mysqli_query($conexion, $sql); // or die(mysqli_error($conexion));

// Devolvemos el resultado
if (!$resultado){ 

    if(mysqli_errno($conexion) == 1062){ //Error que corresponde a un PK repetida.
        responderError( "Ya existe un equipo con ese nombre.", $conexion);
    }else{
        responderError("Error al registrar el equipo: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion);
    }
} else {
    responder("El equipo ha sido registrado correctamente.", $conexion);
}




?>

