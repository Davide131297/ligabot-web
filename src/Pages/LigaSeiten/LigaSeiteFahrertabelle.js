import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { Title, Center, Box, ScrollArea, Space } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import BootstrapTable from 'react-bootstrap/Table';
import { db } from '../../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import Alpine from '././../../Components/Teamlogos/Alpine.png';
import AstonMartin from '././../../Components/Teamlogos/AstonMartin.png';
import Ferrari from '././../../Components/Teamlogos/Ferrari.png';
import Haas from '././../../Components/Teamlogos/Logo_Haas_F1.png';
import McLaren from '././../../Components/Teamlogos/MclarenIcon.png';
import Mercedes from '././../../Components/Teamlogos/MercedesIcon.png';
import RedBull from '././../../Components/Teamlogos/RedBullIcon.png';
import KickSauber from '././../../Components/Teamlogos/StakeSauber.png';
import VisaRB from '././../../Components/Teamlogos/VisaRB.jpg';
import Williams from '././../../Components/Teamlogos/Williams.png';


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

    function renderTeamLogo(team) {
        if (team === 'Ferrari') {
          return <img src={Ferrari} alt="Ferrari Logo" style={{ width: '15px', height: '20px' }} />;
        }
        if (team === 'AstonMartin') {
          return <img src={AstonMartin} alt="Aston Martin Logo" style={{ width: '25px', height: '20px'}} />;
        }
        if (team === 'Mercedes') {
          return <img src={Mercedes} alt="Mercedes Logo" style={{ width: '20px', height: '20px'}} />;
        }
        if (team === 'RedBull') {
          return <img src={RedBull} alt="Red Bull Logo" style={{ width: '20px', height: '20px' }} />;
        }
        if (team === 'Williams') {
          return <img src={Williams} alt="Williams Logo" style={{ width: '20px', height: '20px' }} />;
        }
        if (team === 'McLaren') {
          return <img src={McLaren} alt="McLaren Logo" style={{ width: '25px', height: '25px' }} />;
        }
        if (team === 'Alpine') {
          return <img src={Alpine} alt="Alpine Logo" style={{ width: '20px', height: '20px' }} />;
        }
        if (team === 'KickSauber') {
          return <img src={KickSauber} alt="KickSauber Logo" style={{ width: '20px', height: '20px' }}/>;
        }
        if (team === 'VisaRB') {
            return <img src={VisaRB} alt="RB Visa Logo" style={{ width: '20px', height: '15px' }}/>;
        }
        if (team === 'Haas') {
          return <img src={Haas} alt="Haas Logo" style={{ width: '40px', height: '15px' }} />;
        }
        return null;
      }

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
                                    <td>{renderTeamLogo(fahrer.team)}</td>
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