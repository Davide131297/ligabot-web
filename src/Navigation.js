import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { AppShell, Group, Burger, Button, Text, Avatar, Loader } from '@mantine/core';
import { db } from './utils/firebase';
import Login from './Components/login';
import Registrierung from './Components/Registrierung';
import Logo from './Components/Logo/race-car.png';
import { doc, getDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import SeitenNavbar from './Components/SeitenNavbar';

export function Navigation({toggleMobile, toggleDesktop, mobileOpened, desktopOpened, ligaName}) {
    const navigate = useNavigate();
    const [geöffnet, setGeöffnet] = useState(false); //Modal für Login
    const [modalOpen, setModalOpen] = useState(false); //Modal für Registrierung
    const [angemeldet, setAngemeldet] = useState(false); //Angemeldet oder nicht
    const [nutzername, setNutzername] = useState(null); //Nutzername
    const [logo, setLogo] = useState(null); //Logo speicherung
    const location = useLocation();
    const [newLocation, setNewLocation] = useState(null);

    useEffect(() => {
        if (location.pathname !== "/" && location.pathname !== "/Einstellungen") {
            const path = location.pathname.split("/");
            setNewLocation(path[1]);
            searchLigaLogo(path[1]);
        }
    }, [location]);

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

    useEffect(() => {
        if (ligaName) {
            searchLigaLogo()
        }
    }, [ligaName]);

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

    function searchLigaLogo(LigaPfad) {
        const collectionPfad = ligaName || LigaPfad;
        if (!collectionPfad) return;
        const logoDocRef = doc(db, collectionPfad, "Logo");
        getDoc(logoDocRef).then((docSnap) => {
            if (docSnap.exists()) {
                setLogo(docSnap.data().url);
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    return (
        <>
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="md" />
                {location.pathname === "/" || location.pathname === "/Einstellungen" ? (
                    <img src={Logo} height={40} width={40} alt='Logo Bot' style={{cursor: 'pointer'}} onClick={() => handleNavigation("/")}/>
                ) : logo ? (
                    <img src={logo} height={40} width={40} alt='Logo Bot' style={{cursor: 'pointer'}} onClick={() => handleNavigation("/")}/>
                ) : (
                    <Loader color='blue'/>
                )}
                {location.pathname === "/" || location.pathname === "/Einstellungen" ? (
                    !angemeldet ? (
                        <>
                            <Button variant="white" color="rgba(0, 0, 0, 1)" onClick={() => setModalOpen(true)}>
                                Registrieren
                            </Button>
                            <Button variant='white' color='rgba(0, 0, 0, 1)' onClick={() => setGeöffnet(true)}>
                                Anmelden
                            </Button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button variant='white' color='rgba(0, 0, 0, 1)' onClick={() => handleLogout()}>
                                Logout
                            </Button>
                            <Avatar alt="it's me" src={logo} />
                            <Text size="xs">Angemeldet als {nutzername}</Text>
                        </div>
                    )
                ) : (
                    <Text size="md"> {newLocation} </Text>
                )}
            </Group>
        </AppShell.Header>
        {location.pathname === "/" || location.pathname === "/Einstellungen" ? (
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
        ) : ( <SeitenNavbar toggleMobile={toggleMobile} toggleDesktop={toggleDesktop}/> 
        )}

        <Login geöffnet={geöffnet} setGeöffnet={setGeöffnet} setAngemeldet={setAngemeldet} setNutzername={setNutzername}/>
        <Registrierung modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
    );
}