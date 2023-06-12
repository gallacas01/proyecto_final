<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos el equipo.
$id_equipo = $_POST['id_equipo'];

$sql = "Delete from equipo where id_equipo = $id_equipo;";

//echo $sql;
$resultado = mysqli_query( $conexion, $sql);

if (!$resultado){
    responderError( "Se ha producido un error al eliminar el equipo. Descripcion del error: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
}else{
    responder("El equipo ha sido eliminado correctamente.", $conexion);
}

?>

