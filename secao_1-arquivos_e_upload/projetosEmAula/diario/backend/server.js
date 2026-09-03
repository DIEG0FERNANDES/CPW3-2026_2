const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

//1. Rota para carregar o formulário HTML na porta 3000
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

//2. Rota POST para receber e salvar o recado
app.post('/estudo', (req, res) => {
  const { materia, resumo } = req.body;
  const linha = `[${materia}]: ${resumo}\n`;

  fs.appendFileSync('diario.txt', linha, 'utf-8');

  res.redirect('/historico');
});

//3. Rota GET para ler o arquivo e exibir o mural
app.get('/historico', (req, res) => {
  if (!fs.existsSync('diario.txt')) {
    return res.send(`Nenhuma entrada enviada ainda. 
      <br><br>
      <a href='/'>Enviar primeira entrada</a>`);
  }
  const conteudo = fs.readFileSync('diario.txt', 'utf-8');
  res.send(`
    <style>
      body {
        font-family: Arial;
        text-align: center;
        background: #f2f2f2;
      }

      pre {
        background: white;
        padding: 20px;
        margin: 20px auto;
        max-width: fit-content;
        text-align: left;
      }

      a {
        color: white;
        background-color: cyan;
        padding: 20px;
        border-radius: 10px;
        margin: 10px;
        text-decoration: none;

      }
</style>
    <h1>Diario do Estudante</h1>
    <pre>${conteudo}</pre>
    <a href="/">Enviar outra entrada</a>
    `);
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000")); 