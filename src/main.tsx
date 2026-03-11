import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import App from './App';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { ContextMenuProvider } from 'mantine-contextmenu';
import 'mantine-contextmenu/styles.css';
import { initDevLogger, resetDevLog } from './utils/devLogger';

if (import.meta.env.DEV) {
  resetDevLog();
  initDevLogger();
}

const theme = createTheme({
  primaryColor: 'gray',
  components: {
    Stack: {
      defaultProps: {
        gap: 'xs',
      },
    },
    NumberInput: {
      defaultProps: {
        hideControls: true,
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications position="top-right" autoClose={5000} />
        <ContextMenuProvider>
          <App />
        </ContextMenuProvider>
      </MantineProvider>
    </Provider>
  </StrictMode>,
);
