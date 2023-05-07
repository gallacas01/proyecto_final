import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import {createContext, useContext, useEffect, useState} from "react";

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

    //Variable de estado para almacenar el usuario que haya iniciado sesión.
    const [user, setUser] = useState('');
    const [checkedSession, setCheckedSession] = useState(false);

    //UseEffect que comprueba si hay una sesión iniciada y almacena el usuario de la sesión si se ha iniciado sesión.
    useEffect ( () => {

    //Función que devuelve el current user.
        const suscribed = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser){
                console.log("No se ha iniciado sesión.");
            }else{
                setUser(currentUser);
            }
            setCheckedSession(true);
        });
        //Llamamos a la función.
        suscribed();
    },[]);
    
    const register = async (email, password) =>{
        try{
            const response = await createUserWithEmailAndPassword (auth, email, password);
            setUser(auth.currentUser);
            console.log(auth);
            console.log(response);
        }catch (error){    

            if (error.message === "FirebaseError: Firebase: Error (auth/email-already-in-use)."){
                alert("El correo " + email + " ya está en uso.");
            }else {
                alert("Se ha producido un error: " + error);
            }
        }
    }

    const login = async (email, password) =>{

        try{
            const response = await signInWithEmailAndPassword(auth, email,password);
            setUser(auth.currentUser);
            console.log(auth);
            console.log(response);

        }catch (error){            
            if (error.message === "Firebase: Error (auth/user-not-found)."){
                alert("El correo no es correcto.");
            }else if (error.message === "Firebase: Error (auth/wrong-password)."){
                alert("La contraseña no es correcta.");
            }else {
                alert("Se ha producido un error: " + error);
            }
        }
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
    //Exportamos nuestras funciones y variables para usarlas en el resto de componentes.
    return <authContext.Provider 
        value={{
            register,
            login,
            loginWithGoogle,
            logOut,
            user,
            checkedSession
        }}>
        {children}
    </authContext.Provider>
}
