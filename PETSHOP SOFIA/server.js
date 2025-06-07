const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para processar JSON e dados de formulários
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./marcacoes.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criação da tabela "marcacoes" (se não existir)
db.run(`
  CREATE TABLE IF NOT EXISTS marcacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    animal TEXT NOT NULL,
    servico TEXT NOT NULL,
    data TEXT,
    hora TEXT NOT NULL,
    contacto TEXT NOT NULL,
    email TEXT NOT NULL,
    observacoes TEXT,
    data_entrada TEXT,
    data_saida TEXT
  )
`);

// Rota para servir o arquivo marcacao.html na raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'marcacao.html'));
});

// Rota para receber os dados do formulário
app.post('/api/marcacoes', (req, res) => {
  const { nome, animal, servico, data, hora, contacto, email, observacoes, data_entrada, data_saida } = req.body;

  // Validação dos campos obrigatórios
  if (
    !nome ||
    !animal ||
    !servico ||
    !hora ||
    !contacto ||
    !email ||
    (servico !== 'Hotel' && !data) ||
    (servico === 'Hotel' && (!data_entrada || !data_saida))
  ) {
    return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  const query = `
    INSERT INTO marcacoes (nome, animal, servico, data, hora, contacto, email, observacoes, data_entrada, data_saida)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [nome, animal, servico, data, hora, contacto, email, observacoes, data_entrada, data_saida],
    function (err) {
      if (err) {
        console.error('Erro ao inserir dados:', err.message);
        return res.status(500).json({ mensagem: 'Erro ao salvar a marcação.' });
      }
      res.status(201).json({ mensagem: 'Marcação salva com sucesso!' });
    }
  );
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});