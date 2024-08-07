import { Modal, TextInput, Button } from '@mantine/core';
import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from './../utils/firebase';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';

function Login({geöffnet, setGeöffnet, setAngemeldet, setNutzername}) {
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

    const handleLogin = async () => {
        try {
        const userCredential = await signInWithEmailAndPassword(auth, email, passwort);
        // Erfolgreiche Anmeldung
        // Speichern Sie die Anmeldedaten im LocalStorage
        localStorage.setItem('user', JSON.stringify(userCredential.user));
        notifications.show({
            title: t('loginSuccess'),
            message: t('loginSuccessMessage'),
            color: 'green',
            autoClose: 2000,
        });
        setNutzername(userCredential.user.displayName);
        setGeöffnet(false);
        setAngemeldet(true);
        navigate('/Einstellungen');
        } catch (error) {
            console.error(error);
            notifications.show({
                title: t('loginError'),
                message: t('loginErrorMessage') + error.message,
                color: 'red',
                autoClose: 2000,
            });
        }
    };

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            notifications.show({
                title: t('passwordResetEmailSent'),
                message: t('passwordResetEmailSentMessage'),
                color: 'green',
                autoClose: 2000,
            });
        } catch (error) {
            notifications.show({
                title: t('passwordResetEmailError'),
                message: t('passwordResetEmailSentMessage') + error.message,
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
            title={t('login')}
            size="md"
            closeOnClickOutside={false}
            centered
            withCloseButton={true}
        >
            <TextInput
                label="E-Mail"
                placeholder={t('yourEmail')}
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
            />
            <TextInput
                label={t('password')}
                placeholder={t('yourPassword')}
                type="password"
                value={passwort}
                onChange={(event) => setPasswort(event.currentTarget.value)}
            />
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button onClick={handlePasswordReset} variant="filled" color="gray">{t('passwordReset')}</Button>
                <Button onClick={handleLogin} variant="filled" color="rgba(0, 0, 0, 1)" style={{marginLeft: '5px'}}>{t('login')}</Button>
            </div>
        </Modal>
        </>
    );
}

export default Login;
