<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$id_partido = $_POST['id_partido'];
$id_jugador = $_POST['id_jugador'];
$tipo = $_POST['tipo'];

$sql = "INSERT INTO evento_partido (id_partido, id_jugador, tipo) VALUES ($id_partido, $id_jugador, '$tipo');";

// echo $sql;
$resultado = mysqli_query( $conexion, $sql); // or die(mysqli_error($conexion));

// Devolvemos el resultado
if (!$resultado){ 
        responderError("Error al registrar el evento: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion);
} else {
    responder("El evento ha sido registrado correctamente.", $conexion);
}

?>

