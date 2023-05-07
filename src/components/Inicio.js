import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../css/bootstrap.css';
import '../css/styles.css';

export default function Inicio() {

    //Constantes
    const auth = useAuth();
    const user = auth.user;
    const navigate = useNavigate();

    return (
        <div className="container-fluid">
            <div className="row"><NavBar /></div>
            <div className="row">
                <h1>CAROUSEL</h1>
                <div className="col-6" style={{backgroundColor : "#182E3E", color : "white"}}> klasdfjlkdsajalkdsjlkljklajadskljklajdflkjdflkaj </div>
                <div className="col-6" style={{backgroundColor : "white", color : "#182E3E"}}> jasklfjdsklfjladskjdsklajlkadsjldskjlfkajafslk </div>
                <div className="col-6" style={{backgroundColor : "white", color : "#182E3E"}}> kladsjfkldsajklfasjklfjdslkjlkdsfjklfads </div>
                <div className="col-6" style={{backgroundColor : "#182E3E", color : "white"}}> kladsjfkladsjkladfsjkladsjskldfdfskljdfskla </div>
            </div>
            <div className="row"><Footer /></div>
        </div>
    );
}