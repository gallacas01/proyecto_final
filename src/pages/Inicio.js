import Footer from "../components/Footer";
import img_balon from "../img/imagen_balon.png";
import jugadores_andando from "../img/jugadores_andando.jpg";
import football_pitch from "../img/footabll_pitch.jpg";
import player_celebrating from "../img/player_celebrating.jpg";
import { Link } from "react-router-dom";

export default function Inicio() {

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 p-0">
                    <img src={img_balon} className="img-fluid w-100" height={'550px'} alt="..." />
                </div>
            </div>
            <div className="row text-center" style={{ borderTop: "0.4rem solid rgb(252, 224, 179)" }}>
                <div className="col-4 p-2" style={{ backgroundColor: "#182E3E", color: "white" }} >
                    <h3 className="p-1">Echa un vistazo a las plantillas de todos los equipos</h3>
                    <Link to="/ver_jugadores"><img src={jugadores_andando} className="w-100" height={'78%'} alt="Players waking" /></Link>
                 </div>
                <div className="col-4 p-2" style={{ backgroundColor: "white", color: "#182E3E" }}> 
                    <h3 className="p-1">Las estadísticas de tus jugadores favoritos en un solo click </h3>
                    <img src={player_celebrating} className="w-100" height={'78%'} alt="Football pitch" />
                </div>
                <div className="col-4 p-2" style={{ backgroundColor: "#182E3E", color: "white" }}>                    
                    <h3 className="p-1">Consulta la clasificación y mantente actualizado/a en todo momento </h3>
                    <img src={football_pitch} className="w-100" height={'78%'} alt="Football pitch" />
                </div>
            </div>
            <div className="row" style={{ borderTop: "0.4rem solid rgb(252, 224, 179)" }}><Footer /></div>
        </div>
    );
}