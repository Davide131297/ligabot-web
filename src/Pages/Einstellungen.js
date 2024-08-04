import { db } from './../utils/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, onSnapshot, doc, setDoc, updateDoc, getDoc, deleteField, where, getDocs, query, Timestamp } from 'firebase/firestore';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Button, Table, Modal, ScrollArea, Box, Select, Divider, Loader, TextInput, Menu, ActionIcon, FileButton, Group, Space, Switch, Center, Tooltip } from '@mantine/core';
import BootstrapTable from 'react-bootstrap/Table';
import { useDisclosure } from '@mantine/hooks';
import { FaTrashAlt } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import { MdWebAsset } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi";
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import './Einstellungen.css';
import Statistiken from '../Components/Statistiken';
import RichText from '../Components/RichText/Richtext';
import { IoFilter } from "react-icons/io5";
import { DatePicker } from '@mantine/dates';
import html2canvas from 'html2canvas';
import { IoCamera } from "react-icons/io5";
import RenderCalendar from '../Components/DownloadPictureDocs/RenderCalendar';

const Einstellungen = ({ ligaName, setLigaName}) => {  

    const [DiscordServer, setDiscordServer] = useState([]);
    const [eigenerDiscordServer, setEigenerDiscordServer] = useState([]);
    const [Liga, setLiga] = useState([]);
    const [user, setUser] = useState(null);
    const [Daten, setDaten] = useState(null);
    const [ligaErstellt, setLigaErstellt] = useState(false);
    const [fahrername, setFahrername] = useState("");
    const [teamname, setTeamname] = useState("");
    const [ligaDaten, setLigaDaten] = useState([]); // Fahrerdaten als Array
    const [fahrerliste, setFahrerliste] = useState([]);
    const [fahrerlistenObjekt, setFahrerlistenObjekt] = useState(); // Fahrerdaten als Objekt direkt aus der Datenbank
    const [teams, setTeams] = useState();
    const [teamsArray, setTeamsArray] = useState([]);
    const [isLoading, setIsLoading] = useState("1");
    const [reloadData, setReloadData] = useState(false);
    const [newLogo, setNewLogo] = useState(false); // Neues Logo hochladen mobiles Modal
    const [editPage, setEditPage] = useState(false); // Modal für das Bearbeiten der Ligaseite
    const navigate = useNavigate();

    const [opened, { open, close }] = useDisclosure(false); // Modal Hinzufügen neuer Fahrer
    const [openEintragen, setOpenEintragen] = useState(false); // Modal Eintragen der Ergebnisse
    const [ergebnisse, setErgebnis] = useState({}); // Ergebnisse für die Strecken
    const [gefahreneStrecke, setGefahreneStrecke] = useState(null); // Strecke, für die die Ergebnisse eingetragen werden
    const [file, setFile] = useState(null);
    const [streckenVisible, setStreckenVisible] = useState(null);
    const [tempStreckenVisible, setTempStreckenVisible] = useState({ ...streckenVisible });
    const [streckenPopup, setStreckenPopup] = useState(false);

    const [dateModal, setDateModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingStrecke, setEditingStrecke] = useState('');

    const [calendarData, setCalendarData] = useState([]);
    const [openCalendar, setOpenCalendar] = useState(false);

    const driverRef = useRef();
    const teamRef = useRef();



    // Schritt 1 & 2: Extrahiere und sortiere die Strecken basierend auf dem Datum
    const sortierteStrecken = streckenVisible ? Object.keys(streckenVisible)
        .filter(schlüssel => streckenVisible[schlüssel].Visible) // Nur sichtbare Strecken
        .sort((a, b) => streckenVisible[a].datum.seconds - streckenVisible[b].datum.seconds) : []; // Sortiere nach Datum

    const openModal = (strecke, datum) => {
        setEditingStrecke(strecke);
        setSelectedDate(datum ? new Date(datum.seconds * 1000) : new Date());
        setDateModal(true);
    };
      
    // Funktion zum Aktualisieren des Datums
    const updateDate = () => {
        const newTimestamp = Timestamp.fromDate(selectedDate);
        setTempStreckenVisible(prev => ({
          ...prev,
          [editingStrecke]: {
            ...prev[editingStrecke],
            datum: newTimestamp,
          },
        }));
        setDateModal(false);
    };

    useEffect(() => {
        if (typeof streckenVisible === 'object' && streckenVisible !== null) {
            const arrayData = Object.keys(streckenVisible).map(key => {
                const obj = streckenVisible[key];
                const formattedDate = obj.datum.toDate().toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit'
                }).replace(/\./g, '.').slice(0, -1);
                return { ...obj, datum: formattedDate, name: key };
            }).sort((a, b) => {
                const [dayA, monthA] = a.datum.split('.');
                const [dayB, monthB] = b.datum.split('.');
                const dateA = new Date(2023, monthA - 1, dayA); // Jahr 2023 als Platzhalter
                const dateB = new Date(2023, monthB - 1, dayB); // Jahr 2023 als Platzhalter
                return dateA - dateB;
            });
            setCalendarData(arrayData);
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
        { value: 'Österreich', label: 'Österreich' },
        { value: 'Großbritannien', label: 'Großbritannien' },
        { value: 'Ungarn', label: 'Ungarn' },
        { value: 'Belgien', label: 'Belgien' },
        { value: 'Niederlande', label: 'Niederlande' },
        { value: 'Monza', label: 'Monza' },
        { value: 'Aserbaidschan', label: 'Aserbaidschan' },
        { value: 'Singapur', label: 'Singapur' },
        { value: 'Austin', label: 'Austin' },
        { value: 'Mexiko', label: 'Mexiko' },
        { value: 'Brasilien', label: 'Brasilien' },
        { value: 'LasVegas', label: 'Las Vegas' },
        { value: 'Katar', label: 'Katar' },
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

    const f1Teams = [
        { value: 'Mercedes', label: 'Mercedes' },
        { value: 'RedBull', label: 'Red Bull' },
        { value: 'McLaren', label: 'McLaren' },
        { value: 'Ferrari', label: 'Ferrari' },
        { value: 'AstonMartin', label: 'Aston Martin' },
        { value: 'Alpine', label: 'Alpine' },
        { value: 'VisaRB', label: 'Visa RB' },
        { value: 'KickSauber', label: 'Kick Sauber' },
        { value: 'Haas', label: 'Haas' },
        { value: 'Williams', label: 'Williams' }
    ];

    const allDataAvailable = useCallback(() => {
        const pairringLiga = Liga.filter(liga => liga.adminUser.includes(user));
        if (pairringLiga.length > 0) {
            setLigaName(pairringLiga[0].ligaName);
            const pairringDiscrodServer = DiscordServer.find(server => server.ligaKey === pairringLiga[0].key);
            setEigenerDiscordServer(pairringDiscrodServer);
            setDaten({ pairringLiga: pairringLiga[0], pairringDiscrodServer });
        }
    }, [DiscordServer, Liga, user, setDaten]);

    useEffect(() => {
        if (streckenPopup) {
          setTempStreckenVisible({ ...streckenVisible });
        }
    }, [streckenPopup, streckenVisible]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/');
            notifications.show({
                title: 'Fehler',
                message: 'Du bist nicht angemeldet, bitte melde dich an',
                color: 'red',
            });
        }
    }, []);

    useEffect(() => {
        if (file)  {
            console.log("File: ", file);
            handleLogoUpload();
        }
    }, [file]);

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
                    setIsLoading("2");
                } else {
                    setLigaErstellt(true);
                    setIsLoading("3");
                }
            });

            return () => {
                ligaNameUnsubscribe();
            }
        }
    }, [Daten, ligaErstellt]);

   useEffect(() => {
        if (ligaErstellt) {
            const fahrerDatenRef = collection(db, `${ligaName}`);
            const discordUnsubscribe = onSnapshot(fahrerDatenRef, (snapshot) => {
                let fahrerDatenList = [];
                snapshot.forEach((doc) => {
                    fahrerDatenList.push(doc.data());
                });
                setFahrerlistenObjekt(fahrerDatenList[0]);
                const fahrerlistenObjekt = fahrerDatenList[0];
                // Umwandlung des Objekts in ein Array von Objekten
                const fahrerlistenArray = Object.entries(fahrerlistenObjekt).map(([fahrerName, daten]) => {
                    return {
                        fahrername: fahrerName,
                        ...daten
                    };
                });
                const fahrerliste = fahrerlistenArray.map((fahrer) => fahrer.fahrername);
                setFahrerliste(fahrerliste);
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
                setLigaDaten(fahrerlistenArray);
                setIsLoading("3");
            });
        }
    }, [ligaErstellt]);

    useEffect(() => {
        if (ligaErstellt) {
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
                    setTeams(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
        }
    }, [ligaErstellt, ligaName, reloadData]);

    useEffect(() => {
        const fetchStreckenDaten = async () => {
            if (ligaDaten && teamsArray && ligaName) { // Stellen Sie sicher, dass ligaName nicht leer oder undefined ist
                try {
                    const StreckenRef = doc(db, ligaName, "Strecken");
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
    }, [ligaDaten, teamsArray, ligaName]); // Stellen Sie sicher, dass ligaName als Abhängigkeit hinzugefügt wird

    async function createLigaCollection() {
        if (ligaName) {
            // Erstelle das Dokument "Fahrer" in der Collection mit dem Namen ligaName
            const fahrerDocRef = doc(db, ligaName, 'Fahrer');
            setDoc(fahrerDocRef, {})
            .then(() => {
                console.log("Dokument 'Fahrer' erfolgreich erstellt!");
            })
            .catch((error) => {
                console.error("Fehler beim Erstellen des Dokuments 'Fahrer': ", error);
            });

            // Erstelle das Dokument "Teams" in der Collection mit dem Namen ligaName
            const teamsDocRef = doc(db, ligaName, 'Teams');
            setDoc(teamsDocRef, {})
            .then(() => {
                console.log("Dokument 'Teams' erfolgreich erstellt!");
            })
            .catch((error) => {
                console.error("Fehler beim Erstellen des Dokuments 'Teams': ", error);
            });

            // Erstelle das Dokument "Logo" in der Collection mit dem Namen ligaName
            const logoDocRef = doc(db, ligaName, 'Logo');
            setDoc(logoDocRef, {})
            .then(() => {
                console.log("Dokument 'Logo' erfolgreich erstellt!");
            })
            .catch((error) => {
                console.error("Fehler beim Erstellen des Dokuments 'Logo': ", error);
            });

            // Erstelle das Dokument "Startseite" in der Collection mit dem Namen ligaName
            const startseiteDocRef = doc(db, ligaName, 'Startseite');
            setDoc(startseiteDocRef, {})
            .then(() => {
                console.log("Dokument 'Startseite' erfolgreich erstellt!");
            })
            .catch((error) => {
                console.error("Fehler beim Erstellen des Dokuments 'Startseite': ", error);
            });

            const StreckenDocRef = doc(db, ligaName, 'Strecken');
            const strecken = {
                AbuDhabi: { Visible: true },
                Aserbaidschan: { Visible: true },
                Austin: { Visible: true },
                Australien: { Visible: true },
                Bahrain: { Visible: true },
                Belgien: { Visible: true },
                Brasilien: { Visible: true },
                China: { Visible: true },
                Großbritannien: { Visible: true },
                Imola: { Visible: true },
                Japan: { Visible: true },
                Kanada: { Visible: true },
                Katar: { Visible: true },
                LasVegas: { Visible: true },
                Mexiko: { Visible: true },
                Miami: { Visible: true },
                Monaco: { Visible: true },
                Monza: { Visible: true },
                Niederlande: { Visible: true },
                SaudiArabien: { Visible: true },
                Singapur: { Visible: true },
                Spanien: { Visible: true },
                Ungarn: { Visible: true },
                Österreich: { Visible: true }
            };
        
            let baseTimestamp = Timestamp.now();
            let counter = 0;
            const oneDayInSeconds = 86400;
        
            for (const strecke in strecken) {
                strecken[strecke].datum = new Timestamp(baseTimestamp.seconds + (counter * oneDayInSeconds), baseTimestamp.nanoseconds);
                counter += 1;
            }
        
            setDoc(StreckenDocRef, strecken);
        } else {
            console.error("Fehler: Liga-Name ist leer");
        }
    }

    const handleCreateDriver = (e) => {
        if (!fahrername && !teamname) {
            console.error("Fahrername und Teamname sind leer");
            notifications.show({
                title: 'Fehler',
                message: 'Bitte fülle alle Felder aus',
                color: 'red',
            });
            return;
        }
        e.preventDefault();
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
            const docRefTeams = doc(db, ligaName, 'Teams');
            updateDoc(docRefTeams, {
                [teamname]: {
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
                close();
                setFahrername("");
                setTeamname(null);
                setReloadData(!reloadData);
                notifications.show({
                    title: 'Fahrer hinzugefügt',
                    message: 'Fahrer wurde erfolgreich hinzugefügt ✅',
                    color: 'green',
                });
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            console.error("Error: Liga name is empty");
        }
    };

    async function handleErgenisseEintragen() {

        if (!gefahreneStrecke) {
            notifications.show({
                title: 'Fehler',
                message: 'Bitte wähle eine Strecke aus',
                color: 'red',
            });
            return;
        }

        if (!ergebnisse.Pole || !ergebnisse.SchnellsteRunde || !ergebnisse.FahrerDesTages) {
            notifications.show({
                title: 'Warnung',
                message: 'Du hast nicht alle Felder ausgefüllt, die Ergebnisse werden trotzdem eingetragen',
                color: 'yellow',
            });
        }

        const ergebnisseAlsInteger = Object.keys(ergebnisse).reduce((acc, key) => {
            acc[key] = ergebnisse[key] === "DNF" ? "DNF" : parseInt(ergebnisse[key], 10);
            return acc;
        }, {});

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

            // Füge Pole, SchnellsteRunde und FahrerDesTages hinzu
            if (ergebnisse.Pole === fahrername) {
                if (!fahrer.Pole) {
                    fahrer.Pole = {};
                }
                fahrer.Pole[gefahreneStrecke] = true;
            }
            if (ergebnisse.SchnellsteRunde === fahrername) {
                if (!fahrer.SchnellsteRunde) {
                    fahrer.SchnellsteRunde = {};
                }
                fahrer.SchnellsteRunde[gefahreneStrecke] = true;
            }
            if (ergebnisse.FahrerDesTages === fahrername) {
                if (!fahrer.FahrerDesTages) {
                    fahrer.FahrerDesTages = {};
                }
                fahrer.FahrerDesTages[gefahreneStrecke] = true;
            }
        });

        Object.keys(fahrerlistenObjekt).forEach(fahrername => {
            delete fahrerlistenObjekt[fahrername].gesamtWertung;
        });

        const docRef = doc(db, ligaName, 'Fahrer');
        try {
            await updateDoc(docRef, fahrerlistenObjekt);
            await updateTeams();
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }

    async function updateTeams() {
        const teamErgebnisse = {};

        // Sammeln der Teamergebnisse
        Object.values(fahrerlistenObjekt).forEach(({ team, Wertung }) => {
            if (!teamErgebnisse[team]) {
                teamErgebnisse[team] = {};
            }
            Object.entries(Wertung).forEach(([strecke, punkte]) => {
                // Initialisiere mit null, wenn die Strecke noch nicht existiert
                if (teamErgebnisse[team][strecke] === undefined) {
                    teamErgebnisse[team][strecke] = null;
                }
                // Behandle DNF als 0
                const effektivePunkte = punkte === "DNF" ? 0 : punkte;
                // Aktualisiere die Punkte, wenn welche vorhanden sind
                if (effektivePunkte !== null) {
                    if (teamErgebnisse[team][strecke] === null) {
                        teamErgebnisse[team][strecke] = effektivePunkte;
                    } else {
                        teamErgebnisse[team][strecke] += effektivePunkte;
                    }
                }
                // Wenn keine Punkte vorhanden sind (null), aber die Strecke existiert, belasse den Wert bei null
                // Diese Zeile ist eigentlich redundant, da die Logik oben bereits abdeckt, dass null-Werte beibehalten werden
            });
        });

        // Aktualisieren des Teams-Dokuments
        const teamsDocRef = doc(db, ligaName, 'Teams');
        try {
            await updateDoc(teamsDocRef, teamErgebnisse, { merge: true });
            setErgebnis({});
            setOpenEintragen(false);
            setReloadData(!reloadData);
            console.log("Teams erfolgreich aktualisiert");
            notifications.show({
                title: 'Ergebnisse eingetragen',
                message: 'Ergebnisse wurden erfolgreich eingetragen ✅',
                color: 'green',
            })

        } catch (error) {
            console.error("Fehler beim Aktualisieren der Teams: ", error);
        }
    }

    async function handleReset() {
        // Bestätigungsdialog anzeigen
        const bestaetigung = window.confirm("Es werden alle Wertungen gelöscht und auf null gesetzt. Dieser Vorgang kann nicht rückgängig gemacht werden. Bist du sicher, dass du fortfahren möchten?");
        if (!bestaetigung) {
            console.log("Zurücksetzen abgebrochen.");
            return; // Frühe Rückkehr, wenn der Benutzer abbricht
        }

        const resetObjektFahrer = {};
        Object.keys(fahrerlistenObjekt).forEach(fahrername => {
            resetObjektFahrer[fahrername] = {
                team: fahrerlistenObjekt[fahrername].team,
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
            };
        });

        const docRef = doc(db, ligaName, 'Fahrer');
        try {
            await updateDoc(docRef, resetObjektFahrer);
            console.log("Fahrer erfolgreich zurückgesetzt");
            notifications.show({
                title: 'Fahrer zurückgesetzt',
                message: 'Fahrer Wertungen wurden erfolrgreich zurückgesetzt ✅',
                color: 'green',
            })
        } catch (error) {
            console.error("Error updating document: ", error);
        }

        const resetObjektTeams = {};
        Object.keys(teams).forEach(team => {
            resetObjektTeams[team] = {};
            Strecken.forEach(strecke => {
                resetObjektTeams[team][strecke] = null;
            });
        });

        try {
            const teamsDocRef = doc(db, ligaName, 'Teams');
            await updateDoc(teamsDocRef, resetObjektTeams);
            console.log("Teams erfolgreich zurückgesetzt");
            notifications.show({
                title: 'Teams zurückgesetzt',
                message: 'Team Wertungen wurden erfolrgreich zurückgesetzt ✅',
                color: 'green',
            })
            setReloadData(!reloadData);
        }catch (error) {
            console.error("Fehler beim Zurücksetzen der Teams: ", error);
        }
    }

    async function handleDriverDelete(fahrer) {
        const bestaetigung = window.confirm(`Möchtest du den Fahrer ${fahrer.fahrername} wirklich löschen?`);
        if (!bestaetigung) {
            console.log("Löschen abgebrochen");
        } else {
            const docRef = doc(db, ligaName, 'Fahrer');
            try {
                const update = {};
                update[fahrer.fahrername] = deleteField(); // Verwenden Sie deleteField() hier
        
                await updateDoc(docRef, update);
                console.log("Fahrer erfolgreich gelöscht");
                notifications.show({
                    title: 'Fahrer gelöscht',
                    message: `Fahrer ${fahrer.fahrername} wurde erfolgreich gelöscht ✅`,
                    color: 'green',
                });
            } catch (error) {
                console.error("Fehler beim Löschen des Fahrers: ", error);
            }
        }
    }

    async function handleTeamDelete(team) {
        const bestaetigung = window.confirm(`Möchtest du das Team ${team.teamName} wirklich löschen?`);
        if (!bestaetigung) {
            console.log("Löschen abgebrochen");
        } else {
            const docRef = doc(db, ligaName, 'Teams');
            try {
                const update = {};
                update[team.teamName] = deleteField(); // Verwenden Sie deleteField() hier
        
                await updateDoc(docRef, update);
                console.log("Team erfolgreich gelöscht");
                notifications.show({
                    title: 'Team gelöscht',
                    message: `Team ${team.teamName} wurde erfolgreich gelöscht ✅`,
                    color: 'green',
                });
                setReloadData(!reloadData);
            } catch (error) {
                console.error("Fehler beim Löschen des Teams: ", error);
            }
        }
    }

    async function handleEditData() {
        console.log("Bearbeiten der Daten");
        const ligaCollection = collection(db, 'discordServers');
        const q = query(ligaCollection, where('ligaKey', '==', eigenerDiscordServer.ligaKey));
        let data = []
        let documentID = null;

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                data = doc.data();
                documentID = doc.id;
            });
            if (data) {
                console.log("Daten gefunden:", data);
                console.log("Dokument ID:", documentID);
                const neuerServerID = prompt("Bitte geben Sie die neue Server ID ein", data.serverId);

                // Überprüfen, ob neuerServerID nicht null ist
                if (neuerServerID !== null && neuerServerID.trim() !== "") {
                    let updateData = {
                        ligaKey: data.ligaKey,
                        registrierungsDatum: data.registrierungsDatum,
                        serverId: neuerServerID
                    };

                    const docRef = doc(db, 'discordServers', documentID);
                    await updateDoc(docRef, updateData);
                    console.log("Daten erfolgreich aktualisiert");
                    notifications.show({
                        title: 'Server ID aktualisiert',
                        message: 'Server ID wurden erfolgreich aktualisiert ✅',
                        color: 'green',
                    });
                    setIsLoading("3");
                } else {
                    console.log("Aktualisierung abgebrochen");
                }
            } else {
                console.log("Keine Daten gefunden");
            }
        } catch (error) {
            console.error("Fehler beim Abrufen des Dokuments:", error);
        }
    }

    function handleLigaPageClick() {
        console.log("Liga-Seite öffnen");
        navigate(`/${ligaName}`);
    }

    function inviteBot() {
        console.log("Bot einladen");
        const einladungsLink = `https://discord.com/oauth2/authorize?client_id=1255477848039362651&permissions=2147486720&integration_type=0&scope=bot+applications.commands`;
        window.open(einladungsLink, '_blank');
    }

    async function handleDriverEdit(fahrer) {

        if (!fahrer || !fahrer.fahrername) {
            console.error("Fahrer oder Fahrername fehlt", fahrer);
            return;
        }

        const gesuchterFahrerSchlüssel = Object.keys(fahrerlistenObjekt).find(schlüssel => schlüssel === fahrer.fahrername);
        const gesuchterFahrer = fahrerlistenObjekt[gesuchterFahrerSchlüssel];

        if (!gesuchterFahrer) {
        } else {
            const neuerName = window.prompt("Bitte gebe den neuen Fahrernamen ein:", gesuchterFahrerSchlüssel);
            if (neuerName && !fahrerlistenObjekt[neuerName]) {
                fahrerlistenObjekt[neuerName] = gesuchterFahrer;
                delete fahrerlistenObjekt[gesuchterFahrerSchlüssel];

                // Speichern des aktualisierten fahrerlistenObjekt in der Datenbank
                const fahrerDocRef = doc(db, ligaName, "Fahrer");
                try {
                    await setDoc(fahrerDocRef, fahrerlistenObjekt);
                    notifications.show({
                        title: 'Fahrer aktualisiert',
                        message: `Fahrer ${gesuchterFahrerSchlüssel} wurde erfolgreich in ${neuerName} umbenannt ✅`,
                        color: 'green',
                    });
                    console.log("Speichern erfolgreich");
                } catch (error) {
                    console.error("Fehler beim Speichern der Fahrerliste", error);
                }
            } else {
                console.error("Ungültiger neuer Name oder Name bereits vorhanden.");
            }
        }
    }

    async function handleLogoUpload() {
        if (!file) {
            console.error("Keine Datei zum Hochladen bereitgestellt.");
            return;
        }

        console.log("Bild wird hochgeladen...");
        const storage = getStorage();
        const imageRef = ref(storage, `images/${ligaName}`);

        try {
            const snapshot = await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            // URL in Firestore speichern
            await setDoc(doc(db, ligaName, 'Logo'), {
                url: downloadURL,
                name: file.name,
            });
            
            console.log('Bild erfolgreich hochgeladen und URL in Firestore gespeichert.');
            notifications.show({
                title: 'Logo hochgeladen',
                message: 'Bild wurde erfolgreich hochgeladen ✅. Sobald du die Seite neu lädst, wird das neue Logo angezeigt.',
                color: 'green',
            });
            if (window.innerWidth < 768) {
                setNewLogo(!newLogo);
            }
        } catch (error) {
            console.error('Fehler beim Hochladen des Bildes:', error);
        }
    }

    function getCellStyle(value) {
        if (value === 25 || value === 26) {
            return { backgroundColor: 'gold' };
        }
        if (value === 18 || value === 19) {
            return { backgroundColor: 'silver' };
        }
        if (value === 15 || value === 16) {
            return { backgroundColor: 'peru' };
        }
        if (value === "DNF") {
            return { backgroundColor: 'black', color: 'white' };
        }
        return { backgroundColor: 'transparent' };
    }

    function handleCancelUpdateStreckenVisible() {
        setStreckenPopup(false);
        setTempStreckenVisible({ ...streckenVisible });
    }

    async function handleUpdateStreckenVisible() {
        const docRef = doc(db, ligaName, 'Strecken');
        try {
            await setDoc(docRef, tempStreckenVisible);
            console.log("Strecken erfolgreich aktualisiert");
            notifications.show({
                title: 'Strecken aktualisiert',
                message: 'Strecken wurden erfolgreich aktualisiert ✅',
                color: 'green',
            });
            setStreckenPopup(false);
            // setStreckenPopup(false);
        } catch (error) {
            console.error("Fehler beim Aktualisieren der Strecken: ", error);
        }
    }

    function downloadDriverStandingsCSV(ligaDaten, Strecken, streckenVisible) {
        const BOM = "\uFEFF";
        const spaltenÜberschriften = ["Fahrername", "Team", ...Strecken.filter(schlüssel => streckenVisible && streckenVisible[schlüssel]), "Gesamtwertung"];
    
        let csvString = BOM + spaltenÜberschriften.join(",") + "\n";
    
        ligaDaten.forEach((fahrer) => {
            let zeile = [fahrer.fahrername, fahrer.team];
    
            Strecken.filter(schlüssel => streckenVisible && streckenVisible[schlüssel]).forEach((schlüssel) => {
                zeile.push(fahrer.Wertung?.[schlüssel] || '');
            });
    
            zeile.push(fahrer.gesamtWertung);
            csvString += zeile.join(",") + "\n";
        });
    
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'Fahrerwertung.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function downloadTeamStandingCSV(teamsArray, Strecken, streckenVisible) {
        const BOM = "\uFEFF"; // Byte Order Mark für UTF-8
        let csvContent = "Team," + Strecken.filter(schlüssel => streckenVisible && streckenVisible[schlüssel]).map(schlüssel => schlüssel).join(",") + ",Gesamtwertung\n";
    
        teamsArray.forEach(team => {
            let row = [team.teamName];
            Strecken.filter(schlüssel => streckenVisible && streckenVisible[schlüssel]).forEach(schlüssel => {
                row.push(team[schlüssel]);
            });
            row.push(team.gesamtWertung);
            csvContent += row.join(",") + "\n";
        });
    
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Konstrukteurstabelle.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function formatDate(datum) {
        if (!datum) return '';
        const date = new Date(datum.seconds * 1000);
        return date.toLocaleDateString('de-DE');
    }   

    function returnFontColorForDriverTableImage(value) { // Funktion die die Schriftfarbe pro Zelle für die Fahrertabelle bestimmt
        if (value === "DNF") {
            return 'red';
        } else if (value === "25" || value === "26") {
            return 'gold';
        } else if (value === "18" || value === "19") {
            return 'silver';
        } else if (value === "15" || value === "16") {
            return 'peru';
        } else {
            return 'white';
        }
    }

    const downloadDriverTableAsImage = () => {
        const table = driverRef.current;
        const lastColumns = table.querySelectorAll('tr > :last-child');

        // Temporarily hide the last column
        lastColumns.forEach(cell => {
            cell.style.display = 'none';
        });

        // Change background, text color, and border styles
        table.style.backgroundColor = 'black';
        table.style.color = 'white';
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
            cell.style.backgroundColor = 'black';
            cell.style.borderColor = 'white'; // Set border color to white
            cell.style.borderWidth = '1px'; // Set border width to 2px
            cell.style.borderStyle = 'solid'; // Ensure border style is solid
            cell.style.color = returnFontColorForDriverTableImage(cell.innerText); // Pass cell text to function
        });

        html2canvas(table).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'Fahrerwertung.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Restore the last column
            lastColumns.forEach(cell => {
                cell.style.display = '';
            });

            // Revert background, text color, and border styles
            table.style.backgroundColor = '';
            table.style.color = '';
            cells.forEach(cell => {
                cell.style.backgroundColor = '';
                cell.style.color = '';
                cell.style.borderColor = ''; // Revert border color
                cell.style.borderWidth = ''; // Revert border width
                cell.style.borderStyle = ''; // Revert border style
            });
        });
    };

    const downloadTeamTableAsImage = () => {
        const table = teamRef.current;
        const lastColumns = table.querySelectorAll('tr > :last-child');

        // Temporarily hide the last column
        lastColumns.forEach(cell => {
            cell.style.display = 'none';
        });

        // Change background, text color, and border styles
        table.style.backgroundColor = 'black';
        table.style.color = 'white';
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
            cell.style.backgroundColor = 'black';
            cell.style.color = 'white';
            cell.style.borderColor = 'white'; // Set border color to white
            cell.style.borderWidth = '1px'; // Set border width to 2px
            cell.style.borderStyle = 'solid'; // Ensure border style is solid
        });

        html2canvas(table).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'Fahrerwertung.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Restore the last column
            lastColumns.forEach(cell => {
                cell.style.display = '';
            });

            // Revert background, text color, and border styles
            table.style.backgroundColor = '';
            table.style.color = '';
            cells.forEach(cell => {
                cell.style.backgroundColor = '';
                cell.style.color = '';
                cell.style.borderColor = ''; // Revert border color
                cell.style.borderWidth = ''; // Revert border width
                cell.style.borderStyle = ''; // Revert border style
            });
        });
    };

    const downloadCalendarAsImage = () => {
        setOpenCalendar(true);
    };

    return (
        <>
            <div>
                {window.innerWidth < 768 && (
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon variant="transparent" color="rgba(0, 0, 0, 1)">
                            <CiMenuKebab size={20} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Liga Management</Menu.Label>
                            <Menu.Item onClick={open}>
                                Fahrer Hinzufügen
                            </Menu.Item>
                            <Menu.Item onClick={() => setOpenEintragen(true)}>
                                Ergebnisse eintragen
                            </Menu.Item>
                            <Menu.Item onClick={() => setStreckenPopup(true)}>
                                Kalender
                            </Menu.Item>
                            <Menu.Item color="red" onClick={() => handleReset()}>
                                Zurücksetzen
                            </Menu.Item>
                            <Menu.Item onClick={() => setNewLogo(true)}>
                                Liga Logo ändern
                            </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Ligaseite Design</Menu.Label>
                            <Menu.Item onClick={() => setEditPage(true)}>
                                Seite Home anpassen
                            </Menu.Item>
                        <Menu.Label>Discrod Bot</Menu.Label>
                            <Menu.Item onClick={() => inviteBot()}>
                                Bot Einladen
                            </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Downloads</Menu.Label>
                            <Menu.Item onClick={() => downloadDriverStandingsCSV(ligaDaten, Strecken, streckenVisible)}>
                                Fahrertabelle CSV
                            </Menu.Item>
                            <Menu.Item onClick={() => downloadTeamStandingCSV(teamsArray, Strecken, streckenVisible)}>
                                Konstrukteurstabelle CSV
                            </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                )}
                <div>
                    <ScrollArea w="auto" h="auto">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Admin(s)</Table.Th>
                                <Table.Th>Liga</Table.Th>
                                <Table.Th>Discord Server ID</Table.Th>
                                <Table.Th>{/* Buttons */}</Table.Th>
                            </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Td>{Daten?.pairringLiga?.adminUser.join(', ')}</Table.Td>
                                    <Table.Td>{Daten?.pairringLiga?.ligaName}</Table.Td>
                                    <Table.Td>{Daten?.pairringDiscrodServer?.serverId}</Table.Td>
                                    <Table.Td style={{cursor: 'pointer'}}>
                                        <MdEdit color='black' size={20} onClick={() => handleEditData()}/>
                                    </Table.Td>
                                </Table.Tr>
                        </Table.Tbody>
                    </Table>
                    </ScrollArea>
                </div>
                <div>
                <Button
                    variant="filled" radius="xl"
                    rightSection={<FaArrowUpRightFromSquare size={14} />}
                    onClick={() => handleLigaPageClick()}
                >
                    Zur Liga-Seite
                </Button>
                {window.innerWidth >= 768 && (
                    <>
                        <Button variant="filled" radius="xl" color="cyan" onClick={open} style={{ flex: 1 }}>Fahrer hinzufügen</Button>
                        <Button variant="filled" radius="xl" color="cyan" onClick={() => setOpenEintragen(true)} style={{ flex: 1 }}>Ergebnisse eintragen</Button>
                        <Button variant="filled" radius="xl" color="gray" rightSection={<IoFilter size={14}/>} style={{ flex: 1 }} onClick={() => setStreckenPopup(true)}>Kalender</Button>
                        <Button variant="filled" radius="xl" color="red" onClick={() => handleReset()} style={{ flex: 1 }}>Alle Wertungen zurücksetzten</Button>
                        <Button
                            variant="filled" radius="xl" color="grape"
                            rightSection={<FaArrowUpRightFromSquare size={14} />}
                            onClick={() => inviteBot()}
                        >
                            Bot einladen
                        </Button>
                        <FileButton onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => 
                            <Button
                                {...props}
                                variant="filled" radius="xl" color="lime"
                                rightSection={<CgProfile size={14} />}
                            >
                                Liga Logo ändern
                            </Button>
                        }
                        </FileButton>
                        <Button
                            variant="filled" radius="xl" color="yellow"
                            rightSection={<MdWebAsset size={14} />}
                            onClick={() => setEditPage(true)}
                        >
                            Seite Home anpassen
                        </Button>
                        <Menu>
                            <Menu.Target>
                                <Button
                                    variant="filled" radius="xl" color="gray"
                                >
                                    Downloads
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => downloadDriverStandingsCSV(ligaDaten, Strecken, streckenVisible)}>
                                    Fahrertabelle CSV
                                </Menu.Item>
                                <Menu.Item onClick={() => downloadTeamStandingCSV(teamsArray, Strecken, streckenVisible)}>
                                    Konstrukteurstabelle CSV
                                </Menu.Item>
                                <Menu.Item onClick={() => downloadCalendarAsImage()}>
                                    🗓️ Kalender Download
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </>
                )}
                </div>
            </div>
            <div>
                {!ligaErstellt && isLoading === "2" &&(
                    <div style={{marginTop: '20px'}}>
                        Die Liga wurde noch nicht erstellt!
                        <Button variant="filled" color="rgba(0, 0, 0, 1)" onClick={createLigaCollection}
                        style={{marginLeft: '10px'}}
                        >
                            Liga erstellen
                        </Button>
                    </div>
                )}

                {ligaErstellt && isLoading === "2" &&(
                    <div>
                        <Loader color="gray" size="lg" />
                    </div>
                )}

                {ligaErstellt && isLoading === "3" && ligaDaten.length === 0 &&(
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <Box bg="transparent" my="xl" style={{ width: '40vh', height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            Keine Daten vorhanden...
                        </Box>
                    </div>
                )}

                {ligaErstellt && ligaDaten.length > 0 && isLoading === "3" &&(
                    <>
                    <div className='divider'>
                    <Divider orientation="horizontal" margins="md" label="Fahrerübersicht" />
                    </div>

                    <div className='tabellenPosition'>
                        <ScrollArea w="auto" h="auto">
                            <Box w="70%">
                                <Tooltip label="Fahrertabelle als Bild speichern">
                                <ActionIcon variant="filled" color="rgba(0, 0, 0, 1)" aria-label="Settings" onClick={downloadDriverTableAsImage}>
                                    <IoCamera size={20}/>
                                </ActionIcon>
                                </Tooltip>
                                <BootstrapTable striped bordered hover className='Eintragungübersicht' ref={driverRef}>
                                    <thead>
                                        <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        <th className="stickySpalte">Fahrername</th>
                                        <th>Team</th>
                                        {
                                            sortierteStrecken.map((schlüssel) => (
                                            <th key={schlüssel} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                <img 
                                                src={require(`./../Components/Länderflaggen/${
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
                                        <th>{/* Buttons */}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ligaDaten.map((fahrer, index) => (
                                        <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <td className="stickySpalte">{fahrer.fahrername}</td>
                                            <td>{fahrer.team}</td>
                                            {
                                            sortierteStrecken.map((schlüssel) => (
                                                <td key={schlüssel} style={getCellStyle(fahrer?.Wertung?.[schlüssel])}>{fahrer?.Wertung?.[schlüssel]}</td>
                                            ))
                                            }
                                            <td>{fahrer.gesamtWertung}</td>
                                            <td>
                                            <div style={{display: 'flex', marginLeft: '5px'}}>
                                                <div style={{marginRight: '10px', cursor: 'pointer'}}>
                                                <FaUserEdit color='black' size={20} onClick={() => handleDriverEdit(fahrer)}/>
                                                </div>
                                                <div style={{ cursor: 'pointer'}}>
                                                <FaTrashAlt color='red' size={20} onClick={() => handleDriverDelete(fahrer)}/>
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
                    <div className='divider'>
                        <Divider orientation="horizontal" margins="md" label="Teamübersicht" />
                    </div>
                    <div className='tabellenPosition'>
                        <ScrollArea w="auto" h="auto">
                            <Box w="70%">
                                <Tooltip label="Teamtabelle als Bild speichern">
                                <ActionIcon variant="filled" color="rgba(0, 0, 0, 1)" aria-label="Settings" onClick={downloadTeamTableAsImage}>
                                    <IoCamera size={20}/>
                                </ActionIcon>
                                </Tooltip>
                                <BootstrapTable striped bordered hover className='Eintragungübersicht' ref={teamRef}>
                                    <thead>
                                        <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        <th className="stickySpalte">Team</th>
                                        {
                                            sortierteStrecken.map((schlüssel) => (
                                            <th key={schlüssel} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                <img 
                                                src={require(`./../Components/Länderflaggen/${
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
                                        <th>{/* Buttons */}</th>
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
                                            <td>
                                            <div style={{display: 'flex', marginLeft: '5px'}}>
                                                <div style={{ cursor: 'pointer'}}>
                                                <FaTrashAlt color='red' size={20} onClick={() => handleTeamDelete(team)}/>
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
                    </>
                )}
            </div>
            {ligaErstellt && isLoading === "3" && ligaDaten.length > 0 && (
                <>
                    <div className='divider'>
                        <Divider orientation="horizontal" margins="md" label="Statistiken" />
                    </div>
                    <div className="Statisiken">
                        <Statistiken ligaName={ligaName} fahrerlistenObjekt={fahrerlistenObjekt} teamsArray={teamsArray}/>
                    </div>
                </>
            )}

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
                    <TextInput
                        label="Fahrername"
                        withAsterisk
                        description="Gib den Namen des Fahrers ein"
                        placeholder="Fahrername"
                        value={fahrername}
                        onChange={(event) => setFahrername(event.currentTarget.value)}
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                    <Select
                        label="Team:"
                        placeholder="--Bitte wähle ein Team--"
                        onChange={(value) => setTeamname(value)}
                        data={f1Teams.map(team => ({ value: team.value, label: team.label }))}
                        searchable
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                    />
                    <Button type="submit" style={{ marginTop: '10px' }}>Fahrer hinzufügen</Button>
                </form>
            </Modal>

            {/* Modal für das Eintragen der Ergebnisse */}
            <Modal
                opened={openEintragen}
                onClose={() => {
                    setOpenEintragen(false); // Schließt den Dialog oder das Pop-up
                    setErgebnis({}); // Setzt den Zustand `ergebnis` zurück
                }}
                title="Ergebnisse eintragen"
                centered
                size="md"
            >
                <Select
                    label="Streckenauswahl"
                    placeholder="Wähle hier die Strecke"
                    data={StreckenSelect.map(strecke => ({ value: strecke.value, label: strecke.label }))}
                    searchable
                    onChange={(value) => setGefahreneStrecke(value)}
                    required
                    nothingFoundMessage="Nothing found..."
                />

                <div style={{marginTop: '10px'}}>
                    <ScrollArea h="auto">
                        <BootstrapTable striped bordered hover className='Eintragungübersicht'>
                            <thead>
                                <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <th>Fahrername</th>
                                    <th>Punkte</th>
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
                                                nothingFoundMessage="Nothing found..."
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </BootstrapTable>
                    </ScrollArea>
                </div>

                <div>
                    <Select
                        placeholder='Wer hat die Pole Position?'
                        data={fahrerliste.map(fahrer => ({ value: fahrer, label: fahrer }))}
                        onChange={(value) => setErgebnis(prevErgebnis => ({
                            ...prevErgebnis,
                            Pole: value
                        }))}
                        searchable
                        required
                        nothingFoundMessage="Nothing found..."
                        style={{ marginBottom: '5px' }}
                    />

                    <Select
                        placeholder='Wer hat die schnellste Runde?'
                        data={fahrerliste.map(fahrer => ({ value: fahrer, label: fahrer }))}
                        onChange={(value) => setErgebnis(prevErgebnis => ({
                            ...prevErgebnis,
                            SchnellsteRunde: value
                        }))}
                        searchable
                        required
                        nothingFoundMessage="Nothing found..."
                        style={{ marginBottom: '5px' }}
                    />

                    <Select
                        placeholder='Wer ist der Fahrer des Tages?'
                        data={fahrerliste.map(fahrer => ({ value: fahrer, label: fahrer }))}
                        onChange={(value) => setErgebnis(prevErgebnis => ({
                            ...prevErgebnis,
                            FahrerDesTages: value
                        }))}
                        searchable
                        nothingFoundMessage="Nothing found..."
                        style={{ marginBottom: '5px' }}
                    />
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

            {/* Modal für das Hochladen des Logos */}
            <Modal
                opened={newLogo}
                onClose={() => {
                    setNewLogo(false);
                    setFile(null);
                }}
                title="Liga Logo ändern"
                centered
                size="md"
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Group justify="center">
                        <FileButton onChange={setFile} accept="image/png,image/jpeg">
                        {(props) => <Button {...props}>Upload image</Button>}
                        </FileButton>
                    </Group>
                </div>
            </Modal>

            {/* Modal für das Bearbeiten der Startseite */}
            <Modal
                opened={editPage}
                onClose={() => setEditPage(false)}
                title="Startseite bearbeiten"
                centered
                size="xl"
                >
                <RichText ligaName={ligaName} setEditPage={setEditPage}/>
            </Modal>

            {/* Modal für das Filtern der Strecken */}
            <Modal
                opened={streckenPopup}
                onClose={() => setStreckenPopup(false)}
                title="Streckenfilter"
                centered
                size="md"
            >
                <ScrollArea h="60vh">
                    <Box w="100%">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <BootstrapTable striped bordered hover className='StreckenvisibleModal'>
                            <thead>
                                <tr>
                                    <th>Strecke</th>
                                    <th>Status</th>
                                    <th>Datum</th> {/* Neue Spalte für das Datum */}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(tempStreckenVisible || {}).sort((a, b) => a[0].localeCompare(b[0])).map(([strecke, { Visible, datum }]) => (
                                    <tr key={strecke}>
                                    <td>{strecke}</td>
                                    <td>{Visible ? 'Sichtbar' : 'Nicht sichtbar'}</td>
                                    <td onClick={() => Visible && openModal(strecke, datum)} style={{cursor: Visible ? 'pointer' : 'default'}}>
                                        {Visible ? formatDate(datum) : "Kein Rennen"}
                                    </td>
                                    <td>
                                        <Switch
                                        checked={tempStreckenVisible[strecke]?.Visible}
                                        onChange={() => setTempStreckenVisible(prev => ({
                                            ...prev,
                                            [strecke]: {
                                            ...prev[strecke],
                                            Visible: !prev[strecke]?.Visible
                                            }
                                        }))}
                                        />
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </BootstrapTable>
                        </div>
                    </Box>
                </ScrollArea>

                <Space h="xl" />

                <Group justify="flex-end">
                    <Button 
                        variant="filled" color="red" radius="xl"
                        onClick={handleCancelUpdateStreckenVisible}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant="filled" color="green" radius="xl"
                        onClick={() => handleUpdateStreckenVisible()}
                    >
                        Speichern
                    </Button>
                </Group>

            </Modal>

            <Modal
                opened={dateModal}
                onClose={() => setDateModal(false)}
                title="Datum auswählen"
                >
                <Center>
                <DatePicker
                locale='de'
                    value={selectedDate}
                    onChange={setSelectedDate}
                />
                </Center>

                <Group justify="flex-end">
                    <Button 
                        variant="filled" color="green" radius="xl"
                        onClick={updateDate} 
                        style={{ marginTop: '1rem' }}
                    >
                        Datum aktualisieren
                    </Button>
                </Group>
            </Modal>

            <Modal
                opened={openCalendar}
                onClose={() => setOpenCalendar(false)}
                title="Kalender Download"
                centered
                size="xl"
            >
                <RenderCalendar calendarData={calendarData}/>
            </Modal>
        </>
    );
}
export default Einstellungen;