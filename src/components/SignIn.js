import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import '../css/bootstrap.css';
import '../css/styles.css';

function FrmLogin(){

    //Constantes
    const auth = useAuth();
    const user = auth.user;
    const navigate = useNavigate();

    //Variables de estado.
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = ( async (event) => {

        event.preventDefault();     
        await auth.login(email, password);
    });

    //Si el usuario tiene una sesión iniciada, se le redirige a la pantalla de inicio.
    useEffect( () => {

        if (user){
            navigate("/inicio");
        }else if (!user){
            console.log(user);
            console.log("No hay usuario");
        }
    },[user]);

    return(
        <form className="frmAcceso rounded-2">
            <h2 className="text-center mt-2">Bienvenido /a</h2>
            <div className="my-2 row mx-0">
                <label className="form-label">Email</label>
                <input type="email" className="form-control shadow-none" onChange={(event) => setEmail(event.target.value)} required />
            </div>

            <div className="my-2 row mx-0">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-control shadow-none" onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <button className="btn1 w-100 p-2" onClick={handleLogin}>INICIAR SESIÓN</button>
            <button className="btn1 w-100 mt-2 p-2"><i class="bi bi-google p-1"></i>Iniciar sesión con Google</button>
            <button className="btn1 w-100 mt-2 p-2" onClick={auth.logOut}><i class="bi bi-google p-1"></i>Cerrar sesión</button>
        </form>      
          
    );
}

export default function LoginScreen(){

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center p-0">
            <div className="row">           
                <div className="col-lg-10 mx-auto rounded-2" style={{border : "3px solid #182E3E"}}>
                    <FrmLogin />
                    <p className="text-center mt-1"><Link to={"/register"} className="link"> ¿No tienes una cuenta? Regístrate</Link> </p>
                </div>  
            </div>
        </div>
    );
    
}