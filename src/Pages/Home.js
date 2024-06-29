import { Stepper, Text, Image, Title, SimpleGrid, Center, Space } from '@mantine/core';

import BefehlAntworten from '../Components/HomeBilder/BefehlAntworten.png';
import BotBefehle from '../Components/HomeBilder/BotBefehle.png';

const Home = () => {

    return (
        <>
            <Center>
                <Title order={1}>Willkommen beim F1 Ligabot</Title>
            </Center>

            <Space h="xl" />

            <SimpleGrid cols={3}>
                <div>
                    <Title order={2}>Das sind die Schritte zum F1 Ligabot</Title>
                    <Space h="sm" />
                    <Stepper orientation="vertical">
                        <Stepper.Step label="Step 1" description="Registrieren" />
                        <Stepper.Step label="Step 2" description="Anmelden" />
                        <Stepper.Step label="Step 3" description="Liga erstellen Button drücken" />
                        <Stepper.Step label="Step 4" description="Bot in deinen Discord Server einladen" />
                        <Stepper.Step label="Step 4" description="Fahrer hinzufügen" />
                        <Stepper.Step label="Step 5" description="Ergebnisse Eintragen" />
                    </Stepper>
                </div>

                <div> {/* Container für den ersten Titel und Bild */}
                    <Title order={2}>Beispielantworten</Title>
                    <Space h="sm" />
                    <Image
                        radius="md"
                        src={BefehlAntworten}
                    />
                </div>

                <div>
                    <Title order={2}>Verfügbare Slash Befehle</Title>
                    <Space h="sm" />
                    <Image
                        radius="md"
                        src={BotBefehle}
                    />
                </div>
            </SimpleGrid>

        </>
    );
}
export default Home;