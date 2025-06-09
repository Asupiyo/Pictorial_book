import { useEffect, useState } from 'react';
import * as Papa from 'papaparse';

const CSV_URL = 'https://asupiyo.s3.ap-northeast-1.amazonaws.com/public/pokemon_name.csv';

export function usePokemonData() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const timestamp = new Date().getTime();
                const urlWithCacheBuster = `${CSV_URL}?t=${timestamp}`;

                const response = await fetch(urlWithCacheBuster, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache'
                    }
                });

                const csvText = await response.text();
                const parsedData = Papa.parse(csvText, { header: true });
                setData(parsedData.data);
            } catch (error) {
                console.error('CSVの取得に失敗しました', error);
            }
        }

        fetchData();
    }, []);

    return data;
}