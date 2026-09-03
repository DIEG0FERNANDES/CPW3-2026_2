const express = require('express');
const app = express();
const port = 3000;

//Cors permite a comunicação da API do backend com as informações do frontend
const cors = require('cors');
app.use(cors());

app.get('/dog', async (req, res) => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const dados = await response.json();

  res.json(dados);
});

app.listen(port, () => {
  console.log(`Está funcionando em http://localhost:${port}`);
})