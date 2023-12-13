const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movie');
const { createUser, loginUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { createUserValidator, authenticateValidator } = require('../middlewares/customValidator');
const { FoundError } = require('../middlewares/foundError');

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);
router.post('/signin', authenticateValidator, loginUser);
router.post('/signup', createUserValidator, createUser);
// router.use('*', auth, () => {
//   throw new FoundError('Страница не найдена', 404);
// });

module.exports = router;
