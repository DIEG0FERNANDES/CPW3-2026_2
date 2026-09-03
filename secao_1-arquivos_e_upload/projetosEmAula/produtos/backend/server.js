const express = require("express");
const app = express();
app.use(express.json());

let produtos = [];
let id = 1;

//get
app.get("/produtos", (req, res) => {
  res.json(produtos);
});

app.get("/produtos/caros", (req, res) => {
  const produtosCaros = produtos.filter(p => p.preco > 1000);
  if (!produtosCaros) {
    return res.status(404).json({
      erro: "Produto(s) não encontrado(s)"
    });
  }
  res.send(produtosCaros);
});

app.get("/produtos/baratos", (req, res) => {
  const produtosBaratos = produtos.filter(p => p.preco < 200);
  if (!produtosBaratos) {
    return res.status(404).json({
      erro: "Produto(s) não encontrado(s)"
    });
  }
  res.send(produtosBaratos);
});


app.get("/produtos/:id", (req, res) => {
  const produto = produtos.find(p => p.id ==
    req.params.id);
  if (!produto) {
    return res.status(404).json({
      erro: "Produto não encontrado"
    });
  }
  res.json(produto);
});

//post
app.post("/produtos", (req, res) => {
  const body = req.body;

  if (Array.isArray(body)) {
    const produtosCadastrados = [];
    const erros = [];

    body.forEach((produto, index) => {
      const { nome, preco } = produto;

      if (!nome || !preco) {
        erros.push({
          index,
          produto,
          erro: "Dados inválidos"
        });
        return;
      }

      const novoProduto = {
        id: id++,
        nome,
        preco
      };

      produtos.push(novoProduto);
      produtosCadastrados.push(novoProduto);
    });

    if (erros.length > 0) {
      return res.status(207).json({
        cadastrados: produtosCadastrados,
        erros: erros
      });
    }

    return res.status(201).json({
      mensagem: `${produtosCadastrados.length} produtos cadastrados`,
      produtos: produtosCadastrados
    });
  }

  //Se for só um
  const { nome, preco } = req.body;
  if (!nome || !preco) {
    return res.status(400).json({
      erro: "Dados inválidos"
    });
  }
  const novoProduto = {
    id: id++,
    nome,
    preco
  };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

//porta pra subir o servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});