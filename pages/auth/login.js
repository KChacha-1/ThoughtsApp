import {FcGoogle} from "react-icons/fc";
import {signInWithPopup ,GoogleAuthProvider} from "firebase/auth";
import { async, auth } from "../../utils/firebase";
import {useRouter} from "next/router";
import {useAuthState} from "react-firebase-hooks/auth"
import {useEffect} from "react";

export default function login(){
    const route = useRouter(); //Initalizes routes
    const [user, loading] = useAuthState(auth);  //allows logic to be passed when a user is authenticated 
    //sign in with google
    const googleProvider = new GoogleAuthProvider();
    const GoogleLogin = async() => {
        try {
            const result = await signInWithPopup(auth, googleProvider); //sets the Authentication for a user signing in through google or other provider
            route.push("/"); //kicks user to homepage after successful login
        } catch (error) {
            console.log(error);
        }
    }; 
    useEffect (()=> {
        if (user){
            route.push("/");
        } else{
            console.log("login");
        }
    } 

    )
    return(
        <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
            <h2 className="text-2xl font-medium">Join Today!</h2>
            <div className="py-4">
                <h3 className="py-4">Sign In with </h3>
                <button onClick={GoogleLogin} className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4"> <FcGoogle className="text-2xl "/> Sign in With Google</button>
            </div>
        </div>
    )
}