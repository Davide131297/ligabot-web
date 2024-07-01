import React, { useEffect, useState } from 'react';
import { db } from './../../utils/firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import Statistiken from "../../Components/Statistiken";
import { Center, Title, Space, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const LigaSeiteStatistiken = () => {
    const [ligaName, setLigaName] = useState(null);
    const [fahrerlistenObjekt, setFahrerlistenObjekt] = useState(null);
    const [teamsArray, setTeamsArray] = useState(null);
    const params = useParams();
    const matches = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (!ligaName) {
            console.log(params);
            setLigaName(params.id);
        } else {
            console.log('ligaName is already set', ligaName);
        }
    }, [params]);

    useEffect(() => {
        if (ligaName) {
            console.log("Liga Name:", ligaName);
            const fahrerDatenRef = collection(db, `${ligaName}`);
            const discordUnsubscribe = onSnapshot(fahrerDatenRef, (snapshot) => {
                let fahrerDatenList = [];
                snapshot.forEach((doc) => {
                    fahrerDatenList.push(doc.data());
                });
                console.log("Fahrer Daten List:", fahrerDatenList);
                if (fahrerDatenList.length > 0) {
                    setFahrerlistenObjekt(fahrerDatenList[0]);
                } else {
                    console.log("Keine Daten gefunden in", ligaName);
                }
            }, (error) => {
                console.error("Fehler beim Abrufen der Fahrerdaten:", error);
            });
            return () => discordUnsubscribe();
        }
    }, [ligaName]);

    useEffect(() => {
        if (ligaName) {
            const docRef = doc(db, ligaName, "Teams");
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
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
        }
    }, [ligaName]);

    return (
        <>
        <Center>
            <Title order={matches ? 4 : 1}>Statistiken</Title>
        </Center>

        <Space h="xl" />

        <Statistiken ligaName={ligaName} fahrerlistenObjekt={fahrerlistenObjekt} teamsArray={teamsArray} />
        </>
    );
}
export default LigaSeiteStatistiken;