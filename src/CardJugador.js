import { useState, useEffect } from 'react';
import './css/styles.css';

export default function Card({info}) {

    //Inicializamos la variable
    const [datos, setDatos] = useState({id_jugador : info.id_jugador, dni_jugador: info.dni_jugador, 
        nombre_completo : info.nombre_completo, fecha_nacimiento : info.fecha_nacimiento, 
        peso : info.peso, altura: info.altura, posicion : info.posicion,
        pais : info.pais, equipo : info.equipo, imagen : info.imagen});
    // const [datosAnteriores, setDatosAnteriores] = useState({});
    // const [isEditOn, setIsEditOn] = useState(false);
    // const [savingProduct, setSavingProduct] = useState(false);
    // const [updatingProduct, setUpdatingProduct] = useState(false);
    // const [borrandoEnBD, setBorrandoEnBD] = useState(false);

    // //UseEffect para el registro de un producto.
    // useEffect(() => {

    //     async function saveProduct() {
    //         let parametros = new FormData();
    //         let id = datos.id;
    //         let category = datos.category;
    //         let name = datos.name;
    //         let price = datos.price;
    //         let stock = datos.stock

    //         parametros.append("id", id);
    //         parametros.append("category", category);
    //         parametros.append("name", name);
    //         parametros.append("price", price);
    //         parametros.append("stock", stock);

    //         let response = await fetch("https://localhost/DAM 2022-2023/react/trabajo/postProduct.php",
    //             {
    //                 body: parametros,  // objeto FormData
    //                 method: "POST"
    //             });

    //         //PREGUNTAR POR QUÉ NO MUESTRA EL ARRAY DE DATOS.
    //         if (response.ok) {
    //             setDatos({ id, category, name, price, stock });
    //             let respuesta = await response.json();
    //             alert(respuesta.datos);
    //             setIsEditOn(false);
    //         } else {
    //             alert(response.datos);
    //         }
    //     }


    //     if (savingProduct === true) {
    //         saveProduct();
    //         setSavingProduct(false);
    //     }

    // }, [savingProduct]);

    // useEffect(() => {

    //     async function updateProductFromBD() {
    //         let parametros = new FormData();
    //         let id = datos.id;
    //         let category = datos.category;
    //         let name = datos.name;
    //         let price = datos.price;
    //         let stock = datos.stock

    //         parametros.append("id", id);
    //         parametros.append("category", category);
    //         parametros.append("name", name);
    //         parametros.append("price", price);
    //         parametros.append("stock", stock);

    //         let response = await fetch("https://localhost/DAM 2022-2023/react/trabajo/updateProduct.php",
    //             {
    //                 body: parametros,
    //                 method: "POST"
    //             });

    //         if (response.ok) {
    //             let respuesta = await response.json();
    //             if (!respuesta.error) {
    //                 setDatos({ id, category, name, price, stock });
    //                 alert(respuesta.datos);
    //                 setIsEditOn(false);
    //             }
    //         }
    //     }

    //     if (updatingProduct === true) {
    //         updateProductFromBD();
    //         setUpdatingProduct(false);
    //     }
    // }, [updatingProduct]);

    // useEffect(() => {

    //     async function deleteProduct() {
    //         let parametros = new FormData();
    //         parametros.append("id", datos.id);
    //         console.log(datos);

    //         let response = await fetch("https://localhost/DAM 2022-2023/react/trabajo/deleteProductById.php",
    //             {
    //                 body: parametros,  // objeto FormData
    //                 method: "POST"
    //             });

    //         if (response.ok) {
    //             let respuesta = await response.json();
    //             alert(respuesta.datos);
    //             setDatos({id : "", category : "", name : "", price : "", stock : ""})
    //             setBorrandoEnBD(false);
    //         }
    //     }

    //     // Sualo borro cuando el estado así lo indique
    //     if (borrandoEnBD === true) {

    //         // Actualizar la BD
    //         deleteProduct();

    //         // Cambiamos el estado tras guardar
    //         setBorrandoEnBD(false);
    //     }
    // }, [borrandoEnBD]);

    // // Cada cambio en el input se sincroniza con el estado
    // function handleChange(event) {
    //     const name = event.target.name;  // "nombre" o "apellidos"  
    //     const value = event.target.value;

    //     // Desectructuracion con objetos para proporcionar un nuevo objeto
    //     // ...datos --> copia del objeto
    //     // [name]: value --> se cambia el valor de la propiedad definida por name
    //     const nuevosDatos = { ...datos, [name]: value };

    //     setDatos(nuevosDatos);
    // }

    // function activarEdicion() {
    //     setDatosAnteriores({ ...datos }); // Guardo datos antes de editar
    //     setIsEditOn(true);
    // }

    // function activarNuevoProducto(){
    //     setDatosAnteriores({ ...datos }); // Guardo datos antes de editar
    //     setDatos({id : "", category : "", name : "", price : "", stock : ""})
    //     setIsEditOn(true);
    // }

    // function activarBorrado() {
    //     if (window.confirm("¿Eliminar el producto?")){
    //         // setDatos({ ...datosAnteriores });
    //         setBorrandoEnBD(true);
    //     }
        
    // }

    // function postProduct() {
    //     setSavingProduct(true);
    // }

    // function updateProduct() {
    //     // Al guardar datos solo cambio el estado de edición
    //     // datos permanece sincronizado con los inputs
    //     setIsEditOn(false);

    //     // Lanzamos la actualización en BD cambiando la variable
    //     // de estado guardandoEnBD --> tras renderizar se activa useEffect
    //     setUpdatingProduct(true);
    // }

    // function cancelarEdicion() {
    //     // Restauramos los datosAnteriores
    //     setDatos({ ...datosAnteriores });
    //     setIsEditOn(false);
    // }

    // function handleIdProductToSearch(event){
    //     let idProductToSearch = event.target.previousElementSibling.value;
    //     console.log(idProductToSearch);
    //     searchProduct(idProductToSearch);
    // }

    // async function searchProduct(idProduct){

    //     let parametros = new FormData();
    //     parametros.append("id", idProduct);

    //     let response = await fetch("https://localhost/DAM 2022-2023/react/trabajo/getProductById.php",
    //         {
    //             body: parametros,  // objeto FormData
    //             method: "POST"
    //         });

    //     if (response.ok) {
    //         let product = await response.json();
    //         if (product == null){
    //             alert("No existe ningún produco con ese ID.");

    //         }else{
    //             let id = product.id;
    //             let category = product.category;
    //             let name = product.name;
    //             let price = product.price;
    //             let stock = product.stock;
    //             setDatos({id,category,name,price,stock});
    //         }
           
    //     }
    // }


    // useEffect ( () => { 

    //     setDatos ({ id_jugador : info.id_jugador, dni_jugador: info.dni_jugador, 
    //         nombre_completo : info.nombre_completo, fecha_nacimiento : info.fecha_nacimiento, 
    //         peso : info.peso, altura: info.altura, posicion : info.posicion,
    //         pais : info.pais, equipo : info.equipo, imagen : info.imagen});
    // },[]);

    return (
        <div className='col-lg-4 p-1 my-1'>
            <div className="card my-0 border-2 rounded-3">
                <div className="card-body">
                    <h5 className="card-title mb-3">Información del jugador</h5>

                    <div className="row my-2 mx-auto">
                        <p>Nombre: {datos.nombre_completo.split(" ")[0]}</p>
                    </div>
                    
                    <div className="row my-2">
                        <img src={datos.imagen} class="card-img-top" alt="..." />
                    </div>

                    <div className="row my-2 mx-auto">
                        <p>Fecha de nacimiento: {datos.fecha_nacimiento}</p>
                    </div>
                
                </div>
            </div>
        </div>

    );
}

