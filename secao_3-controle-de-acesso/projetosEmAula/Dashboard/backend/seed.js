const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Aponta para o arquivo database.db
const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Cria a tabela se ela ainda não existir
  db.run(`
CREATE TABLE IF NOT EXISTS produtos (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
preco REAL NOT NULL,
quantidade INTEGER NOT NULL
)
`);

  // 2. Limpa dados antigos de testes anteriores
  db.run("DELETE FROM produtos");

  // 3. Insere os dados iniciais
  const stmt = db.prepare(
    "INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)",
  );

  stmt.run("Notebook Dell", 3500.0, 5);
  stmt.run("Mouse Sem Fio", 89.9, 15);
  stmt.run("Teclado Mecânico", 250.0, 8);

  stmt.finalize(() => {
    console.log("Tabela criada e banco povoado com sucesso!");
  });
});
