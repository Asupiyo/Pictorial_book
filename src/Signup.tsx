import React from 'react';
import { auth, provider, signInWithPopup } from './firebase';

function GoogleLogin() {
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User Info: ", user);
        } catch (error) {
            console.error("Error during Google Sign In: ", error);
        }
    };

    return (
        <div>
            <button onClick={handleLogin}>Googleでログイン</button>
        </div>
    );
}

export default GoogleLogin;
