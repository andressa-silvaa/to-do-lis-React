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
    titulo: '',
    descricao: '',
    prioridade: 'alta',
    completa: false,
    categoria: '',
  });
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });
  const menuRef = useRef(null);

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

        console.log('Tarefas recebidas:', response.data);

        // Ordena as tarefas pela data de cadastro em ordem decrescente
        const sortedTasks = response.data.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));
        
        setTasks(sortedTasks);
      } catch (error) {
        console.error('Erro ao buscar as tarefas:', error);
      }
    };

    fetchTasks();
  }, [token]);

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
  const handleCloseModal = () => {
    setShowModal(false);
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
    setFormData({ ...formData, completa: e.target.value === 'true' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) {
      setAlert({ show: true, message: 'Há campos inválidos. Por favor, corrija-os.', type: 'danger' });
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
      return;
    }
  
    try {
      if (!token) {
        console.error('Token não encontrado no contexto');
        return;
      }
  
      const response = await axios.post('https://to-do-list-api-eight.vercel.app/tarefa', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Tarefa adicionada com sucesso:', response.data);
  
      // Adiciona a nova tarefa no início da lista de tarefas
      setTasks(prevTasks => [response.data.tarefa, ...prevTasks].sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro)));
  
      handleCloseModal();
      setAlert({ show: true, message: 'Tarefa adicionada com sucesso!', type: 'success' });
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    } catch (error) {
      console.error('Erro ao adicionar a tarefa:', error);
      setAlert({ show: true, message: 'Ocorreu um erro ao adicionar a tarefa: ' + (error.response?.data?.mensagem || error.message), type: 'danger' });
      setTimeout(() => {
        setAlert({ show: false });
      }, 3000);
    }
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
          <button className="btn btn-primary tarefas-pendentes">
            <img src={pendenteImg} alt="ícone" className='pendenteImg' />Tarefas
          </button>
          <button className="btn btn-primary tarefas-completas" onClick={handleCompleteClick}>
            <img src={validoImg} alt="ícone" className='validoImg' />Tarefas Completas
          </button>
        </div>
        <div className="col-md-12 d-flex justify-content-start mt-3">
          <button className="btn btn-primary nova-tarefa" onClick={handleShowModal}>
            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Nova Tarefa
          </button>
        </div>
      </div>

      <div className="card-container row">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div className="col-md-4" key={task.id}>
              <div className="task-card">
                <div className="d-flex justify-content-between align-items-center position-relative">
                  <h5 className="task-title">{task.titulo}</h5>
                  <button className="btn btn-light mais" onClick={() => handleMenuToggle(task.id)}>
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                  {showMenu === task.id && (
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
          <Modal.Title>Adicionar Tarefa</Modal.Title>
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
                checked={formData.completa === true}
                onChange={handleRadioChange}
              />
              <Form.Check
                type="radio"
                label="pendente"
                name="completa"
                value="false"
                checked={formData.completa === false}
                onChange={handleRadioChange}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="primary" type="submit" className='custom-button'>
                Adicionar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Tarefas;
