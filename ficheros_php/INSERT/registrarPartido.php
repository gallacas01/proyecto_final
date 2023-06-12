<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$id_equipo_local = $_POST['id_equipo_local'];
$id_equipo_visitante = $_POST['id_equipo_visitante'];
$id_competicion = $_POST['id_competicion'];
$estadio = $_POST['estadio'];
$goles_equipo_local = $_POST['goles_equipo_local'];
$goles_equipo_visitante = $_POST['goles_equipo_visitante'];
$fecha = $_POST['fecha'];

$sql = "INSERT INTO PARTIDO (id_equipo_local, id_equipo_visitante, id_competicion, estadio, goles_local, goles_visitante, fecha)
VALUES ($id_equipo_local, $id_equipo_visitante, $id_competicion ,'$estadio', $goles_equipo_local, $goles_equipo_visitante, '$fecha');";

// echo $sql;
$resultado = mysqli_query( $conexion, $sql); // or die(mysqli_error($conexion));

// Devolvemos el resultado
if (!$resultado){ 
        responderError("Error al registrar el partido: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion);
} else {
    responder("El partido ha sido registrado correctamente.", $conexion);
}

?>

