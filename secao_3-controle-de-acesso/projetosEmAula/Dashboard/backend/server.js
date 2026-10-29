const express = require("express");
const session = require("express-session");
const path = require("path");
const sqlite3 = require("sqlite3").verbose(); // Importa o SQLite nativo

const app = express();

// --- CONFIGURAÇÃO DO BANCO DE DADOS (SQLite) ---
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

// Garante que a tabela existe no arranque da aplicação
db.serialize(() => {
  db.run(`
CREATE TABLE IF NOT EXISTS produtos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
preco REAL NOT NULL,
quantidade INTEGER NOT NULL
)
`);
});

// Permite que o Node leia os dados enviados pelo formulário HTML
app.use(express.urlencoded({ extended: true }));

// Permite que o Node leia o css e arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Configuração da Sessão (Expira em 60 segundos)
app.use(
  session({
    secret: "minha_chave_secreta",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000, // em milissegundos
    },
  }),
);

// Middleware que barra invasores (Rotas Protegidas)
function verificaAcesso(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// --- ROTAS DE AUTENTICAÇÃO ---

// Rota inicial: Entrega a página de login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Recebe os dados do formulário de login
app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === "admin" && pass === "admin") {
    req.session.user = user;
    res.redirect("/dashboard");
  } else {
    res.send(
      'Login ou senha incorretos! <a href="/login">Tentar novamente</a>',
    );
  }
});

// Rota do Botão de Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.get("/dashboard", verificaAcesso, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

app.get("/api/produtos", verificaAcesso, (req, res) => {
  const sql = "SELECT * FROM produtos";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro ao consultar o banco de dados" });
    }
    res.json(rows);
  });
});

//create
app.post("/api/produtos/novo", verificaAcesso, (req, res) => {
  const { nome, preco, quantidade } = req.body;
  const sql = "INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)";

  db.run(sql, [nome, preco, quantidade], function (err) {
    if (err) {
      return res.status(500).send("Erro ao cadastrar produto");
    }
    res.redirect("/dashboard");
  });
});

//delete
app.get("/api/produtos/deletar/:id", verificaAcesso, (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM produtos WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).send("Erro ao excluir produto");
    }
    res.redirect("/dashboard");
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor a ON! Aceda a: http://localhost:3000/login");
});
