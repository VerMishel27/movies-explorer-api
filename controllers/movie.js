const Movie = require('../models/Movie');
const { FoundError } = require('../middlewares/foundError');

const getMovie = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movie = await Movie.find({owner});

    return res.status(200).send(movie);
  } catch (error) {
    return next(error);
  }
};

const postMovie = async (req, res, next) => {
  try {
    const newMovie = await new Movie(req.body);
    newMovie.owner = req.user._id;

    return res.status(201).send(await newMovie.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new FoundError('Переданы некорректные данные при создании карточки.', 400));
    }
    return next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return next(new FoundError('Видео с указаным _id не найдена!', 404));
    }

    if (_id !== String(movie.owner)) {
      return next(new FoundError('Можно удалять только свои видео!', 403));
    }

    const delMovie = await Movie.deleteOne(movie);
    return res.status(200).send(delMovie);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new FoundError('Передан неправильный _id.', 400));
    }
    return next(error);
  }
};

module.exports = {
  getMovie,
  postMovie,
  deleteMovie,
};
