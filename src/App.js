import React from 'react';
import { Router } from './Router';
import { Divider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Modal } from '@mantine/core';
import Datenschutz from './Pages/Datenschutz';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [opened, setOpened] = React.useState(false);
  const [impressumOpened, setImpressumOpened] = React.useState(false);

  const handleDatenschutzClick = () => {
    setOpened(true);
  }

  const handleImpressumClick = () => {  
    setImpressumOpened(true);
  }

  return (
    <MantineProvider>
      <Notifications position='top-right'/>
      <Router />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '10px',
        backgroundColor: '#f0f0f0',
        paddingTop: '10px',
        borderTop: '2px solid #dcdcdc'
      }}>
        <p style={{cursor: 'pointer'}} onClick={handleDatenschutzClick}>Datenschutz</p>
        <p style={{cursor: 'pointer'}} onClick={handleImpressumClick}>Impressum</p>
      </div>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Datenschutzerklärung"
        size="100vh"
      >
        <Datenschutz />
      </Modal>

      <Modal
        opened={impressumOpened}
        onClose={() => setImpressumOpened(false)}
        title="Impressum"
        size="lg"
      >
        <p>Test</p>
      </Modal>

    </MantineProvider>
    
  );
}

export default App;
