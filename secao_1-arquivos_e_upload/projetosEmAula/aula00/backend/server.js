const express = require('express');
const app = express();
const port = 3000

app.use((req, res, next) => {
  console.log('Acesso:', req.method, req.url);
  next();
})

//  define endpoint
app.get('/', (req, res) => {
  res.send(`
    <h1>~ MENU ~</h1>
    <a href="/inicio/Rogerio">Ir para Início</a><br>
    <a href="/status">Ir para status</a><br>
    <a href="/soma/2/2">Ir para soma</a><br>
    <a href="/sub/2/2">Ir para subtração</a><br>
    <a href="/mult/2/2">Ir para multiplicação</a>
  `);
});

app.get('/inicio/:nome', (req, res) => {
  const nome = req.params.nome;
  res.send(`
    <h1>~ INÍCIO ~</h1>
    <p>Bem vindo ${nome}!<br>
    Este é um site para testar a rota /inicio com variavel dinâmica...<br>
    Espero que esteja certo '-'</p>
    
  `);
});

app.get('/aluno', (req, res) => {
  res.send("ROTA OKAY");
});

// rota dinâmica (":" é uma variavel )
app.get('/aluno/:nome', (req, res) => {
  const nome = req.params.nome;
  res.send(`Olá, ${nome}`);
});

// com números
app.get('/soma/:a/:b', (req, res) => {
  const a = Number(req.params.a);
  const b = Number(req.params.b);
  const resultado = a + b;
  res.send(`Soma [${a} + ${b}] = ${resultado} !`);
});

app.get('/sub/:a/:b', (req, res) => {
  const a = Number(req.params.a);
  const b = Number(req.params.b);
  const resultado = a - b;
  res.send(`Subtração [${a} - ${b}] = ${resultado} !`);
});

app.get('/mult/:a/:b', (req, res) => {
  const a = Number(req.params.a);
  const b = Number(req.params.b);
  const resultado = a * b;
  res.send(`Multiplicação [${a} * ${b}] = ${resultado} !`);
});

app.get('/status', (req, res) => {
  res.json({
    servidor: 'online',
    disciplina: 'cpw3',
    professora: 'milena',
    hora: new Date().toLocaleString()
  })
})


// Liga o servidor pra escutar na porta 3000
app.listen(port, () => {
  console.log("Servidor rodando em http://localhost:3000");
});