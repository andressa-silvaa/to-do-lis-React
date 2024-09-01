import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';
import pandaIO from '../../assets/img/panda.io.png';
import userImg from '../../assets/img/usuario.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isAuthRoute = ['/login', '/cadastro'].includes(location.pathname);
  const isTasksRoute = ['/tarefas', '/tarefas-completas'].includes(location.pathname);

  const headerClass = isAuthRoute ? 'header-auth' : isTasksRoute ? 'header-tasks' : '';

  const handleUserClick = () => {
    setShowMenu(prev => !prev);
  };

  const handleLogout = () => {
    // Adicione a lógica de logout aqui
    console.log('Deslogar');
    setShowMenu(false); // Fecha o menu após o logout
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.matches('.logo-user')) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`header ${headerClass}`}>
      {isAuthRoute && (
        <div className="row w-100 m-0">
          <div className="col-md-6 auth-left d-none d-md-block">
            {/* Conteúdo da metade esquerda */}
          </div>
          <div className="col-12 col-md-6 auth-right d-flex align-items-center justify-content-end">
            <img src={pandaIO} alt="Auth Logo" className="logo-right" />
          </div>
        </div>
      )}

      {isTasksRoute && (
        <div className="d-flex align-items-center justify-content-between w-100">
          <img src={pandaIO} alt="Tasks Logo" className="logo-left" />
          <div className="d-flex align-items-center position-relative">
            <h3 className="mb-0">Usuário</h3>
            <div className="position-relative">
              <img 
                src={userImg} 
                alt="Botão usuário" 
                className="logo-user ms-2 cursor-pointer" 
                onClick={handleUserClick} 
              />
              {showMenu && (
                <div className="user-menu position-absolute" ref={menuRef}>
                  <a href="#logout" onClick={handleLogout}>Sair</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
