import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Login from './paginas/login/Login';
import Cadastro from './paginas/cadastro/Cadastro';
import Tarefas from './paginas/tarefas/Tarefas';
import TarefasCompletas from './paginas/tarefasCompletas/TarefasCompletas';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/tarefas" element={<Tarefas />} />
          <Route path="/tarefas-completas" element={<TarefasCompletas />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
