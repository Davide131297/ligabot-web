import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { auth } from '../utils/firebase';

const Home = () => {
    const [opened, { open, close }] = useDisclosure(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault(); // Verhindert das automatische Neuladen der Seite

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

    return (
        <Modal 
            opened={opened} 
            onClose={close} 
            title="Registrieren"
            size="md"
            closeOnClickOutside={false}
            withCloseButton={false}
            centered
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
                    <label style={{ marginBottom: '10px' }}>
                        E-Mail:
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
                        Registrieren
                    </button>
                </form>
            </div>
        </Modal>
    );
}
export default Home;