<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos el equipo.
$id_equipo = $_POST['id_equipo'];

$sql = "DELETE FROM jugador WHERE dni_jugador = ( SELECT dni_jugador FROM movimiento WHERE id_equipo_nuevo = $id_equipo
    ORDER BY fecha DESC LIMIT 1 );";

// echo $sql;
$resultado = mysqli_query( $conexion, $sql);

if (!$resultado){
    responderError( "Error al eliminar los jugadores del equipo. ".$equipo." Descripcion del error: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
}else{
    responder("Los jugadores del equipo han sido eliminados correctamente.", $conexion);
}

?>

