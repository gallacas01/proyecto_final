<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$sql = "SELECT * FROM equipo order by nombre;";

$resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al recuperar los equipos: ".mysqli_error($conexion), $conexion);
} else {

    $datos = []; // Creamos un array vacío
    //Recorremos los registros que ha devuelto la base de datos
    while ($fila = mysqli_fetch_assoc($resultado)) { 
        // Almacenamos en un array cada una de las filas que vamos leyendo del recordset.
        $datos[] = $fila;
    }
    
    responder($datos, $conexion);
}

?>