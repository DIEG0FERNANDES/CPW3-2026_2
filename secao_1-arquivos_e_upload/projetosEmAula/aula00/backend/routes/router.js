import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Seja bem vindo! Este é o servidor backend funcionando");
});

router.get("/status", (req, res) => {
  res.json({
    servidor: "online",
    disciplina: "LP3",
    professora: "Diego",
    hora: new Date().toLocaleString(),
  });
});

router.get("/soma/:a/:b", (req, res) => {
  const a = Number(req.params.a);
  const b = Number(req.params.b);
  res.send(`O resultado da soma é ${a + b}`);
});

router.get("/subtracao/:a/:b", (req, res) => {
  const a = Number(req.params.a);
  const b = Number(req.params.b);
  res.send(`O resultado da subtração é ${a - b}`);
});

router.get("/multiplicacao/:a/:b", (req, res) => {
  const a = Number(req.params.a);
  const b = Number(req.params.b);
  res.send(`O resultado da multiplicação é ${a * b}`);
});
// router.get("/", (req, res) => {
//   res.send(`
//         <h1>Menu</h1>
//         <a href="/aluno/Diego">Ir para aluno</a><br>
//         <a href="/status">Ir para status</a>
//         `);
// });
// router.get("/aluno", (req, res) => {
//   res.send("rota ok");
// });

// router.get("/aluno/:nome", (req, res) => {
//   const nome = req.params.nome;
//   res.send(`Olá, ${nome}!`);
// });

router.use((req, res, next) => {
  console.log("Acesso:", req.method, req.url);
  next();
});

export default router;
