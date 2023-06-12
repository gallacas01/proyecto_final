<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$ordenacion = $_POST['ordenacion'];
$id_competicion = $_POST['id_competicion'];

$sql = "SELECT ep.id_jugador, j.nombre_completo, j.imagen, j.posicion,
SUM(CASE WHEN tipo = 'Gol' THEN 1 ELSE 0 END) AS goles,
SUM(CASE WHEN tipo = 'Asistencia' THEN 1 ELSE 0 END) AS asistencias,
SUM(CASE WHEN tipo = 'Tarjeta amarilla' THEN 1 ELSE 0 END) AS tarjetas_amarillas,
SUM(CASE WHEN tipo = 'Tarjeta roja' THEN 1 ELSE 0 END) AS tarjetas_rojas
FROM evento_partido ep inner join jugador j on j.id_jugador = ep.id_jugador 
inner join partido p on ep.id_partido = p.id_partido
where p.id_competicion = $id_competicion
GROUP BY ep.id_jugador
ORDER BY $ordenacion desc;";

$resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al recuperar las estadísticas: ".mysqli_error($conexion), $conexion);
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