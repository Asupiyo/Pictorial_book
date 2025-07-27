import {useEffect, useState} from 'react';
import { useAuthContext } from './context/AuthContext';
import {createClient}  from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabasekey = process.env.REACT_APP_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabasekey);

interface PokemonData{
    data_key:string;
    number : number;
    name: string;
    form_name: string;
    img: string;
}

export function usePokemonData(){
    const[pokemonList, setPokemonList] = useState<PokemonData[]>([]);
    const[registeredPokemonIds, setRegisteredPokemonIds] = useState<Set<string>>(new Set());
    const{user, supabaseUserId} = useAuthContext();

    useEffect(() => {
        async function fetchPokemonData(){
            try{
                const{data:pokemonData, error:pokemonError} = await supabase
                    .from('pokemon_data')
                    .select('*')
                    .order('number', {ascending: true});
                if(pokemonError){
                    console.error('ポケモンデータの取得に失敗:', pokemonError);
                    return;
                }
                const sortedData = pokemonData?.sort((a,b)=>{

                    if(a.number !== b.number){
                        return parseInt(a.number) - parseInt(b.number);
                    }
                    const getPriority =(form_name:string)=>{
                        if(!form_name || form_name.trim() === ''||form_name === 'ノーマルモード')return 0;
                        if(form_name.includes('female'))return 1;
                        return 2;
                    };
                    return getPriority(a.form_name) - getPriority(b.form_name);
                });
                setPokemonList(sortedData || []);
            }catch(error) {
                console.error('ポケモンデータの取得中にエラーが発生:', error);
            }
        }
        fetchPokemonData();
    },[]);

    useEffect(() => {
        async function fetchUserRegistrations(){
            if (!user || !supabaseUserId){
                setRegisteredPokemonIds(new Set());
                return;
            }
            try{
                const{data:userRegistrations, error:regError} = await supabase
                    .from('pokemon_user')
                    .select('pokemon_id')
                    .eq('user_id', supabaseUserId);
                if(regError){
                    console.error('ユーザー登録情報の取得に失敗:', regError);
                    setRegisteredPokemonIds(new Set());
                }else{
                    const registeredIds = new Set(
                        userRegistrations?.map(reg => reg.pokemon_id) || []
                    );
                    setRegisteredPokemonIds(registeredIds);
                }
            }catch(error) {
                console.error('ユーザー登録情報の取得中にエラーが発生:', error);
                setRegisteredPokemonIds(new Set());
            }
        }
        fetchUserRegistrations();
    }, [user, supabaseUserId]);

    const isRegistered = (dataKey:string): boolean => {
        return registeredPokemonIds.has(dataKey);
    };

    const toggleRegistration = async (pokemon: PokemonData):Promise<boolean> => {
        if(!user||!supabaseUserId){
            console.error('ユーザー情報がありません。ログインしてください');
            return false;
        }

        const isCurrentlyRegistered = isRegistered(pokemon.data_key);

        try{
            if(isCurrentlyRegistered){
                console.log(`ポケモン ${pokemon.name} を登録解除します`);
                const{error} = await supabase
                    .from('pokemon_user')
                    .delete()
                    .eq('user_id', supabaseUserId)
                    .eq('pokemon_id', pokemon.data_key);
                if(error) throw error;

                const newRegistered = new Set(registeredPokemonIds);
                newRegistered.delete(pokemon.data_key);
                setRegisteredPokemonIds(newRegistered);
            }else{
                console.log(`ポケモン ${pokemon.name} を登録します`);
                const{error} = await supabase
                    .from('pokemon_user')
                    .insert({
                        user_id: supabaseUserId,
                        pokemon_id: pokemon.data_key
                    });
                if(error) throw error;

                const newRegistered = new Set(registeredPokemonIds);
                newRegistered.add(pokemon.data_key);
                setRegisteredPokemonIds(newRegistered);
            }
            return true;
        }catch(error){
            console.error('登録/登録解除中にエラーが発生:', error);
            return false;
        }
    };
    return{
        pokemonList,
        registeredPokemonIds,
        isRegistered,
        toggleRegistration
    };
}