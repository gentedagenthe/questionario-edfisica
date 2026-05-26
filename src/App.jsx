import React from 'react';
import QuestionarioEdFisica from './QuestionarioEdFisica';
import AdminPanel from './AdminPanel';

export default function App() {
  const isAdmin = window.location.pathname === '/admin';
  return isAdmin ? <AdminPanel /> : <QuestionarioEdFisica />;
}
