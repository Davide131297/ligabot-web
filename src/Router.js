import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Einstellungen from './Pages/Einstellungen';
import LigaSeite from './Pages/LigaSeite';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navigation } from './Navigation'; // Stellen Sie sicher, dass der Pfad korrekt ist

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
                        <Route path="/Einstellungen" element={<Einstellungen ligaName={ligaName} setLigaName={setLigaName}/>} />
                        <Route path="/:id" element={<LigaSeite />} />
                    </Routes>
                </AppShell.Main>
            </AppShell>
        </BrowserRouter>
    );
}