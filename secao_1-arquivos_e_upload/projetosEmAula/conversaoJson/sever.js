const fs = require("fs/promises");
async function converterJSON() {
  try {
    const textoJson = await fs.readFile("dados.json", "utf-8");

    const textoConvertido = JSON.parse(textoJson);

    const textoFormatado = textoConvertido.map((chave) => {
      return `
      nome: ${chave.nome}\n
      email:${chave.email}\n
      telefone:${chave.telefone}
      `;
    });

    await fs.writeFile('jsonConvertido.txt', textoFormatado)
    console.log("Sucesso ....")
  } catch (erro) {
    console.log("Erro na conversão:", erro);
  }
}

converterJSON();
