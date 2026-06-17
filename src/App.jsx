import React from 'react';
import QuestionarioEdFisica from './QuestionarioEdFisica';
import AdminPanel from './AdminPanel';

export default function App() {
  if (process.env.REACT_APP_INSCRICOES_ENCERRADAS === 'true') {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '40px'
    }}>
      <img src="/logo.png" alt="Genthe" style={{ width: 160, marginBottom: 32 }} />
      <h2 style={{ color: '#1B6FAB' }}>Inscrições encerradas</h2>
      <p style={{ color: '#555', maxWidth: 400 }}>
        O prazo para participação neste processo seletivo foi encerrado.<br/>
        Agradecemos o seu interesse.
      </p>
    </div>
  );
}
  const isAdmin = window.location.pathname === '/admin';
  return isAdmin ? <AdminPanel /> : <QuestionarioEdFisica />;
}
