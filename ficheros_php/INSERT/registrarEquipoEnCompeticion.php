<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$id_equipo = $_POST['id_equipo'];
$id_competicion = $_POST['id_competicion'];

$sql = "INSERT INTO equipo_competicion (id_equipo,id_competicion)
VALUES($id_equipo, $id_competicion);";
$resultado = mysqli_query($conexion, $sql); // or die(mysqli_error($conexion));

// Devolvemos el resultado
if (!$resultado){ 

    if(mysqli_errno($conexion) == 1062){ //Error que corresponde a un PK repetida.
        responderError( "El equipo ya está registrado en esa competición.", $conexion);
    }else{
        responderError("Error al registrar el equipo: " .mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion);
    }
} else {
    responder("El equipo ha sido inscrito correctamente en la competición.", $conexion);
}




?>

