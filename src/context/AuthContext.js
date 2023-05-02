import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {auth} from "../firebase/firebase.config";
import {createContext, useContext} from "react";

//Creamos el contexto.
export const authContext = createContext();

//Creamos una especie de hook que simule el useContext para que toda la app tenga acceso a los datos de inicio de sesión.
//Exporta el contexto a los componentes usando el AuthProvider.
export const useAuth = () => {
    const context = useContext(authContext);
    if (!context){
        console.log("Error creando el contexto.");
    }
    return context;
}

export function AuthProvider({children}){
    
    const register = async (email, password) =>{
        const response = await createUserWithEmailAndPassword (auth, email, password);
        console.log(response);
    }
    const login = async (email, password) =>{
        const response = await signInWithEmailAndPassword(auth, email,password);
        console.log(response);
    }
    //Login con Google, que es un proveedor externo.
    const loginWithGoogle = async () => {
        const responseGoogle = new GoogleAuthProvider();
        return signInWithPopup(auth, responseGoogle);
    }

    //Función de logOut
    const logOut = async () => {
        const response = await signOut(auth);
        console.log(response);
    }

    //La propiedad value sirve para exportar por defecto las funciones y el contenido (como el valor del usaurio y la contraseña) que se indiquen en el value.
    //Exportamos nuestras funciones.
    return <authContext.Provider 
        value={{
            register,
            login,
            loginWithGoogle,
            logOut
        }}>
        {children}
    </authContext.Provider>
}
