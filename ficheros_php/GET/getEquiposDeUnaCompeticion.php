<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$id_competicion = $_POST['id_competicion'];

$sql = "Select * from equipo where id_equipo in (select id_equipo from equipo_competicion where id_competicion = $id_competicion)";

$resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));

if (!$resultado){
    responderError("Error al recuperar los equipos de esa competición: " .mysqli_error($conexion), $conexion );
} else {

    $datos = []; // Creamos un array vacío
    //Recorremos los registros que ha devuelto la base de datos
    while ($fila = mysqli_fetch_assoc($resultado)) { 
        // Almacenamos en un array cada una de las filas que vamos leyendo del recordset.
        $datos[] = $fila;
    }
    //Devolvemos el resultado.    
    responder($datos, $conexion);
}

?>