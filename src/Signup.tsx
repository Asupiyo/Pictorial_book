import React from 'react';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import {useAuthContext} from "./context/AuthContext";
import "./Signup.css";

function GoogleLogin() {
    const{user} = useAuthContext();
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User Info: ", user);
        } catch (error) {
            console.error("Error during Google Sign In: ", error);
        }
    };

    const handleLogout = async () => {
        try{
            await signOut(auth);
            console.log("User logged out");
        }catch(error){
            console.error("Error during sign out : ",error);
        }
    }

    return (
        <div>
            {user ? (
                <>
                    <img className="showPhoto" src={user.photoURL} alt="User profile"/>
                    <p className="child">{user.displayName}でログイン中</p>
                    <button className="LoginButton" onClick={handleLogout}>ログアウト</button>
                </>
            ) : (
                <button className="LoginButton" onClick={handleLogin}>Googleでログイン</button>
            )}
        </div>
    );
}

export default GoogleLogin;
