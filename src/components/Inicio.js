import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import '../css/bootstrap.css';
import '../css/styles.css';
import img_balon from "../img/imagen_balon.png";
// import tarjeta_amarilla from "../img/tarjeta_amarilla.png";
// import tarjeta_roja from "../img/tarjeta_roja.png";


export default function Inicio() {

    return (
        <div className="container-fluid">
            <div className="row"><NavBar /></div>
            <div className="row">
                <div class="carousel slide p-0">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src={img_balon} class="d-block w-100" data-bs-interval="1000" alt="..." />
                        </div>
                        <div class="carousel-item">
                            <img src={img_balon} class="d-block w-100" data-bs-interval="1000" alt="..." />
                        </div>
                        <div class="carousel-item">
                            <img src={img_balon} class="d-block w-100" data-bs-interval="1000" alt="..." />
                        </div>
                    </div>
                </div>
            </div> 
            <div className="row" style={{ borderTop: "0.4rem solid rgb(252, 224, 179)" }}>
                <div className="col-6" style={{ backgroundColor: "#182E3E", color: "white" }}> klasdfjlkdsajalkdsjlkljklajadskljklajdflkjdflkaj </div>
                <div className="col-6" style={{ backgroundColor: "white", color: "#182E3E" }}> jasklfjdsklfjladskjdsklajlkadsjldskjlfkajafslk </div>
                <div className="col-6" style={{ backgroundColor: "white", color: "#182E3E" }}> kladsjfkldsajklfasjklfjdslkjlkdsfjklfads </div>
                <div className="col-6" style={{ backgroundColor: "#182E3E", color: "white" }}> kladsjfkladsjkladfsjkladsjskldfdfskljdfskla </div>
            </div>
            <div className="row"><Footer /></div>
        </div>
    );
}