import { AppShell, Text } from '@mantine/core';
import { FaHome } from "react-icons/fa";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { RiGroup3Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const SeitenNavbar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname.split("/");
    const ligaName = path[1];

    const handleNavigation = (path) => {
        console.log("Navigiere zu: ", path);
        navigate(path);
    }

    return (
        <AppShell.Navbar p="md">
            <AppShell.Section>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', cursor: 'pointer' }} onClick={() => handleNavigation(`/${ligaName}`)}>
                    <FaHome size={26} />
                    <Text size="xl" weight={700} ml="sm">
                        Startseite
                    </Text>
                </div>
            </AppShell.Section>
            <AppShell.Section>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer'}} onClick={() => handleNavigation(`/${ligaName}/fahrertabelle`)}>
                    <GiFullMotorcycleHelmet size={26} />
                    <Text size="xl" weight={700} ml="sm">
                        Fahrertabelle
                    </Text>
                </div>
            </AppShell.Section>
            <AppShell.Section>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', cursor: 'pointer'}} onClick={() => handleNavigation(`/${ligaName}/konstrukteurstabelle`)}>
                    <RiGroup3Fill size={26} />
                    <Text size="xl" weight={700} ml="sm">
                        Konstrukteurstabelle
                    </Text>
                </div>
            </AppShell.Section>
        </AppShell.Navbar>
    )
}
export default SeitenNavbar;