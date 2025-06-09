import React, {useEffect} from 'react';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import {useAuthContext} from "./context/AuthContext";
import { setUserInfo, clearUserInfo } from './UserStore';
import "./Signup.css";

function GoogleLogin() {
    const{user} = useAuthContext();

    // AuthContextの変更を監視して、userStoreを更新
    useEffect(() => {
        if (user) {
            // userStoreにユーザー情報を保存
            setUserInfo(user);
        } else {
            // userStoreのユーザー情報をクリア
            clearUserInfo();
        }
    }, [user]);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User Info: ", user);
            setUserInfo(user);
        } catch (error) {
            console.error("Error during Google Sign In: ", error);
        }
    };

    const handleLogout = async () => {
        try{
            await signOut(auth);
            console.log("User logged out");
            clearUserInfo();
        }catch(error){
            console.error("Error during sign out : ",error);
        }
    }

    return (
        <div>
            {user ? (
                <>
                    <button className="LoginButton" onClick={handleLogout}>ログアウト</button>
                    <img className="showPhoto" src={user.photoURL} alt="User profile"/>
                    <p className="child">{user.displayName}でログイン中</p>
                </>
            ) : (
                <button className="LoginButton" onClick={handleLogin}>
                    Googleで<br/>ログイン
                </button>
            )}
        </div>
    );
}

export default GoogleLogin;
