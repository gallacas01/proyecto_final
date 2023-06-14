<?php
include('../config.php');

//Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$id_competicion = $_POST['id_competicion'];
$sql = "SELECT e.nombre AS nombre_equipo, 
COUNT(p.id_partido) AS partidos_jugados, 
SUM(CASE WHEN p.id_equipo_local = e.id_equipo AND p.goles_local > p.goles_visitante THEN 1 
         WHEN p.id_equipo_visitante = e.id_equipo AND p.goles_visitante > p.goles_local THEN 1 
         ELSE 0 
    END) AS partidos_ganados, 
SUM(CASE WHEN p.id_equipo_local = e.id_equipo AND p.goles_local < p.goles_visitante THEN 1 
         WHEN p.id_equipo_visitante = e.id_equipo AND p.goles_visitante < p.goles_local THEN 1 
         ELSE 0 
    END) AS partidos_perdidos, 
SUM(CASE WHEN (p.id_equipo_local = e.id_equipo OR p.id_equipo_visitante = e.id_equipo) AND p.goles_local = p.goles_visitante THEN 1 
         ELSE 0 
    END) AS partidos_empatados, 
SUM(CASE WHEN p.id_equipo_local = e.id_equipo THEN p.goles_local ELSE p.goles_visitante END) AS goles_a_favor, 
SUM(CASE WHEN p.id_equipo_local = e.id_equipo THEN p.goles_visitante ELSE p.goles_local END) AS goles_en_contra, 
SUM(CASE WHEN p.id_equipo_local = e.id_equipo AND p.goles_local > p.goles_visitante THEN 3 
         WHEN p.id_equipo_visitante = e.id_equipo AND p.goles_visitante > p.goles_local THEN 3 
         WHEN (p.id_equipo_local = e.id_equipo OR p.id_equipo_visitante = e.id_equipo) AND p.goles_local = p.goles_visitante THEN 1 
         ELSE 0 
    END) AS puntos
FROM equipo e 
INNER JOIN partido p ON e.id_equipo = p.id_equipo_local OR e.id_equipo = p.id_equipo_visitante
WHERE p.id_competicion = $id_competicion
GROUP BY e.id_equipo, e.nombre
ORDER BY puntos DESC;";

$resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al recuperar los clasificación: ".mysqli_error($conexion), $conexion);
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