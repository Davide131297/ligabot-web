import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { AppShell, Group, Burger, Button, Text, Avatar, Loader, SegmentedControl } from '@mantine/core';
import { db } from './utils/firebase';
import Login from './Components/login';
import Registrierung from './Components/Registrierung';
import Logo from './Components/Logo/race-car.png';
import { doc, getDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import SeitenNavbar from './Components/SeitenNavbar';
import { FaBook } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import '../src/utils/i18n'; // i18n-Konfiguration importieren

export function Navigation({toggleMobile, toggleDesktop, mobileOpened, desktopOpened, ligaName}) {
    const navigate = useNavigate();
    const [geöffnet, setGeöffnet] = useState(false); //Modal für Login
    const [modalOpen, setModalOpen] = useState(false); //Modal für Registrierung
    const [angemeldet, setAngemeldet] = useState(false); //Angemeldet oder nicht
    const [nutzername, setNutzername] = useState(null); //Nutzername
    const [logo, setLogo] = useState(null); //Logo speicherung
    const location = useLocation();
    const [newLocation, setNewLocation] = useState(null);
    const [language, setLanguage] = useState(null);
    const {t, i18n} = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem("i18nextLng");
        if (savedLanguage) {
            setLanguage(savedLanguage);
            i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);

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

    const handleNavigationFromLogo = (path) => {
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

    const data = [
        {
            label: <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/1920px-Flag_of_Germany.svg.png" 
                alt="Germany" 
                width="20" 
                height="15" />,
            value: 'de'
        },
        {   
            label: <img
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1920px-Flag_of_the_United_Kingdom_%281-2%29.svg.png'
                alt='United Kingdom'
                width='20'
                height='15' />,
            value: 'en'
        },
    ];

    function handleLanguageChange(value) {
        setLanguage(value);
        localStorage.setItem("i18nextLng", value);
        i18n.changeLanguage(value); //Sprache ändern
    };

    return (
        <>
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="md" />
                {location.pathname === "/" || location.pathname === "/Einstellungen" || location.pathname === "/Dokumentation" ? (
                    <img src={Logo} height={40} width={40} alt='Logo Bot' style={{cursor: 'pointer'}} onClick={() => handleNavigation("/")}/>
                ) : logo ? (
                    <img src={logo} height={40} width={40} alt='Logo Bot' style={{cursor: 'pointer'}} onClick={() => handleNavigationFromLogo(`/${newLocation}`)}/>
                ) : (
                    <Loader color='blue'/>
                )}
                {location.pathname === "/" || location.pathname === "/Einstellungen" || location.pathname === "/Dokumentation" ? (
                    !angemeldet ? (
                        <>
                            <Button variant="white" color="rgba(0, 0, 0, 1)" onClick={() => setModalOpen(true)}>
                                {t('register')}
                            </Button>
                            <Button variant='white' color='rgba(0, 0, 0, 1)' onClick={() => setGeöffnet(true)}>
                                {t('login')}
                            </Button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button variant='white' color='rgba(0, 0, 0, 1)' onClick={() => handleLogout()}>
                                {t('logout')}
                            </Button>
                            <Avatar alt="it's me" src={logo} />
                            <Text size="xs">{nutzername}</Text>
                        </div>
                    )
                ) : (
                    <Text size="md"> {newLocation} </Text>
                )}
                <Group justify="flex-end">
                    <SegmentedControl
                        value={language}
                        onChange={handleLanguageChange}
                        data={data} 
                    />
                </Group>
            </Group>
        </AppShell.Header>
        {location.pathname === "/" || location.pathname === "/Einstellungen" || location.pathname === "/Dokumentation" ? (
        <AppShell.Navbar p="md">
            <AppShell.Section>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', cursor: 'pointer' }} onClick={() => handleNavigation("/")}> {/* Flex Container */}
                    <FaHome size={26} />
                    <Text size="xl" weight={700} ml="sm">
                        {t('home')}
                    </Text>
                </div>
            </AppShell.Section>
            <AppShell.Section>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer' }} onClick={() => handleNavigation("/Dokumentation")}> {/* Flex Container */}
                    <FaBook size={22} />
                    <Text size="xl" weight={700} ml="sm">
                        {t('documentation')}
                    </Text>
                </div>
            </AppShell.Section>
            {angemeldet && (
                <AppShell.Section>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer'}} onClick={() => handleNavigation("/Einstellungen")}> {/* Flex Container */}
                        <IoMdSettings size={26} />
                        <Text size="xl" weight={700} ml="sm">
                            {t('settings')}
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