<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$sql = "select id_partido from partido order by id_partido desc limit 1";

$resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al recuperar el id del último partido registrado: ".mysqli_error($conexion) );
} else {
    $id = mysqli_fetch_assoc($resultado);
    responder($id, $conexion);
}

?>