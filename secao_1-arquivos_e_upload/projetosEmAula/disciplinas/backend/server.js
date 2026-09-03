const express = require("express");
const app = express();
app.use(express.json());

let disciplinas = [];
let idDisciplina = 1;

// Listar todas as disciplinas
app.get("/disciplinas", (req, res) => {
  res.json(disciplinas);
});

// Buscar disciplina por ID
app.get("/disciplinas/:id", (req, res) => {
  const disciplina = disciplinas.find(d => d.id == req.params.id);
  if (!disciplina) {
    return res.status(404).json({
      erro: "Disciplina não encontrada"
    });
  }
  res.json(disciplina);
});

// Buscar disciplinas por área
app.get("/disciplinas/area/:area", (req, res) => {
  const disciplinasArea = disciplinas.filter(d =>
    d.area.toLowerCase() === req.params.area.toLowerCase()
  );
  if (disciplinasArea.length === 0) {
    return res.status(404).json({
      erro: "Nenhuma disciplina encontrada para esta área"
    });
  }
  res.json(disciplinasArea);
});

// Criar uma nova disciplina
app.post("/disciplinas", (req, res) => {
  const { nome, area, cargaHoraria, professor, semestre } = req.body;

  if (!nome || !area || !cargaHoraria) {
    return res.status(400).json({
      erro: "Campos obrigatórios: nome, area, cargaHoraria"
    });
  }

  const novaDisciplina = {
    id: idDisciplina++,
    nome,
    area,
    cargaHoraria,
    professor: professor || "Não definido",
    semestre: semestre || "Não definido",
  };

  disciplinas.push(novaDisciplina);
  res.status(201).json(novaDisciplina);
});

// Atualizar uma disciplina completamente
app.put("/disciplinas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const disciplinaIndex = disciplinas.findIndex(d => d.id === id);

  if (disciplinaIndex === -1) {
    return res.status(404).json({
      erro: "Disciplina não encontrada"
    });
  }

  const { nome, area, cargaHoraria, professor, semestre } = req.body;

  if (!nome || !area || !cargaHoraria) {
    return res.status(400).json({
      erro: "Campos obrigatórios: nome, area, cargaHoraria"
    });
  }

  disciplinas[disciplinaIndex] = {
    id: id,
    nome,
    area,
    cargaHoraria,
    professor: professor || "Não definido",
    semestre: semestre || "Não definido",
  };

  res.json({
    mensagem: "Disciplina atualizada com sucesso",
    disciplina: disciplinas[disciplinaIndex]
  });
});

// Remover uma disciplina por ID
app.delete("/disciplinas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const disciplinaIndex = disciplinas.findIndex(d => d.id === id);

  if (disciplinaIndex === -1) {
    return res.status(404).json({
      erro: "Disciplina não encontrada"
    });
  }

  const disciplinaRemovida = disciplinas[disciplinaIndex];
  disciplinas.splice(disciplinaIndex, 1);

  res.json({
    mensagem: "Disciplina removida com sucesso",
    disciplina: disciplinaRemovida
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});