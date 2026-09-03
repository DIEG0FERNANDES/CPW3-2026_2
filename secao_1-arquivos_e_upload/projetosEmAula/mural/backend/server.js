const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

//1. Rota para carregar o formulário HTML na porta 3000
app.get('/', (req, res) => {
  //Aponta para o index.html dentro da pasta frontend
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

//2. Rota POST para receber e salvar o recado
app.post('/recado', (req, res) => {
  const { nome, mensagem } = req.body;
  const linha = `${nome}: ${mensagem}\n`;

  fs.appendFileSync('mural.txt', linha, 'utf-8');

  //Redireciona para a tela do mural
  res.redirect('/mural');
});

//3. Rota GET para ler o arquivo e exibir o mural
app.get('/mural', (req, res) => {
  if (!fs.existsSync('mural.txt')) {
    return res.send(`Nenhum recado cadastrado ainda. 
      <br><br>
      <a href='/'>Enviar primeiro recado</a>`);
  }
  const conteudo = fs.readFileSync('mural.txt', 'utf-8');
  res.send(`
    <h1>Mural de Recados</h1>
    <pre>${conteudo}</pre>
    <a href="/">Enviar outro recado</a>
    `);
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000")); 