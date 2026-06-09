import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import EditorPage from './pages/EditorPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';

function AppLayout() {
  const { user } = useAuth();

  if (!user) return <AuthPage />;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>
      <Navbar />
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/history" element={<div style={{overflowY:'auto',flex:1}}><HistoryPage /></div>} />
          <Route path="/profile" element={<div style={{overflowY:'auto',flex:1}}><ProfilePage /></div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
