import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { Title, Center, Box, ScrollArea, Space } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import BootstrapTable from 'react-bootstrap/Table';
import { db } from '../../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const LigaSeiteFahrertabelle = () => {
    const location = useLocation();
    const [ligaDaten, setLigaDaten] = useState(null);
    const matches = useMediaQuery('(max-width: 768px)');
    const [fahrerListe, setFahrerListe] = useState(null);

    useEffect(() => {
        const path = location.pathname.split("/");
        const ligaName = path[1];
        const aktuellerPfad = path[2];
        const ligaInformationen = {
            ligaName: ligaName,
            aktuellerPfad: aktuellerPfad
        }
        setLigaDaten(ligaInformationen);
    }, [location]);

    useEffect(() => {
        if (ligaDaten) {
            const fahrerDatenRef = collection(db, `${ligaDaten.ligaName}`);
            const discordUnsubscribe = onSnapshot(fahrerDatenRef, (snapshot) => {
                let fahrerDatenList = [];
                snapshot.forEach((doc) => {
                    fahrerDatenList.push(doc.data());
                });
                const fahrerlistenObjekt = fahrerDatenList[0];
                // Umwandlung des Objekts in ein Array von Objekten
                const fahrerlistenArray = Object.entries(fahrerlistenObjekt).map(([fahrerName, daten]) => {
                    return {
                        fahrername: fahrerName,
                        ...daten
                    };
                });
                // Schritt 1: Hinzufügen von gesamtWertung zu jedem Objekt
                fahrerlistenArray.forEach(fahrer => {
                    // Stellen Sie sicher, dass fahrer.Wertung ein Objekt ist; falls nicht, verwenden Sie ein leeres Objekt
                    const wertungenArray = Object.values(fahrer.Wertung || {});
                    // Filtere alle "DNF" Werte heraus
                    const gefilterteWertungenArray = wertungenArray.filter(wertung => wertung !== "DNF");
                    // Anwenden von reduce auf das Array der gefilterten Werte
                    fahrer.gesamtWertung = gefilterteWertungenArray.reduce((summe, aktuelleWertung) => summe + aktuelleWertung, 0);
                });

                // Sortieren des Arrays absteigend basierend auf gesamtWertung
                fahrerlistenArray.sort((a, b) => b.gesamtWertung - a.gesamtWertung);

                // Optional: Ausgabe des sortierten Arrays zur Überprüfung
                setFahrerListe(fahrerlistenArray);
            });
        }
    }, [ligaDaten]);

    const Strecken = [
        "Bahrain",
        "SaudiArabien",
        "Australien",
        "Japan",
        "China",
        "Miami",
        "Imola",
        "Monaco",
        "Kanada",
        "Spanien",
        "Österreich",
        "Großbritannien",
        "Ungarn",
        "Belgien",
        "Niederlande",
        "Monza",
        "Aserbaidschan",
        "Singapur",
        "Austin",
        "Mexiko",
        "Brasilien",
        "LasVegas",
        "Katar",
        "AbuDhabi",
    ];

    return (
        <>
        <Center>
            <Title order={matches ? 4 : 1}>Fahrertabelle für die Liga {ligaDaten?.ligaName}</Title>
        </Center>

        <Space h="xl" />

        <Center>
            <ScrollArea w="auto" h="auto">
                <Box w="70%">
                    <BootstrapTable striped bordered hover className='Eintragungübersicht'>
                        <thead>
                            <tr>
                                <th className="stickySpalte">Fahrername</th>
                                <th>Team</th>
                                    {
                                        Strecken.map((schlüssel) => (
                                        <th key={schlüssel} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <img 
                                                src={require(`./../../Components/Länderflaggen/${
                                                    schlüssel.toLowerCase() === 'austin' || schlüssel.toLocaleLowerCase() === 'miami' || schlüssel.toLocaleLowerCase() === 'lasvegas' ? 'usa' : 
                                                    schlüssel.toLowerCase() === 'imola' || schlüssel.toLowerCase() === 'monza' ? 'italien' : 
                                                    schlüssel.toLowerCase()
                                                }.png`)} 
                                                alt={schlüssel} 
                                                className='ÜbersichtFlaggen'
                                            />
                                        </th>
                                        ))
                                    }
                                <th>Gesamtwertung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fahrerListe?.map((fahrer, index) => (
                                <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <td className="stickySpalte">{fahrer.fahrername}</td>
                                    <td>{fahrer.team}</td>
                                    {Strecken.map((schlüssel) => (
                                        <td key={schlüssel}>{fahrer.Wertung[schlüssel]}</td>
                                    ))}
                                    <td>{fahrer.gesamtWertung}</td>
                                </tr>
                            ))}
                        </tbody>
                    </BootstrapTable>
                </Box>
            </ScrollArea>
        </Center>
        </>
    );
}
export default LigaSeiteFahrertabelle;