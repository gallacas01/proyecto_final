<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

//Recuperamos los parámetros de la petición mediante la key que pusimos (en este caso, jugador)
$id_equipo = $_POST['id_equipo'];
$nombre = $_POST['nombre'];
$estadio = $_POST['estadio'];
$fecha_fundacion = $_POST['fecha_fundacion'];
$escudo = $_POST['escudo'];

$sql = "UPDATE equipo set nombre='$nombre', estadio='$estadio', fecha_fundacion='$fecha_fundacion'";

//Si no se envía imagen, no se actualiza ese campo. De lo contrario. sí.
// echo $sql;
if ( $escudo != 0){
    $sql .= ", escudo='$escudo' where id_equipo=$id_equipo;";
}else{
    $sql .= " where id_equipo=$id_equipo;";
}

// echo $sql;
$resultado = mysqli_query($conexion, $sql); 

if (!$resultado){ //Se entrará aquí si hay errores
    responderError("Se ha producido un error al modificar los datos del equipo. ", $conexion);
}else{
    responder("Los datos del equipo han sido actualizados correctamente. ", $conexion);
}

?>

