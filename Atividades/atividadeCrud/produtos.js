import express from "express";

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
const produtos = [
  { id: 1, nome: "Notebook", preco: 3500 },
  { id: 2, nome: "Mouse", preco: 80 },
  { id: 3, nome: "Teclado", preco: 150 },
  { id: 4, nome: "Monitor", preco: 1200 },
];

app.get("/produtos", (req, res) => {
  res.json(produtos);
});

app.get("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find((p) => p.id === id);
  if (produto) {
    res.json(produto);
  } else {
    res.status(404).send("Produto não encontrado");
  }
});

app.get("/caros", (req, res) => {
  const caros = produtos.filter((p) => p.preco > 1000);
  res.json(caros);
});

app.get("/baratos", (req, res) => {
  const baratos = produtos.filter((p) => p.preco < 200);
  res.json(baratos);
});
