'use client';

import { useState, useEffect } from 'react';
import GiftCard from './GiftCard';
import Papa from 'papaparse';

type GiftCardData = {
    name: string;
    photo: string;
    password: string;
    dueTo: string;
};

export default function App() {
    const [giftCards, setGiftCards] = useState<GiftCardData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://asupiyo.s3.ap-northeast-1.amazonaws.com/pokemon_data.csv')
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: false,
                    skipEmptyLines: true,
                    complete: function (results) {
                        const rawData = results.data as unknown as string[][];
                        const parsedGiftCards: GiftCardData[] = rawData.map(row => ({
                            name: row[0],
                            photo: row[1],
                            password: row[2],
                            dueTo: row[3]
                        }));
                        setGiftCards(parsedGiftCards); // 状態を更新
                    }
                });
            })
            .catch(error => {
                console.error('CSVの読み込みに失敗しました:', error);
                setError('CSVの読み込みに失敗しました');
            });
    }, []);

    if (error) {
        return <div>エラーが発生しました: {error}</div>;
    }

    return (
        <div className="card">
            {giftCards.map((item) => (
                <GiftCard {...item} key={item.name} />
            ))}
        </div>
    );
}
