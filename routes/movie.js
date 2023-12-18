const { Router } = require('express');
const { getMovie, postMovie, deleteMovie } = require('../controllers/movie');
const { postMovieValidator, movieIdValidator } = require('../middlewares/customValidator');

const movieRouter = Router();

movieRouter.get('/', getMovie);
movieRouter.post('/', postMovieValidator, postMovie);
movieRouter.delete('/:movieId', movieIdValidator, deleteMovie);

module.exports = movieRouter;
