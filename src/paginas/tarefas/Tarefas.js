import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Tarefas.css';

function Tarefas() {
  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col-md-12 d-flex justify-content-between">
          <button className="btn btn-primary">Tarefas</button>
          <button className="btn btn-primary">Tarefas Completas</button>
        </div>
        <div className="col-md-12 d-flex justify-content-start mt-3">
          <button className="btn btn-primary">Nova Tarefa</button>
        </div>
      </div>
      <div className="card-container row">
        <div className="col-md-4">
          <div className="task-card">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="task-title">Comprar Morangos</h5>
              <button className="btn btn-light">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
            <div className="task-description">
              <span className="task-priority baixa">Baixa</span>
              Na volta do serviço, passar no mercado para comprar duas caixinhas de morangos.
            </div>
            <div className="task-category mercado">
              <i className="fas fa-calendar-alt"></i> 10 Nov
              <span className="ml-2">Mercado</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="task-card">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="task-title">Comprar o novo livro da Colleen Hoover</h5>
              <button className="btn btn-light">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
            <div className="task-description">
              <span className="task-priority baixa">Baixa</span>
              Na volta do serviço, passar no mercado para comprar duas caixinhas de morangos.
            </div>
            <div className="task-category hobbies">
              <i className="fas fa-calendar-alt"></i> 10 Nov
              <span className="ml-2">Hobbies</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="task-card">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="task-title">Criar Planilha</h5>
              <button className="btn btn-light">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
            <div className="task-description">
              <span className="task-priority alta">Alta</span>
              Criar a planilha para o projeto que me solicitaram.
            </div>
            <div className="task-category trabalho">
              <i className="fas fa-calendar-alt"></i> 12 Nov
              <span className="ml-2">Trabalho</span>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="task-card">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="task-title">Criar + uma planilha</h5>
              <button className="btn btn-light">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
            <div className="task-description">
              <span className="task-priority médio">Médio</span>
              Organizar meus gastos do mês.
            </div>
            <div className="task-category financeiro">
              <i className="fas fa-calendar-alt"></i> 12 Nov
              <span className="ml-2">Financeiro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tarefas;
