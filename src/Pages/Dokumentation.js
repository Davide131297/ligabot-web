import { Center, Title, Text, SimpleGrid, Image, Box, Space } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import React, { useState } from 'react';

import DemoSeite from '../Components/DemoBilder/DemoStartseite.png';
import StartseiteEditor from '../Components/DemoBilder/StartseiteEditor.png';
import DemoFahrertabelle from '../Components/DemoBilder/Fahrertabelle.png';
import DemoKonstrukteuretabelle from '../Components/DemoBilder/Konstrukteurstabelle.png';
import DemoStatistiken from '../Components/DemoBilder/StatistikenGrafik.png';

export default function Dokumentation() {  
    const matches = useMediaQuery('(max-width: 768px)'); 

    return (
        <SimpleGrid cols={matches ? 1 : 2}>
        <div>
            <Center>
                <Title order={1}>Dokumentation</Title>
            </Center>

            <Title order={2}>Einleitung</Title>
                <Text>
                    Der "F1-LigaBot" ist eine Anwendung, die es ermöglicht, eine eigene Formel 1 Liga zu erstellen, verwalten, und die Ergebnisse der Rennen zu speichern.
                    Es wird jeder Liga eine eigene Webseite erstellt in der die Tabellen & Statistiken der Liga angezeigt werden.
                    Außerdem wird ein Discord Bot bereitgestellt, der die Ergebnisse der Rennen in einem Discord Server postet.
                </Text>
            <Title order={2}>Registrierung</Title>
                <Text>
                    Um die Anwendung zu nutzen, musst du deine Liga registrieren. Dazu musst du dich einmal registrieren. Bei der Registrierung musst du die ServerID 
                    deines Discord Servers angeben, damit der Bot weiß, welcher Server zu welcher Liga gehört.
                </Text>
            <Title order={2}>Discord Bot</Title>
                <Text>
                    Der Discord Bot ist ein Bot, der in einem Discord Server hinzugefügt werden kann.
                </Text>
                <Text>
                    Der Bot kann die Fahrertabelle und die Konstrukteurstabelle der Liga in einem Discord Server posten.
                </Text>
            <Title order={2}>Liga Webseite</Title>
                <Text>
                    Die Liga Webseite zeigt die Eingerichtete Liga an. Um auf die LigaSeite zu gelangen, muss die URL so ausschauen: "https://ligabot-38d61.web.app/(Liganame)".
                </Text>
                <Text>
                    Auf der Liga Webseite werden die Fahrertabelle, die Konstrukteurstabelle und die Statistiken der Liga angezeigt.
                </Text>
            <Title order={2}>Einstellungsseite</Title>
                <Text>
                    Die Einstellungsseite ermöglicht es, eine neue Liga zu erstellen oder eine bestehende Liga zu bearbeiten.
                </Text>
                <Text>
                    Es können der Name der Liga, das Logo der Liga und die Anzahl der Rennen pro Saison eingestellt werden, sowie deren Ergebnisse eingetragen werden.
                </Text>
                <Text>
                    Die Sichtbarkeit der Länder in den Tabellen kann eingestellt werden, falls nicht alle Strecken im Rennkalender enthalten sind. Drücke dazu den Button "Streckenfiltern".
                </Text>
                <Text>
                    Die Fahrerwertung und die Konstrukteurswertung können zurückgesetzt werden. Damit werden alle Punkte der Fahrer und Konstrukteure auf 0 gesetzt für eine neue Saison.
                </Text>
                <Text>
                    Die Tabellen "Fahrerwertung" und "Konstrukteurswertung" können auf der Einstellungsseite über den Button "Downloads" als CSV-Datei heruntergeladen werden.
                </Text>
            <Title order={2}>CSV Download</Title>
                <Text>
                    Die Tabellen "Fahrerwertung" und "Konstrukteurswertung" können auf der Einstellungsseite über den Button "Downloads" als CSV-Datei heruntergeladen werden.
                </Text>
                <Text>
                    Die CSV-Dateien können in Excel oder Google Tabellen geöffnet werden. Bei Excel muss gegebenfalls das das Komma als Trennzeichen eingestellt werden.
                </Text>
        </div>
        {!matches && (
        <div>
        <Carousel withIndicators height={500} slideGap="md">
            <Carousel.Slide>
            <Box
                bg="#dbdbdb"
                p="sm"
            >
                <Center>
                    <Image
                        src={DemoSeite}
                        radius="md"
                        h={200}
                        w="auto"
                        fit="contain"
                        alt="Demo Startseite"
                    />
                </Center>
            </Box>
            </Carousel.Slide>
            <Carousel.Slide>
            <Box
                bg="#dbdbdb"
                p="sm"
            >
                <Center>
                    <Image
                        src={StartseiteEditor}
                        radius="md"
                        h={400}
                        w="auto"
                        fit="contain"
                        alt="Demo Startseite Editor"
                    />
                </Center>
            </Box>
            </Carousel.Slide>
            <Carousel.Slide>
            <Box
                bg="#dbdbdb"
                p="sm"
            >
                <Center>
                    <Image
                        src={DemoFahrertabelle}
                        radius="md"
                        h={300}
                        w="auto"
                        fit="contain"
                        alt="Demo Fahrertabelle"
                    />
                </Center>
            </Box>
            </Carousel.Slide>
            <Carousel.Slide>
            <Box
                bg="#dbdbdb"
                p="sm"
            >
                <Center>
                    <Image
                        src={DemoKonstrukteuretabelle}
                        radius="md"
                        h={230}
                        w="auto"
                        fit="contain"
                        alt="Demo Konstrukteurstabelle"
                    />
                </Center>
            </Box>
            </Carousel.Slide>
            <Carousel.Slide>
            <Box
                bg="#dbdbdb"
                p="sm"
            >
                <Center>
                    <Image
                        src={DemoStatistiken}
                        radius="md"
                        h={250}
                        w="auto"
                        fit="contain"
                        alt="Demo Statistiken"
                    />
                </Center>
            </Box>
            </Carousel.Slide>
        </Carousel>
        </div>
        )}
        {matches && (
        <div>
            <Center>
            <Title order={3}>DemoStartseite</Title>
            </Center>
            <Center>
                <Image
                    src={DemoSeite}
                    radius="md"
                    h="14vh"
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
                    h="30vh"
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
                    h="19vh"
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
                    h="14vh"
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
                    h="16vh"
                    w="auto"
                    fit="contain"
                    alt="Demo Statistiken"
                />
            </Center>

        </div>
        )}
        </SimpleGrid>
    );
}       