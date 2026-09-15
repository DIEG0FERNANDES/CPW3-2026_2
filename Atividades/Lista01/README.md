# Lista 01 — API de Jogos (Node.js + Express)

API backend em Node.js/Express para cadastro de jogos, com persistência em
arquivo JSON e histórico de operações em arquivo TXT.

## Estrutura do projeto

```
lista01-api-jogos/
├── server.js
├── package.json
├── .gitignore
├── dados/
│   ├── jogos.json
│   └── historico.txt
└── README.md
```

## Como instalar e rodar

## Usando NPM

```bash
# 1. Instalar as dependências (cria a pasta node_modules)
npm install

# 2. Iniciar o servidor
node server.js
# ou, se preferir usar o script definido no package.json:
npm start
```

## Usando Yarn

```bash
# 1. Instalar as dependências (cria a pasta node_modules)
yarn

# 2. Iniciar o servidor
node server.js
# ou, se preferir usar o script definido no package.json:
yarn start
```

O servidor sobe em `http://localhost:3000`.

## Endpoints disponíveis

| Método | Rota             | Descrição                                  |
|--------|------------------|---------------------------------------------|
| GET    | `/`              | Mensagem confirmando que a API está no ar   |
| GET    | `/jogos`         | Lista todos os jogos                        |
| GET    | `/jogos/melhores`| Lista jogos com nota >= 8                   |
| GET    | `/jogos/:id`     | Busca um jogo pelo ID                       |
| POST   | `/jogos`         | Cadastra um novo jogo                       |
| PUT    | `/jogos/:id`     | Atualiza um jogo existente                  |
| DELETE | `/jogos/:id`     | Remove um jogo                              |
| GET    | `/historico`     | Retorna o conteúdo de `historico.txt`       |

Exemplo de Body para `POST /jogos` e `PUT /jogos/:id`:
```json
{ "titulo": "Minecraft", "genero": "Aventura", "ano": 2011, "nota": 9 }
```

---

# Respostas teóricas

## Parte 1 — Conceitos iniciais de Node.js, NPM e Express

**1. O que é Node.js e qual sua função em uma aplicação web?**
Node.js é um ambiente de execução (runtime) que permite rodar JavaScript
fora do navegador, diretamente no sistema operacional, usando o motor V8
do Google Chrome. Em uma aplicação web, ele é usado para criar o
**backend**: o servidor que recebe requisições, processa lógica de
negócio, acessa arquivos/bancos de dados e devolve respostas ao cliente.

**2. Diferença entre JavaScript no navegador e no Node.js?**
No navegador, o JavaScript tem acesso a APIs específicas de interface,
como `document`, `window` e manipulação do DOM, mas não pode acessar o
sistema de arquivos do computador por segurança. No Node.js, não existe
DOM nem `window`, mas em compensação há acesso a módulos do sistema
operacional, como `fs` (arquivos), `path` (caminhos) e `http` (servidores).

**3. O que é NPM?**
NPM (Node Package Manager) é o gerenciador de pacotes do Node.js. Ele
permite instalar, atualizar e remover bibliotecas de terceiros (como o
Express) no projeto, além de gerenciar as dependências listadas no
`package.json`.

**4. Função do arquivo `package.json`?**
É o arquivo que descreve o projeto: nome, versão, scripts (comandos
como `npm start`) e, principalmente, a lista de dependências que o
projeto precisa para funcionar. Ele permite que qualquer pessoa reconstrua
o ambiente do projeto rodando apenas `npm install`.

**5. Por que `node_modules` normalmente não vai para o GitHub?**
Porque essa pasta pode conter milhares de arquivos e ocupar muito espaço,
além de ser totalmente reconstruível a partir do `package.json` com o
comando `npm install`. Por isso ela é listada no `.gitignore` — versionar
o `node_modules` é redundante e deixa o repositório desnecessariamente
pesado.

*(Itens 6-10 — criação do projeto, instalação do Express, configuração do
`server.js` na porta 3000 e rota `GET /` — estão implementados em
`server.js`. O teste da rota `GET /` no Postman deve ser colado na seção
"Prints do Postman" ao final deste documento.)*

## Parte 2 — Rotas, requisições e respostas

**11. O que é uma rota (endpoint) em uma API?**
É uma combinação de um caminho de URL com um método HTTP que o servidor
reconhece e para o qual define um comportamento específico. Por exemplo,
`GET /jogos` é uma rota diferente de `POST /jogos`, mesmo compartilhando
o mesmo caminho.

**12. Função de `req` em uma rota Express?**
`req` (request) representa a requisição recebida do cliente. É por meio
dele que acessamos dados enviados junto com a chamada, como parâmetros de
URL (`req.params`), corpo da requisição (`req.body`) e query strings
(`req.query`).

**13. Função de `res` em uma rota Express?**
`res` (response) representa a resposta que o servidor vai devolver ao
cliente. É usado para definir o status HTTP (`res.status()`) e o conteúdo
da resposta (`res.json()`, `res.send()`).

**14. Diferença entre `res.send()` e `res.json()`?**
`res.send()` é genérico: pode enviar texto, HTML, buffers ou objetos
(nesse último caso, o Express converte para JSON automaticamente).
`res.json()` é específico para enviar dados em formato JSON, definindo
corretamente o cabeçalho `Content-Type: application/json` — por isso é a
opção mais indicada quando se quer garantir uma resposta JSON.

**15. O que significa API REST/RESTful?**
É um estilo arquitetural para construir APIs baseado em recursos (como
"jogos") que são manipulados através dos métodos HTTP padrão (GET, POST,
PUT, DELETE), usando URLs previsíveis e respostas normalmente em JSON.
Uma API é chamada de "RESTful" quando segue essas convenções.

**16. Associação entre métodos HTTP e sua finalidade:**
- `GET` → buscar/consultar dados, sem alterá-los.
- `POST` → criar um novo recurso.
- `PUT` → atualizar um recurso já existente.
- `DELETE` → remover um recurso existente.

**17. Diferença entre `req.body` e `req.params`?**
`req.params` captura valores que fazem parte do **caminho da URL**, como
o `:id` em `/jogos/:id`. `req.body` captura os dados enviados no **corpo**
da requisição, geralmente em JSON, usados em operações como POST e PUT.

**18. Para que serve `app.use(express.json())`?**
É um middleware que instrui o Express a interpretar automaticamente o
corpo das requisições que chegam com `Content-Type: application/json`,
convertendo o texto JSON recebido em um objeto JavaScript acessível por
`req.body`. Sem esse middleware, `req.body` chegaria `undefined`.

## Parte 5 — PUT: atualização de dados

**43. Por que o PUT é diferente do POST?**
`POST` é usado para **criar** um novo recurso — cada chamada gera um item
novo. `PUT` é usado para **atualizar** um recurso que já existe,
identificado por um ID na própria URL (`/jogos/:id`); se o ID não existir,
a operação deve falhar (no projeto, retornando 404), em vez de criar um
novo item.

## Parte 6 — DELETE: exclusão de dados

**50. Por que o DELETE não precisa receber Body?**
Porque a exclusão só depende de identificar **qual** recurso remover, e
essa informação já vem na própria URL através do `:id`. Não há dados
adicionais a enviar — diferente do POST/PUT, que precisam de um corpo
JSON com as informações do que criar ou alterar.

## Parte 7 — Rota especial e manipulação de arrays

**56. Diferença entre `find()`, `findIndex()` e `filter()`?**
- `find()` retorna o **primeiro elemento** do array que satisfaz uma
  condição, ou `undefined` se nenhum for encontrado.
- `findIndex()` retorna a **posição (índice)** do primeiro elemento que
  satisfaz a condição, ou `-1` se não encontrar.
- `filter()` retorna um **novo array** com **todos** os elementos que
  satisfazem a condição (pode ser vazio, mas nunca `undefined`).

**57. Diferença entre `push()` e `splice()`?**
`push()` adiciona um ou mais elementos ao **final** de um array.
`splice()` é mais versátil: pode remover, substituir ou inserir elementos
em qualquer posição do array, especificando índice inicial e quantidade
de elementos afetados — no projeto, é usado para **remover** o jogo pelo
índice encontrado com `findIndex()`.

## Parte 8 — JSON: teoria e conversão

**58. O que é JSON?**
JSON (JavaScript Object Notation) é um formato de texto leve para troca
de dados, baseado na sintaxe de objetos e arrays do JavaScript, mas
independente de linguagem — é amplamente usado para comunicação entre
APIs e para armazenar dados estruturados em arquivos.

**59. Função de `JSON.parse()`?**
Converte uma **string** de texto no formato JSON em uma estrutura de
dados JavaScript (objeto ou array) que pode ser manipulada normalmente no
código.

**60. Função de `JSON.stringify()`?**
Faz o processo inverso: converte um objeto ou array JavaScript em uma
**string** de texto no formato JSON, pronta para ser enviada em uma
resposta HTTP ou gravada em um arquivo.

**61. Por que um arquivo JSON no disco precisa ser lido como texto antes
de ser manipulado como objeto/array?**
Porque tudo que está gravado em um arquivo é, fisicamente, uma sequência
de caracteres (texto) — o sistema de arquivos não entende "objetos
JavaScript". Por isso é necessário ler o conteúdo como texto (`fs.readFile`
ou `fs.readFileSync`) e depois usar `JSON.parse()` para transformar esse
texto em uma estrutura utilizável no código.

**62. Finalidade dos parâmetros `null, 2` em
`JSON.stringify(dados, null, 2)`?**
O segundo parâmetro (`null`) é um "replacer" opcional, usado para
filtrar ou transformar valores durante a conversão — `null` significa que
nenhum filtro é aplicado. O terceiro parâmetro (`2`) define a
indentação: cada nível de aninhamento do JSON será recuado em 2 espaços,
tornando o arquivo resultante legível para humanos, em vez de uma única
linha compacta.

**63. Três regras de sintaxe de um JSON válido:**
1. As chaves (nomes das propriedades) devem estar sempre entre aspas
   duplas (`"chave"`), nunca aspas simples.
2. Não é permitido usar vírgula depois do último elemento de um objeto ou
   array (trailing comma).
3. Não é possível incluir comentários dentro de um arquivo JSON puro.
   *(Também vale citar: strings sempre em aspas duplas, e apenas os tipos
   string, número, booleano, null, objeto e array são permitidos.)*

**64. Diferença entre um objeto JavaScript em memória e o texto
armazenado em um arquivo `.json`?**
O objeto em memória é uma estrutura de dados "viva", que existe apenas
enquanto o programa está rodando (na RAM), podendo ser modificada
diretamente pelo código. O conteúdo do arquivo `.json` é apenas **texto**
salvo em disco, que precisa ser lido e convertido (`JSON.parse`) para se
tornar um objeto manipulável, e precisa ser convertido de volta em texto
(`JSON.stringify`) para ser salvo novamente.

## Parte 9 — Persistência em arquivo JSON

**72. Por que os dados agora permanecem após o servidor ser desligado?**
Porque, em vez de guardar os jogos apenas em uma variável na memória RAM
(que é apagada quando o processo do Node.js termina), o projeto lê e
grava os dados diretamente no arquivo `jogos.json`, no disco. Como o
disco não é apagado ao encerrar o programa, os dados persistem — na
próxima vez que o servidor for iniciado, ele volta a ler o arquivo
atualizado.

## Parte 10 — Manipulação de arquivo TXT e histórico

**83. Diferença entre `writeFile` e `appendFile`?**
`writeFile` **sobrescreve** todo o conteúdo do arquivo com o novo texto
fornecido — se o arquivo já existia, seu conteúdo anterior é perdido.
`appendFile` **acrescenta** o novo texto ao final do arquivo, preservando
tudo o que já estava escrito antes.

**84. O que pode acontecer com o conteúdo anterior de um arquivo quando
`writeFile` é usado sobre um arquivo que já existe?**
O conteúdo anterior é completamente apagado e substituído pelo novo
conteúdo passado na chamada — por isso `writeFile` não é adequado para
manter um histórico de eventos ao longo do tempo.

**85. Finalidade de `readFile`?**
Ler o conteúdo de um arquivo do disco de forma assíncrona (sem travar a
execução do restante do programa enquanto a leitura acontece), entregando
o resultado através de um callback ou de uma Promise.

## Parte 11 — Exclusão de arquivos e módulo fs

**86. Função de `fs.unlink()`?**
Remove (exclui) um arquivo do sistema de arquivos, de forma assíncrona.
Existe também a versão síncrona, `fs.unlinkSync()`.

**87. O que acontece quando `fs.unlink()` é usado para remover um
arquivo?**
O arquivo é apagado permanentemente do disco. Diferente de mover algo
para uma "lixeira", essa exclusão é direta — se não houver backup, o
conteúdo não pode ser recuperado.

**88. Associação entre operações e métodos de arquivo:**
- Criar/escrever → `fs.writeFile()` / `fs.writeFileSync()`
- Ler → `fs.readFile()` / `fs.readFileSync()`
- Acrescentar → `fs.appendFile()` / `fs.appendFileSync()`
- Excluir → `fs.unlink()` / `fs.unlinkSync()`

**89. O que significa o erro `ENOENT`?**
É um código de erro do Node.js que significa "Error NO ENTry" (nenhuma
entrada/arquivo encontrado) — ocorre tipicamente quando o programa tenta
ler, abrir ou apagar um arquivo ou pasta que não existe no caminho
informado.

**90. Situação do projeto em que `ENOENT` poderia ocorrer:**
Se o arquivo `dados/jogos.json` fosse apagado manualmente (ou a pasta
`dados` fosse renomeada) enquanto o servidor está rodando, a próxima
chamada a `fs.readFileSync(CAMINHO_JOGOS, ...)` lançaria um erro
`ENOENT`, pois o caminho informado deixaria de apontar para um arquivo
existente.

## Parte 12 — path e caminhos de arquivos

**91. Para que serve o módulo `path` do Node.js?**
Serve para construir e manipular caminhos de arquivos e pastas de forma
segura e independente do sistema operacional, evitando erros ao juntar
partes de um caminho manualmente.

**92. Por que escrever caminhos manualmente pode causar problemas entre
Windows, Linux e macOS?**
Porque cada sistema operacional usa um separador diferente entre pastas:
Windows usa contra-barra (`\`), enquanto Linux e macOS usam barra normal
(`/`). Um caminho escrito manualmente com um desses separadores pode
simplesmente não funcionar no outro sistema.

**93/94. Uso de `path.join()` para montar os caminhos:**
```js
const CAMINHO_JOGOS = path.join(__dirname, 'dados', 'jogos.json');
const CAMINHO_HISTORICO = path.join(__dirname, 'dados', 'historico.txt');
```
(Implementado em `server.js`.)

**95. Vantagem de utilizar `path.join()` no projeto?**
O `path.join()` monta o caminho automaticamente com o separador correto
para o sistema operacional em que o código está rodando, tornando o
projeto portátil — funciona igual em uma máquina Windows, Linux ou macOS,
sem precisar de ajustes manuais.

## Parte 13 — Tratamento de erros

**96. Função do bloco `try/catch`?**
Permite "tentar" executar um trecho de código que pode falhar (`try`) e,
caso um erro seja lançado durante essa execução, capturá-lo (`catch`) e
tratá-lo de forma controlada — por exemplo, retornando uma resposta de
erro amigável ao cliente, em vez de deixar o servidor travar ou retornar
uma mensagem de erro técnica.

*(Os itens 97-99, sobre tratamento de erro em leitura/escrita de arquivo
e resposta apropriada em caso de erro interno, estão implementados em
todas as rotas de `server.js`, através dos blocos `try/catch` que
envolvem as chamadas a `lerJogos()` e `salvarJogos()`, retornando status
500 em caso de falha inesperada.)*

**100. Teste de uma situação de erro controlado:**
Para simular um erro de leitura, renomeamos temporariamente o arquivo
`dados/jogos.json` (ex: para `jogos_backup.json`) e chamamos
`GET /jogos`. O servidor não travou: o bloco `try/catch` de `lerJogos()`
capturou o erro (`ENOENT`), registrou a mensagem no console e retornou um
array vazio, evitando que a API quebrasse por completo. Após restaurar o
nome original do arquivo, a rota voltou a funcionar normalmente.

## Parte 14 — Síncrono, assíncrono e Event Loop

**101. Diferença entre operação síncrona e assíncrona?**
Uma operação **síncrona** bloqueia a execução do restante do código até
que ela termine — o programa "espera parado". Uma operação **assíncrona**
é iniciada e o programa continua executando outras tarefas enquanto ela
acontece em segundo plano; quando termina, um callback (ou uma Promise) é
usado para lidar com o resultado.

**102. O que acontece com o servidor quando uma operação síncrona
demorada bloqueia a execução?**
Como o Node.js é single-threaded (executa em uma única thread principal),
uma operação síncrona demorada trava **todo** o servidor enquanto está em
execução — nenhuma outra requisição de nenhum outro cliente pode ser
atendida nesse período, mesmo que sejam requisições completamente
diferentes.

**103. Por que operações assíncronas são preferíveis em rotas de
servidor?**
Porque permitem que o servidor continue atendendo outras requisições
enquanto uma operação demorada (como leitura de arquivo, consulta a
banco de dados ou chamada a uma API externa) está em andamento,
aproveitando melhor os recursos e evitando que um único cliente lento
prejudique a experiência de todos os outros.

**104. O que é uma Promise?**
É um objeto do JavaScript que representa o resultado (ainda não
disponível) de uma operação assíncrona. Uma Promise pode estar em três
estados: pendente, resolvida (sucesso) ou rejeitada (erro), permitindo
tratar o resultado dessa operação de forma organizada com `.then()`,
`.catch()`, ou com `async/await`.

**105. Função de `async`?**
A palavra-chave `async`, colocada antes de uma função, indica que essa
função retornará sempre uma Promise, e habilita o uso da palavra-chave
`await` dentro dela.

**106. Função de `await`?**
`await` pausa a execução da função `async` até que a Promise à sua
frente seja resolvida (ou rejeitada), permitindo escrever código
assíncrono com uma aparência sequencial e mais fácil de ler, em vez de
encadear vários `.then()`.

**107. Compare `readFileSync` com `readFile`:**
`readFileSync` é **síncrono**: bloqueia a execução até terminar de ler o
arquivo, retornando o resultado diretamente. `readFile` é **assíncrono**:
inicia a leitura e devolve o controle imediatamente ao restante do
código, entregando o resultado mais tarde por meio de um callback (ou de
uma Promise, se usado com `fs.promises` e `await`).

**108. Uso de `try/catch` com versão assíncrona:**
Caso se opte por usar `fs.promises.readFile`/`writeFile` com
`async/await` no lugar das versões síncronas, é indispensável envolver
essas chamadas em um bloco `try/catch`, já que uma Promise rejeitada
(por exemplo, por um `ENOENT`) lançaria um erro que precisa ser
capturado manualmente — diferente das versões `Sync`, que já lançam o
erro diretamente no fluxo síncrono de execução.

## Parte 15 — Middlewares

**109. O que é um middleware no Express?**
É uma função que tem acesso a `req`, `res` e a uma função `next()`, e que
é executada **entre** o momento em que a requisição chega ao servidor e o
momento em que ela é finalmente tratada por uma rota. Um middleware pode
modificar a requisição, encerrar a resposta, ou repassar o controle para
o próximo middleware/rota chamando `next()`.

**110. Por que `express.json()` pode ser considerado um middleware?**
Porque ele intercepta toda requisição recebida, processa o corpo (Body)
quando o `Content-Type` é JSON, disponibiliza o resultado em `req.body`,
e então chama `next()` internamente para que a requisição continue seu
fluxo até a rota correspondente — exatamente o comportamento de um
middleware.

**111. Duas outras responsabilidades que um middleware pode assumir:**
1. **Autenticação/autorização**: verificar se o usuário está logado ou
   tem permissão antes de deixar a requisição avançar até a rota.
2. **Logging**: registrar informações de cada requisição recebida (como
   método, URL e horário) para fins de monitoramento ou depuração.

**112. Em que momento o middleware atua no fluxo
requisição → rota → resposta?**
O middleware atua **entre** a chegada da requisição e a execução da
rota final — ou seja, toda requisição passa primeiro pelos middlewares
registrados (na ordem em que foram declarados com `app.use()`) antes de
alcançar a função da rota que efetivamente gera a resposta.

## Parte 16 — Sessões e Cookies (somente teoria)

**113. Por que o protocolo HTTP é considerado stateless?**
Porque cada requisição HTTP é tratada de forma totalmente independente
pelo servidor — por padrão, o servidor não guarda nenhuma "memória" de
requisições anteriores feitas pelo mesmo cliente. Cada nova requisição
chega "do zero", sem contexto automático das anteriores.

**114. O que é um Cookie?**
É um pequeno pedaço de dado (geralmente texto) que o servidor envia para
o navegador, e que o navegador passa a reenviar automaticamente em
requisições futuras para o mesmo domínio. É uma das formas mais comuns
de dar "memória" a um protocolo stateless como o HTTP.

**115. O que é uma Sessão?**
É um mecanismo para armazenar informações sobre um usuário **no lado do
servidor**, associadas a um identificador único (geralmente entregue ao
cliente via cookie), permitindo reconhecer esse usuário ao longo de
várias requisições sem expor os dados sensíveis diretamente no
navegador.

**116. Onde os dados de um Cookie ficam armazenados?**
No **navegador do cliente** (no computador/dispositivo do usuário).

**117. Onde os dados de uma Sessão ficam armazenados?**
No **servidor** (em memória, banco de dados, ou outro armazenamento
server-side) — o cliente recebe apenas um identificador (Session ID),
não os dados da sessão em si.

**118. Como Cookie e Sessão podem trabalhar juntos para reconhecer um
usuário entre diferentes requisições?**
O servidor cria uma sessão e gera um identificador único (Session ID)
para ela, guardando os dados da sessão do lado do servidor. Esse
identificador é enviado ao navegador através de um Cookie. Em toda
requisição seguinte, o navegador reenvia automaticamente esse Cookie, e o
servidor usa o Session ID recebido para localizar os dados da sessão
correspondente e "lembrar" daquele usuário.

**119. Exemplo de uso adequado para Cookie:**
Lembrar a preferência de idioma ou tema (claro/escuro) escolhido pelo
usuário em um site, para que essa escolha seja mantida em visitas
futuras sem exigir login.

**120. Exemplo de uso adequado para Sessão:**
Manter um usuário autenticado (logado) em um sistema após o login,
permitindo que ele acesse páginas protegidas sem precisar digitar a
senha novamente a cada requisição.

**121. O que é, conceitualmente, um Session ID?**
É um identificador único e (idealmente) difícil de adivinhar, gerado
pelo servidor no momento em que uma sessão é criada, usado como "chave"
para localizar os dados daquela sessão específica armazenados no
servidor, sem a necessidade de transmitir os dados em si a cada
requisição.

---

# Prints do Postman

> **Cole aqui os prints solicitados.** Cada print deve mostrar claramente:
> o método HTTP, a URL utilizada, o Body em JSON (quando houver), o
> status da resposta e o resultado retornado.

## GET /

## GET /jogos

## GET /jogos/:id — ID existente

## GET /jogos/:id — ID inexistente (404)

## POST /jogos — cadastro válido (201)

## POST /jogos — dados obrigatórios ausentes (400)

## PUT /jogos/:id — atualização válida

## PUT /jogos/:id — ID inexistente (404)

## DELETE /jogos/:id

## GET /jogos após o DELETE (comprovando a remoção)

## GET /jogos/melhores

## GET /historico
