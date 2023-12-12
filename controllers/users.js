const bcrypt = require('bcrypt');
const User = require('../models/User');

const { NODE_ENV, JWT_SECRET } = process.env;

const { generateToken } = require('../utils/jwt');

const { MONGO_DUPLCATE_ERROR_CODE } = require('../constants/errorStatus');
const { FoundError } = require('../middlewares/foundError');

const SOLT_ROUNDS = 10;

const createUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
    } = req.body;

    const hash = await bcrypt.hash(password, SOLT_ROUNDS);

    const newUser = await User.create({
      email,
      password: hash,
      name,
    });

    return res.status(201).send({
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    if (error.code === MONGO_DUPLCATE_ERROR_CODE) {
      return next(new FoundError('Пользователь с таким email уже существует!', 409));
    }
    if (error.name === 'ValidationError') {
      return next(new FoundError('Переданы некорректные данные при создании пользователя.', 400));
    }
    return next(error);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      throw new FoundError('Пользователь с указанным _id не найден.', 404);
    }

    const user = await User.findById(_id);

    return res.status(200).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new FoundError('Передан не валидный id', 400));
    }
    return next(error);
  }
};

const updateInfoUser = async (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new FoundError('Пользователь с указанным _id не найден.', 404);
      }
      return res.status(200).send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((error) => {
      if (error.code === MONGO_DUPLCATE_ERROR_CODE) {
        return next(new FoundError('Пользователь с таким email уже существует!', 409));
      }
      if (error.name === 'ValidationError') {
        next(new FoundError('Переданы некорректные данные при обновлении профиля.', 400));
      }
      return next(error);
    });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userAdmin = await User.findOne({ email })
      .select('+password')
      .orFail(() => next(new FoundError('Пользователь не найден!', 401)));

    const matched = await bcrypt.compare(String(password), userAdmin.password);

    if (!matched) {
      throw new FoundError('Не правильные email или пароль!', 401);
    }

    const token = generateToken({ _id: userAdmin._id, email: userAdmin.email }, NODE_ENV !== 'production' ? JWT_SECRET : 'dev_secret');

    return res.status(200).send({ token });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new FoundError('Переданы некорректные данные при создании пользователя.', 400));
    }
    return next(error);
  }
};

module.exports = {
  getUserMe,
  updateInfoUser,
  createUser,
  loginUser,
};
