import fs from 'fs'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();

app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CAMINHO_JOGOS = path.join(__dirname, 'dados', 'jogos.json');
const CAMINHO_HISTORICO = path.join(__dirname, 'dados', 'historico.txt');

function lerJogos() {
  try {
    const conteudo = fs.readFileSync(CAMINHO_JOGOS, 'utf-8');
    return JSON.parse(conteudo);
  } catch (erro) {
    console.error('Erro ao ler jogos.json:', erro.message);
    return [];
  }
}

function salvarJogos(jogos) {
  try {
    fs.writeFileSync(CAMINHO_JOGOS, JSON.stringify(jogos, null, 2));
  } catch (erro) {
    console.error('Erro ao salvar jogos.json:', erro.message);
    throw erro;
  }
}

function registrarHistorico(mensagem) {
  try {
    const dataHora = new Date().toLocaleString('pt-BR');
    const linha = `[${dataHora}] ${mensagem}\n`;
    fs.appendFileSync(CAMINHO_HISTORICO, linha);
  } catch (erro) {
    console.error('Erro ao gravar historico.txt:', erro.message);
  }
}

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de jogos está funcionando! 🎮' });
});

app.get('/jogos', (req, res) => {
  try {
    const jogos = lerJogos();
    res.json(jogos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao buscar os jogos.' });
  }
});

app.get('/jogos/melhores', (req, res) => {
  try {
    const jogos = lerJogos();
    const melhores = jogos.filter((jogo) => jogo.nota >= 8);
    res.json(melhores);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao buscar os melhores jogos.' });
  }
});

app.get('/jogos/:id', (req, res) => {
  try {
    const jogos = lerJogos();
    const id = Number(req.params.id);
    const jogo = jogos.find((j) => j.id === id);

    if (!jogo) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    res.json(jogo);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao buscar o jogo.' });
  }
});

app.post('/jogos', (req, res) => {
  try {
    const { titulo, genero, ano, nota } = req.body;

    if (!titulo || !genero) {
      return res.status(400).json({
        erro: 'Os campos "titulo" e "genero" são obrigatórios.',
      });
    }

    const jogos = lerJogos();
    const novoId = jogos.length > 0 ? Math.max(...jogos.map((j) => j.id)) + 1 : 1;

    const novoJogo = {
      id: novoId,
      titulo,
      genero,
      ano: ano ?? null,
      nota: nota ?? null,
    };

    jogos.push(novoJogo);
    salvarJogos(jogos);
    registrarHistorico(`JOGO CADASTRADO: ${titulo}`);

    res.status(201).json(novoJogo);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao cadastrar o jogo.' });
  }
});

app.put('/jogos/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const jogos = lerJogos();
    const jogo = jogos.find((j) => j.id === id);

    if (!jogo) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    const { titulo, genero, ano, nota } = req.body;

    if (titulo !== undefined) jogo.titulo = titulo;
    if (genero !== undefined) jogo.genero = genero;
    if (ano !== undefined) jogo.ano = ano;
    if (nota !== undefined) jogo.nota = nota;

    salvarJogos(jogos);
    registrarHistorico(`JOGO ATUALIZADO: ${jogo.titulo}`);

    res.json(jogo);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao atualizar o jogo.' });
  }
});

app.delete('/jogos/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const jogos = lerJogos();
    const indice = jogos.findIndex((j) => j.id === id);

    if (indice === -1) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    const [jogoRemovido] = jogos.splice(indice, 1);
    salvarJogos(jogos);
    registrarHistorico(`JOGO REMOVIDO: ${jogoRemovido.titulo}`);

    res.json({ mensagem: `Jogo "${jogoRemovido.titulo}" removido com sucesso.` });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao remover o jogo.' });
  }
});

app.get('/historico', (req, res) => {
  try {
    const conteudo = fs.readFileSync(CAMINHO_HISTORICO, 'utf-8');
    res.type('text/plain').send(conteudo || 'Nenhum registro no histórico ainda.');
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao ler o histórico.' });
  }
});

export default app;