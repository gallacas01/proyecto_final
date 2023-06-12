<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$id_jugador = $_POST['id_jugador'];
$dni_jugador = $_POST['dni_jugador'];
$nombre_completo = $_POST['nombre_completo'];
$fecha_nacimiento = $_POST['fecha_nacimiento'];
$peso = $_POST['peso'];
$altura = $_POST['altura'];
$posicion = $_POST['posicion'];
$dorsal = $_POST['dorsal'];
$pais = $_POST['pais'];
$imagen = $_POST['imagen'];


$sql = "UPDATE jugador set dni_jugador='$dni_jugador', nombre_completo='$nombre_completo', fecha_nacimiento='$fecha_nacimiento',
peso=$peso, altura=$altura, posicion='$posicion', pais ='$pais', dorsal=$dorsal";

if ( $imagen != 0){
    $sql .= ", imagen='$imagen' where id_jugador=$id_jugador;";
}else{
    $sql .= " where id_jugador=$id_jugador;";
}

// echo $sql;
$resultado = mysqli_query($conexion, $sql); 

if (!$resultado){ //Se entrará aquí si hay errores
    responderError("Se ha producido un error al modificar los datos del jugador.", $conexion);
}else{
    responder("Los datos del jugador han sido actualizados correctamente.", $conexion);
}

?>

