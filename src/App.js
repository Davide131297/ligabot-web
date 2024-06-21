import React from 'react';
import { Router } from './Router';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <MantineProvider>
      <Notifications position='top-right'/>
      <Router />
    </MantineProvider>
    
  );
}

export default App;
