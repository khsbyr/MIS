import React from 'react';
import Routes from './routes/router';
import ContextProvider from './context/Tools';

export default function App() {
  return (
    <div>
      <ContextProvider>
        <Routes />
      </ContextProvider>
    </div>
  );
}
