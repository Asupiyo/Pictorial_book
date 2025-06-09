// FeaturesCards.tsx
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

// ポケモンデータの型を定義
interface PokemonData {
    number: number;
    name: string;
    form_name: string;
    img: string;
    register_count: string;
}

export function FeaturesCards() {
    const { user } = useAuthContext();
    const pokemonData = usePokemonData();
    const [loading, setLoading] = useState(false);
    const [registeredPokemon, setRegisteredPokemon] = useState<{[key: string]: boolean}>({});

    // 型を明示的に指定
    const handleButtonClick = async (feature: PokemonData) => {
        console.log('1. Button clicked!');

        if (!user) return;

        setLoading(true);
        console.log('2. Loading set to true');

        try {
            console.log('3. Getting token...');
            const token = await user.getIdToken();
            const pokemon_id = `${feature.number}_${feature.form_name}`;
            const isCurrentlyRegistered = (registeredPokemon as any)[pokemon_id] === true || feature.register_count !== "0";
            console.log('4. Making API request...');
            const response = await fetch('https://847nq2bojl.execute-api.ap-northeast-1.amazonaws.com/prod/pokemon/registration', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.uid,
                    pokemon_id: pokemon_id,
                    number: feature.number,
                    name: feature.name,
                    form_name: feature.form_name,
                    action: isCurrentlyRegistered ? 'unregister' : 'register'
                })
            });

            console.log('5. Response received:', response.status);

            if (response.ok) {
                console.log('6. Response is OK, getting text...');
                const responseText = await response.text();
                console.log('7. Response text:', responseText);

                console.log('8. Parsing JSON...');
                const result = JSON.parse(responseText);
                console.log('9. Parsed result:', result);

                console.log('10. Updating state...');
                setRegisteredPokemon(prev => ({
                    ...prev,
                    [pokemon_id]: result.new_status === 1
                }));
                console.log('11. State updated');
            } else {
                console.log('6. Response not OK');
            }
        } catch (error) {
            console.error('ERROR in catch:', error);
        } finally {
            console.log('12. Setting loading to false');
            setLoading(false);
        }
    };
    const features = pokemonData.map((feature: PokemonData) => {
        const pokemon_id = `${feature.number}_${feature.form_name}`;
        const isRegistered = (registeredPokemon as any)[pokemon_id]|| feature.register_count !== "0";

        return (
            <Card key={feature.img} shadow="md" radius="md" className={classes.card} padding="xl">
                {!isRegistered ? (
                    <img className={classes.black_img} src={feature.img} alt={feature.name} />
                ) : (
                    <img src={feature.img} alt={feature.name} />
                )}
                <Text fz="lg" fw={500} c="black" className={classes.cardTitle} mt="md">
                    {feature.number}.{feature.name}
                </Text>
                {feature.form_name !== 'female' && (
                    <Text fz="sm" c="black" mt="sm">
                        {feature.form_name}
                    </Text>
                )}

                <button
                    onClick={() => handleButtonClick(feature)}
                    disabled={loading}
                    style={{
                        backgroundColor: isRegistered ? '#ff6b6b' : '#51cf66',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '処理中...' : (isRegistered ? '解除' : '登録')}
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

            <SimpleGrid cols={{ base: 1, md: 5 }} spacing="xl" mt={50}>
                {features}
            </SimpleGrid>
        </Container>
    );
}

export default FeaturesCards;