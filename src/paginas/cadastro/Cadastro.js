import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Cadastro.css';
import pandaImage from '../../assets/img/panda.png'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Importando axios

function Cadastro() {
  const navigate = useNavigate(); 

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nomeTouched, setNomeTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);

  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

  const validate = () => {
    let isValid = true;
    const newErrors = {
      nome: '',
      email: '',
      senha: ''
    };

    if (nome.length < 3 || nome.length > 40) {
      newErrors.nome = 'O nome deve ter entre 3 e 40 caracteres.';
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'O e-mail deve ser válido.';
      isValid = false;
    }

    if (senha.length < 8 || senha.length > 20) {
      newErrors.senha = 'A senha deve ter entre 8 e 20 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNomeTouched(true);
    setEmailTouched(true);
    setSenhaTouched(true);

    const isValid = validate();
    if (!isValid) {
      setAlert({ show: true, message: 'Há campos inválidos. Por favor, corrija-os.', type: 'danger' });
      setTimeout(() => setAlert({ show: false }), 2000);
      return;
    }

    try {

      setIsLoading(true);
      const response = await axios.post('https://to-do-list-api-eight.vercel.app/usuario', {
        nome,
        email,
        senha
      });

      // Supondo que a resposta é um objeto JSON com a mensagem
      if (response.data.mensagem === 'Já existe usuário cadastrado com o e-mail informado.') {
        setAlert({ show: true, message: response.data.mensagem, type: 'danger' });
        setTimeout(() => setAlert({ show: false }), 2000);
      } else {
        setAlert({ show: true, message: 'Usuário cadastrado com sucesso!', type: 'success' });
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (error) {
      console.error('Erro no axios:', error);
      if (error.response) {
        // Exibindo mensagem de erro com base na resposta do servidor
        setAlert({ show: true, message: 'Ocorreu um erro ao cadastrar: ' + (error.response.data.mensagem || error.message), type: 'danger' });
      } else {
        // Erro ao configurar a requisição ou outro erro
        setAlert({ show: true, message: 'Ocorreu um erro ao cadastrar: ' + error.message, type: 'danger' });
      }
      setTimeout(() => setAlert({ show: false }), 2000);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show fixed-top top-right`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert({ ...alert, show: false })} aria-label="Close"></button>
        </div>
      )}
      <div className="row h-100">
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center bg-light-blue">
          <div className="img-container">
            <img src={pandaImage} alt="Logo" className="img-fluid" />
          </div>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-start align-items-center p-4">
          <h2>Bem vindo(a) à To do list!</h2>
          <p>Crie sua conta e comece a organizar sua vida com estilo.</p>
          <div className="center-form">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nome" className="form-label">Como podemos te chamar? *</label>
                <input 
                  type="text" 
                  id="nome" 
                  name="nome" 
                  className={`form-control ${nomeTouched && errors.nome ? 'is-invalid' : ''}`} 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  onBlur={() => setNomeTouched(true)} 
                  required 
                />
                {nomeTouched && errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">E-mail: *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className={`form-control ${emailTouched && errors.email ? 'is-invalid' : ''}`} 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  onBlur={() => setEmailTouched(true)} 
                  required 
                />
                {emailTouched && errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Senha: *</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  className={`form-control ${senhaTouched && errors.senha ? 'is-invalid' : ''}`} 
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)} 
                  onBlur={() => setSenhaTouched(true)} 
                  required 
                />
                {senhaTouched && errors.senha && <div className="invalid-feedback">{errors.senha}</div>}
              </div>
              <div className="mb-3">
                <a href="/login">Já tem uma conta?</a>
              </div>
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-success me-2 entrar" onClick={() => navigate('/login')}>Entrar</button>
                <button type="submit" className="btn btn-success cadastrar" disabled={isLoading}>
                  {isLoading ? (
                    <span className="btn btn-success me-2 login-entrar" role="status" aria-hidden="true"></span>
                  ) : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
