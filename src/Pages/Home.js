import { Stepper, Text, Image, Title, SimpleGrid, Center, Space } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

import BefehlAntworten from '../Components/HomeBilder/BefehlAntworten.png';
import BotBefehle from '../Components/HomeBilder/BotBefehle.png';

const Home = () => {
    const {t} = useTranslation();
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <>
            <Center>
                <Title order={isMobile ? 2 : 1}>{t('welcome')}</Title>
            </Center>

            <Space h="xl" />

            <SimpleGrid cols={isMobile ? 1 : 3}>
                <div>
                    <Title order={2}>{t('stepsToF1Ligabot')}</Title>
                    <Space h="sm" />
                    <Stepper orientation="vertical">
                        <Stepper.Step label="Step 1" description={t('register')} />
                        <Stepper.Step label="Step 2" description={t('login')} />
                        <Stepper.Step label="Step 3" description={t('createLeague')} />
                        <Stepper.Step label="Step 4" description={t('inviteBot')} />
                        <Stepper.Step label="Step 4" description={t('driverAdd')} />
                        <Stepper.Step label="Step 5" description={t('resultsEnter')} />
                    </Stepper>
                </div>

                <div> {/* Container für den ersten Titel und Bild */}
                    <Title order={2}>{t('exampleAnswers')}</Title>
                    <Space h="sm" />
                    <Image
                        radius="md"
                        src={BefehlAntworten}
                    />
                </div>

                <div>
                    <Title order={2}>{t('availableSlashCommands')}</Title>
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