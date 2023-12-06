const { Router } = require('express');
const { getUserMe, updateInfoUser } = require('../controllers/users');
const { infoUserValidator } = require('../middlewares/customValidator');

const userRouter = Router();

userRouter.get('/me', getUserMe);
userRouter.patch('/me', infoUserValidator, updateInfoUser);

module.exports = userRouter;
