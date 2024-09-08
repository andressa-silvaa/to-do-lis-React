import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import pendenteImg from '../../assets/img/pendente.png';
import validoImg from '../../assets/img/valido.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useUser } from '../../contexto/UserContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './TarefasCompletas.css';


function TarefasCompletas() {
  const [showMenu, setShowMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToRestore, setTaskToRestore] = useState(null); 
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEditId, setTaskToEditId] = useState(null);
  const [taskToSeeId, setTaskToSeeId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'alta',
    completa: false,
    categoria: '',
  });
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false); 
  const [isSeeing, setIsSeeing] = useState(false); 
  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const navigate = useNavigate();
  const { token } = useUser();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!token) {
          console.error('Token não encontrado no contexto');
          return;
        }

        const response = await axios.get('https://to-do-list-api-eight.vercel.app/tarefas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const sortedTasks = response.data.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));
        setTasks(sortedTasks);
      } catch (error) {
        console.error('Erro ao buscar as tarefas:', error);
      }
    };

    fetchTasks();
  }, [token]);

  const handleMenuToggle = (index) => {
    setShowMenu((prevShowMenu) => (prevShowMenu === index ? null : index));
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current && !menuRef.current.contains(event.target) &&
      buttonRef.current && !buttonRef.current.contains(event.target)
    ) {
      setShowMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePendingClick = () => {
    navigate('/tarefas'); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsSeeing(false);
    setFormData({
      titulo: '',
      descricao: '',
      prioridade: 'alta',
      completa: false,
      categoria: '',
    });
    setErrors({});
  };

  const validate = () => {
    if (formData.completa == 1) {
      formData.completa = true;
    }
    else{
      formData.completa = false;
    }
    const newErrors = {};
    if (!formData.titulo || formData.titulo.length < 3 || formData.titulo.length > 100) {
      newErrors.titulo = 'O título deve ter entre 3 e 100 caracteres.';
    }

    if (!formData.descricao || formData.descricao.length < 10 || formData.descricao.length > 500) {
      newErrors.descricao = 'A descrição deve ter entre 10 e 500 caracteres.';
    }

    if (typeof formData.completa !== 'boolean') {
      newErrors.completa = 'O campo completa deve ser um valor booleano (true ou false).';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Por favor, selecione uma categoria.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, completa: e.target.value === 'true' ? true : false });
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) {
      setAlert({ show: true, message: 'Há campos inválidos. Por favor, corrija-os.', type: 'danger' });
      setTimeout(() => setAlert({ show: false }), 3000);
      return;
    }
  
    try {
      if (!token) {
        console.error('Token não encontrado no contexto');
        return;
      }
  
      const url = isEditing
        ? `https://to-do-list-api-eight.vercel.app/tarefa/${taskToEditId}`
        : 'https://to-do-list-api-eight.vercel.app/tarefa';
  
      const method = isEditing ? 'put' : 'post';
  
      const taskData = {
        ...formData,
        completa: formData.completa === true || formData.completa === 'true'
      };
  
      const response = await axios[method](
        url,
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (isEditing) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskToEditId ? response.data.tarefa : task
          )
        );
      } else {
        setTasks(prevTasks => [response.data.tarefa, ...prevTasks]);
      }
      
  
      handleCloseModal();
      setAlert({
        show: true,
        message: isEditing ? 'Tarefa editada com sucesso!' : 'Tarefa adicionada com sucesso!',
        type: 'success',
      });
      setTimeout(() => setAlert({ show: false }), 3000);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Erro ao processar a tarefa: ' + (error.response?.data?.mensagem || error.message),
        type: 'danger',
      });
      setTimeout(() => setAlert({ show: false }), 3000);
    }
  };
  
  
  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setTaskToDelete(null);
  };

  const handleDelete = async () => {
    try {
      if (!token) {
        console.error('Token não encontrado no contexto');
        return;
      }
  
      await axios.delete(`https://to-do-list-api-eight.vercel.app/tarefa/${taskToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete));
      setAlert({ show: true, message: 'Tarefa excluída com sucesso!', type: 'success' });
      setTimeout(() => {
        setAlert({ show: false });
      }, 2000);
  
    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
      setAlert({ show: true, message: 'Ocorreu um erro ao excluir a tarefa: ' + (error.response?.data?.mensagem || error.message), type: 'danger' });
      setTimeout(() => {
        setAlert({ show: false });
      }, 2000);
    } finally {
      handleCloseConfirmModal();
    }
  };
  
  const handleRestore = async () => {
    try {
      if (!token) {
        console.error('Token não encontrado no contexto');
        return;
      }
  
      console.log("ID da tarefa a ser restaurada:", taskToRestore);
  
      console.log("Lista de tarefas:", tasks);
  
      const taskToUpdate = tasks.find(task => task.id === taskToRestore.id);
      if (!taskToUpdate) {
        console.error('Tarefa não encontrada');
        return;
      }
  
      const updatedTaskData = {
        titulo: taskToUpdate.titulo,
        descricao: taskToUpdate.descricao,
        categoria: taskToUpdate.categoria,
        prioridade: taskToUpdate.prioridade,
        completa: false, 
      };
  
      await axios.put(`https://to-do-list-api-eight.vercel.app/tarefa/${taskToRestore.id}`, updatedTaskData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(prevTasks => prevTasks.map(task =>
        task.id === taskToRestore.id ? { ...task, completa: false } : task
      ));
  
      setAlert({ show: true, message: 'Tarefa restaurada com sucesso!', type: 'success' });
      setTimeout(() => setAlert({ show: false }), 2000);
  
    } catch (error) {
      console.error('Erro ao restaurar a tarefa:', error);
      setAlert({ show: true, message: 'Erro ao restaurar a tarefa: ' + (error.response?.data?.mensagem || error.message), type: 'danger' });
      setTimeout(() => setAlert({ show: false }), 2000);
    } finally {
      handleCloseRestoreConfirmModal();
    }
  };
  
  
  
  
  const handleEditClick = (task) => {
    console.log('Editando tarefa:', task); 
    setTaskToEditId(task.id);
    setFormData({
      titulo: task.titulo || "",
      descricao: task.descricao || "",
      prioridade: task.prioridade || "",
      completa: task.completa || false,
      categoria: task.categoria || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };
  

  const handleCloseRestoreConfirmModal = () => {
    setShowRestoreConfirmModal(false);
    setTaskToRestore(null); 
  };
  const handleRestoreStatusClick = (taskId) => {
    setTaskToRestore(taskId);
    setShowRestoreConfirmModal(true);
};
  const handleViewClick = (task) => {
    setTaskToSeeId(task.id);
    setFormData({
      titulo: task.titulo || "",
      descricao: task.descricao || "",
      prioridade: task.prioridade || "",
      completa: task.completa || false,
      categoria: task.categoria || "",
    });
    setIsSeeing(true);
    setShowModal(true);
  };
  
  const categories = ['Trabalho', 'Pessoal', 'Estudo', 'Casa', 'Saúde', 'Compras', 'Projetos', 'Eventos', 'Finanças', 'Lazer', 'Outro'];
  const categoryColors = {
    Trabalho: '#f08080',
    Pessoal: '#800080',
    Estudo: '#FF7F50',
    Casa: '#5F9EA0',
    Saúde: '#87cefa',
    Compras: '#ff5722',
    Projetos: '#9c27b0',
    Eventos: '#3f51b5',
    Finanças: '#00bcd4',
    Lazer: '#8bc34a',
    Outro: '#9e9e9e'
  };

  return (
    <div className="container mt-5">
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show fixed-top top-right`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert({ ...alert, show: false })} aria-label="Close"></button>
        </div>
      )}
      <div className="row mb-3">
      <div className="col-md-12">
          <button className="btn btn-primary tarefas-pendentes-completas" onClick={handlePendingClick}>
            <img src={pendenteImg} alt="icon" className='pendenteImg' />Tarefas
          </button>
          <button className="btn btn-primary tarefas-completas-completas">
            <img src={validoImg} alt="icon" className='validoImg' />Tarefas Completas
          </button>
        </div>
      </div>

      <div className="card-container row">
  {tasks.length > 0 ? (
    tasks
      .filter(task => task && task.completa)
      .map((task) => (
        <div className="col-md-4" key={task.id}>
          <div className="task-card">
            <div className="d-flex justify-content-between align-items-center position-relative">
              <h5 className="task-title">{task.titulo}</h5>
              <button
                className="btn btn-light mais"
                onClick={() => handleMenuToggle(task.id)}
              >
                <i className="fas fa-ellipsis-h"></i>
              </button>
              {showMenu == task.id && (
                <div className="task-menu" ref={menuRef}>
                  <button className="btn btn-danger" onClick={() => handleDeleteClick(task.id)}><i className="fas fa-trash"></i></button>
                  <button className="btn btn-info" onClick={() => handleRestoreStatusClick(task)}><i className="fas fa-undo"></i></button>
                  <button className="btn btn-warning" onClick={() => handleEditClick(task)}><i className="fas fa-edit"></i></button>
                  <button className="btn btn-info" onClick={() => handleViewClick(task)}><i className="fas fa-expand"></i></button>
                </div>
              )}
            </div>
            <div className={`task-priority ${task.prioridade}`}>{task.prioridade}</div>
            <div className="task-description-container">
              <p className="task-description">
                {task.descricao}
              </p>
            </div>
            <hr />
            <div className="d-flex justify-content-between task-category-container">
              <div className="task-category">
                <i className="fas fa-flag"></i> {format(new Date(task.dataCadastro), 'dd MMM yy', { locale: ptBR })}
              </div>
              <span
                className="categoria"
                style={{ backgroundColor: categoryColors[task.categoria] || '#9e9e9e' }} // Usa a cor correspondente à categoria
              >
                {task.categoria}
              </span>
            </div>
          </div>
        </div>
      ))
  ) : (
    <p>Nenhuma tarefa encontrada.</p>
  )}
</div>

  <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
        <Modal.Title>
          {isSeeing ? 'Ver tarefa' : (isEditing ? 'Editar Tarefa' : 'Adicionar Tarefa')}
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="custom-form-group" controlId="formTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o título"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                isInvalid={!!errors.titulo}
                disabled={isSeeing}
              />
              <Form.Control.Feedback type="invalid">{errors.titulo}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="custom-form-group" controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Digite a descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                isInvalid={!!errors.descricao}
                disabled={isSeeing}
              />
              <Form.Control.Feedback type="invalid">{errors.descricao}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="custom-form-group" controlId="formPrioridade">
              <Form.Label>Prioridade</Form.Label>
              <Form.Control
                as="select"
                name="prioridade"
                value={formData.prioridade}
                onChange={handleChange}
                disabled={isSeeing}
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="custom-form-group" controlId="formCompleta">

              <Form.Control.Feedback type="invalid">{errors.completa}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="custom-form-group" controlId="formCategoria">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                isInvalid={!!errors.categoria}
                disabled={isSeeing}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
              </Form.Control>
              <Form.Label>Status</Form.Label>
              <Form.Check
                type="radio"
                label="concluída"
                name="completa"
                value="true"
                checked={formData.completa == true}
                onChange={handleRadioChange}
                disabled={isSeeing}
              />
              <Form.Check
                type="radio"
                label="pendente"
                name="completa"
                value="false"
                checked={formData.completa == false}
                onChange={handleRadioChange}
                disabled={isSeeing}
              />
            </Form.Group>
            <Modal.Footer>
            {!isSeeing && (
              <Button variant="primary" type="submit" className='custom-button'>
                {isEditing ? 'Salvar Alterações' : 'Adicionar'}
              </Button>)}
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza de que deseja excluir esta tarefa?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Excluir</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmação para Restauração */}
      <Modal show={showRestoreConfirmModal} onHide={handleCloseRestoreConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>Você tem certeza que deseja marcar esta tarefa como pendente novamente?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary button-cancelar" onClick={handleCloseRestoreConfirmModal}>Cancelar</Button>
          <Button variant="success button-restaurar-tarefa" onClick={handleRestore}>Marcar como Pendente</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default TarefasCompletas;
