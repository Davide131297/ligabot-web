import { db } from './../utils/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { Button, Table, Modal } from '@mantine/core';
import BootstrapTable from 'react-bootstrap/Table';
import { useDisclosure } from '@mantine/hooks';

const Einstellungen = () => {  

    const [DiscordServer, setDiscordServer] = useState([]);
    const [Liga, setLiga] = useState([]);
    const [user, setUser] = useState(null);
    const [Daten, setDaten] = useState(null);
    const [ligaName, setLigaName] = useState(null);
    const [ligaErstellt, setLigaErstellt] = useState(false);
    const [ligaDaten, setLigaDaten] = useState([]);
    const [fahrername, setFahrername] = useState("");
    const [teamname, setTeamname] = useState("");
    const [opened, { open, close }] = useDisclosure(false);

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
                console.log("Fahrerdaten: ", JSON.stringify(fahrerDatenList, null, 2));
                // setLigaDaten(fahrerDatenList);
            });
        }
    }, [ligaErstellt]);

    useEffect(() => {
        if (ligaDaten.length > 0) {
            console.log("Ligadaten: ", ligaDaten);
        }
    }, [ligaDaten]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Fahrername: ", fahrername);
        if (ligaName) {
            const docRef = doc(db, ligaName, 'Fahrer', fahrername);
            setDoc(docRef, {
                team: teamname,
                Wertung: {}
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


    useEffect(() => {
        if (nutzerDaten) {
            console.log(nutzerDaten);
        }
    }, [nutzerDaten]);

    function handlepairing() {
        const NutzerDaten = {
            LigaZugehörigkeit: Liga.find(Liga => Liga.adminUser === user),
            DiscordServerZugehörigkeit: DiscordServer.find(DiscordServer => DiscordServer.ligaKey === Liga.find(Liga => Liga.key).key)
        };
        setNutzerDaten(NutzerDaten);
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
                {!ligaErstellt && (
                    <div>
                        Die Liga wurde noch nicht erstellt!
                        <Button variant="filled" color="rgba(0, 0, 0, 1)" onClick={createLigaCollection}>Liga erstellen</Button>
                    </div>
                )}
                {ligaErstellt && ligaDaten && (
                    <div>
                        Die Liga wurde bereits erstellt!
                    </div>
                )}
            </div>
            <div>
                <Button onClick={open}>Fahrer hinzufügen</Button>
            </div>
            <Modal
                opened={opened}
                onClose={close}
                title="Fahrer hinzufügen"
                centered
                size="md"
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
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
        </>
    );
}
export default Einstellungen;