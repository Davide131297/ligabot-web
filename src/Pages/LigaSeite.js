import React, { useState } from 'react';
import { Title, Center } from '@mantine/core';
import { useLocation } from 'react-router-dom';


const LigaSeite = () => {
    const location = useLocation();
    const path = location.pathname.split("/");
    const ligaName = path[1];

    return (
        <>
            <Center>
                <Title order={1}>Willkommen bei der Liga {ligaName}</Title>
            </Center>
        </>
    );
}
export default LigaSeite;