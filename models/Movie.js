const mongoose = require('mongoose');

const movieShema = new mongoose.Schema({
  country: {
    type: String,
    required: {
      value: true,
      message: 'Поле country является обязательным',
    },
  },
  director: {
    type: String,
    required: {
      value: true,
      message: 'Поле director является обязательным',
    },
  },
  duration: {
    type: Number,
    required: {
      value: true,
      message: 'Поле duration является обязательным',
    },
  },
  year: {
    type: String,
    required: {
      value: true,
      message: 'Поле year является обязательным',
    },
  },
  description: {
    type: String,
    required: {
      value: true,
      message: 'Поле description является обязательным',
    },
  },
  image: {
    type: String,
    required: {
      value: true,
      message: 'Поле image является обязательным',
    },
  },
  trailerLink: {
    type: String,
    required: {
      value: true,
      message: 'Поле trailerLink является обязательным',
    },
  },
  thumbnail: {
    type: String,
    required: {
      value: true,
      message: 'Поле thumbnail является обязательным',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieShema);
