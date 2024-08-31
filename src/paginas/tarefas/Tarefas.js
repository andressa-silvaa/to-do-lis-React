import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import pendenteImg from '../../assets/img/pendente.png'; 
import validoImg from '../../assets/img/valido.png'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Tarefas.css';

function Tarefas() {
  const [showMenu, setShowMenu] = useState(null);
  const menuRef = useRef(null);

  const handleMenuToggle = (index) => {
    setShowMenu(showMenu == index ? null : index);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate(); 

  const handleCompleteClick = () => {
    navigate('/tarefas-completas'); 
  };
  return (
    <div className="container mt-5">
      {/* Botões de filtros */}
      <div className="row mb-3">
        <div className="col-md-12">
          <button className="btn btn-primary tarefas-pendentes">
            <img src={pendenteImg} alt="icon" className='pendenteImg' />Tarefas
          </button>
          <button className="btn btn-primary tarefas-completas" onClick={handleCompleteClick}>
            <img src={validoImg} alt="icon" className='validoImg' />Tarefas Completas
          </button>
        </div>
        <div className="col-md-12 d-flex justify-content-start mt-3">
          <button className="btn btn-primary nova-tarefa">
            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Nova Tarefa
          </button>
        </div>
      </div>
      
      {/* Cartões de tarefas */}
      <div className="card-container row">
        {[1, 2, 3, 4].map((_, index) => (
          <div className="col-md-4" key={index}>
            <div className="task-card">
              <div className="d-flex justify-content-between align-items-center position-relative">
                <h5 className="task-title">Título da Tarefa {index + 1}</h5>
                <button className="btn btn-light mais" onClick={() => handleMenuToggle(index)}>
                  <i className="fas fa-ellipsis-h"></i>
                </button>
                {showMenu === index && (
                  <div className="task-menu" ref={menuRef}>
                    <button className="btn btn-danger"><i className="fas fa-trash"></i></button>
                    <button className="btn btn-success"><i className="fas fa-check"></i></button>
                    <button className="btn btn-warning"><i className="fas fa-edit"></i></button>
                    <button className="btn btn-info"><i className="fas fa-expand"></i></button>
                  </div>
                )}
              </div>
              <div className="task-priority alta">Alta</div>
              <div className="task-description-container">
                <p className="task-description">
                  Descrição da tarefa {index + 1}.
                </p>
              </div>
              <div className="d-flex justify-content-between task-category-container">
                <div className="task-category">
                  <i className="fas fa-flag"></i> Data
                </div>
                <span className="categoria">Categoria</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tarefas;
