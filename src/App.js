import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './componentes/header/Header';
import Login from './paginas/login/Login';
import Cadastro from './paginas/cadastro/Cadastro';
import Tarefas from './paginas/tarefas/Tarefas';
import TarefasCompletas from './paginas/tarefasCompletas/TarefasCompletas';

function App() {
  return (
    <Router>
      <main>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/tarefas-completas" element={<TarefasCompletas />} />
          {/* Redirecionar a rota raiz ("/") para a página de login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
