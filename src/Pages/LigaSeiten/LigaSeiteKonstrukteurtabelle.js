import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { Title, Center, Box, ScrollArea, Space } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import BootstrapTable from 'react-bootstrap/Table';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const LigaSeiteKonstrukteurtabelle = () => {
    const location = useLocation();
    const [ligaDaten, setLigaDaten] = useState(null);
    const matches = useMediaQuery('(max-width: 768px)');
    const [teamsArray, setTeamsArray] = useState([]);
    const [teams, setTeams] = useState(null);
    const [streckenVisible, setStreckenVisible] = useState(null);
    const [sortierteStrecken, setSortierteStrecken] = useState(null);

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
            const docRef = doc(db, ligaDaten.ligaName, "Teams");
            getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    // Verarbeitung der Teams, ohne das Ergebnis zu verwenden, da setTeams(docSnap.data()) bleibt
                    const teams = Object.keys(docSnap.data()).map(teamName => ({
                        teamName,
                        ...docSnap.data()[teamName]
                    }));
                    teams.forEach(team => {
                        // Extrahiere alle Werte außer 'teamName'
                        const rennenWerte = Object.keys(team).reduce((acc, key) => {
                            if (key !== 'teamName' && team[key] !== null) {
                                acc.push(team[key]);
                            }
                            return acc;
                        }, []);
                        // Berechne die gesamte Wertung, indem du sicherstellst, dass nur numerische Werte addiert werden
                        const gesamtWertung = rennenWerte.reduce((summe, wert) => {
                            // Hier müssen Sie entscheiden, wie Sie mit Objekten umgehen möchten
                            // Zum Beispiel, wenn `wert` ein Objekt mit einer Eigenschaft `punkte` ist, die eine Zahl ist
                            let numWert = 0;
                            if (typeof wert === 'object' && wert !== null) {
                                // Angenommen, Sie möchten eine Eigenschaft `punkte` aus dem Objekt extrahieren
                                numWert = wert.punkte || 0;
                            } else if (typeof wert === 'number') {
                                numWert = wert;
                            }
                            return summe + numWert;
                        }, 0);
                        team.gesamtWertung = gesamtWertung;
                    });

                    // Sortiere die Teams absteigend nach gesamtWertung
                    teams.sort((a, b) => b.gesamtWertung - a.gesamtWertung);

                    setTeamsArray(teams);
                    setTeams(docSnap.data());
                    console.log("TeamsArray: ", teams);

                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
        }
    }, [location, ligaDaten]);

    useEffect(() => {
        const fetchStreckenDaten = async () => {
            if (ligaDaten) { // Stellen Sie sicher, dass ligaName nicht leer oder undefined ist
                try {
                    const StreckenRef = doc(db, ligaDaten.ligaName, "Strecken");
                    const StreckenDoc = await getDoc(StreckenRef);
                    if (StreckenDoc.exists()) {
                        setStreckenVisible(StreckenDoc.data());
                    } else {
                        console.log("Keine Strecken gefunden");
                    }
                } catch (error) {
                    console.error("Fehler beim Abrufen der Strecken Daten:", error);
                }
            }
        };
        fetchStreckenDaten();
    }, [ligaDaten]);

    useEffect(() => {
        if (streckenVisible) {
            setSortierteStrecken(Object.keys(streckenVisible)
            .filter(schlüssel => streckenVisible[schlüssel].Visible) // Nur sichtbare Strecken
            .sort((a, b) => streckenVisible[a].datum.seconds - streckenVisible[b].datum.seconds));
        }
    }, [streckenVisible]);

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
            <Title order={matches ? 4 : 1}>Konstrukteurstabelle für die Liga {ligaDaten?.ligaName}</Title>
        </Center>

        <Space h="xl" />

        {streckenVisible && sortierteStrecken &&(
        <Center>
            <ScrollArea w="auto" h="auto">
                <Box w="70%">
                <BootstrapTable striped bordered hover className='Eintragungübersicht'>
                                    <thead>
                                        <tr>
                                        <th className="stickySpalte">Team</th>
                                        {
                                            sortierteStrecken.map((schlüssel) => (
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
                                        {teamsArray.map((team, index) => (
                                        <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <td className="stickySpalte">{team.teamName}</td>
                                            {
                                            sortierteStrecken.map((schlüssel) => (
                                                <td key={schlüssel}>{teams[team.teamName][schlüssel]}</td>
                                            ))
                                            }
                                            <td>{team.gesamtWertung}</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </BootstrapTable>
                </Box>
            </ScrollArea>
        </Center>
        )}
        </>
    );
}
export default LigaSeiteKonstrukteurtabelle;