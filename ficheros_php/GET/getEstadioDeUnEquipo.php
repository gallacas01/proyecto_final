<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$id_equipo = $_POST['id_equipo'];

$sql = "SELECT estadio from equipo where id_equipo = $id_equipo;";
$resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al recuperar el estadio del equipo con id $id_equipo:".mysqli_error($conexion), $conexion );
} else {
    $estadio = mysqli_fetch_assoc($resultado);
    responder($estadio, $conexion);
}

?>