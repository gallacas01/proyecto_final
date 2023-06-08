import Footer from "../components/Footer";
// import img_balon from "../img/imagen_balon.png";
import jugadores_andando from "../img/jugadores_andando.jpg";
import football_pitch from "../img/footabll_pitch.jpg";
import player_celebrating from "../img/player_celebrating.jpg";
import img_inicial from "../img/img_principal.jpg";
import { Link } from "react-router-dom";

export default function Inicio() {

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-0">
                    <img src={img_inicial} className="img-fluid"  alt="Imagen_aficion" />
                </div>
            </div>
            <div className="row text-center" style={{ borderTop: "0.2rem solid rgb(252, 224, 179)" }}>
                <div className="col-12 col-md-4 col-lg-4 p-2" style={{ backgroundColor: "#182E3E", color: "white" }} >
                    <h4 className="p-0 p-sm-1">Echa un vistazo a las plantillas de todos los equipos</h4>
                    <Link to="/ver_jugadores"><img src={jugadores_andando}className="w-100" height={'300px'} alt="Players waking" /></Link>
                 </div>
                <div className="col-12 col-md-4 col-lg-4 p-2" style={{ backgroundColor: "white", color: "#182E3E" }}> 
                    <h4 className="p-0 p-sm-1">Las estadísticas de tus jugadores favoritos en un click </h4>
                    <img src={player_celebrating} className="w-100" height={'300px'} alt="Player celebrating" />
                </div>
                <div className="col-12 col-md-4 col-lg-4 p-2" style={{ backgroundColor: "#182E3E", color: "white" }}>                    
                    <h4 className="p-0 p-sm-1">Consulta la clasificación y mantente actualizado/a en todo momento </h4>
                    <img src={football_pitch}className="w-100" height={'300px'} alt="Football pitch" />
                </div>
            </div>
            <div className="row" style={{ borderTop: "0.2rem solid rgb(252, 224, 179)" }}><Footer /></div>
        </div>
    );
}