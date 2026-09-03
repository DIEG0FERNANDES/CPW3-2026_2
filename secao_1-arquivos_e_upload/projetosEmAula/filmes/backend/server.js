const express = require("express");
const app = express();
app.use(express.json());

let filmes = [];
let id = 1;

//get
app.get("/filmes", (req, res) => {
  res.json(filmes);
});

app.get("/filmes/nota/bem-avaliados", (req, res) => {
  const filmesBemAvaliados = filmes.filter(f => f.nota >= 9);
  if (filmesBemAvaliados.length === 0) {
    return res.status(404).json({
      erro: "Filme(s) não encontrado(s)"
    });
  }
  res.json(filmesBemAvaliados);
});

app.get("/filmes/:id", (req, res) => {
  const filme = filmes.find(f => f.id ==
    req.params.id);
  if (!filme) {
    return res.status(404).json({
      erro: "Filme não encontrado"
    });
  }
  res.json(filme);
});

app.get("/filmes/ano/:ano", (req, res) => {
  const filmesAno = filmes.filter(f => f.ano == req.params.ano);
  if (filmesAno.length === 0) {
    return res.status(404).json({
      erro: "Filme(s) não encontrado(s)"
    });
  }
  res.json(filmesAno);
});

//post pra criar um ou vários 
app.post("/filmes", (req, res) => {
  const body = req.body;

  // Se for um array, cria múltiplos
  if (Array.isArray(body)) {
    const filmesCriados = [];
    const erros = [];

    body.forEach((filme, index) => {
      const { titulo, ano, nota } = filme;

      if (!titulo || !ano || !nota) {
        erros.push({
          index,
          filme,
          erro: "Dados inválidos"
        });
        return;
      }

      const novoFilme = {
        id: id++,
        titulo,
        ano,
        nota
      };

      filmes.push(novoFilme);
      filmesCriados.push(novoFilme);
    });

    if (erros.length > 0) {
      return res.status(207).json({
        criados: filmesCriados,
        erros: erros
      });
    }

    return res.status(201).json({
      mensagem: `${filmesCriados.length} filmes criados`,
      filmes: filmesCriados
    });
  }

  // Se for um objeto único, cria um filme
  const { titulo, ano, nota } = body;
  if (!titulo || !ano || !nota) {
    return res.status(400).json({
      erro: "Dados inválidos"
    });
  }

  const novoFilme = {
    id: id++,
    titulo,
    ano,
    nota
  };

  filmes.push(novoFilme);
  res.status(201).json(novoFilme);
});

//porta pra subir o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});