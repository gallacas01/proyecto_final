import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import '../css/bootstrap.css';
import '../css/styles.css';


export default function Inicio() {

    const [imagen, setImagen] = useState(null);

    useEffect ( () => {

        async function getImagen(){
            let response = await fetch("https://localhost/DAM_2022-2023/proyecto_final/GET/getImagen.php");

            if (response.ok){

                let respuesta = await response.json();
                let imagen = "data:image/png;base64," + respuesta.datos.escudo;
                const blob = await fetch(imagen).then((res) => res.blob());
                let imagenConvertida = URL.createObjectURL(blob);
                setImagen(imagenConvertida);
            }
        }

        getImagen();
    },[]);
    
    return (
        <>
            <NavBar />
            <h1>CUERPO</h1>
                <img  src={imagen} alt="Imagen" />
            <Footer />
        </>
    );
}