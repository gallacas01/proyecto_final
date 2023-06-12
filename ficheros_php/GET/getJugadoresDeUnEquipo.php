<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$id_equipo = $_POST['id_equipo'];

//IMPORTANTE: LA FECHA DEL TRASPASO SIEMPRE TIENE QUE SER SUPERIOR A LA FECHA EN LA QUE FUE REGISTRADO.
$sql = "SELECT j.*
FROM jugador j
JOIN movimiento m ON j.dni_jugador = m.dni_jugador
WHERE m.id_equipo_nuevo = $id_equipo
  AND NOT EXISTS (
    SELECT 1 
    FROM movimiento m2
    WHERE m2.dni_jugador = m.dni_jugador
      AND m2.fecha > m.fecha
  )
order by j.nombre_completo, j.posicion";
$resultado = mysqli_query( $conexion, $sql); //or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al recuperar los jugadores del equipo con id $id_equipo:".mysqli_error($conexion), $conexion );
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