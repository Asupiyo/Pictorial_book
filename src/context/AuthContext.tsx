import {createContext, useState, useContext, useEffect} from "react";
import { auth, provider, signInWithPopup, signOut } from '../firebase';
import { User } from 'firebase/auth';
import {useUserRegistration} from "./useUserRegistration";

interface AuthContextType {
    user: User | null;
    supabaseUserId : number | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType|undefined>(undefined);

export function useAuthContext(){
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({children}:{children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUserId, setSupabaseUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const {registerOrGetUser} = useUserRegistration();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) =>{
            setUser(firebaseUser);
            if(firebaseUser){
                const supabaseUser = await registerOrGetUser(firebaseUser.uid);
                if(supabaseUser){
                    setSupabaseUserId(supabaseUser.id);
                }
            }else{
                setSupabaseUserId(null);
            }
            setLoading(false);
        });
        return() => unsubscribe();
    }, [registerOrGetUser]);

    const loginWithGoogle = async () => {
        try{
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            const supabaseUser = await registerOrGetUser(firebaseUser.uid);
            if(supabaseUser){
                setSupabaseUserId(supabaseUser.id);
            }
        }catch(error){
            console.log("Googleログイン中にエラーが発生:", error);
        }finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            setUser(null);
            setSupabaseUserId(null);
        } catch (error) {
            console.log("ログアウト中にエラーが発生:", error);
        } finally {
            setLoading(false);
        }
    };
    const value: AuthContextType = {
        user,
        supabaseUserId,
        loading,
        loginWithGoogle,
        logout
    };
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

