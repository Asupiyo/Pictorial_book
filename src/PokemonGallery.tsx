import {
    Group,
    Title,
    Text,
    Card,
    SimpleGrid,
    Container,
} from '@mantine/core';
import { useState } from 'react';
import { useAuthContext } from './context/AuthContext';
import classes from './FeaturesCards.module.css';
import { usePokemonData } from './UsePokemonData';

export function FeaturesCards() {
    const { user } = useAuthContext();
    const { pokemonList, isRegistered, toggleRegistration } = usePokemonData();
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

    // ポケモン登録・解除処理
    const handleButtonClick = async (pokemon: any) => {
        if (!user) {
            alert('ログインが必要です');
            return;
        }

        // ボタンローディング状態
        setLoading(prev => ({ ...prev, [pokemon.data_key]: true }));

        try {
            const success = await toggleRegistration(pokemon);

            if (!success) {
                alert('操作に失敗しました。もう一度お試しください。');
            }
        } catch (error) {
            console.error('ERROR in handleButtonClick:', error);
            alert('エラーが発生しました。');
        } finally {
            // ローディング状態解除
            setLoading(prev => ({ ...prev, [pokemon.data_key]: false }));
        }
    };

    const features = pokemonList.map((pokemon) => {
        const pokemonIsRegistered = isRegistered(pokemon.data_key);
        const isButtonLoading = loading[pokemon.data_key] || false;

        return (
            <Card key={pokemon.data_key} shadow="md" radius="md" className={classes.card} padding="xl">
                <div className = {classes.cardContent}>
                {!pokemonIsRegistered ? (
                    <img className={classes.black_img} src={pokemon.img} alt={pokemon.name} />
                ) : (
                    <img src={pokemon.img} alt={pokemon.name} />
                )}
                <Text fz="lg" fw={500} c="black" className={classes.cardTitle} mt="md">
                    {pokemon.number}.{pokemon.name}
                </Text>

                <div className = {classes.cardFormName}>
                {pokemon.form_name !== 'female' && (
                    <Text fz="sm" c="black" mt="sm">
                        {pokemon.form_name}
                    </Text>
                )}
                </div>
                </div>

                <button
                    onClick={() => handleButtonClick(pokemon)}
                    disabled={isButtonLoading || !user}
                    style={{
                        backgroundColor: pokemonIsRegistered ? '#ff6b6b' : '#51cf66',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isButtonLoading || !user ? 'not-allowed' : 'pointer',
                        opacity: !user ? 0.5 : 1
                    }}
                >
                    {isButtonLoading
                        ? '処理中...'
                        : (pokemonIsRegistered ? '解除' : '登録')
                    }
                </button>
            </Card>
        );
    });

    return (
        <Container size="lg" py="xl">
            <Group justify="center">
            </Group>

            <Title order={2} className={classes.title} ta="center" mt="sm">
                ポケモン色違い図鑑
            </Title>

            <Text c="dimmed" className={classes.description} ta="center" mt="md">
                オス・メス・姿違いも一覧で見れる色違い図鑑だよ
            </Text>

            {!user && (
                <Text c="red" ta="center" mt="md">
                    ポケモンを登録するにはログインが必要です
                </Text>
            )}

            <SimpleGrid cols={{ base: 1, md: 5 }} spacing="xl" mt={50}>
                {features}
            </SimpleGrid>
        </Container>
    );
}

export default FeaturesCards;