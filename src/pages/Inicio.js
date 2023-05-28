import Footer from "../components/Footer";
import '../css/bootstrap.css';
import '../css/styles.css';
import img_balon from "../img/imagen_balon.png";
// import tarjeta_amarilla from "../img/tarjeta_amarilla.png";
// import tarjeta_roja from "../img/tarjeta_roja.png";


export default function Inicio() {

    return (
        <div className="container-fluid">
            {/* <div className="row">
                <div className="carousel slide p-0">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={img_balon} className="d-block w-100" data-bs-interval="1000" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src={img_balon} className="d-block w-100" data-bs-interval="1000" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src={img_balon} className="d-block w-100" data-bs-interval="1000" alt="..." />
                        </div>
                    </div>
                </div>
            </div>  */}
            <div className="row">
                <div className="col-12 p-0">
                    <img src={img_balon} className="d-block w-100" height={'750px'} alt="..." />
                </div>
            </div>
            <div className="row text-center" style={{ borderTop: "0.4rem solid rgb(252, 224, 179)" }}>
                <div className="col-6 p-2" style={{ backgroundColor: "#182E3E", color: "white" }} >
                    <p>Echa un vistazo a las plantillas de todos los equipos registrados</p> 
                 </div>
                <div className="col-6 p-2" style={{ backgroundColor: "white", color: "#182E3E" }}> 
                    <p>Consulta la clasificación y las estadísticas de todos los equipos </p>
                </div>
                <div className="col-6" style={{ backgroundColor: "white", color: "#182E3E" }}> 
                 </div>
                <div className="col-6" style={{ backgroundColor: "#182E3E", color: "white" }}> kladsjfkladsjkladfsjkladsjskldfdfskljdfskla </div>
            </div>
            <div className="row"><Footer /></div>
        </div>
    );
}