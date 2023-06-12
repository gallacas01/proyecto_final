import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import MyModal from "../components/Modal";

function FrmSignUp(){

    //Constantes
    const auth = useAuth();
    const user = auth.user;
    const navigate = useNavigate();
    //Variables de estado
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [textoModal, setTextoModal] = useState('');
    const [modalError, setModalError] = useState(false);

    const handleRegister = ( (event) => {

        if (email !== "" && password !== ""){
            event.preventDefault();
            auth.register(email.trim(), password.trim());
        }else{
            setTextoModal("Por favor, rellena los dos dos campos del formulario.");
            setModalError(true);
            setShowModal(true);
        }
      
    });

     //Si el usuario tiene una sesión iniciada, se le redirige a la pantalla de inicio.
     useEffect( () => {

        if (user){
            navigate("/inicio");
        }
    },[user]);

    return(
        <>
            <form className="frmAcceso rounded-2">
                <h2 className="text-center mt-2">Registrarse</h2>
                <div className="my-2 row mx-0">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control shadow-none" onChange={(event) => setEmail(event.target.value)} required />
                </div>

                <div className="my-2 row mx-0">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control shadow-none" onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <button className="btn1 w-100 p-2" onClick={handleRegister}>REGISTRARSE</button>
            </form>        
            <MyModal showModal={showModal} setShowModal={setShowModal} tipo={modalError} texto={textoModal} />  
        </>
    );
}

export default function SignUpScreen(){

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center p-0">
            <div className="row">           
                <div className="col-10 col-sm-12 mx-auto rounded-2" style={{border : "3px solid #182E3E"}}>
                    <FrmSignUp />
                    <p className="text-center mt-1"><Link to={"/login"} className="link">Ya tengo una cuenta</Link> </p>
                </div>          
            </div>
        </div>
    );
   
}