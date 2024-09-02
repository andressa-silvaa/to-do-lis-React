import React, { useState, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import pandaImage from '../../assets/img/panda.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexto/UserContext'; 

function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [senhaTouched, setSenhaTouched] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    senha: ''
  });

  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

  const validate = useCallback(() => {
    let isValid = true;
    const newErrors = {
      email: '',
      senha: ''
    };

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
  }, [email, senha]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    setEmailTouched(true);
    setSenhaTouched(true);

    if (!validate()) {
      setAlert({ show: true, message: 'Há campos inválidos. Por favor, corrija-os.', type: 'danger' });
      return;
    }

    try {
      const response = await axios.post('https://to-do-list-api-eight.vercel.app/login', {
        email,
        senha
      });
      

      login(response.data.usuario, response.data.token); 
      
      setAlert({ show: true, message: 'Login realizado com sucesso!', type: 'success' });
      setTimeout(() => navigate('/tarefas'), 1000);
    } catch (error) {
      if (error.response) {
        setAlert({ show: true, message: 'Ocorreu um erro ao fazer login: ' + (error.response.data.mensagem || error.message), type: 'danger' });
      } else {
        setAlert({ show: true, message: 'Ocorreu um erro ao fazer login: ' + error.message, type: 'danger' });
      }
    }
  }, [email, senha, navigate, validate, login]);

  const handleRegisterClick = () => {
    navigate('/cadastro');
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
          <h2>Bem vindo(a) de volta!</h2>
          <p>Pronto(a) para conquistar mais um dia?</p>
          <div className="center-form">
            <form onSubmit={handleSubmit}>
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
                <label htmlFor="senha" className="form-label">Senha: *</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  className={`form-control ${senhaTouched && errors.senha ? 'is-invalid' : ''}`}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onBlur={() => setSenhaTouched(true)}
                  required
                />
                {senhaTouched && errors.senha && <div className="invalid-feedback">{errors.senha}</div>}
              </div>
              <div className="mb-3">
                <a href="/forgot-password">Esqueceu a senha?</a>
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success me-2 login-entrar">Entrar</button>
                <button type="button" className="btn btn-success login-cadastrar" onClick={handleRegisterClick}>Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
