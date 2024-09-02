import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import pendenteImg from '../../assets/img/pendente.png'; 
import validoImg from '../../assets/img/valido.png'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Tarefas.css';
import { useUser } from '../../contexto/UserContext'; 

function Tarefas() {
  const [showMenu, setShowMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'alta',
    complete: 'nao',
    category: '',
  });
  const [tasks, setTasks] = useState([]); // Estado para armazenar as tarefas recebidas da API
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const { token } = useUser(); // Use o token do contexto

  useEffect(() => {
    // Fazer a requisição para listar as tarefas
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

        console.log('Tarefas recebidas:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('Erro ao buscar as tarefas:', error);
      }
    };

    fetchTasks();
  }, [token]); // Adicione o token às dependências

  const handleMenuToggle = (index) => {
    setShowMenu(showMenu === index ? null : index);
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

  const handleCompleteClick = () => {
    navigate('/tarefas-completas'); 
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar a nova tarefa
    console.log(formData);
    handleCloseModal();
  };

  // Defina as categorias, ou substitua pela importação se for o caso
  const categories = ['Trabalho', 'Pessoal', 'Estudo'];

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
          <button className="btn btn-primary nova-tarefa" onClick={handleShowModal}>
            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Nova Tarefa
          </button>
        </div>
      </div>
      
      {/* Cartões de tarefas dinâmicos */}
      <div className="card-container row">
        {tasks.map((task, index) => (
          <div className="col-md-4" key={task.id}>
            <div className="task-card">
              <div className="d-flex justify-content-between align-items-center position-relative">
                <h5 className="task-title">{task.titulo}</h5>
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
              <div className={`task-priority ${task.prioridade}`}>{task.prioridade}</div>
              <div className="task-description-container">
                <p className="task-description">
                  {task.descricao}
                </p>
              </div>
              <div className="d-flex justify-content-between task-category-container">
                <div className="task-category">
                  <i className="fas fa-flag"></i> {task.completa ? 'Completa' : 'Pendente'}
                </div>
                <span className="categoria">{task.categoria}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para adicionar tarefa */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Nova Tarefa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="custom-form-group" controlId="formTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o título da tarefa"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="custom-form-group" controlId="formDescription">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Digite a descrição da tarefa"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="custom-form-group" controlId="formPriority">
              <Form.Label>Prioridade</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="custom-form-group" controlId="formComplete">
              <Form.Label>Completa</Form.Label>
              <Form.Check
                type="radio"
                label="Sim"
                name="complete"
                value="sim"
                checked={formData.complete === 'sim'}
                onChange={handleChange}
                required
              />
              <Form.Check
                type="radio"
                label="Não"
                name="complete"
                value="não"
                checked={formData.complete === 'não'}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="custom-form-group" controlId="formCategory">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Adicionar Tarefa
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Tarefas;
