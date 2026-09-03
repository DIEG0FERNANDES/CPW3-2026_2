import express from "express";

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

const filmes = [
  { id: 1, titulo: "A Origem", ano: 2010, nota: 10 },
  { id: 2, titulo: "A Familia do Futuro", ano: 2007, nota: 9 },
  { id: 3, titulo: "Homem-Aranha", ano: 2002, nota: 8 },
  { id: 4, titulo: "Interestelar", ano: 2014, nota: 10 },
  { id: 5, titulo: "Click", ano: 2006, nota: 9 },
];

app.get("/filmes", (req, res) => {
  res.json(filmes);
});

app.get("/filmes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filme = filmes.find((f) => f.id === id);
  if (filme) {
    res.json(filme);
  } else {
    res.status(404).send("Filme não encontrado");
  }
});

app.get("/bem-avaliados", (req, res) => {
  const bemAvaliados = filmes.filter((f) => f.nota >= 9);
  res.json(bemAvaliados);
});

app.get("/filmes/ano/:ano", (req, res) => {
  const ano = parseInt(req.params.ano);
  const filmesDoAno = filmes.filter((f) => f.ano === ano);
  res.json(filmesDoAno);
});
