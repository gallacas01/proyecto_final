import Footer from "../components/Footer";
import players from "../img/players.jpg";
import football_pitch from "../img/footabll_pitch.jpg";
import player_celebrating from "../img/player_celebrating.jpg";
import img_inicial from "../img/img_principal.png";
import { Link } from "react-router-dom";

export default function Inicio() {

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-0">
                    <img src={img_inicial} className="imagenInicial" alt="Imagen_aficion" />
                </div>
            </div>
            <div className="row text-center" style={{ borderTop: "0.2rem solid rgb(252, 224, 179)", backgroundColor: "#182E3E", color:"white" }}>
                <div className="col-12 col-sm-6 col-md-4 p-2" style={{ backgroundColor: "#182E3E", color: "white"}}>
                    <h4 className="p-0 p-sm-1">Descubre información sobre cualquier jugador </h4>
                    <Link to="/ver_jugadores"><img src={players} className="imagenInicio"  alt="Players waking"/></Link>
                 </div>
                <div className="col-12 col-sm-6  col-md-4 p-2" style={{ backgroundColor: "white", color: "#182E3E" }}> 
                    <h4 className="p-0 p-sm-1">Revisa las estadísticas de todos los jugadores </h4>
                    <Link to={"/estadisticas"}><img src={player_celebrating} className="imagenInicio"  alt="Player celebrating"/></Link>
                </div>
                <div className="col-12 col-sm-8 col-md-4 p-2 mx-auto" style={{ backgroundColor: "#182E3E", color: "white" }}>                    
                    <h4 className="p-0 p-sm-1">Consulta la clasificación y mantente actualizado/a</h4>
                    <Link to={"/clasificacion"}><img src={football_pitch} className="imagenInicio"  alt="Football pitch"/></Link>
                </div>
            </div>
            <div className="row" style={{ borderTop: "0.2rem solid rgb(252, 224, 179)" }}><Footer /></div>
        </div>
    );
}