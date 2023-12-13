require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes');

const app = express();

const { errorHandler } = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { ADDRESS_DB } = require('./constants/constants');
const { cors } = require('./middlewares/cors');
const { FoundError } = require('./middlewares/foundError');

app.use(cors);

const { NODE_ENV, PORT = 3000, DB_ADDRESS } = process.env;

app.use(express.json());

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : ADDRESS_DB);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(() => {
  throw new FoundError('Страница не найдена', 404);
});

app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
