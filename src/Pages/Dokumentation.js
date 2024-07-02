import { Center, Title } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';

export default function Dokumentation() {  
    const matches = useMediaQuery('(max-width: 768px)'); 

    return (
        <div>
            <Center>
                <Title order={1}>Dokumentation</Title>
            </Center>
            <Title order={2}>Einleitung</Title>
            <p>Die Webanwendung "F1-Manager" ist eine Anwendung, die es ermöglicht, eine eigene Formel 1 Liga zu erstellen und zu verwalten. 
                Die Anwendung ist in React.js geschrieben und verwendet Firebase als Datenbank. 
                Die Anwendung besteht aus einer Startseite
                und einer Einstellungsseite. Die Startseite zeigt die verschiedenen Ligen an, die in der Anwendung erstellt wurden.
                Die Einstellungsseite ermöglicht es, eine neue Liga zu erstellen oder eine bestehende Liga zu bearbeiten.
            </p>
            <Title order={2}>Startseite</Title>
            <p>Die Startseite zeigt die verschiedenen Ligen an, die in der Anwendung erstellt wurden. 
                Es wird der Name der Liga und das Logo der Liga angezeigt.
            </p>
            <Title order={2}>Einstellungsseite</Title>
            <p>Die Einstellungsseite ermöglicht es, eine neue Liga zu erstellen oder eine bestehende Liga zu bearbeiten.
                Es können der Name der Liga, das Logo der Liga und die Anzahl der Rennen pro Saison eingestellt werden.
            </p>
            <Title order={2}>Liga Seite</Title>
            <p>Die Liga Seite zeigt die verschiedenen Informationen über die Liga an. 
                Es werden die Fahrertabelle, die Konstrukteurstabelle und die Statistiken der Liga angezeigt.
            </p>
            <Title order={2}>Fahrertabelle</Title>
            <p>Die Fahrertabelle zeigt die verschiedenen Fahrer der Liga an. 
                Es werden die Position, der Name, das Team, die Punkte und die Siege der Fahrer angezeigt.
            </p>
            <Title order={2}>Konstrukteurstabelle</Title>
            <p>Die Konstrukteurstabelle zeigt die verschiedenen Konstrukteure der Liga an. 
                Es werden die Position, der Name, die Punkte und die Siege der Konstrukteure angezeigt.
            </p>
            <Title order={2}>Statistiken</Title>
            <p>Die Statistiken zeigen verschiedene Statistiken der Liga an. 
                Es werden die Anzahl der Rennen, die Anzahl der Fahrer, die Anzahl der Konstrukteure, die Anzahl der Siege und die Anzahl der Punkte angezeigt.
            </p>
        </div>
    );
}       