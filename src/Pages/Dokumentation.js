import { Center, Title, Text } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';

export default function Dokumentation() {  
    const matches = useMediaQuery('(max-width: 768px)'); 

    return (
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
                    Auf der Liga Seite werden die Fahrertabelle, die Konstrukteurstabelle und die Statistiken der Liga angezeigt.
                </Text>
            <Title order={2}>Einstellungsseite</Title>
                <Text>
                    Die Einstellungsseite ermöglicht es, eine neue Liga zu erstellen oder eine bestehende Liga zu bearbeiten.
                    Es können der Name der Liga, das Logo der Liga und die Anzahl der Rennen pro Saison eingestellt werden, sowie deren Ergebnisse eingetragen werden.
                </Text>
        </div>
    );
}       