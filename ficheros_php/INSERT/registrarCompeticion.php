<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$nombre = $_POST['nombre'];
$temporada = $_POST['temporada'];

$sql = "INSERT INTO competicion (nombre,temporada)
VALUES('$nombre', '$temporada');";
$resultado = mysqli_query($conexion, $sql); // or die(mysqli_error($conexion));

// Devolvemos el resultado
if (!$resultado){ 
        responderError("Error al registrar la competición: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion);
} else {
    responder("La competición ha sido registrado correctamente.", $conexion);
}




?>

