import express from "express";

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

const musicas = [
  { id: 1, titulo: "Dark Red", artista: "Steve Lacy", nota: 10 },
  { id: 2, titulo: "Instant Crush", artista: "Daft Punk", nota: 9 },
  { id: 3, titulo: "Chop Suey!", artista: "System of a Down", nota: 8 },
  { id: 4, titulo: "Backstage", artista: "Matuê", nota: 7 },
];

app.get("/musicas", (req, res) => {
  res.json(musicas);
});

app.get("/musicas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const musica = musicas.find((m) => m.id === id);
  if (musica) {
    res.json(musica);
  } else {
    res.status(404).send("Música não encontrada");
  }
});

app.get("/artista/:nome", (req, res) => {
  const nome = req.params.nome;
  const musicasDoArtista = musicas.filter((m) => m.artista === nome);
  res.json(musicasDoArtista);
});

app.get("/top", (req, res) => {
  const bemAvaliados = musicas.filter((m) => m.nota >= 9);
  res.json(bemAvaliados);
});
