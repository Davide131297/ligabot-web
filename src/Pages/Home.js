import { Stepper } from '@mantine/core';
import { Text } from '@mantine/core';
import { Image } from '@mantine/core';
import { Title } from '@mantine/core';

import BefehlAntworten from '../Components/HomeBilder/BefehlAntworten.png';
import BotBefehle from '../Components/HomeBilder/BotBefehle.png';

const Home = () => {

    return (
        <>
            <div>
                <Text size="lg">Das sind die Schritte zum F1 Ligabot</Text>
                <Stepper orientation="vertical">
                    <Stepper.Step label="Step 1" description="Registrieren" />
                    <Stepper.Step label="Step 2" description="Anmelden" />
                    <Stepper.Step label="Step 3" description="Liga erstellen Button drücken" />
                    <Stepper.Step label="Step 4" description="Bot in deinen Discord Server einladen" />
                    <Stepper.Step label="Step 4" description="Fahrer hinzufügen" />
                </Stepper>
            </div>

            <div style={{ display: 'flex', gap: '5px' }}> {/* Äußerer Container für horizontale Anordnung */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Container für den ersten Titel und Bild */}
                    <Title order={2}>Verfügbare Slash Befehle</Title>
                    <Image
                        style={{ width: '300px', height: '300px', objectFit: 'contain' }}
                        radius="md"
                        src={BefehlAntworten}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Container für den zweiten Titel und Bild */}
                    <Title order={2}>Beispielantworten</Title>
                    <Image
                        style={{ width: '300px', height: '300px', objectFit: 'contain' }}
                        radius="md"
                        src={BotBefehle}
                    />
                </div>
            </div>

        </>
    );
}
export default Home;