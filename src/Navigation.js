import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { AppShell, Group, Burger, Button, Text, Avatar } from '@mantine/core';
import Login from './Components/login';
import Registrierung from './Components/Registrierung';
import Logo from './Components/Logo/race-car.png';

export function Navigation({toggleMobile, toggleDesktop, mobileOpened, desktopOpened}) {
    const navigate = useNavigate();
    const [geöffnet, setGeöffnet] = useState(false); //Modal für Login
    const [modalOpen, setModalOpen] = useState(false); //Modal für Registrierung
    const [angemeldet, setAngemeldet] = useState(false); //Angemeldet oder nicht
    const [nutzername, setNutzername] = useState(null); //Nutzername

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userObj = JSON.parse(user);
            setNutzername(userObj.displayName);
            setAngemeldet(true);
        } else {
            setAngemeldet(false);
        }
    }, []);

    const handleNavigation = (path) => {
        toggleMobile();
        toggleDesktop();
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setAngemeldet(false);
        navigate('/');
    }

    return (
        <>
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="md" />
                <img src={Logo} height={40} width={40} alt='Logo Bot' style={{cursor: 'pointer'}} onClick={() => handleNavigation("/")}/>
                {!angemeldet ? (
                    <>
                        <Button variant="white" color="rgba(0, 0, 0, 1)" onClick={() => setModalOpen(true)}>
                            Registrieren
                        </Button>
                        <Button variant='white' color='rgba(0, 0, 0, 1)' onClick={() => setGeöffnet(true)}>
                            Anmelden
                        </Button>
                    </>
                    ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button variant='white' color='rgba(0, 0, 0, 1)' onClick={() => handleLogout()}>
                                Logout
                            </Button>
                            <Avatar alt="it's me" />
                            <Text size="xs">Angemeldet als {nutzername}</Text>
                        </div>
                    </>
                )}
            </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
            <AppShell.Section>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', cursor: 'pointer' }} onClick={() => handleNavigation("/")}> {/* Flex Container */}
                    <FaHome size={26} />
                    <Text size="xl" weight={700} ml="sm">
                        Startseite
                    </Text>
                </div>
            </AppShell.Section>
            {angemeldet && (
                <AppShell.Section>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer'}} onClick={() => handleNavigation("/Einstellungen")}> {/* Flex Container */}
                        <IoMdSettings size={26} />
                        <Text size="xl" weight={700} ml="sm">
                            Einstellungen
                        </Text>
                    </div>
                </AppShell.Section>
            )}
        </AppShell.Navbar>

        <Login geöffnet={geöffnet} setGeöffnet={setGeöffnet} setAngemeldet={setAngemeldet} setNutzername={setNutzername}/>
        <Registrierung modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
    );
}