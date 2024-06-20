import { Modal, TextInput, Button } from '@mantine/core';
import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from './../utils/firebase';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

function Login({geöffnet, setGeöffnet}) {
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const navigate = useNavigate();

    const handleLogin = async () => {
        try {
        const userCredential = await signInWithEmailAndPassword(auth, email, passwort);
        // Erfolgreiche Anmeldung
        // Speichern Sie die Anmeldedaten im LocalStorage
        localStorage.setItem('user', JSON.stringify(userCredential.user));
        notifications.show({
            title: 'Login erfolgreich! 🎉',
            message: 'Du hast dich erfolgreich angemeldet!',
            color: 'green',
            autoClose: 2000,
        });
        setGeöffnet(false);
        navigate('/Einstellungen');
        } catch (error) {
        // Fehlerbehandlung
        console.error(error);
        }
    };

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            notifications.show({
                title: 'Passwort-Reset-Email gesendet! 📧',
                message: 'Überprüfen Sie Ihre E-Mail, um Ihr Passwort zurückzusetzen.',
                color: 'green',
                autoClose: 2000,
            });
        } catch (error) {
            notifications.show({
                title: 'Fehler beim Senden der Passwort-Reset-Email! 😞',
                message: 'Fehler beim Senden der Passwort-Reset-Email: ' + error.message,
                color: 'red',
                autoClose: 2000,
            });
        }
    }

    return (
        <>
        <Modal
            opened={geöffnet}
            onClose={() => setGeöffnet(false)}
            title="Anmelden"
            size="md"
            closeOnClickOutside={false}
            centered
            withCloseButton={true}
        >
            <TextInput
                label="E-Mail"
                placeholder="Ihre E-Mail"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
            />
            <TextInput
                label="Passwort"
                placeholder="Ihr Passwort"
                type="password"
                value={passwort}
                onChange={(event) => setPasswort(event.currentTarget.value)}
            />
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button onClick={handlePasswordReset} variant="filled" color="gray">Passwort zurücksetzen</Button>
                <Button onClick={handleLogin} variant="filled" color="rgba(0, 0, 0, 1)" style={{marginLeft: '5px'}}>Anmelden</Button>
            </div>
        </Modal>
        </>
    );
}

export default Login;
