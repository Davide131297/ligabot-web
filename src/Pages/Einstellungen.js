import { db } from './../utils/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { Button, Table, Modal, ScrollArea, Box, Select, NumberInput} from '@mantine/core';
import BootstrapTable from 'react-bootstrap/Table';
import { useDisclosure } from '@mantine/hooks';
import { FaTrashAlt } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";

const Einstellungen = () => {  

    const [DiscordServer, setDiscordServer] = useState([]);
    const [Liga, setLiga] = useState([]);
    const [user, setUser] = useState(null);
    const [Daten, setDaten] = useState(null);
    const [ligaName, setLigaName] = useState(null);
    const [ligaErstellt, setLigaErstellt] = useState(false);
    const [fahrername, setFahrername] = useState("");
    const [teamname, setTeamname] = useState("");
    const [ligaDaten, setLigaDaten] = useState([]);
    const [fahrerliste, setFahrerliste] = useState([]);
    const [fahrerlistenObjekt, setFahrerlistenObjekt] = useState();

    const [opened, { open, close }] = useDisclosure(false); // Modal Hinzufügen neuer Fahrer
    const [openEintragen, setOpenEintragen] = useState(false); // Modal Eintragen der Ergebnisse
    const [ergebnisse, setErgebnis] = useState({});
    const [gefahreneStrecke, setGefahreneStrecke] = useState(null);

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

    const StreckenSelect = [
        { value: 'Bahrain', label: 'Bahrain' },
        { value: 'SaudiArabien', label: 'Saudi Arabien' },
        { value: 'Australien', label: 'Australien' },
        { value: 'Japan', label: 'Japan' },
        { value: 'China', label: 'China' },
        { value: 'Miami', label: 'Miami' },
        { value: 'Imola', label: 'Imola' },
        { value: 'Monaco', label: 'Monaco' },
        { value: 'Kanada', label: 'Kanada' },
        { value: 'Spanien', label: 'Spanien' },
        { value: 'Österreich_Sprint', label: 'Österreich Sprint' },
        { value: 'Österreich_Rennen', label: 'Österreich Rennen' },
        { value: 'Großbritannien', label: 'Großbritannien' },
        { value: 'Ungarn', label: 'Ungarn' },
        { value: 'Belgien', label: 'Belgien' },
        { value: 'Niederlande', label: 'Niederlande' },
        { value: 'Monza', label: 'Monza' },
        { value: 'Aserbaidschan', label: 'Aserbaidschan' },
        { value: 'Singapur', label: 'Singapur' },
        { value: 'Austin_Sprint', label: 'Austin Sprint' },
        { value: 'Austin_Rennen', label: 'Austin Rennen' },
        { value: 'Mexiko', label: 'Mexiko' },
        { value: 'Brasilien_Sprint', label: 'Brasilien Sprint' },
        { value: 'Brasilien_Rennen', label: 'Brasilien Rennen' },
        { value: 'LasVegas', label: 'Las Vegas' },
        { value: 'Katar_Sprint', label: 'Katar Sprint' },
        { value: 'Katar_Rennen', label: 'Katar Rennen' },
        { value: 'AbuDhabi', label: 'Abu Dhabi' },
    ];

    const punkte = [
        "DNF",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "15",
        "16",
        "18",
        "19",
        "25",
        "26"
    ];

    const allDataAvailable = useCallback(() => {
        const pairringLiga = Liga.filter(liga => liga.adminUser === user);
        if (pairringLiga.length > 0) {
            setLigaName(pairringLiga[0].ligaName);
            const pairringDiscrodServer = DiscordServer.find(server => server.ligaKey === pairringLiga[0].key);
            setDaten({ pairringLiga: pairringLiga[0], pairringDiscrodServer });
        }
    }, [DiscordServer, Liga, user, setDaten]);

    useEffect(() => {
        const discordServerRef = collection(db, 'discordServers');
        const discordUnsubscribe = onSnapshot(discordServerRef, (snapshot) => {
            let discordServerList = [];
            snapshot.forEach((doc) => {
                discordServerList.push(doc.data());
            });
            setDiscordServer(discordServerList);
        });

        const ligaKeysRef = collection(db, 'ligaKeys');
        const ligaUnsubscribe = onSnapshot(ligaKeysRef, (snapshot) => {
            let ligaList = [];
            snapshot.forEach((doc) => {
                ligaList.push(doc.data());
            });
            setLiga(ligaList);
        });

        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
            setUser(localUser.displayName);
        }

        return () => {
            discordUnsubscribe();
            ligaUnsubscribe();
        }
    }, []);

    useEffect(() => {
        if (DiscordServer && Liga && user) {
            allDataAvailable();
        }
    }, [DiscordServer, Liga, user, allDataAvailable]);

    useEffect(() => {
        if (Daten?.pairringLiga?.ligaName) {
            const ligaNameRef = collection(db, Daten.pairringLiga.ligaName);
            const ligaNameUnsubscribe = onSnapshot(ligaNameRef, (snapshot) => {
                if (snapshot.empty) {
                    setLigaErstellt(false);
                } else {
                    setLigaErstellt(true);
                }
            });

            return () => {
                ligaNameUnsubscribe();
            }
        }
    }, [Daten]);

   useEffect(() => {
        if (ligaErstellt) {
            console.log("Liga wurde erstellt");
            const fahrerDatenRef = collection(db, `${ligaName}`);
            const discordUnsubscribe = onSnapshot(fahrerDatenRef, (snapshot) => {
                let fahrerDatenList = [];
                snapshot.forEach((doc) => {
                    fahrerDatenList.push(doc.data());
                });
                console.log("FahrerdatenList: ", fahrerDatenList[0]);
                setFahrerlistenObjekt(fahrerDatenList[0]);
                const fahrerlistenObjekt = fahrerDatenList[0];
                // Umwandlung des Objekts in ein Array von Objekten
                const fahrerlistenArray = Object.entries(fahrerlistenObjekt).map(([fahrerName, daten]) => {
                    return {
                        fahrername: fahrerName,
                        ...daten
                    };
                });
                console.log("Fahrerdaten: ", fahrerlistenArray);
                const fahrerliste = fahrerlistenArray.map((fahrer) => fahrer.fahrername);
                setFahrerliste(fahrerliste);
                // Schritt 1: Hinzufügen von gesamtWertung zu jedem Objekt
                fahrerlistenArray.forEach(fahrer => {
                    // Stellen Sie sicher, dass fahrer.Wertung ein Objekt ist; falls nicht, verwenden Sie ein leeres Objekt
                    const wertungenArray = Object.values(fahrer.Wertung || {});
                    // Anwenden von reduce auf das Array der Werte
                    fahrer.gesamtWertung = wertungenArray.reduce((summe, aktuelleWertung) => summe + aktuelleWertung, 0);
                });

                // Sortieren des Arrays absteigend basierend auf gesamtWertung
                fahrerlistenArray.sort((a, b) => b.gesamtWertung - a.gesamtWertung);

                // Optional: Ausgabe des sortierten Arrays zur Überprüfung
                console.log("FahrerlistenArray: ", fahrerlistenArray);
                setLigaDaten(fahrerlistenArray);
            });
        }
    }, [ligaErstellt]);

    function createLigaCollection() {
        if (ligaName) {
            const docRef = doc(db, ligaName, 'Fahrer');
            setDoc(docRef, {})
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            console.error("Error: Liga name is empty");
        }
    }

    const handleCreateDriver = (e) => {
        e.preventDefault();
        console.log("Fahrername: ", fahrername);
        if (ligaName) {
            const docRef = doc(db, ligaName, 'Fahrer');
            updateDoc(docRef, {
                [fahrername]: {
                    team: teamname,
                    Wertung: {
                        Bahrain: null,
                        SaudiArabien: null,
                        Australien: null,
                        Japan: null,
                        China: null,
                        Miami: null,
                        Imola: null,
                        Monaco: null,
                        Kanada: null,
                        Spanien: null,
                        Österreich: null,
                        Großbritannien: null,
                        Ungarn: null,
                        Belgien: null,
                        Niederlande: null,
                        Monza: null,
                        Aserbaidschan: null,
                        Singapur: null,
                        Austin: null,
                        Mexiko: null,
                        Brasilien: null,
                        LasVegas: null,
                        Katar: null,
                        AbuDhabi: null
                    }
                }
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            console.error("Error: Liga name is empty");
        }
    };

    async function handleErgenisseEintragen() {
        const ergebnisseAlsInteger = Object.keys(ergebnisse).reduce((acc, key) => {
            acc[key] = parseInt(ergebnisse[key], 10);
            return acc;
        }, {});

        console.log("Ergebnisse: ", ergebnisseAlsInteger);
        console.log("Gefahrene Strecke: ", gefahreneStrecke);

        Object.keys(fahrerlistenObjekt).forEach(fahrername => {
            let fahrer = fahrerlistenObjekt[fahrername];
            if (ergebnisseAlsInteger.hasOwnProperty(fahrername)) {
                // Aktualisiere die Wertung für das Rennen in gefahreneStrecke
                if (!fahrer.Wertung) {
                    fahrer.Wertung = {};
                }
                fahrer.Wertung[gefahreneStrecke] = ergebnisseAlsInteger[fahrername];

                // Aktualisiere die gesamtWertung basierend auf den neuen Ergebnissen
                let gesamt = 0;
                Object.values(fahrer.Wertung).forEach(wertung => {
                    if (wertung) gesamt += wertung;
                });
                fahrer.gesamtWertung = gesamt;
            }
        });

        Object.keys(fahrerlistenObjekt).forEach(fahrername => {
            delete fahrerlistenObjekt[fahrername].gesamtWertung;
        });
        
        console.log("Aktualisiertes FahrerlistenObjekt: ", fahrerlistenObjekt);

        const docRef = doc(db, ligaName, 'Fahrer');
        try {
            await updateDoc(docRef, fahrerlistenObjekt);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    return (
        <>
            <div>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Nutzername</Table.Th>
                            <Table.Th>Liga</Table.Th>
                            <Table.Th>Discord Server ID</Table.Th>
                        </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>{Daten?.pairringLiga?.adminUser}</Table.Td>
                                <Table.Td>{Daten?.pairringLiga?.ligaName}</Table.Td>
                                <Table.Td>{Daten?.pairringDiscrodServer?.serverId}</Table.Td>
                            </Table.Tr>
                    </Table.Tbody>
                </Table>
            </div>
            <div>
                {!ligaErstellt &&(
                    <div>
                        Die Liga wurde noch nicht erstellt!
                        <Button variant="filled" color="rgba(0, 0, 0, 1)" onClick={createLigaCollection}>Liga erstellen</Button>
                    </div>
                )}
                {ligaErstellt && ligaDaten &&(
                    <div>
                        <ScrollArea w="auto" h="auto">
                            <Box w="70%">
                                <BootstrapTable striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Fahrername</th>
                                            <th>Team</th>
                                            {
                                            Strecken.map((schlüssel) => (
                                                <th key={schlüssel}>{schlüssel}</th>
                                            ))
                                            }
                                            <th>Gesamtwertung</th>
                                            <th>{/* Buttons */}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ligaDaten.map((fahrer, index) => (
                                            <tr key={index}>
                                                <td>{fahrer.fahrername}</td>
                                                <td>{fahrer.team}</td>
                                                {Strecken.map((schlüssel) => (
                                                    <td key={schlüssel}>{fahrer.Wertung[schlüssel]}</td>
                                                ))}
                                                <td>{fahrer.gesamtWertung}</td>
                                                <td>
                                                    <div style={{display: 'flex', marginLeft: '5px'}}>
                                                        <div style={{marginRight: '10px', cursor: 'pointer'}}>
                                                            <FaUserEdit color='black' size={20}/>
                                                        </div>
                                                        <div style={{ cursor: 'pointer'}}>
                                                            <FaTrashAlt color='red' size={20}/>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </BootstrapTable>
                            </Box>
                        </ScrollArea>
                    </div>
                )}
            </div>
            <div>
                <Button onClick={open}>Fahrer hinzufügen</Button>
                <Button onClick={() => setOpenEintragen(true)}>Ergebnisse eintragen</Button>
            </div>

            {/* Modal für das Hinzufügen eines Fahrers */}
            <Modal
                opened={opened}
                onClose={() => {
                    close();
                    setFahrername("");
                    setTeamname("");
                }}
                title="Fahrer hinzufügen"
                centered
                size="md"
            >
                <form onSubmit={handleCreateDriver} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
                    <label>
                        Fahrername:
                        <input 
                            type="text" 
                            value={fahrername} 
                            onChange={(e) => setFahrername(e.target.value)} 
                            required
                            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        />
                    </label>
                    <label>
                        Team:
                        <select 
                            value={teamname} 
                            onChange={(e) => setTeamname(e.target.value)} 
                            required
                            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                        >
                            <option value="">--Bitte wählen Sie ein Team--</option>
                            <option value="Mercedes">Mercedes</option>
                            <option value="Red Bull Racing">Red Bull Racing</option>
                            <option value="McLaren">McLaren</option>
                            <option value="Ferrari">Ferrari</option>
                            <option value="Aston Martin">Aston Martin</option>
                            <option value="Alpine">Alpine</option>
                            <option value="Visa RB">AlphaTauri</option>
                            <option value="Kick Sauber">Alfa Romeo</option>
                            <option value="Haas">Haas</option>
                            <option value="Williams">Williams</option>
                        </select>
                    </label>
                    <input type="submit" value="Fahrer hinzufügen" style={{marginTop: "30px"}}/>
                </form>
            </Modal>

            {/* Modal für das Eintragen der Ergebnisse */}
            <Modal
                opened={openEintragen}
                onClose={() => setOpenEintragen(false)}
                title="Ergebnisse eintragen"
                centered
                size="md"
            >
                <Select
                    label="Streckenauswahl"
                    placeholder="Wähle hier die Strecke"
                    data={StreckenSelect}
                    searchable
                    onChange={(value) => setGefahreneStrecke(value)}
                />

                <div style={{marginTop: '10px'}}>
                    <BootstrapTable striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                <th>Fahrername</th>
                                <th>Platzierung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fahrerliste.map((fahrer, index) => (
                                <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <td>{fahrer}</td>
                                    <td>
                                        <Select
                                            placeholder="Punkte auswahl"
                                            data={punkte.map(punkt => ({value: punkt, label: punkt}))}
                                            onChange={(value) => setErgebnis(prevErgebnis => ({
                                                ...prevErgebnis,
                                                [fahrer]: value // Aktualisiert die Punkte für den spezifischen Fahrer
                                            }))}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </BootstrapTable>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
                    <Button 
                        style={{marginTop: '20px'}}
                        variant="filled" color="green" radius="xl"
                        onClick={() => {handleErgenisseEintragen()}}
                    >
                        Ergebnisse eintragen
                    </Button>
                </div>

            </Modal>
        </>
    );
}
export default Einstellungen;