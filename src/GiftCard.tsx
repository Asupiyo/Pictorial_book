import { Card, Group, Text } from '@mantine/core';
import classes from './CardWithStats.module.css';
import './page.css';

type Props = {
    key: string;
    name: string;
    photo: string;
    password: string;
    dueTo: string;
};

export default function GiftCard(props: Props) {
    return (
        <><Card withBorder padding="lg" className={classes.card}>
            <Text fz="sm" fw={700} className="outlined-text">
                {props.name}
            </Text>
            <Group>
                <img src={props.photo} alt={props.name} width="100" height="100" />
                <div>
                    <Text mt="sm" mb="md" c="dimmed" fz="xs">
                        <span className="subtitle">あいことば</span>:<span className="info">{props.password}</span>
                    </Text>
                    <Text mt="sm" mb="md" c="dimmed" fz="xs">
                        <span className="subtitle">受取期限</span>:<span className="info">{props.dueTo}</span>
                    </Text>
                </div>
            </Group>
          </Card>
        </>
    );
}
