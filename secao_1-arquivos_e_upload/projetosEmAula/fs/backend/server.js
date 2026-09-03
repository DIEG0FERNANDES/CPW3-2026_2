const fs = require("node:fs/promises");

async function lerMeuArquivo() {
  try {
    const data = await fs.readFile("texto2.txt", "utf-8");
    console.log("Conteúdo do arquivo:", data);
  } catch (erro) {
    console.error("Ops, deu um erro ao ler o arquivo:", erro.message);
  }
}

lerMeuArquivo();
