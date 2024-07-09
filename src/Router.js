import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Einstellungen from './Pages/Einstellungen';
import Dokumentation from './Pages/Dokumentation';

import LigaSeite from './Pages/LigaSeiten/LigaSeite'
import LigaSeiteFahrertabelle from './Pages/LigaSeiten/LigaSeiteFahrertabelle';
import LigaSeiteKonstrukteurtabelle from './Pages/LigaSeiten/LigaSeiteKonstrukteurtabelle';
import LigaSeiteStatistiken from './Pages/LigaSeiten/LigaSeiteStatistiken';

import { AppShell, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navigation } from './Navigation';


export function Router() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
    const [ligaName, setLigaName] = useState(null);

    return (
        <BrowserRouter>
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
                }}
                padding="md"
            >
                <Navigation 
                    toggleMobile={toggleMobile}
                    toggleDesktop={toggleDesktop}
                    mobileOpened={mobileOpened}
                    desktopOpened={desktopOpened}
                    ligaName={ligaName}
                />
                <AppShell.Main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Einstellungen" 
                            element={
                                <Einstellungen 
                                    ligaName={ligaName} 
                                    setLigaName={setLigaName}
                                />
                            } 
                        />
                        <Route path="/Dokumentation" element={<Dokumentation />} />
                        <Route path="/:id" element={<LigaSeite ligaName={ligaName}/>} />
                        <Route path="/:id/fahrertabelle" element={<LigaSeiteFahrertabelle />} />
                        <Route path="/:id/konstrukteurstabelle" element={<LigaSeiteKonstrukteurtabelle />} />
                        <Route path="/:id/statistiken" element={<LigaSeiteStatistiken />} />
                    </Routes>
                </AppShell.Main>
            </AppShell>
        </BrowserRouter>
    );
}