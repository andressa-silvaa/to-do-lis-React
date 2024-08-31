import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import  '../estilos/Login.css';
import pandaImage from '../assets/img/panda.png'; 
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const navigate = useNavigate(); 

  const handleRegisterClick = () => {
    navigate('/cadastrar'); 
  };

  return (
    <div className="container-fluid vh-100">
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
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">E-mail: *</label>
                <input type="email" id="email" name="email" className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Senha: *</label>
                <input type="password" id="password" name="password" className="form-control" required />
              </div>
              <div className="mb-3">
                <a href="/forgot-password">Esqueceu a senha?</a>
              </div>
              <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success me-2 entrar">Entrar</button>
                  <button type="button" className="btn btn-success cadastrar" onClick={handleRegisterClick}>Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
