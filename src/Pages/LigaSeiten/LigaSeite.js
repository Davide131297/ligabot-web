import React, { useEffect } from 'react';
import { Title, Center } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';

const LigaSeite = () => {
    const location = useLocation();
    const path = location.pathname.split("/");
    const ligaName = path[1];
    const matches = useMediaQuery('(max-width: 768px)');

    return (
        <>
            <Center>
                <Title order={matches ? 4 : 1}>Willkommen bei der Liga {ligaName}</Title>
            </Center>
        </>
    );
}
export default LigaSeite;