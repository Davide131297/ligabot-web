import React, { useEffect } from 'react';
import { Title, Center } from '@mantine/core';
import { useLocation } from 'react-router-dom';

const LigaSeite = () => {
    const location = useLocation();
    const path = location.pathname.split("/");
    const ligaName = path[1];

    useEffect(() => {
        const path = location.pathname.split("/");
        const ligaName = path[1];
        console.log("Liga: ", ligaName);
    }, [location]);

    return (
        <>
            <Center>
                <Title order={1}>Willkommen bei der Liga {ligaName}</Title>
            </Center>
        </>
    );
}
export default LigaSeite;