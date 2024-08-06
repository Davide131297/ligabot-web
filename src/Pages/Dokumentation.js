import { Center, Title, Text, SimpleGrid, Image, Space } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

import DemoSeite from '../Components/DemoBilder/DemoStartseite.png';
import StartseiteEditor from '../Components/DemoBilder/StartseiteEditor.png';
import DemoFahrertabelle from '../Components/DemoBilder/Fahrertabelle.png';
import DemoKonstrukteuretabelle from '../Components/DemoBilder/Konstrukteurstabelle.png';
import DemoStatistiken from '../Components/DemoBilder/StatistikenGrafik.png';
import StreckenFilter from '../Components/DemoBilder/Streckenfilter.png';

export default function Dokumentation() {  
    const matches = useMediaQuery('(max-width: 768px)'); 
    const {t} = useTranslation();

    return (
        <>
        <Center>
            <Title order={1}>{t('documentation')}</Title>
        </Center>
        <Space h="lg" />
        <SimpleGrid cols={matches ? 1 : 2}>
            <div>
                <Title order={2}>{t('introduction')}</Title>
                    <Text>
                        {t('introductionText')}
                    </Text>
                <Space h="lg" />
                <Title order={2}>{t('register')}</Title>
                    <Text>
                        {t('registrationText')}
                    </Text>
                <Space h="lg" />
                <Title order={2}>Discord Bot</Title>
                    <Text>
                        {t('discordBot')}
                    </Text>
                    <Space h="sm" />
                    <Text>
                        {t('botPost')}
                    </Text>
                <Space h="lg" />
                <Title order={2}>{t('leagueWebsiteTitle')}</Title>
                    <Text>
                        {t('leagueWebsite')}
                    </Text>
                    <Space h="sm" />
                    <Text>
                        {t('leagueWebsiteContent')}
                    </Text>
                <Space h="lg" />
                <Title order={2}>{t('settingsPage')}</Title>
                    <Text>
                        {t('settingsPageContent')}
                    </Text>
                    <Space h="sm" />
                    <Text>
                        {t('settingsPageContent2')}
                    </Text>
                    <Space h="sm" />
                    <Text>
                        {t('settingsPageContent3')}
                    </Text>
                    <Space h="sm" />
                    <Text>
                        {t('settingPageContent4')}
                    </Text>
                    <Space h="sm" />
                    <Text>
                        {t('settingPageContent5')}
                    </Text>
                    <Space h="sm" />
                    <Text>
                        {t('settingPageContent6')}
                    </Text>
                <Space h="lg" />
                <Title order={2}>CSV Download</Title>
                    <Text>
                        {t('settingPageContent5')}
                    </Text>
                    <Text>
                        {t('settingPageContent7')}
                    </Text>
                <Space h="lg" />
            </div>
            <div>
                <Center>
                <Title order={3}>DemoStartseite</Title>
                </Center>
                <Center>
                    <Image
                        src={DemoSeite}
                        radius="md"
                        h={matches ? "13vh" : "25vh"}
                        w="auto"
                        fit="contain"
                        alt="Demo Startseite"
                    />
                </Center>

                <Center>
                <Title order={3}>Startseite Editor</Title>
                </Center>
                <Center>
                    <Image
                        src={StartseiteEditor}
                        radius="md"
                        h={matches ? "30vh" : "40vh"}
                        w="auto"
                        fit="contain"
                        alt="Demo Startseite Editor"
                    />
                </Center>

                <Center>
                <Title order={3}>Fahrertabelle</Title>
                </Center>
                <Center>
                    <Image
                        src={DemoFahrertabelle}
                        radius="md"
                        h={matches ? "19vh" : "35vh"}
                        w="auto"
                        fit="contain"
                        alt="Demo Fahrertabelle"
                    />
                </Center>

                <Center>
                <Title order={3}>Konstrukteurstabelle</Title>
                </Center>
                <Center>
                    <Image
                        src={DemoKonstrukteuretabelle}
                        radius="md"
                        h={matches ? "14vh" : "25vh"}
                        w="auto"
                        fit="contain"
                        alt="Demo Konstrukteurstabelle"
                    />
                </Center>

                <Center>
                <Title order={3}>Statistiken</Title>
                </Center>
                <Center>
                    <Image
                        src={DemoStatistiken}
                        radius="md"
                        h={matches ? "15vh" : "30vh"}
                        w="auto"
                        fit="contain"
                        alt="Demo Statistiken"
                    />
                </Center>

                <Center>
                <Title order={3}>Streckenfilter</Title>
                </Center>
                <Center>
                    <Image
                        src={StreckenFilter}
                        radius="md"
                        h={matches ? "40vh" : "50vh"}
                        w="auto"
                        fit="contain"
                        alt="Demo Streckenfilter"
                    />
                </Center>

            </div>
        </SimpleGrid>
        </>
    );
}       