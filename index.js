const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ChatBotTests'
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ' + err.stack);
    return;
  }
  console.log('Подключено к базе данных MySQL');
});

app.use(express.json()); // Позволяет серверу обрабатывать JSON в запросах

app.get('/', (req, res) => {
  res.send('<h1>Привет, Октагон!</h1>');
});

app.get('/getAllItems', (req, res) => {
  connection.query('SELECT * FROM Items', (error, results, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

app.post('/addItem', (req, res) => {
  const { name, desc } = req.body;

  if (!name || !desc) {
    res.status(400).json({ error: 'Bad Request: Missing name or desc in request body' });
    return;
  }

  connection.query('INSERT INTO Items (name, `desc`) VALUES (?, ?)', [name, desc], (error, results, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ id: results.insertId, name, desc });
  });
});


app.post('/deleteItem', (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Bad Request: Missing id in request body' });
    return;
  }

  connection.query('DELETE FROM Items WHERE id = ?', [id], (error, results, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ success: true });
  });
});

app.post('/updateItem', (req, res) => {
  const { id, name, desc } = req.body;

  if (!id || !name || !desc) {
    res.status(400).json({ error: 'Ты ошибка!!!' });
    return;
  }


  

  connection.query('UPDATE Items SET name = ?, `desc` = ? WHERE id = ?', [name, desc, id], (error, results, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ id, name, desc });
  });
});




app.listen(port, () => {
  console.log(`Сервер запущен по адресу http://localhost:${port}`);
});


