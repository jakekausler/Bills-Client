import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import "./index.css";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import { ContextMenuProvider } from 'mantine-contextmenu';
import 'mantine-contextmenu/styles.css';


const theme = createTheme({
  primaryColor: "gray",
  components: {
    Stack: {
      defaultProps: {
        gap: "xs",
      },
    },
    NumberInput: {
      defaultProps: {
        hideControls: true,
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <ContextMenuProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
            </Routes>
          </BrowserRouter>
        </ContextMenuProvider>
      </MantineProvider>
    </Provider>
  </StrictMode>,
);
