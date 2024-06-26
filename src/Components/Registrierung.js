import { Modal } from '@mantine/core';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { auth } from '../utils/firebase';
import { db } from '../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { LoadingOverlay, Box, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AiOutlineQuestionCircle } from "react-icons/ai";
import ServerIDPhoto from './ServerID.png';

const Registrierung = ({ modalOpen, setModalOpen}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [leagueName, setLeagueName] = useState("");
    const [serverId, setServerID] = useState("");
    const [visible, { toggle }] = useDisclosure(false);
    const [showHowToModal, setShowHowToModal] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault(); // Verhindert das automatische Neuladen der Seite
        toggle();

        // Registrieren
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Hinzufügen des Anzeigenamens zum Benutzerprofil
                return updateProfile(userCredential.user, {
                    displayName: displayName,
                }).then(() => {
                    // Nach dem Hinzufügen des Anzeigenamens, zurückgeben des userCredential für die weitere Verarbeitung
                    return userCredential;
                });
            })
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Erfolgreich registriert:", user);
                // Senden der Authentifizierungs-E-Mail
                sendEmailVerification(user)
                    .then(() => {
                        console.log("Authentifizierungs-E-Mail gesendet an:", email);
                        notifications.show({
                            title: 'Registrierung erfolgreich! 🎉',
                            message: 'Du hast dich erfolgreich registriert! Bitte bestätige deine E-Mail-Adresse.',
                            color: 'green',
                            autoClose: 2000,
                        });
                        saveLeagueInDB();
                    })
                    .catch((error) => {
                        console.error("Fehler beim Senden der Authentifizierungs-E-Mail:", error.message);
                    });
            })
            .catch((error) => {
                console.error("Fehler bei der Registrierung:", error.message);
                notifications.show({
                    title: 'Registrierung fehlgeschlagen! 😞',
                    message: 'Fehler bei der Registrierung: ' + error.message,
                    color: 'red',
                    autoClose: 4000,
                });
            });
    };

    function saveLeagueInDB() {
        // Generieren eines zufälligen Strings von 12 Zeichen für ligaKey
        const ligaKey = Math.random().toString(36).substring(2, 14);
    
        // Erstellen des Dokuments in der Sammlung "discordServers"
        addDoc(collection(db, "ligaKeys"), {
            ligaName: leagueName,
            key: ligaKey,
            registrierungsDatum: Timestamp.now(),
            adminUser: displayName
        })
        .then((docRef) => {
            console.log("Dokument erfolgreich erstellt mit ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Fehler beim Erstellen des Dokuments: ", error);
        });

        addDoc(collection(db, "discordServers"), {
            ligaKey: ligaKey,
            registrierungsDatum: Timestamp.now(),
            serverId: serverId
        })
        .then((docRef) => {
            console.log("Dokument erfolgreich erstellt mit ID: ", docRef.id);
            setModalOpen(false);
            toggle();
        })
        .catch((error) => {
            console.error("Fehler beim Erstellen des Dokuments: ", error);
        });
    }

    return (
        <>
        <Modal 
            opened={modalOpen} 
            onClose={() => setModalOpen(false)} 
            title="Registrieren"
            size="md"
            closeOnClickOutside={false}
            centered
        >
            <Box pos="relative">
                <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
                            <label style={{ marginBottom: '10px' }}>
                                E-Mail:
                                <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                required
                                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                                />
                            </label>
                            <label style={{ marginBottom: '10px' }}>
                                Nutzername:
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                                />
                            </label>
                            <label style={{ marginBottom: '10px' }}>
                                Passwort:
                                <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                                />
                            </label>

                            <label style={{ marginBottom: '10px' }}>
                                Liganame:
                                <input
                                    type="text"
                                    value={leagueName}
                                    onChange={(e) => setLeagueName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                                />
                            </label>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <label style={{ flex: 1 }}>
                                    Discrod-ServerID:
                                    <input
                                        type="text"
                                        value={serverId}
                                        onChange={(e) => setServerID(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '10px', fontSize: '16px', marginRight: '10px' }}
                                    />
                                </label>

                                <ActionIcon variant="transparent" radius="xl" aria-label="Settings">
                                    <AiOutlineQuestionCircle color='black' size={20} onClick={() => setShowHowToModal(true)}/>
                                </ActionIcon>
                            </div>

                            <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
                                Registrieren
                            </button>
                        </form>
                    </div>
            </Box>
        </Modal>

        <Modal
            opened={showHowToModal}
            onClose={() => setShowHowToModal(false)}
            title="ServerID finden"
            size="md"
            closeOnClickOutside={false}
            centered
        >
            <p>So findest du die Server-ID um deine Ligadaten mit dem Bot zu koppeln.</p>
            <p>Gehe in deinem Discord-Server und klicke auf den Namen mit einem Rechtsklick.</p>
            <img src={ServerIDPhoto} alt="ServerID" style={{ width: '100%', height: 'auto' }} />

        </Modal>
        </>
    );
}
export default Registrierung;