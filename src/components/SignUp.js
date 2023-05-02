import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function FrmSignUp(){

    const auth = useAuth();
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = ( (event) => {
        event.preventDefault();
        auth.register(email, password);
    });

    return(
        <form className="frmAcceso rounded-2">
            <h2 className="text-center">Registro</h2>
            <div className="my-2 row mx-0">
                <label className="form-label">Email</label>
                <input type="email" className="form-control shadow-none" onChange={(event) => setEmail(event.target.value)} required />
            </div>

            <div className="my-2 row mx-0">
                <label className="form-label">Contraseña</label>
                <input type="password" className="form-control shadow-none" onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <button className="btn1 w-100" onClick={handleRegister}>REGISTRARSE</button>
        </form>        
    );
}

export default function SignUpScreen(){

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center p-0">
            <div className="row">           
                <div className="col">
                    <FrmSignUp />
                </div>          
            </div>
        </div>
    );
   
}