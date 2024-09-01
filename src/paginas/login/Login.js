import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Login.css';
import pandaImage from '../../assets/img/panda.png'; 
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

  const validate = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: ''
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'O e-mail deve ser válido.';
      isValid = false;
    }

    if (password.length < 8 || password.length > 20) {
      newErrors.password = 'A senha deve ter entre 8 e 20 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailTouched(true);
    setPasswordTouched(true);

    const isValid = validate();
    if (!isValid) {
      setAlert({ show: true, message: 'Há campos inválidos. Por favor, corrija-os.', type: 'danger' });
      return;
    }

    try {
      console.log('Iniciando requisição para a API...');
      const response = await fetch('https://to-do-list-api-git-main-andressas-projects-37c54a16.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.message || 'Erro ao enviar os dados.');
      }

      setAlert({ show: true, message: 'Login realizado com sucesso!', type: 'success' });
      setTimeout(() => navigate('/tarefas'), 1000);
    } catch (error) {
      console.error('Erro no fetch:', error);
      setAlert({ show: true, message: 'Ocorreu um erro ao fazer login: ' + error.message, type: 'danger' });
    }
  };

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
                <label htmlFor="password" className="form-label">Senha: *</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  className={`form-control ${passwordTouched && errors.password ? 'is-invalid' : ''}`} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  onBlur={() => setPasswordTouched(true)} 
                  required 
                />
                {passwordTouched && errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
