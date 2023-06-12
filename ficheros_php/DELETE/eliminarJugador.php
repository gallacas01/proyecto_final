<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos el equipo.
$id_jugador = $_POST['id_jugador'];

$sql = "Delete from jugador where id_jugador = $id_jugador;";

//echo $sql;
$resultado = mysqli_query( $conexion, $sql);

if (!$resultado){
    responderError( "Error al eliminar el jugador: ".$equipo." Descripcion del error: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
}else{
    responder("El jugador ha sido eliminado correctamente.", $conexion);
}

?>

