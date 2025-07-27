import {useState,useCallback} from 'react';
import {createClient}  from "@supabase/supabase-js";

const supabaseUrl = 'https://gvhptkiyldkqonzfroqn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aHB0a2l5bGRrcW9uemZyb3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjI0MjAsImV4cCI6MjA2NzI5ODQyMH0.lG9DUTYUVGIStQkKgVgUbBBOiow_7HwuTGzzfiIGjTQ'; // ← あなたのanon key
const supabase = createClient(supabaseUrl, supabaseKey);

interface UserData{
    id: number;
    firebase_id: string;
}

export function useUserRegistration() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registerOrGetUser = useCallback(async (firebaseUid: string): Promise<UserData | null> => {
        setLoading(true);
        setError(null);

        try {
            const {data: existingUser, error: selectError} = await supabase
                .from('users')
                .select('*')
                .eq('firebase_id', firebaseUid)
                .single();

            if (selectError && selectError.code !== 'PGRST116') {
                throw selectError;
            }
            if (existingUser) {
                console.log('既存のユーザーを取得:', existingUser);
                return existingUser;
            }
            const {data: newUser, error: insertError} = await supabase
                .from('users')
                .insert({firebase_id: firebaseUid})
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            console.log('新しいユーザーを登録:', newUser);
            return newUser;
        } catch (err: any) {
            console.error('ユーザー登録または取得中にエラーが発生:', err);
            setError(err.message || 'ユーザー登録または取得中にエラーが発生しました');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return{
        registerOrGetUser,
        loading,
        error
    }
}