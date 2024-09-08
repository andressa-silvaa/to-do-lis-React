# 📝 To-Do List App

Este é o repositório da aplicação de To-Do List em React, que consome uma API Node.js e Express para gerenciar tarefas de usuários. O objetivo é fornecer um sistema onde os usuários possam cadastrar-se, fazer login, e gerenciar suas tarefas de forma prática e intuitiva.


## 🔗 Demonstração

A aplicação está disponível para uso [aqui](https://to-do-lis-react.vercel.app/login).

## 🎯 Funcionalidades

- **Cadastro de usuários**: Novos usuários podem criar uma conta para acessar o sistema.
  
<img align="center" alt="Cadastro" height="300em" width="600em" src="https://i.imgur.com/bsOsByd.png"/>

- **Login de usuários**: Usuários já cadastrados podem fazer login no sistema.
  
<img align="center" alt="Login" height="300em" width="600em" src="https://i.imgur.com/OZvpHb4.png"/>

- **Gerenciamento de tarefas**:
   
  - Visualizar os detalhes completos de uma tarefa ao clicar no ícone de 3 pontinhos.
    
    <img align="center" alt="Login" height="300em" width="600em" src="https://i.imgur.com/du53VzU.png"/>
    
  - Adicionar novas tarefas com título, descrição, prioridade (alta, média, baixa), categoria e status (pendente ou concluída).
    
    <img align="center" alt="Login" height="300em" width="400em" src="https://i.imgur.com/ykJc2To.png"/>
  
  - Editar tarefas existentes.
    
    <img align="center" alt="Login" height="300em" width="400em" src="https://i.imgur.com/YThDJOi.png"/>
    
  - Excluir tarefas.
    
     <img align="center" alt="Login" height="300em" width="600em" src="https://i.imgur.com/CfDpiFi.png"/>
     
  - Marcar tarefas pendentes como concluídas.
    
    <img align="center" alt="Login" height="300em" width="600em" src="https://i.imgur.com/wpDJqS0.png"/>
    
  - Reverter tarefas concluídas para o status de pendente.
    
   <img align="center" alt="Login" height="300em" width="600em" src="https://i.imgur.com/Fap5QpX.png"/>



## 🗃 Repositório da API
A API utilizada neste projeto está disponível em um repositório separado. Você pode acessá-lo e seguir as instruções para configurá-la em um ambiente local ou entender melhor sua estrutura [aqui](https://github.com/andressa-silvaa/to-do-list-API).

## 🕹 Executando Localmente

1. Clone o repositório: `git clone https://github.com/andressa-silvaa/to-do-lis-React.git`
2. Instale as Dependências: `npm install`
3. Configuração da API: `O projeto consome uma API que está hospedada separadamente. Para utilizar o sistema em desenvolvimento local, siga os seguintes passos:`
 - Clone o repositório da API: `git clone https://github.com/andressa-silvaa/to-do-list-API.git`
 - Crie um banco de dados MySQL local e configure as variáveis de ambiente no arquivo .env da API. Exemplo de .env:
- - ` DB_HOST=seu-host`
- - `DB_USER=seu-usuario`
- - `DB_PASSWORD=sua-senha`
- - `DB_NAME=seu-banco-de-dados`
 - Instale as dependências da API e inicie o servidor:
 - - `npm install`
 - - `npm start`
4. Configuração do Front-End:
- No ambiente local, será necessário alterar as URLs das requisições para que apontem para a API local. Os arquivos a serem modificados são:
- - `src/pages/login.js`
- - `src/pages/cadastro.js`
- - `src/pages/tarefas.js`
- - `src/pages/tarefasCompletas.js`
- - `Substitua as URLs de requisição pela URL local onde a API está rodando (por exemplo, http://localhost:3000).`
5. Executar o Projeto: `Após configurar a API, execute o projeto React: npm start`


## 💻 Tecnologias Utilizadas

- **Frontend:** React, HTML, CSS, javascript, Bootstrap, Axios, etc.
- **BackEnd:** Node.js, JavaScript, Express, Knex, MySql, etc. 
  

## 💡 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.


## 👩Autor
>Andressa Silva



