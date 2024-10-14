import React from 'react';
import '@mantine/core/styles.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {MantineProvider} from "@mantine/core";
import { theme } from './theme';
import Signup from "./Signup";
import {AuthProvider} from "./context/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <AuthProvider>
                <div style={{ display: "flex", justifyContent: "space-between", width: "90%" }}>
                    <div style={{ maxWidth: "170px", marginRight: "0px" }}>
                        <Signup />
                    </div>
                    <div style={{ margin: "0 auto" }}>
                        <App />
                    </div>
                </div>
            </AuthProvider>
        </MantineProvider>
    </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
