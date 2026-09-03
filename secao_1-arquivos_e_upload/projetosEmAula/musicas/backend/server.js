const express = require("express");
const app = express();
app.use(express.json());

let musicas = [];
let id = 1;

//get
app.get("/musicas", (req, res) => {
  res.json(musicas);
});

app.get("/musicas/top", (req, res) => {
  const musicasTop = musicas.filter(m => m.nota >= 9);
  if (musicasTop.length === 0) {
    return res.status(404).json({
      erro: "Música(s) não encontrada(s)"
    });
  }
  res.json(musicasTop);
});

app.get("/musicas/:id", (req, res) => {
  const musica = musicas.find(m => m.id ==
    req.params.id);
  if (!musica) {
    return res.status(404).json({
      erro: "Música não encontrada"
    });
  }
  res.json(musica);
});

app.get("/musicas/artista/:artista", (req, res) => {
  const musicasArtista = musicas.filter(f => f.artista == req.params.artista);
  if (musicasArtista.length === 0) {
    return res.status(404).json({
      erro: "Música(s) não encontrada(s)"
    });
  }
  res.json(musicasArtista);
});

//post pra criar um ou vários 
app.post("/musicas", (req, res) => {
  const body = req.body;

  // Se for um array, cria múltiplos
  if (Array.isArray(body)) {
    const musicasAdicionadas = [];
    const erros = [];

    body.forEach((musica, index) => {
      const { titulo, artista, nota } = musica;

      if (!titulo || !artista || !nota) {
        erros.push({
          index,
          musica,
          erro: "Dados inválidos"
        });
        return;
      }

      const novaMusica = {
        id: id++,
        titulo,
        artista,
        nota
      };

      musicas.push(novaMusica);
      musicasAdicionadas.push(novaMusica);
    });

    if (erros.length > 0) {
      return res.status(207).json({
        adicionadas: musicasAdicionadas,
        erros: erros
      });
    }

    return res.status(201).json({
      mensagem: `${musicasAdicionadas.length} músicas adicionadas`,
      musicas: musicasAdicionadas
    });
  }

  // Se for um objeto único, cria um filme
  const { titulo, artista, nota } = body;
  if (!titulo || !artista || !nota) {
    return res.status(400).json({
      erro: "Dados inválidos"
    });
  }

  const novaMusica = {
    id: id++,
    titulo,
    artista,
    nota
  };

  musicas.push(novaMusica);
  res.status(201).json(novaMusica);
});

//porta pra subir o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});