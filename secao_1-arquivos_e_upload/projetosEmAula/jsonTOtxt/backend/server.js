const fs = require('fs/promises');

async function converterJsonParaTxt() {
  try {
    const jsonBruto = await fs.readFile('json_bruto.json', 'utf-8');
    const conteudo = JSON.parse(jsonBruto);

    const textoFormatado = conteudo
      .map(item => `${item.nome}, ${item.email}, ${item.telefone}`).join('\n');

    await fs.writeFile('dados_convertidos.txt', textoFormatado);
    console.log('Arquivo TXT gerado com sucesso!');

  } catch (erro) {
    console.error('Erro na conversão: ', erro);
  }
}

converterJsonParaTxt();