import React, {useEffect, useState} from 'react';
import { Router } from './Router';
import { Divider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Modal } from '@mantine/core';
import Datenschutz from './Pages/Datenschutz';
import Impressum from './Pages/Impressum';
import { useTranslation } from 'react-i18next';
import '../src/utils/i18n';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [opened, setOpened] = useState(false);
  const [impressumOpened, setImpressumOpened] = useState(false);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);


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
        <p style={{cursor: 'pointer'}} onClick={handleDatenschutzClick}>{t('PrivacyPolicy')}</p>
        <p style={{cursor: 'pointer'}} onClick={handleImpressumClick}>{t('Imprint')}</p>
      </div>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('PrivacyPolicy')}
        size="100vh"
      >
        <Datenschutz />
      </Modal>

      <Modal
        opened={impressumOpened}
        onClose={() => setImpressumOpened(false)}
        title={t('Imprint')}
        size="lg"
      >
        <Impressum />
      </Modal>

    </MantineProvider>
    
  );
}

export default App;
