const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const TelegramBot = require('node-telegram-bot-api');
const token = '6838397161:AAEibMIKUtWVhDwNib4W3wuf7bivcqvc_Fg';
const bot = new TelegramBot(token, { polling: true });

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


app.use(express.json()); 




app.get('/getAllItems', (req, res) => {
  connection.query('SELECT * FROM chatbottests', (error, results, fields) => {
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
  connection.query('INSERT INTO chatbottests (name, `desc`) VALUES (?, ?)', [name, desc], (error, results, fields) => {
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
  connection.query('DELETE FROM chatbottests WHERE id = ?', [id], (error, results, fields) => {
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
  connection.query('UPDATE chatbottests SET name = ?, `desc` = ? WHERE id = ?', [name, desc, id], (error, results, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ id, name, desc });
  });
});





bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Приветсвтую тебя, я бот для продажи ключей майнкрафт. Нажми "/help" для ознакомления с моим списком команд');
});


bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
Список доступных команд:
/help - Выводит список команд с описанием
/site - Отправляет ссылку на моего создателя
/creator - Отправляет информацию о моём создателе
/price - Цены на различные услуги
`;
  bot.sendMessage(chatId, message);
});


bot.onText(/\/site/, (msg) => {
  const chatId = msg.chat.id;
  const message = 'Ссылка на моего создателя: https://t.me/EvgenSh0w';
  bot.sendMessage(chatId, message);
});

bot.onText(/\/creator/, (msg) => {
  const chatId = msg.chat.id;
  const message = 'Мой создатель: Байсаров Евгений Яковлевич';
  bot.sendMessage(chatId, message);
});


bot.onText(/\/price/, (msg) => {
  const chatId = msg.chat.id;
  const message = `
----------------------------------------------------------------------------------------  
1. Лайк - 300 рублей
2. Лайк + Комментарий - 500 рублей
3. Реклама в начале ролика - 65000 рублей
4. Преролл для сайтов, серверов и т.п. - от 50000 рублей
5. Заказной стрим (Ваша игра, ваш сервер, ваше время и т.п.) - от 30000р/1час
6. Пиар на стриме - 10000рублей (большая аудитория за короткое время) (!)кроме каналов и майнкрафт серверов(!)
7. Индивидуальные предложения - Индивидуальная цена
----------------------------------------------------------------------------------------
Услуги:
1. Друг на час (Общение с вами в ВК/Скайпе как с другом) - 25000р/час
2. Поиграть с вами - 40000р/час + копия игры, если у меня её нет
3. Ответы на ваши вопросы в течении 20мин в ВК - 10000р
4. Консультация (Что нужно делать для того чтобы стать популярным) - 30000р
5. Добавить в друзья в ВК - 2000 рублей
----------------------------------------------------------------------------------------
Вернуться назад - /help
----------------------------------------------------------------------------------------
`;
  bot.sendMessage(chatId, message);
});


// bot.onText(/\/local/, (msg) => {
//   const chatId = msg.chat.id;
//   const message = `
// Список доступных команд:
// /randomItem - Генерация случайного ID из диапазона записей в БД
// /deleteItem - Запрос к БД для удаления предмета по ID
// /getItemByID - Запрос к БД для получения предмета по ID
// `;
//   bot.sendMessage(chatId, message);
// });



// bot.onText(/\/randomItem/, (msg) => {
//   const chatId = msg.chat.id;
  
//   connection.query('SELECT id FROM chatbottests', (error, results, fields) => {
//     if (error) {
//       console.error('Ошибка выполнения запроса: ' + error.stack);
//       bot.sendMessage(chatId, 'Произошла ошибка при получении случайного предмета.');
//       return;
//     }

  
//     const randomIndex = Math.floor(Math.random() * results.length);
//     const randomItemId = results[randomIndex].id;


//     connection.query('SELECT * FROM chatbottests WHERE id = ?', [randomItemId], (error, results, fields) => {
//       if (error) {
//         console.error('Ошибка выполнения запроса: ' + error.stack);
//         bot.sendMessage(chatId, 'Произошла ошибка при получении случайного предмета.');
//         return;
//       }


//       const randomItem = results[0];
//       const message = `(${randomItem.id}) - ${randomItem.name}: ${randomItem.desc}`;
//       bot.sendMessage(chatId, message);
//     });
//   });
// });


// bot.onText(/^\/deleteItem(?:\s+(\S+))?$/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const itemId = match[1];

//   if (!itemId) {
//     bot.sendMessage(chatId, 'Пожалуйста, укажите ID предмета: /deleteItem id');
//     return;
//   }


//   connection.query('DELETE FROM chatbottests WHERE id = ?', [itemId], (error, results, fields) => {
//     if (error) {
//       console.error('Ошибка выполнения запроса: ' + error.stack);
//       bot.sendMessage(chatId, 'Произошла ошибка при удалении предмета.');
//       return;
//     }


//     if (results.affectedRows > 0) {
//       bot.sendMessage(chatId, 'Предмет успешно удален.');
//     } else {
//       bot.sendMessage(chatId, 'Ошибка: предмет с указанным ID не найден.');
//     }
//   });
// });



// bot.onText(/\/getItemByID(?:\s+(\S+))?$/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const itemId = match[1];

//   if (!itemId) {
//     bot.sendMessage(chatId, 'Пожалуйста, укажите ID предмета: /getItemByID id');
//     return;
//   }

//   connection.query('SELECT * FROM chatbottests WHERE id = ?', [itemId], (error, results, fields) => {
//     if (error) {
//       console.error('Ошибка выполнения запроса: ' + error.stack);
//       bot.sendMessage(chatId, 'Произошла ошибка при получении предмета.');
//       return;
//     }


//     if (results.length > 0) {
//       const item = results[0];
//       const message = `(${item.id}) - ${item.name}: ${item.desc}`;
//       bot.sendMessage(chatId, message);
//     } else {
//       bot.sendMessage(chatId, 'Предмет с указанным ID не найден.');
//     }
//   });
// });




// const qrcode = require('qrcode');
// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const validUrl = require('valid-url');

// // Команда !qr
// bot.onText(/^\/qr (.+)$/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const text = match[1];

//   // Проверка, является ли введенный текст валидным URL-адресом
//   if (!validUrl.isUri(text)) {
//     bot.sendMessage(chatId, 'Пожалуйста, введите корректный URL-адрес.');
//     return;
//   }

//   // Генерация QR-кода из введенного URL-адреса
//   qrcode.toFile('qrCode.png', text, (err) => {
//     if (err) {
//       console.error('Ошибка при создании QR-кода:', err);
//       bot.sendMessage(chatId, 'Произошла ошибка при создании QR-кода.');
//       return;
//     }

//     // Отправка изображения QR-кода
//     bot.sendPhoto(chatId, fs.createReadStream('qrCode.png'));
//   });
// });

// bot.onText(/^\/webscr (.+)$/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   const websiteUrl = match[1];

//   try {
//     // Запуск браузера
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Переход на указанный веб-сайт и ожидание загрузки
//     await page.goto(websiteUrl, { timeout: 60000 }); // Установка времени ожидания в 60 секунд

//     // Получение размеров страницы
//     const dimensions = await page.evaluate(() => {
//       return {
//         width: document.documentElement.clientWidth,
//         height: document.documentElement.clientHeight,
//         deviceScaleFactor: window.devicePixelRatio
//       };
//     });

//     // Определение размера скриншота (не более 20 мегапикселей)
//     const maxPixels = 20 * 1024 * 1024;
//     const scaleFactor = Math.min(Math.sqrt(maxPixels / (dimensions.width * dimensions.height)), 1);
//     const screenshotOptions = {
//       path: 'screenshot.png',
//       clip: {
//         x: 0,
//         y: 0,
//         width: Math.round(dimensions.width * scaleFactor),
//         height: Math.round(dimensions.height * scaleFactor)
//       },
//       fullPage: false
//     };

//     // Создание скриншота страницы
//     await page.screenshot(screenshotOptions);

//     // Отправка скриншота
//     bot.sendPhoto(chatId, fs.createReadStream('screenshot.png'));

//     // Закрытие браузера
//     await browser.close();
//   } catch (error) {
//     console.error('Ошибка при создании скриншота веб-страницы:', error);
//     bot.sendMessage(chatId, 'Произошла ошибка при создании скриншота веб-страницы.');
//   }
// });





function updateUserLastMessage(userId) {
  const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); 
  const sql = `INSERT INTO Users (ID, lastMessage) VALUES (${userId}, '${currentDate}') ON DUPLICATE KEY UPDATE lastMessage='${currentDate}'`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Ошибка выполнения запроса к базе данных:', err);
      throw err;
    }
    console.log('Запись успешно обновлена (или добавлена)');
  });
}


bot.on('message', (msg) => {
  const userId = msg.from.id;
  console.log('ID пользователя:', userId); 
  updateUserLastMessage(userId);
});




const { setIntervalAsync } = require('set-interval-async');

async function checkLastMessagesAndSendRandomItem() {
  try {
    console.log('Проверка последних сообщений пользователей...');
    const currentDate = new Date();
    const twoDaysAgo = new Date(currentDate.getTime() - 60000 * 1000); 
    const formattedDate = twoDaysAgo.toISOString().slice(0, 19).replace('T', ' '); 

    const sql = `SELECT ID FROM Users WHERE lastMessage <= '${formattedDate}'`;
    connection.query(sql, (err, results, fields) => {
      if (err) {
        console.error('Ошибка выполнения запроса к базе данных:', err);
        return;
      }

      console.log('Результаты запроса:', results); 

      if (results.length > 0) {
        console.log('Есть пользователи, которым нужно отправить "randomItem"');
        results.forEach((user) => {
          // Отправка "randomItem" пользователю
          const userId = user.ID;
          console.log('Отправка сообщения пользователю с ID:', userId);
          bot.sendMessage(userId, 'Рекомендую написать команду /price чтобы ознакомиться с ценами на мои услуги :3');
        });
      } else {
        console.log('Нет пользователей, которым нужно отправить "randomItem"');
      }
    });
  } catch (error) {
    console.error('Ошибка при проверке даты последнего сообщения пользователей:', error);
  }
}


// Создание таймера, который будет срабатывать каждые 30 секунд
setIntervalAsync(checkLastMessagesAndSendRandomItem, 100000 * 1000); 


app.listen(port, () => {
  console.log(`Сервер запущен по адресу http://localhost:${port}`);
});
