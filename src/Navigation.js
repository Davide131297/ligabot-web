import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import {Text } from '@mantine/core';
import { AppShell, Group, Burger } from '@mantine/core';
import Logo from './Components/Logo/race-car.png';

export function Navigation({toggleMobile, toggleDesktop, mobileOpened, desktopOpened}) {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        toggleMobile();
        navigate(path);
    };

    return (
        <>
        <AppShell.Header>
            <Group h="100%" px="md">
                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="md" />
                <img src={Logo} height={40} width={40} alt='Logo Bot' />
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
            <AppShell.Section>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer'}} onClick={() => handleNavigation("/Einstellungen")}> {/* Flex Container */}
                    <IoMdSettings size={26} />
                    <Text size="xl" weight={700} ml="sm">
                        Einstellungen
                    </Text>
                </div>
            </AppShell.Section>
        </AppShell.Navbar>
        </>
    );
}