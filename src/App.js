import React from "react";
import Logo from "./components/Logo";
import { SharedStateProvider } from "./providers/shared-state.tsx";
import "./App.css";
import Router from "./routes";

function App() {
  return (
    <SharedStateProvider>
      <main className='layout'>
        <Logo />
        <Router />
      </main>
    </SharedStateProvider>
  );
}

export default App;
